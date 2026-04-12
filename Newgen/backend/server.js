require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

require("./src/config/passport");

const connectDB = require("./src/config/db");
const errorMiddleware = require("./src/middlewares/error.middleware");

const authRoutes = require("./src/routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

// ─────────────────────────────
// FIXED CORS (IMPORTANT)
// ─────────────────────────────
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/diff", require("./src/routes/diff.routes"));
app.use("/api/review", require("./src/routes/review.routes"));
app.use("/api/upload", require("./src/routes/upload.routes"));

// HEALTH
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// ERROR HANDLER
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
