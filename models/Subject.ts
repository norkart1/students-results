import mongoose from "mongoose"

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameArabic: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  maxMarks: { type: Number, required: true, default: 100 },
  writtenMarks: { type: Number, required: true, default: 90 },
  ceMarks: { type: Number, required: true, default: 10 },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema)
