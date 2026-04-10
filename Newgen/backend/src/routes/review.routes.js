const express = require('express')
const router  = express.Router()

const {
  createReview,
  getReviewsByProject,
  getReviewById,
  updateIssueStatus,
  getReviewSummary,
  deleteReview
} = require('../controllers/review.controller')

const { protect } = require('../middlewares/auth.middleware')

router.use(protect)

// Run full AI review on an uploaded screen pair
router.post('/:uploadId',                         createReview)

// Get all reviews for a project
router.get('/project/:projectId',                 getReviewsByProject)

// Get single review
router.get('/:id',                                getReviewById)

// Get AI plain-English summary of a review
router.get('/:id/summary',                        getReviewSummary)

// Update a single issue status (open / resolved / ignored)
router.put('/:id/issue/:issueId',                 updateIssueStatus)

// Delete review
router.delete('/:id',                             deleteReview)

module.exports = router
