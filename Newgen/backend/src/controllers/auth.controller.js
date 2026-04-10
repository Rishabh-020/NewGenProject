const jwt                  = require('jsonwebtoken')
const crypto               = require('crypto')
const { validationResult } = require('express-validator')
const User                 = require('../models/user.model')
const { successResponse, errorResponse } = require('../utils/response')
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/email.service')

// ── Generate JWT ──────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// ── @route  POST /api/auth/register ──────────────────────────────────
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400)
    }

    const { name, email, password, role } = req.body

    const existing = await User.findOne({ email })
    if (existing) return errorResponse(res, 'Email already registered', 400)

    const user = await User.create({ name, email, password, role })

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch(console.warn)

    const token = generateToken(user._id)

    return successResponse(res, 'Registration successful', {
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    }, 201)
  } catch (err) {
    next(err)
  }
}

// ── @route  POST /api/auth/login ─────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400)
    }

    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) return errorResponse(res, 'Invalid email or password', 401)

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return errorResponse(res, 'Invalid email or password', 401)

    const token = generateToken(user._id)

    return successResponse(res, 'Login successful', {
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    })
  } catch (err) {
    next(err)
  }
}

// ── @route  GET /api/auth/me ─────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    return successResponse(res, 'User fetched', { user })
  } catch (err) {
    next(err)
  }
}

// ── @route  PUT /api/auth/update-profile ─────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name, role } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, role },
      { new: true, runValidators: true }
    )

    return successResponse(res, 'Profile updated', { user })
  } catch (err) {
    next(err)
  }
}

// ── @route  PUT /api/auth/change-password ────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user._id).select('+password')

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) return errorResponse(res, 'Current password is incorrect', 400)

    user.password = newPassword
    await user.save()

    return successResponse(res, 'Password changed successfully')
  } catch (err) {
    next(err)
  }
}

// ── @route  POST /api/auth/forgot-password ───────────────────────────
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) return errorResponse(res, 'No account found with that email', 404)

    // Generate raw token and hash it for storage
    const rawToken    = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

    user.resetPasswordToken   = hashedToken
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000  // 10 minutes
    await user.save()

    await sendPasswordResetEmail(email, rawToken)

    return successResponse(res, 'Password reset email sent')
  } catch (err) {
    next(err)
  }
}

// ── @route  POST /api/auth/reset-password/:token ─────────────────────
const resetPassword = async (req, res, next) => {
  try {
    const { token }       = req.params
    const { newPassword } = req.body

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) return errorResponse(res, 'Token is invalid or has expired', 400)

    user.password             = newPassword
    user.resetPasswordToken   = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    const jwtToken = generateToken(user._id)

    return successResponse(res, 'Password reset successful', { token: jwtToken })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
}
