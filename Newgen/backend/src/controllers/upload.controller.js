const Upload = require('../models/upload.model')
const Project = require('../models/project.model')
const { successResponse, errorResponse } = require('../utils/response')
const { deleteFiles } = require('../utils/fileHelper')

// ── @route  POST /api/upload/:projectId ──────────────────────────────
const uploadScreens = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const { label, version } = req.body

    const figmaFile = req.files?.figma?.[0]
    const liveFile  = req.files?.live?.[0]

    if (!figmaFile || !liveFile) {
      return errorResponse(res, 'Both figma and live images are required', 400)
    }

    // Verify project exists
    const project = await Project.findById(projectId)
    if (!project) {
      deleteFiles(figmaFile.path, liveFile.path)
      return errorResponse(res, 'Project not found', 404)
    }

    const upload = await Upload.create({
      project:    projectId,
      uploadedBy: req.user._id,
      label:      label   || 'Untitled Screen',
      version:    version || 'V1.0',
      figmaImage: {
        filename:     figmaFile.filename,
        originalName: figmaFile.originalname,
        path:         figmaFile.path,
        mimetype:     figmaFile.mimetype,
        size:         figmaFile.size
      },
      liveImage: {
        filename:     liveFile.filename,
        originalName: liveFile.originalname,
        path:         liveFile.path,
        mimetype:     liveFile.mimetype,
        size:         liveFile.size
      }
    })

    return successResponse(res, 'Screens uploaded successfully', { upload }, 201)
  } catch (err) {
    next(err)
  }
}

// ── @route  GET /api/upload/:projectId ───────────────────────────────
const getUploadsByProject = async (req, res, next) => {
  try {
    const uploads = await Upload.find({ project: req.params.projectId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })

    return successResponse(res, 'Uploads fetched', { uploads, total: uploads.length })
  } catch (err) {
    next(err)
  }
}

// ── @route  GET /api/upload/single/:id ───────────────────────────────
const getUploadById = async (req, res, next) => {
  try {
    const upload = await Upload.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('project',    'name')

    if (!upload) return errorResponse(res, 'Upload not found', 404)

    return successResponse(res, 'Upload fetched', { upload })
  } catch (err) {
    next(err)
  }
}

// ── @route  DELETE /api/upload/:id ───────────────────────────────────
const deleteUpload = async (req, res, next) => {
  try {
    const upload = await Upload.findById(req.params.id)
    if (!upload) return errorResponse(res, 'Upload not found', 404)

    // Only the uploader can delete
    if (upload.uploadedBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to delete this upload', 403)
    }

    // Remove files from disk
    deleteFiles(upload.figmaImage?.path, upload.liveImage?.path)

    await upload.deleteOne()

    return successResponse(res, 'Upload deleted')
  } catch (err) {
    next(err)
  }
}

module.exports = {
  uploadScreens,
  getUploadsByProject,
  getUploadById,
  deleteUpload
}
