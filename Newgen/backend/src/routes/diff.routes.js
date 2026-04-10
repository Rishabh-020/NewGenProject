const express = require('express')
const router  = express.Router()

const { runDiffOnUpload, runDiffRaw } = require('../controllers/diff.controller')
const { protect }                     = require('../middlewares/auth.middleware')
const { uploadReviewImages }          = require('../middlewares/upload.middleware')

router.use(protect)

// Diff from fresh file upload — must be BEFORE /:uploadId or Express matches 'raw' as an ID
router.post('/raw', uploadReviewImages, runDiffRaw)

// Diff from an existing upload record
router.post('/:uploadId', runDiffOnUpload)

module.exports = router
