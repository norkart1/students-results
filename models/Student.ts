import mongoose from "mongoose"

const StudentSchema = new mongoose.Schema({
  regNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  profilePhoto: { type: String }, // stores filename or relative path
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Student || mongoose.model("Student", StudentSchema)
