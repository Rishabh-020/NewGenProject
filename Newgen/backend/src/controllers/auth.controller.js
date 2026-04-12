// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const { validationResult } = require("express-validator");
// const User = require("../models/user.model");
// const { successResponse, errorResponse } = require("../utils/response");
// const {
//   sendVerificationEmail,
//   sendPasswordResetEmail,
// } = require("../services/email.service");

// // ── JWT ─────────────────────────────────────
// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//   });

// // ─────────────────────────────────────────────
// // REGISTER (EMAIL VERIFICATION FLOW)
// // ─────────────────────────────────────────────
// const register = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return errorResponse(res, errors.array()[0].msg, 400);
//     }

//     const { name, email, password, role } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return errorResponse(res, "Email already registered", 400);
//     }

//     // create user but NOT verified
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//       isVerified: false,
//     });

//     const token = generateToken(user._id);

//     await sendVerificationEmail(email, token);

//     return successResponse(res, "Verification email sent. Please verify.");
//   } catch (err) {
//     next(err);
//   }
// };

// // ─────────────────────────────────────────────
// // EMAIL VERIFY
// // ─────────────────────────────────────────────
// const verifyEmail = async (req, res, next) => {
//   try {
//     const { token } = req.params;

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch {
//       return res.send(`<h2 style="color:red;">Invalid or expired link</h2>`);
//     }

//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.send(`<h2>User not found</h2>`);
//     }

//     user.isVerified = true;
//     await user.save();

//     return res.send(`
//       <h2 style="color:green;">Email Verified Successfully ✅</h2>
//       <p>You can now login</p>
//     `);
//   } catch (err) {
//     next(err);
//   }
// };

// // ─────────────────────────────────────────────
// // LOGIN
// // ─────────────────────────────────────────────
// const login = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return errorResponse(res, errors.array()[0].msg, 400);
//     }

//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//       return errorResponse(res, "Invalid credentials", 401);
//     }

//     if (!user.isVerified) {
//       return errorResponse(res, "Please verify your email first", 401);
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return errorResponse(res, "Invalid credentials", 401);
//     }

//     const token = generateToken(user._id);

//     return successResponse(res, "Login successful", {
//       token,
//       user,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // ─────────────────────────────────────────────
// // GOOGLE LOGIN SUCCESS
// // ─────────────────────────────────────────────
// const googleAuthSuccess = async (req, res, next) => {
//   try {
//     if (!req.user) {
//       return errorResponse(res, "Google auth failed", 401);
//     }

//     const token = generateToken(req.user._id);

//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.redirect("http://localhost:5173/");
//   } catch (err) {
//     next(err);
//   }
// };

// // ─────────────────────────────────────────────
// // PASSWORD RESET (UNCHANGED)
// // ─────────────────────────────────────────────
// const forgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return errorResponse(res, "No account found", 404);
//     }

//     const rawToken = crypto.randomBytes(32).toString("hex");

//     const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

//     user.resetPasswordToken = hashed;
//     user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

//     await user.save();

//     await sendPasswordResetEmail(email, rawToken);

//     return successResponse(res, "Reset email sent");
//   } catch (err) {
//     next(err);
//   }
// };

// const resetPassword = async (req, res, next) => {
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     const hashed = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: hashed,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return errorResponse(res, "Token invalid or expired", 400);
//     }

//     user.password = newPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     const jwtToken = generateToken(user._id);

//     return successResponse(res, "Password reset successful", {
//       token: jwtToken,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // ─────────────────────────────────────────────
// // EXPORT
// // ─────────────────────────────────────────────
// module.exports = {
//   register,
//   verifyEmail,
//   login,
//   googleAuthSuccess,
//   forgotPassword,
//   resetPassword,

// };

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const { successResponse, errorResponse } = require("../utils/response");
const { sendVerificationEmail } = require("../services/email.service");

// ── JWT ─────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

// ─────────────────────────────
// REGISTER
// ─────────────────────────────
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return errorResponse(res, "Email already registered", 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      isVerified: false,
    });

    const token = generateToken(user._id);

    await sendVerificationEmail(email, token);

    return successResponse(
      res,
      "Verification email sent. Please verify your email.",
      null,
    );
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────
// VERIFY EMAIL
// ─────────────────────────────
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res
        .status(400)
        .send(`<h2 style="color:red;">Invalid or expired link</h2>`);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send(`<h2>User not found</h2>`);
    }

    if (user.isVerified) {
      return res.send(`<h2>Email already verified ✅</h2>`);
    }

    user.isVerified = true;
    await user.save();

    return res.send(`
      <h2 style="color:green;">Email Verified Successfully ✅</h2>
      <p>You can now login.</p>
    `);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────
// LOGIN
// ─────────────────────────────
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    if (!user.isVerified) {
      return errorResponse(res, "Please verify your email first", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const token = generateToken(user._id);

    user.password = undefined;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, "Login successful", {
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────
// GOOGLE LOGIN
// ─────────────────────────────
const googleAuthSuccess = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.redirect("http://localhost:5173/login");

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("http://localhost:5173/google/success");
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────
// ME (NEW FIXED)
// ─────────────────────────────
const me = async (req, res) => {
  return res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
};

// ─────────────────────────────
module.exports = {
  register,
  login,
  verifyEmail,
  googleAuthSuccess,
  me,
};