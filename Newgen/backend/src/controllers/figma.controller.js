// =============================================================================
// figma.controller.js
// =============================================================================
// Handles two things:
// 1. Extract design tokens from a Figma file/node
// 2. Compare those tokens against live CSS sent from the browser
// =============================================================================

const {
  getFigmaNode,
  extractDesignTokens,
  compareTokensWithCSS
} = require('../services/figma.service')

const Review = require('../models/review.model')
const { successResponse, errorResponse } = require('../utils/response')


// ── @route  POST /api/figma/tokens ───────────────────────────────────
// Extract design tokens from a Figma node
// Body: { fileId, nodeId }
const getTokens = async (req, res, next) => {
  try {
    const { fileId, nodeId } = req.body

    if (!fileId || !nodeId) {
      return errorResponse(res, 'fileId and nodeId are required', 400)
    }

    // fetch node from Figma API
    const node = await getFigmaNode(fileId, nodeId)
    if (!node) return errorResponse(res, 'Figma node not found', 404)

    // extract all design tokens from node tree
    const tokens = extractDesignTokens(node.document)

    return successResponse(res, 'Design tokens extracted', {
      tokens,
      total: tokens.length
    })
  } catch (err) {
    next(err)
  }
}


// ── @route  POST /api/figma/compare ──────────────────────────────────
// Compare Figma tokens vs live CSS from browser
// Body: { fileId, nodeId, liveCSS: { elementName: { padding, fontSize... } } }
const compareWithLive = async (req, res, next) => {
  try {
    const { fileId, nodeId, liveCSS } = req.body

    if (!fileId || !nodeId || !liveCSS) {
      return errorResponse(res, 'fileId, nodeId and liveCSS are required', 400)
    }

    // Step 1 — get Figma tokens
    const node   = await getFigmaNode(fileId, nodeId)
    if (!node) return errorResponse(res, 'Figma node not found', 404)

    const tokens = extractDesignTokens(node.document)

    // Step 2 — compare tokens with live CSS
    const issues = compareTokensWithCSS(tokens, liveCSS)

    // Step 3 — count severities
    const highCount   = issues.filter(i => i.severity === 'high').length
    const mediumCount = issues.filter(i => i.severity === 'medium').length
    const lowCount    = issues.filter(i => i.severity === 'low').length

    return successResponse(res, 'CSS comparison complete', {
      issues,
      total:  issues.length,
      summary: { highCount, mediumCount, lowCount }
    })
  } catch (err) {
    next(err)
  }
}


// ── @route  POST /api/figma/full-review ──────────────────────────────
// Combines image diff (OpenCV) + token diff (Figma API) into one review
// Body: { fileId, nodeId, liveCSS, reviewId }
// reviewId = existing review from image comparison to merge into
const fullReview = async (req, res, next) => {
  try {
    const { fileId, nodeId, liveCSS, reviewId } = req.body

    if (!fileId || !nodeId || !liveCSS) {
      return errorResponse(res, 'fileId, nodeId and liveCSS are required', 400)
    }

    // Step 1 — get Figma tokens and compare with live CSS
    const node   = await getFigmaNode(fileId, nodeId)
    if (!node) return errorResponse(res, 'Figma node not found', 404)

    const tokens    = extractDesignTokens(node.document)
    const cssIssues = compareTokensWithCSS(tokens, liveCSS)

    // Step 2 — if reviewId given, merge CSS issues with existing image issues
    if (reviewId) {
      const review = await Review.findById(reviewId)
      if (review) {
        // add CSS issues on top of existing image diff issues
        const merged = [
          ...review.issues,
          ...cssIssues.map((issue, i) => ({
            id:          `css_${i}`,
            category:    issue.category,
            label:       `${issue.element} — ${issue.property}`,
            severity:    issue.severity,
            description: `${issue.property} mismatch on ${issue.element}`,
            expected:    issue.expected,
            actual:      issue.actual,
            cssfix:      issue.cssfix,
            status:      'open',
            source:      'figma_token'   // flag: came from Figma API not image
          }))
        ]

        review.issues      = merged
        review.totalIssues = merged.length
        review.highCount   = merged.filter(i => i.severity === 'high').length
        review.mediumCount = merged.filter(i => i.severity === 'medium').length
        review.lowCount    = merged.filter(i => i.severity === 'low').length
        await review.save()

        return successResponse(res, 'Full review complete (image + CSS tokens)', {
          review
        })
      }
    }

    // if no reviewId, just return CSS issues alone
    return successResponse(res, 'CSS token comparison complete', {
      issues: cssIssues,
      total:  cssIssues.length
    })

  } catch (err) {
    next(err)
  }
}


module.exports = { getTokens, compareWithLive, fullReview }
