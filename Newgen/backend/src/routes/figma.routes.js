const express = require('express')
const router  = express.Router()

const { getTokens, compareWithLive, fullReview } = require('../controllers/figma.controller')
const { protect } = require('../middlewares/auth.middleware')

router.use(protect)

// Extract design tokens from a Figma node
router.post('/tokens',       getTokens)

// Compare Figma tokens vs live CSS from browser
router.post('/compare',      compareWithLive)

// Full review: image diff + CSS token diff merged
router.post('/full-review',  fullReview)

module.exports = router
