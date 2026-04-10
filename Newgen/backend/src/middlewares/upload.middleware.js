const multer = require('multer')
const path   = require('path')
const fs     = require('fs')

const uploadDir = path.join(__dirname, '../../tmp/uploads')
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const unique = `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
    cb(null, unique)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only PNG, JPG, and WebP images are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }  // 10 MB
})

// For review: expect figma + live fields
const uploadReviewImages = upload.fields([
  { name: 'figma', maxCount: 1 },
  { name: 'live',  maxCount: 1 }
])

// For single image upload
const uploadSingle = upload.single('image')

module.exports = { uploadReviewImages, uploadSingle }
