const express = require('express')
const { body } = require('express-validator')
const router  = express.Router()

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller')

const { protect } = require('../middlewares/auth.middleware')

// Validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['designer', 'developer', 'reviewer']).withMessage('Invalid role')
]

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
]

// Public routes
router.post('/register',                    registerRules, register)
router.post('/login',                       loginRules,    login)
router.post('/forgot-password',             forgotPassword)
router.post('/reset-password/:token',       resetPassword)

// Protected routes
router.get ('/me',                protect,  getMe)
router.put ('/update-profile',    protect,  updateProfile)
router.put ('/change-password',   protect,  changePassword)

module.exports = router
