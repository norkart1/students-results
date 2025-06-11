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

    // Attach the correct public profile photo URL if available
    let profilePhotoUrl = null;
    if (student.profilePhoto) {
      // If already a public URL (from Supabase), use as is
      if (student.profilePhoto.startsWith("http")) {
        profilePhotoUrl = student.profilePhoto;
      } else {
        // Otherwise, assume it's a filename in Supabase avatars bucket
        const supabaseUrl = process.env.SUPABASE_URL;
        profilePhotoUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${student.profilePhoto}`;
      }
    }

    // Attach profilePhotoUrl to the student object in the result
    const resultObj = result.toObject();
    resultObj.student.profilePhoto = profilePhotoUrl;

    return NextResponse.json(resultObj)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 })
  }
}
