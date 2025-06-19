import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Result from "@/models/Result"
import Student from "@/models/Student"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const { batch, results } = await req.json()
    if (!batch || !Array.isArray(results)) {
      return NextResponse.json({ error: "Missing batch or results" }, { status: 400 })
    }
    let created = 0
    let updated = 0
    let errors: any[] = []
    for (const entry of results) {
      try {
        // Find student by regNumber
        const student = await Student.findOne({ regNumber: entry.regNumber })
        if (!student) {
          errors.push({ regNumber: entry.regNumber, error: "Student not found" })
          continue
        }
        // Validate subjects structure
        if (!Array.isArray(entry.subjects) || entry.subjects.length === 0) {
          errors.push({ regNumber: entry.regNumber, error: "No subjects provided" })
          continue
        }
        for (const subj of entry.subjects) {
          if (!subj.subject) {
            errors.push({ regNumber: entry.regNumber, error: "Subject ID missing in one or more subjects" })
            continue
          }
          if (typeof subj.marks !== "object" || subj.marks == null) {
            errors.push({ regNumber: entry.regNumber, error: `Marks missing or invalid for subject ${subj.subject}` })
            continue
          }
        }
        // Upsert result for this student/batch
        const existing = await Result.findOne({ student: student._id, batch })
        if (existing) {
          existing.subjects = entry.subjects
          // Recalculate grandTotal and percentage
          existing.grandTotal = entry.subjects.reduce((sum: number, subj: any) => sum + (subj.marks.T || 0), 0)
          const maxTotal = entry.subjects.reduce((sum: number, subj: any) => {
            return sum + Object.keys(subj.marks).filter(k => k !== 'T').reduce((acc, k) => acc + (Number(subj.marks[k]) || 0), 0)
          }, 0)
          existing.percentage = maxTotal > 0 ? parseFloat(((existing.grandTotal / maxTotal) * 100).toFixed(2)) : 0
          await existing.save()
          updated++
        } else {
          const grandTotal = entry.subjects.reduce((sum: number, subj: any) => sum + (subj.marks.T || 0), 0)
          const maxTotal = entry.subjects.reduce((sum: number, subj: any) => {
            return sum + Object.keys(subj.marks).filter(k => k !== 'T').reduce((acc, k) => acc + (Number(subj.marks[k]) || 0), 0)
          }, 0)
          const percentage = maxTotal > 0 ? parseFloat(((grandTotal / maxTotal) * 100).toFixed(2)) : 0
          await Result.create({
            student: student._id,
            batch,
            subjects: entry.subjects,
            grandTotal,
            percentage
          })
          created++
        }
      } catch (err: any) {
        console.error("Bulk upload entry error:", err)
        errors.push({ regNumber: entry.regNumber, error: err.message })
      }
    }
    return NextResponse.json({ created, updated, errors })
  } catch (err: any) {
    console.error("Bulk upload API error:", err)
    return NextResponse.json({ error: "Bulk upload server error: " + (err.message || err) }, { status: 500 })
  }
}
