import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Student from "@/models/Student"
import Notification from "@/models/Notification"

export async function GET() {
  try {
    await dbConnect()
    const students = await Student.find().populate("batch").sort({ createdAt: -1 })
    return NextResponse.json(students)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const student = await Student.create(body)
    // Create notification for new student
    await Notification.create({
      message: `New student registered: ${student.name || student.regNumber || "Unknown"}`,
    })
    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}
