const Review   = require('../models/review.model')
const Upload   = require('../models/upload.model')
const { runDiff }           = require('../services/diff.service')
const { analyzeWithClaude, generateSummary } = require('../services/claude.service')
const { sendReviewCompleteEmail }            = require('../services/email.service')
const { successResponse, errorResponse }     = require('../utils/response')

// ── Helper: merge OpenCV regions + Claude labels ──────────────────────
const mergeIssues = (regions, aiIssues) =>
  regions.slice(0, 10).map((region, i) => {
    const ai = aiIssues.find(a => a.regionIndex === i) || {}
    return {
      id:          ai.id          || `issue_${i}`,
      category:    ai.category    || 'Visual',
      label:       ai.label       || `Region ${i + 1}`,
      severity:    ai.severity    || region.severity,
      description: ai.description || 'Visual mismatch detected',
      expected:    ai.expected    || '—',
      actual:      ai.actual      || '—',
      cssfix:      ai.cssfix      || '',
      status:      'open',
      bbox:        region.bbox
    }
  })

// ── @route  POST /api/review/:uploadId ───────────────────────────────
// Full pipeline: OpenCV diff → Claude AI → save to DB
const createReview = async (req, res, next) => {
  try {
    const upload = await Upload.findById(req.params.uploadId).populate('project')
    if (!upload) return errorResponse(res, 'Upload not found', 404)

    const figmaPath = upload.figmaImage?.path
    const livePath  = upload.liveImage?.path

    if (!figmaPath || !livePath) {
      return errorResponse(res, 'Image paths missing in upload', 400)
    }

    // Create a pending review record
    let review = await Review.create({
      upload:     upload._id,
      project:    upload.project._id,
      reviewedBy: req.user._id,
      status:     'pending'
    })

    // Step 1 — OpenCV diff
    let diffResult
    try {
      diffResult = await runDiff(figmaPath, livePath)
    } catch (err) {
      review.status = 'failed'
      await review.save()
      return errorResponse(res, `Diff failed: ${err.message}`, 500)
    }

    const regions = diffResult.regions || []

    if (regions.length === 0) {
      review.status      = 'complete'
      review.issues      = []
      review.totalIssues = 0
      await review.save()
      return successResponse(res, 'No visual differences found', { review })
    }

    // Step 2 — Claude AI analysis
    let aiIssues = []
    try {
      aiIssues = await analyzeWithClaude(figmaPath, livePath, regions)
    } catch (err) {
      console.warn('Claude analysis failed, using fallback labels:', err.message)
    }

    // Step 3 — Merge results
    const issues = mergeIssues(regions, aiIssues)

    const highCount   = issues.filter(i => i.severity === 'high').length
    const mediumCount = issues.filter(i => i.severity === 'medium').length
    const lowCount    = issues.filter(i => i.severity === 'low').length

    review.issues      = issues
    review.totalIssues = issues.length
    review.highCount   = highCount
    review.mediumCount = mediumCount
    review.lowCount    = lowCount
    review.status      = 'complete'
    await review.save()

    // Step 4 — Send email notification (non-blocking)
    sendReviewCompleteEmail(
      req.user.email,
      upload.project.name,
      issues.length
    ).catch(console.warn)

    return successResponse(res, 'Review complete', { review }, 201)
  } catch (err) {
    next(err)
  }
}

// ── @route  GET /api/review/project/:projectId ───────────────────────
const getReviewsByProject = async (req, res, next) => {
  try {
    const reviews = await Review.find({ project: req.params.projectId })
      .populate('reviewedBy', 'name email')
      .populate('upload',     'label version')
      .sort({ createdAt: -1 })

    return successResponse(res, 'Reviews fetched', { reviews, total: reviews.length })
  } catch (err) {
    next(err)
  }
}

// ── @route  GET /api/review/:id ──────────────────────────────────────
const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('reviewedBy', 'name email')
      .populate('upload',     'label version figmaImage liveImage')
      .populate('project',    'name')

    if (!review) return errorResponse(res, 'Review not found', 404)

    return successResponse(res, 'Review fetched', { review })
  } catch (err) {
    next(err)
  }
}

// ── @route  PUT /api/review/:id/issue/:issueId ───────────────────────
// Update status of a single issue (open → resolved / ignored)
const updateIssueStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const allowed = ['open', 'resolved', 'ignored']

    if (!allowed.includes(status)) {
      return errorResponse(res, `Status must be one of: ${allowed.join(', ')}`, 400)
    }

    const review = await Review.findById(req.params.id)
    if (!review) return errorResponse(res, 'Review not found', 404)

    const issue = review.issues.id(req.params.issueId)
    if (!issue) return errorResponse(res, 'Issue not found', 404)

    issue.status = status
    await review.save()

    return successResponse(res, 'Issue status updated', { issue })
  } catch (err) {
    next(err)
  }
}

// ── @route  GET /api/review/:id/summary ──────────────────────────────
// Generate AI plain-English summary of review
const getReviewSummary = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return errorResponse(res, 'Review not found', 404)

    if (review.issues.length === 0) {
      return successResponse(res, 'No issues to summarize', { summary: 'No visual differences were found.' })
    }

    const summary = await generateSummary(review.issues)

    return successResponse(res, 'Summary generated', { summary })
  } catch (err) {
    next(err)
  }
}

// ── @route  DELETE /api/review/:id ───────────────────────────────────
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return errorResponse(res, 'Review not found', 404)

    if (review.reviewedBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to delete this review', 403)
    }

    await review.deleteOne()

    return successResponse(res, 'Review deleted')
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createReview,
  getReviewsByProject,
  getReviewById,
  updateIssueStatus,
  getReviewSummary,
  deleteReview
}
