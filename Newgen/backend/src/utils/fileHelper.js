const fs   = require('fs')
const path = require('path')

// Read file as base64
const toBase64 = (filePath) => {
  const buf = fs.readFileSync(filePath)
  return buf.toString('base64')
}

// Get mime type from file path
const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase()
  const map = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }
  return map[ext] || 'image/jpeg'
}

// Safely delete a file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  } catch (err) {
    console.warn(`Could not delete file: ${filePath}`, err.message)
  }
}

// Delete multiple files
const deleteFiles = (...paths) => paths.forEach(deleteFile)

module.exports = { toBase64, getMimeType, deleteFile, deleteFiles }
