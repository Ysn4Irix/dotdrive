const mongoose = require("mongoose")

const fileSchema = mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  password: String,
}, {
  timestamps: true,
  versionKey: false
})

module.exports = mongoose.model("Files", fileSchema)