// =============================================================================
// figma.service.js — Extract design tokens directly from Figma
// =============================================================================
// Instead of comparing images only, we pull the ACTUAL design values from
// Figma's API — spacing, colors, font sizes, border radius etc.
// This gives us exact expected values instead of AI guessing from pixels.
//
// Flow:
//   Figma File ID + Node ID
//         ↓
//   Figma REST API
//         ↓
//   JSON with exact design tokens
//   { padding: 12, fontSize: 24, color: #7C3AED ... }
//         ↓
//   Compare with actual CSS on live page
//         ↓
//   Exact diff: "padding should be 12px but is 16px"
// =============================================================================

const axios = require('axios')

const FIGMA_BASE_URL   = 'https://api.figma.com/v1'
const FIGMA_TOKEN      = process.env.FIGMA_ACCESS_TOKEN

// shared axios instance with Figma auth header
const figmaClient = axios.create({
  baseURL: FIGMA_BASE_URL,
  headers: {
    'X-Figma-Token': FIGMA_TOKEN
  }
})


// =============================================================================
// GET full file data from Figma
// Returns the entire document tree as JSON
// =============================================================================
const getFigmaFile = async (fileId) => {
  try {
    const res = await figmaClient.get(`/files/${fileId}`)
    return res.data
  } catch (err) {
    throw new Error(`Figma API error: ${err.response?.data?.message || err.message}`)
  }
}


// =============================================================================
// GET specific node (frame/component) from Figma file
// nodeId = the specific screen or component you want
// =============================================================================
const getFigmaNode = async (fileId, nodeId) => {
  try {
    const res = await figmaClient.get(`/files/${fileId}/nodes?ids=${nodeId}`)
    return res.data.nodes[nodeId]
  } catch (err) {
    throw new Error(`Figma node error: ${err.response?.data?.message || err.message}`)
  }
}


// =============================================================================
// EXTRACT design tokens from a Figma node
// Recursively walks the node tree and pulls out all style values
// =============================================================================
const extractDesignTokens = (node, tokens = [], depth = 0) => {

  if (!node) return tokens

  // only go 5 levels deep to avoid huge trees
  if (depth > 5) return tokens

  const token = {
    id:   node.id,
    name: node.name,
    type: node.type,   // FRAME, COMPONENT, TEXT, RECTANGLE etc
  }

  // ── Spacing / Sizing ────────────────────────────────────────────────
  if (node.absoluteBoundingBox) {
    token.width  = Math.round(node.absoluteBoundingBox.width)
    token.height = Math.round(node.absoluteBoundingBox.height)
  }

  // padding values (Figma stores as paddingLeft, paddingRight etc)
  if (node.paddingLeft  !== undefined) token.paddingLeft   = node.paddingLeft
  if (node.paddingRight !== undefined) token.paddingRight  = node.paddingRight
  if (node.paddingTop   !== undefined) token.paddingTop    = node.paddingTop
  if (node.paddingBottom!== undefined) token.paddingBottom = node.paddingBottom

  // gap between children (flex gap equivalent)
  if (node.itemSpacing !== undefined) token.gap = node.itemSpacing

  // border radius
  if (node.cornerRadius !== undefined) token.borderRadius = node.cornerRadius

  // ── Colors ──────────────────────────────────────────────────────────
  if (node.fills && node.fills.length > 0) {
    const solidFill = node.fills.find(f => f.type === 'SOLID' && f.visible !== false)
    if (solidFill) {
      token.backgroundColor = rgbaToHex(solidFill.color)
      token.opacity         = solidFill.opacity || 1
    }
  }

  // border/stroke color
  if (node.strokes && node.strokes.length > 0) {
    const stroke = node.strokes.find(s => s.type === 'SOLID')
    if (stroke) {
      token.borderColor = rgbaToHex(stroke.color)
      token.borderWidth = node.strokeWeight || 1
    }
  }

  // ── Typography ──────────────────────────────────────────────────────
  if (node.type === 'TEXT' && node.style) {
    token.fontSize      = node.style.fontSize
    token.fontFamily    = node.style.fontFamily
    token.fontWeight    = node.style.fontWeight
    token.lineHeight    = node.style.lineHeightPx
    token.letterSpacing = node.style.letterSpacing
    token.textAlign     = node.style.textAlignHorizontal?.toLowerCase()

    // text color
    if (node.fills && node.fills.length > 0) {
      const textFill = node.fills.find(f => f.type === 'SOLID')
      if (textFill) token.color = rgbaToHex(textFill.color)
    }
  }

  // ── Layout ──────────────────────────────────────────────────────────
  if (node.layoutMode) {
    token.display       = 'flex'
    token.flexDirection = node.layoutMode === 'HORIZONTAL' ? 'row' : 'column'
    token.alignItems    = figmaAlignToCSS(node.primaryAxisAlignItems)
    token.justifyContent= figmaAlignToCSS(node.counterAxisAlignItems)
  }

  tokens.push(token)

  // recurse into children
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      extractDesignTokens(child, tokens, depth + 1)
    }
  }

  return tokens
}


