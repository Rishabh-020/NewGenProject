const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    figmaImage: {
      filename:    String,
      originalName: String,
      path:        String,
      mimetype:    String,
      size:        Number
    },
    liveImage: {
      filename:    String,
      originalName: String,
      path:        String,
      mimetype:    String,
      size:        Number
    },
    label: {
      type: String,
      default: 'Untitled Screen'
    },
    version: {
      type: String,
      default: 'V1.0'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Upload', uploadSchema)
