const Project = require('../models/project.model')
const { successResponse, errorResponse } = require('../utils/response')

// ── @route  POST /api/project ─────────────────────────────────────────
const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body

    if (!name) return errorResponse(res, 'Project name is required', 400)

    const project = await Project.create({
      name,
      description,
      owner:   req.user._id,
      members: [{ user: req.user._id, role: req.user.role }]
    })

    return successResponse(res, 'Project created', { project }, 201)
  } catch (err) {
    next(err)
  }
}

// ── @route  GET /api/project ──────────────────────────────────────────
const getProjects = async (req, res, next) => {
  try {
    // Return projects where user is owner OR a member
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })

    return successResponse(res, 'Projects fetched', { projects, total: projects.length })
  } catch (err) {
    next(err)
  }
}

// ── @route  GET /api/project/:id ──────────────────────────────────────
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner',          'name email')
      .populate('members.user',   'name email role')

    if (!project) return errorResponse(res, 'Project not found', 404)

    return successResponse(res, 'Project fetched', { project })
  } catch (err) {
    next(err)
  }
}

// ── @route  PUT /api/project/:id ──────────────────────────────────────
const updateProject = async (req, res, next) => {
  try {
    const { name, description, status } = req.body

    const project = await Project.findById(req.params.id)
    if (!project) return errorResponse(res, 'Project not found', 404)

    if (project.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Only the project owner can update it', 403)
    }

    project.name        = name        || project.name
    project.description = description ?? project.description
    project.status      = status      || project.status
    await project.save()

    return successResponse(res, 'Project updated', { project })
  } catch (err) {
    next(err)
  }
}

// ── @route  DELETE /api/project/:id ───────────────────────────────────
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return errorResponse(res, 'Project not found', 404)

    if (project.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Only the project owner can delete it', 403)
    }

    await project.deleteOne()

    return successResponse(res, 'Project deleted')
  } catch (err) {
    next(err)
  }
}

// ── @route  POST /api/project/:id/members ────────────────────────────
const addMember = async (req, res, next) => {
  try {
    const { userId, role } = req.body

    const project = await Project.findById(req.params.id)
    if (!project) return errorResponse(res, 'Project not found', 404)

    const alreadyMember = project.members.some(m => m.user.toString() === userId)
    if (alreadyMember) return errorResponse(res, 'User is already a member', 400)

    project.members.push({ user: userId, role: role || 'developer' })
    await project.save()

    return successResponse(res, 'Member added', { project })
  } catch (err) {
    next(err)
  }
}

// ── @route  DELETE /api/project/:id/members/:userId ──────────────────
const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return errorResponse(res, 'Project not found', 404)

    project.members = project.members.filter(
      m => m.user.toString() !== req.params.userId
    )
    await project.save()

    return successResponse(res, 'Member removed', { project })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
}