// =============================================================================
// COMPARE Figma tokens vs live CSS values
// figmaTokens = array from extractDesignTokens()
// liveCSSMap  = { elementName: { padding, fontSize, color ... } }
//               (extracted from browser by frontend and sent to backend)
// =============================================================================
const compareTokensWithCSS = (figmaTokens, liveCSSMap) => {
  const issues = []

  for (const token of figmaTokens) {
    const liveCSS = liveCSSMap[token.name]

    // skip if no matching live element found
    if (!liveCSS) continue

    // ── Check padding ──────────────────────────────────────────────
    if (token.paddingLeft !== undefined && liveCSS.paddingLeft !== undefined) {
      const expected = `${token.paddingLeft}px`
      const actual   = liveCSS.paddingLeft

      if (expected !== actual) {
        issues.push({
          element:  token.name,
          category: 'Spacing',
          property: 'padding-left',
          expected,
          actual,
          severity: getSeverity(token.paddingLeft, parseFloat(actual)),
          cssfix:   `padding-left: ${expected};`
        })
      }
    }

    // ── Check font size ───────────────────────────────────────────
    if (token.fontSize !== undefined && liveCSS.fontSize !== undefined) {
      const expected = `${token.fontSize}px`
      const actual   = liveCSS.fontSize

      if (expected !== actual) {
        issues.push({
          element:  token.name,
          category: 'Typography',
          property: 'font-size',
          expected,
          actual,
          severity: getSeverity(token.fontSize, parseFloat(actual)),
          cssfix:   `font-size: ${expected};`
        })
      }
    }

    // ── Check font weight ─────────────────────────────────────────
    if (token.fontWeight !== undefined && liveCSS.fontWeight !== undefined) {
      const expected = `${token.fontWeight}`
      const actual   = `${liveCSS.fontWeight}`

      if (expected !== actual) {
        issues.push({
          element:  token.name,
          category: 'Typography',
          property: 'font-weight',
          expected,
          actual,
          severity: 'medium',
          cssfix:   `font-weight: ${expected};`
        })
      }
    }

    // ── Check color ───────────────────────────────────────────────
    if (token.color && liveCSS.color) {
      const expected = token.color.toLowerCase()
      const actual   = normalizeColor(liveCSS.color)

      if (expected !== actual) {
        issues.push({
          element:  token.name,
          category: 'Color',
          property: 'color',
          expected: token.color,
          actual:   liveCSS.color,
          severity: 'high',
          cssfix:   `color: ${token.color};`
        })
      }
    }

    // ── Check background color ────────────────────────────────────
    if (token.backgroundColor && liveCSS.backgroundColor) {
      const expected = token.backgroundColor.toLowerCase()
      const actual   = normalizeColor(liveCSS.backgroundColor)

      if (expected !== actual) {
        issues.push({
          element:  token.name,
          category: 'Color',
          property: 'background-color',
          expected: token.backgroundColor,
          actual:   liveCSS.backgroundColor,
          severity: 'high',
          cssfix:   `background-color: ${token.backgroundColor};`
        })
      }
    }

    // ── Check border radius ───────────────────────────────────────
    if (token.borderRadius !== undefined && liveCSS.borderRadius !== undefined) {
      const expected = `${token.borderRadius}px`
      const actual   = liveCSS.borderRadius

      if (expected !== actual) {
        issues.push({
          element:  token.name,
          category: 'Sizing',
          property: 'border-radius',
          expected,
          actual,
          severity: 'low',
          cssfix:   `border-radius: ${expected};`
        })
      }
    }

    // ── Check width ───────────────────────────────────────────────
    if (token.width !== undefined && liveCSS.width !== undefined) {
      const expected = `${token.width}px`
      const actual   = liveCSS.width

      if (expected !== actual) {
        issues.push({
          element:  token.name,
          category: 'Sizing',
          property: 'width',
          expected,
          actual,
          severity: getSeverity(token.width, parseFloat(actual)),
          cssfix:   `width: ${expected};`
        })
      }
    }
  }

  return issues
}


// =============================================================================
// HELPERS
// =============================================================================

// Convert Figma RGBA (0-1) to CSS hex string
const rgbaToHex = ({ r, g, b }) => {
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

// Convert Figma alignment strings to CSS values
const figmaAlignToCSS = (align) => {
  const map = {
    MIN:     'flex-start',
    CENTER:  'center',
    MAX:     'flex-end',
    SPACE_BETWEEN: 'space-between'
  }
  return map[align] || 'flex-start'
}

// Normalize color to hex for comparison
// handles rgb(255, 0, 0) → #FF0000
const normalizeColor = (color) => {
  if (!color) return ''
  if (color.startsWith('#')) return color.toLowerCase()

  // parse rgb(r, g, b)
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (match) {
    const toHex = (v) => parseInt(v).toString(16).padStart(2, '0')
    return `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`
  }

  return color.toLowerCase()
}

// Calculate severity based on how much the value differs
const getSeverity = (expected, actual) => {
  const diff = Math.abs(expected - actual)
  if (diff > 8)  return 'high'
  if (diff > 3)  return 'medium'
  return 'low'
}


module.exports = {
  getFigmaFile,
  getFigmaNode,
  extractDesignTokens,
  compareTokensWithCSS,
  rgbaToHex
}
