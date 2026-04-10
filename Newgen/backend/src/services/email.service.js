const nodemailer = require('nodemailer')

// Check if email is configured — it is OPTIONAL
// If not configured, emails are silently skipped (no crash)
const EMAIL_CONFIGURED = !!(
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS
)

const transporter = EMAIL_CONFIGURED
  ? nodemailer.createTransport({
      host:   process.env.EMAIL_HOST,
      port:   parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  : null

/**
 * Send welcome email after registration
 */
const sendWelcomeEmail = async (to, name) => {
  if (!EMAIL_CONFIGURED) return console.log('[Email] Not configured — skipping welcome email')
  await transporter.sendMail({
    from:    `"PixelCheck" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to PixelCheck!',
    html: `
      <h2>Hey ${name} 👋</h2>
      <p>Welcome to <strong>PixelCheck</strong> — AI-assisted UI review tool.</p>
      <p>Start comparing Figma designs vs live implementations in seconds.</p>
      <br/>
      <p>— The PixelCheck Team</p>
    `
  })
}

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (to, resetToken) => {
  if (!EMAIL_CONFIGURED) return console.log('[Email] Not configured — skipping reset email')
  const resetURL = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`
  await transporter.sendMail({
    from:    `"PixelCheck" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <h2>Reset Your Password</h2>
      <p>You requested a password reset. Click below to set a new password:</p>
      <a href="${resetURL}" style="background:#7C3AED;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">
        Reset Password
      </a>
      <p>This link expires in 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `
  })
}

/**
 * Notify team members when a review is complete
 */
const sendReviewCompleteEmail = async (to, projectName, issueCount) => {
  if (!EMAIL_CONFIGURED) return console.log('[Email] Not configured — skipping review email')
  await transporter.sendMail({
    from:    `"PixelCheck" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Review Complete — ${projectName}`,
    html: `
      <h2>AI Review Complete</h2>
      <p>The review for <strong>${projectName}</strong> has finished.</p>
      <p><strong>${issueCount}</strong> issue(s) were found.</p>
      <p>Login to PixelCheck to see the full report.</p>
    `
  })
}

module.exports = { sendWelcomeEmail, sendPasswordResetEmail, sendReviewCompleteEmail }
