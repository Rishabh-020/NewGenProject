const buildDiffAnalysisPrompt = (regions) => `
You are a senior UI reviewer comparing a Figma design vs a live implementation.

${
  regions.length > 0
    ? `OpenCV detected ${regions.length} specific diff region(s) as hints:
${JSON.stringify(regions, null, 2)}
Use these positions as starting points but also scan the full image yourself.`
    : `OpenCV found no specific regions. Do a complete visual comparison yourself.`
}

Scan both images section by section:
- Header / navbar
- Stat cards / metric cards
- Charts / graphs
- Activity feed / lists
- Buttons and interactive elements
- Typography and spacing throughout

Look specifically for these issue types:
1. COLOR — wrong colors on buttons, backgrounds, text, icons
2. TYPOGRAPHY — wrong font size, weight, line height
3. SPACING — wrong padding, margin, gap between elements
4. BORDER RADIUS — corners too sharp or too rounded
5. SIZING — elements too big or too small
6. ALIGNMENT — elements shifted from correct position
7. MISSING/EXTRA — elements present in one image but not the other

IMPORTANT — For each issue you find, you MUST estimate the bounding box location
of where that issue appears on the image, as a percentage of image width/height.

For example:
- Header is roughly: x:0 y:0 w:100 h:15
- Stat cards row is roughly: x:0 y:15 w:100 h:25
- Charts section is roughly: x:0 y:40 w:65 h:40
- Activity feed is roughly: x:65 y:40 w:35 h:40
- First stat card: x:0 y:15 w:25 h:25
- Second stat card: x:25 y:15 w:25 h:25
- Third stat card: x:50 y:15 w:25 h:25
- Fourth stat card: x:75 y:15 w:25 h:25

Be as precise as possible when estimating bbox for each issue.

Respond ONLY with a valid JSON array — no markdown, no explanation:
[
  {
    "id": "issue_0",
    "regionIndex": 0,
    "category": "Color" | "Typography" | "Spacing" | "Sizing" | "Alignment" | "Border" | "Component",
    "label": "Short label e.g. Primary Button Color",
    "severity": "high" | "medium" | "low",
    "description": "One sentence describing exactly what is wrong",
    "expected": "Value from Figma e.g. #6c63ff or 12px border-radius",
    "actual": "Value in live e.g. #3b82f6 or 8px border-radius",
    "cssfix": "Exact CSS fix e.g. background-color: #6c63ff;",
    "bbox": {
      "x": 0,
      "y": 0,
      "w": 25,
      "h": 15
    }
  }
]
`;

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
`;

module.exports = { buildDiffAnalysisPrompt, buildSummaryPrompt };
