// const { GoogleGenerativeAI } = require('@google/generative-ai')
// const { toBase64, getMimeType } = require('../utils/fileHelper')
// const { buildDiffAnalysisPrompt, buildSummaryPrompt } = require('../utils/prompts')

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// /**
//  * Convert image file to Gemini inline part
//  */
// const fileToPart = (filePath) => ({
//   inlineData: {
//     data:     toBase64(filePath),
//     mimeType: getMimeType(filePath)
//   }
// })

// /**
//  * Analyse both images + diff regions using Gemini Vision
//  * Returns structured array of UI issues
//  */
// const analyzeWithClaude = async (figmaPath, livePath, regions) => {
//   const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

//   const regionSummary = regions.slice(0, 10).map((r, i) => ({
//     index:      i,
//     severity:   r.severity,
//     issue_type: r.issue_type,
//     position:   `x:${r.bbox.x}% y:${r.bbox.y}% w:${r.bbox.w}% h:${r.bbox.h}%`,
//     color: {
//       figma_hex: r.color?.figma_rgb,
//       live_hex:  r.color?.live_rgb
//     }
//   }))

//   const result = await model.generateContent([
//     fileToPart(figmaPath),
//     fileToPart(livePath),
//     buildDiffAnalysisPrompt(regionSummary)
//   ])

//   const rawText = result.response.text()

//   console.log("Raw Gemini response:", rawText);

//   try {
//     const clean = rawText.replace(/```json|```/g, '').trim()
//     return JSON.parse(clean)
//   } catch {
//     console.warn('Gemini response was not valid JSON')
//     return []
//   }
// }

// /**
//  * Generate plain-English review summary using Gemini
//  */
// const generateSummary = async (issues) => {
//   const model  = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
//   const result = await model.generateContent(buildSummaryPrompt(issues))
//   return result.response.text()
// }

// module.exports = { analyzeWithClaude, generateSummary }

const { Mistral } = require("@mistralai/mistralai");
const fs = require("fs");
const path = require("path");
const { buildDiffAnalysisPrompt } = require("../utils/prompts");

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const fileToBase64 = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  return buffer.toString("base64");
};

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
};

const analyzeWithClaude = async (figmaPath, livePath, regions) => {
  const figmaBase64 = fileToBase64(figmaPath);
  const liveBase64 = fileToBase64(livePath);
  const figmaMime = getMimeType(figmaPath);
  const liveMime = getMimeType(livePath);

  const regionSummary = regions.slice(0, 10).map((r, i) => ({
    index: i,
    severity: r.severity,
    issue_type: r.issue_type,
    position: `x:${r.bbox.x}% y:${r.bbox.y}% w:${r.bbox.w}% h:${r.bbox.h}%`,
    color: {
      figma_hex: r.color?.figma_rgb,
      live_hex: r.color?.live_rgb,
    },
  }));

  const response = await client.chat.complete({
    model: "pixtral-12b-2409",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            imageUrl: {
              url: `data:${figmaMime};base64,${figmaBase64}`,
            },
          },
          {
            type: "image_url",
            imageUrl: {
              url: `data:${liveMime};base64,${liveBase64}`,
            },
          },
          {
            type: "text",
            text: buildDiffAnalysisPrompt(regionSummary),
          },
        ],
      },
    ],
  });

  const rawText = response.choices[0].message.content;
  console.log("Raw Mistral response:", rawText);

  try {
    const clean = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    console.warn("Mistral response was not valid JSON");
    return [];
  }
};

const generateSummary = async (issues) => {
  const response = await client.chat.complete({
    model: "mistral-medium-latest",
    messages: [
      {
        role: "user",
        content: require("../utils/prompts").buildSummaryPrompt(issues),
      },
    ],
  });
  return response.choices[0].message.content;
};

module.exports = { analyzeWithClaude, generateSummary };