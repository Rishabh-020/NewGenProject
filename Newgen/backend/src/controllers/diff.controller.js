const Upload  = require('../models/upload.model')
const { runDiff } = require('../services/diff.service')
const { successResponse, errorResponse } = require('../utils/response')

// ── @route  POST /api/diff/:uploadId ─────────────────────────────────
// Runs OpenCV diff on already-uploaded images, returns raw regions
const runDiffOnUpload = async (req, res, next) => {
  try {
    const upload = await Upload.findById(req.params.uploadId)
    if (!upload) return errorResponse(res, 'Upload not found', 404)

    const figmaPath = upload.figmaImage?.path
    const livePath  = upload.liveImage?.path

    if (!figmaPath || !livePath) {
      return errorResponse(res, 'Image paths are missing in this upload', 400)
    }

    const result = await runDiff(figmaPath, livePath)

    return successResponse(res, 'Diff computed', {
      regions: result.regions,
      total:   result.total
    })
  } catch (err) {
    next(err)
  }
}

// ── @route  POST /api/diff/raw ────────────────────────────────────────
// Runs diff directly on freshly uploaded files (no DB record needed)
const runDiffRaw = async (req, res, next) => {
  try {
    const figmaFile = req.files?.figma?.[0]
    const liveFile  = req.files?.live?.[0]

    if (!figmaFile || !liveFile) {
      return errorResponse(res, 'Both figma and live images are required', 400)
    }

    const result = await runDiff(figmaFile.path, liveFile.path)

    return successResponse(res, 'Diff computed', {
      regions: result.regions,
      total:   result.total
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { runDiffOnUpload, runDiffRaw }
