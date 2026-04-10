/**
 * All Claude AI prompts used across the app
 */

const buildDiffAnalysisPrompt = (regions) => `
You are a senior UI review assistant. You are given:
1. A Figma reference design (first image)
2. A live implemented screen (second image)
3. Diff regions detected by OpenCV — these are areas where pixels differ

Each region includes:
- position: where on the screen the diff was found (as % of image)
- severity: how intense the pixel difference is (high/medium/low)
- issue_type: OpenCV's best guess at the category (use as a hint only)
- color: average color in figma vs live (BGR format)

Your task: For each region, look at both images at that position and identify
the exact UI mismatch. Give the developer a specific CSS fix.

Detected diff regions:
${JSON.stringify(regions, null, 2)}

Rules:
- Use issue_type as a hint but trust what you SEE in the images
- Be specific: say "padding: 16px" not just "padding is wrong"
- cssfix must be a single valid CSS declaration
- Respond ONLY with a valid JSON array — no markdown, no explanation

[
  {
    "id": "issue_0",
    "regionIndex": 0,
    "category": "Spacing" | "Typography" | "Color" | "Sizing" | "Alignment" | "Component",
    "label": "Short label e.g. Header Padding",
    "severity": "high" | "medium" | "low",
    "description": "One sentence describing the mismatch",
    "expected": "Value from Figma e.g. 16px or #7C3AED",
    "actual": "Value in live screen e.g. 24px or #6D28D9",
    "cssfix": "Exact CSS fix e.g. padding: 16px;"
  }
]
`

const buildSummaryPrompt = (issues) => `
You are a UI review assistant. Given these UI issues found between a Figma design
and a live implementation, write a short 2-3 sentence plain-English summary
for a developer.

Issues found:
${JSON.stringify(issues, null, 2)}

Keep it concise. Mention:
- total number of issues
- most critical issue to fix first
- overall quality assessment

No markdown. Plain text only.
`

module.exports = { buildDiffAnalysisPrompt, buildSummaryPrompt }
