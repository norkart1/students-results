import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Student from "@/models/Student"
import Subject from "@/models/Subject"
import Batch from "@/models/Batch"
import Result from "@/models/Result"

export async function POST() {
  try {
    await dbConnect()

    console.log("🗑️ Clearing all data...")

    // Clear all collections
    await Student.deleteMany({})
    await Subject.deleteMany({})
    await Batch.deleteMany({})
    await Result.deleteMany({})

    console.log("✅ All data cleared successfully!")

    return NextResponse.json({
      success: true,
      message: "All data cleared successfully!",
    })
  } catch (error) {
    console.error("Clear data error:", error)
    return NextResponse.json({ error: "Failed to clear data" }, { status: 500 })
  }
}
