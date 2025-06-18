import mongoose from "mongoose"

const ScoringComponentSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g., 'W', 'CE', 'O', 'Practical', etc.
  label: { type: String, required: true }, // e.g., 'Written', 'Oral', etc.
  max: { type: Number, required: false }, // max marks for this component
  computed: { type: Boolean, default: false }, // if this is a computed field (like Total)
})

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameArabic: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  scoringScheme: { type: [ScoringComponentSchema], required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema)
