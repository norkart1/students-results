import mongoose from "mongoose"

const ResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  subjects: [
    {
      subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
      writtenMarks: { type: Number, required: true },
      ceMarks: { type: Number, required: true },
      totalMarks: { type: Number, required: true },
    },
  ],
  grandTotal: { type: Number, required: true },
  percentage: { type: Number, required: true },
  rank: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Result || mongoose.model("Result", ResultSchema)
