import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Result from "@/models/Result"
import Student from "@/models/Student"

export async function GET(request: NextRequest, { params }: { params: { regNumber: string } }) {
  try {
    await dbConnect()

    console.log("Searching for student with reg number:", params.regNumber)

    // First find the student by registration number
    const student = await Student.findOne({ regNumber: params.regNumber })
    if (!student) {
      console.log("Student not found")
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    console.log("Student found:", student.name)

    // Then find the result for this student
    const result = await Result.findOne({ student: student._id })
      .populate("student")
      .populate("batch")
      .populate("subjects.subject")

    if (!result) {
      console.log("Result not found for student")
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    // --- Ensure rank is up-to-date for this batch ---
    if (result.batch) {
      const batchResults = await Result.find({ batch: result.batch })
        .sort({ percentage: -1, grandTotal: -1 })
      for (let i = 0; i < batchResults.length; i++) {
        batchResults[i].rank = i + 1
        await batchResults[i].save()
      }
      // Refetch the result to get the updated rank and all populated fields
      const updatedResult = await Result.findOne({ student: student._id })
        .populate("student")
        .populate("batch")
        .populate("subjects.subject")
      if (updatedResult) {
        let profilePhotoUrl = null;
        if (student.profilePhoto) {
          if (student.profilePhoto.startsWith("http")) {
            profilePhotoUrl = student.profilePhoto;
          } else {
            const supabaseUrl = process.env.SUPABASE_URL;
            profilePhotoUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${student.profilePhoto}`;
          }
        }
        const resultObj = updatedResult.toObject();
        resultObj.student.profilePhoto = profilePhotoUrl;
        return NextResponse.json(resultObj)
      }
    }
    // --- End rank update ---

    // Attach profilePhotoUrl to the student object in the result (fallback)
    let profilePhotoUrl = null;
    if (student.profilePhoto) {
      if (student.profilePhoto.startsWith("http")) {
        profilePhotoUrl = student.profilePhoto;
      } else {
        const supabaseUrl = process.env.SUPABASE_URL;
        profilePhotoUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${student.profilePhoto}`;
      }
    }
    const resultObj = result.toObject();
    resultObj.student.profilePhoto = profilePhotoUrl;
    return NextResponse.json(resultObj)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 })
  }
}
