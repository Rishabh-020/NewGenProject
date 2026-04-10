const express = require('express')
const router  = express.Router()

const {
  uploadScreens,
  getUploadsByProject,
  getUploadById,
  deleteUpload
} = require('../controllers/upload.controller')

const { protect }             = require('../middlewares/auth.middleware')
const { uploadReviewImages }  = require('../middlewares/upload.middleware')

router.use(protect)

// Upload both screens for a project
router.post('/:projectId',          uploadReviewImages, uploadScreens)

// Get all uploads for a project
router.get('/:projectId',           getUploadsByProject)

// Get / delete single upload
router.get('/single/:id',           getUploadById)
router.delete('/:id',               deleteUpload)

module.exports = router
