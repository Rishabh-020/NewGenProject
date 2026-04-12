const Upload = require("../models/upload.model");
const { runDiff } = require("../services/diff.service");
const { analyzeWithClaude } = require("../services/claude.service");
const { successResponse, errorResponse } = require("../utils/response");

// check if OpenCV found useful specific regions
// or just one giant region covering the whole image
const hasUsefulRegions = (regions) => {
  if (!regions || regions.length === 0) return false;
  const useful = regions.filter((r) => r.bbox.w < 80 && r.bbox.h < 80);
  return useful.length > 0;
};

// ── @route  POST /api/diff/:uploadId ─────────────────────────────────
const runDiffOnUpload = async (req, res, next) => {
  try {
    const upload = await Upload.findById(req.params.uploadId);
    if (!upload) return errorResponse(res, "Upload not found", 404);

    const figmaPath = upload.figmaImage?.path;
    const livePath = upload.liveImage?.path;

    if (!figmaPath || !livePath) {
      return errorResponse(res, "Image paths are missing in this upload", 400);
    }

    const diffResult = await runDiff(figmaPath, livePath);
    console.log("OpenCV regions found:", diffResult.regions.length);

    const useful = hasUsefulRegions(diffResult.regions);
    console.log("OpenCV useful:", useful);

    const hintsToPass = useful
      ? diffResult.regions.filter((r) => r.bbox.w < 80 && r.bbox.h < 80)
      : [];

    const issues = await analyzeWithClaude(figmaPath, livePath, hintsToPass);
    console.log("Gemini issues found:", issues.length);

    return successResponse(res, "Diff computed", {
      regions: issues,
      total: issues.length,
    });
  } catch (err) {
    next(err);
  }
};

// ── @route  POST /api/diff/raw ────────────────────────────────────────
const runDiffRaw = async (req, res, next) => {
  try {
    const figmaFile = req.files?.figma?.[0];
    const liveFile = req.files?.live?.[0];

    if (!figmaFile || !liveFile) {
      return errorResponse(res, "Both figma and live images are required", 400);
    }

    // Step 1 — run OpenCV
    const diffResult = await runDiff(figmaFile.path, liveFile.path);
    console.log("OpenCV regions found:", diffResult.regions.length);

    // Step 2 — check if OpenCV found useful specific regions
    const useful = hasUsefulRegions(diffResult.regions);
    console.log("OpenCV useful:", useful);

    if (useful) {
      console.log("Using OpenCV regions as hints for Gemini");
    } else {
      console.log(
        "OpenCV gave no useful regions — letting Gemini analyse fully",
      );
    }

    // Step 3 — pass useful regions or empty array to Gemini
    const hintsToPass = useful
      ? diffResult.regions.filter((r) => r.bbox.w < 80 && r.bbox.h < 80)
      : [];

    // Step 4 — Gemini analyses both images
    const issues = await analyzeWithClaude(
      figmaFile.path,
      liveFile.path,
      hintsToPass,
    );
    console.log("Gemini issues found:", issues.length);
    console.log("Issues:", JSON.stringify(issues, null, 2));

    return successResponse(res, "Diff computed", {
      regions: issues,
      total: issues.length,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { runDiffOnUpload, runDiffRaw };
