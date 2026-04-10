const { GoogleGenerativeAI } = require('@google/generative-ai')
const { toBase64, getMimeType } = require('../utils/fileHelper')
const { buildDiffAnalysisPrompt, buildSummaryPrompt } = require('../utils/prompts')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Convert image file to Gemini inline part
 */
const fileToPart = (filePath) => ({
  inlineData: {
    data:     toBase64(filePath),
    mimeType: getMimeType(filePath)
  }
})

/**
 * Analyse both images + diff regions using Gemini Vision
 * Returns structured array of UI issues
 */
const analyzeWithClaude = async (figmaPath, livePath, regions) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const regionSummary = regions.slice(0, 10).map((r, i) => ({
    index:      i,
    severity:   r.severity,
    issue_type: r.issue_type,
    position:   `x:${r.bbox.x}% y:${r.bbox.y}% w:${r.bbox.w}% h:${r.bbox.h}%`,
    color: {
      figma_hex: r.color?.figma_rgb,
      live_hex:  r.color?.live_rgb
    }
  }))

  const result = await model.generateContent([
    fileToPart(figmaPath),
    fileToPart(livePath),
    buildDiffAnalysisPrompt(regionSummary)
  ])

  const rawText = result.response.text()

  try {
    const clean = rawText.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    console.warn('Gemini response was not valid JSON')
    return []
  }
}

/**
 * Generate plain-English review summary using Gemini
 */
const generateSummary = async (issues) => {
  const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(buildSummaryPrompt(issues))
  return result.response.text()
}

module.exports = { analyzeWithClaude, generateSummary }
