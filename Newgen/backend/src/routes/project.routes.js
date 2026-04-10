const express = require('express')
const router  = express.Router()

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/project.controller')

const { protect } = require('../middlewares/auth.middleware')

// All project routes are protected
router.use(protect)

router.route('/')
  .get(getProjects)
  .post(createProject)

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject)

router.route('/:id/members')
  .post(addMember)

router.route('/:id/members/:userId')
  .delete(removeMember)

module.exports = router
