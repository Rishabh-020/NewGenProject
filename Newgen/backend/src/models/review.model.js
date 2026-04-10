const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
  id:          String,
  category:    { type: String, enum: ['Spacing', 'Typography', 'Color', 'Sizing', 'Alignment', 'Component', 'Visual'] },
  label:       String,
  severity:    { type: String, enum: ['high', 'medium', 'low'] },
  description: String,
  expected:    String,
  actual:      String,
  cssfix:      String,
  source:      { type: String, enum: ['image', 'figma_token'], default: 'image' },
  status:      { type: String, enum: ['open', 'resolved', 'ignored'], default: 'open' },
  bbox: {
    x: Number,
    y: Number,
    w: Number,
    h: Number
  }
})

const reviewSchema = new mongoose.Schema(
  {
    upload: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Upload',
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    issues:     [issueSchema],
    totalIssues: { type: Number, default: 0 },
    highCount:   { type: Number, default: 0 },
    mediumCount: { type: Number, default: 0 },
    lowCount:    { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'complete', 'failed'],
      default: 'pending'
    },
    aiModel: {
      type: String,
      default: 'claude-sonnet-4-20250514'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Review', reviewSchema)
