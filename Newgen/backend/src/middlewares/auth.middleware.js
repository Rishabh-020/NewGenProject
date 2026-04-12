const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { errorResponse } = require("../utils/response");

const protect = async (req, res, next) => {
  try {
    // ✅ Read token from cookie first, then fallback to Bearer header
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return errorResponse(res, "Not authorized. No token provided.", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return errorResponse(res, "User no longer exists.", 401);

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, "Invalid or expired token.", 401);
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, `Role '${req.user.role}' is not allowed.`, 403);
    }
    next();
  };

module.exports = { protect, authorize };
