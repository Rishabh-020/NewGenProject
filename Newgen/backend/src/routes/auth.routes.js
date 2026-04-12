// const express = require("express");
// const { body } = require("express-validator");
// const passport = require("passport");
// const jwt = require("jsonwebtoken");

// const router = express.Router();

// const {
//   register,
//   login,
//   verifyEmail,
//   forgotPassword,
//   resetPassword,
// } = require("../controllers/auth.controller");

// const { protect } = require("../middlewares/auth.middleware");

// // ─────────────────────────────
// // VALIDATION
// // ─────────────────────────────
// const registerRules = [
//   body("name").notEmpty(),
//   body("email").isEmail(),
//   body("password").isLength({ min: 6 }),
// ];

// const loginRules = [
//   body("email").isEmail(),
//   body("password").notEmpty(),
// ];

// // ─────────────────────────────
// // AUTH ROUTES
// // ─────────────────────────────

// router.post("/register", registerRules, register);
// router.post("/login", loginRules, login);

// router.get("/verify-email/:token", verifyEmail);

// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// // ─────────────────────────────
// // GOOGLE OAUTH (IMPORTANT)
// // ─────────────────────────────

// // Step 1
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// // Step 2 (NO controller needed)
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "http://localhost:5173/login",
//   }),
//   (req, res) => {
//     const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.redirect("http://localhost:5173/");
//   },
// );

// module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const passport = require("passport");

const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  googleAuthSuccess,
  me,
} = require("../controllers/auth.controller");

const { protect } = require("../middlewares/auth.middleware");

// ─────────────────────────────
// VALIDATION
// ─────────────────────────────
const registerRules = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
];

const loginRules = [body("email").isEmail(), body("password").notEmpty()];

// ─────────────────────────────
// AUTH ROUTES
// ─────────────────────────────
router.post("/register", registerRules, register);
router.post("/login", loginRules, login);

router.get("/verify-email/:token", verifyEmail);

// ─────────────────────────────
// ME ROUTE (FIXED)
// ─────────────────────────────
router.get("/me", protect, me);

// ─────────────────────────────
// GOOGLE AUTH
// ─────────────────────────────
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  googleAuthSuccess,
);

module.exports = router;