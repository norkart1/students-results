import mongoose from "mongoose"

const BatchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  semester: { type: String, required: true },
  examTitle: { type: String, required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Batch || mongoose.model("Batch", BatchSchema)
