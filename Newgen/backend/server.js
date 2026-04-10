require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const connectDB        = require('./src/config/db')
const errorMiddleware  = require('./src/middlewares/error.middleware')

const authRoutes    = require('./src/routes/auth.routes')
const uploadRoutes  = require('./src/routes/upload.routes')
const reviewRoutes  = require('./src/routes/review.routes')
const diffRoutes    = require('./src/routes/diff.routes')
const projectRoutes = require('./src/routes/project.routes')
const figmaRoutes   = require('./src/routes/figma.routes')

const app  = express()
const PORT = process.env.PORT || 5000

// Connect MongoDB
connectDB()

// Global middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth',    authRoutes)
app.use('/api/upload',  uploadRoutes)
app.use('/api/review',  reviewRoutes)
app.use('/api/diff',    diffRoutes)
app.use('/api/project', projectRoutes)
app.use('/api/figma',   figmaRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() })
})

// Global error handler — must be last
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
