import mongoose from "mongoose"

const SubjectMarkSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  marks: { type: mongoose.Schema.Types.Mixed, required: true }, // e.g., { W: 80, CE: 10, T: 90 }
})

const ResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  subjects: [SubjectMarkSchema],
  grandTotal: { type: Number, required: true },
  percentage: { type: Number, required: true },
  rank: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Result || mongoose.model("Result", ResultSchema)
