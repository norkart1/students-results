import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Student from "@/models/Student"
import Notification from "@/models/Notification"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const student = await Student.findById(params.id).populate("batch")
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }
    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const body = await request.json()
    const student = await Student.findByIdAndUpdate(params.id, body, { new: true })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }
    // Create notification for student update
    await Notification.create({
      message: `Student updated: ${student.name || student.regNumber || "Unknown"}`,
    })
    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const student = await Student.findByIdAndDelete(params.id)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}
