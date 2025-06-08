import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Student from "@/models/Student"
import Subject from "@/models/Subject"
import Batch from "@/models/Batch"
import Result from "@/models/Result"

export async function POST() {
  try {
    await dbConnect()

    console.log("🌱 Starting data seeding...")

    // Clear existing data
    await Student.deleteMany({})
    await Subject.deleteMany({})
    await Batch.deleteMany({})
    await Result.deleteMany({})

    // Create subjects
    const subjects = await Subject.insertMany([
      { name: "Biology", nameArabic: "بیماری", code: "BIO", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
      { name: "Chemistry", nameArabic: "بخاری", code: "CHE", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
      { name: "Physics", nameArabic: "مسلم", code: "PHY", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
      { name: "Mathematics", nameArabic: "ابن ماجہ ونسائی", code: "MAT", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
      { name: "Islamic Studies", nameArabic: "ترمذی", code: "ISL", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
      { name: "Arabic", nameArabic: "جمع", code: "ARA", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
      { name: "English", nameArabic: "اللغة", code: "ENG", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
    ])

    // Create batch
    const batch = await Batch.create({
      name: "NIHAYA 2",
      year: 2025,
      semester: "First Semester",
      examTitle: "ASAS MALIKI EXAMINATION FIRST SEMESTER MAY-JUNE 2025",
      subjects: subjects.map((s) => s._id),
    })

    // Create students with sample data from the image
    const studentsData = [
      { regNumber: "1027", name: "JAMSHAD O.B" },
      { regNumber: "1028", name: "M. RAHMATHULLA" },
      { regNumber: "1030", name: "M. ASHIQ P.T" },
      { regNumber: "1031", name: "M. KABEER T.T" },
      { regNumber: "1034", name: "M. SWALIH E.T" },
      { regNumber: "1035", name: "M. SWALIH P" },
      { regNumber: "1038", name: "RINSHAD C.P" },
      { regNumber: "1040", name: "SAHAL M" },
      { regNumber: "1046", name: "AFTHAB NOUSHAD" },
    ]

    const students = await Student.insertMany(
      studentsData.map((student) => ({
        ...student,
        batch: batch._id,
        email: `${student.name.toLowerCase().replace(/\s+/g, ".")}@student.edu`,
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      })),
    )

    // Create sample results based on the image data - ALL STUDENTS
    const resultsData = [
      {
        student: students[0]._id, // JAMSHAD O.B (1027)
        subjects: [
          { subject: subjects[0]._id, writtenMarks: 72, ceMarks: 10, totalMarks: 82 },
          { subject: subjects[1]._id, writtenMarks: 56, ceMarks: 9, totalMarks: 65 },
          { subject: subjects[2]._id, writtenMarks: 51, ceMarks: 9, totalMarks: 60 },
          { subject: subjects[3]._id, writtenMarks: 53, ceMarks: 9, totalMarks: 62 },
          { subject: subjects[4]._id, writtenMarks: 73, ceMarks: 10, totalMarks: 83 },
          { subject: subjects[5]._id, writtenMarks: 60, ceMarks: 10, totalMarks: 70 },
          { subject: subjects[6]._id, writtenMarks: 79, ceMarks: 0, totalMarks: 79 },
        ],
        grandTotal: 501,
        percentage: 71.5,
        rank: 4,
      },
      {
        student: students[1]._id, // M. RAHMATHULLA (1028)
        subjects: [
          { subject: subjects[0]._id, writtenMarks: 55, ceMarks: 7, totalMarks: 62 },
          { subject: subjects[1]._id, writtenMarks: 48, ceMarks: 8, totalMarks: 56 },
          { subject: subjects[2]._id, writtenMarks: 60, ceMarks: 8, totalMarks: 68 },
          { subject: subjects[3]._id, writtenMarks: 58, ceMarks: 8, totalMarks: 66 },
          { subject: subjects[4]._id, writtenMarks: 75, ceMarks: 10, totalMarks: 85 },
          { subject: subjects[5]._id, writtenMarks: 52, ceMarks: 10, totalMarks: 62 },
          { subject: subjects[6]._id, writtenMarks: 79, ceMarks: 0, totalMarks: 79 },
        ],
        grandTotal: 478,
        percentage: 68.2,
        rank: 6,
      },
      {
        student: students[2]._id, // M. ASHIQ P.T (1030)
        subjects: [
          { subject: subjects[0]._id, writtenMarks: 49, ceMarks: 10, totalMarks: 59 },
          { subject: subjects[1]._id, writtenMarks: 54, ceMarks: 8, totalMarks: 62 },
          { subject: subjects[2]._id, writtenMarks: 55, ceMarks: 8, totalMarks: 63 },
          { subject: subjects[3]._id, writtenMarks: 55, ceMarks: 8, totalMarks: 63 },
          { subject: subjects[4]._id, writtenMarks: 76, ceMarks: 10, totalMarks: 86 },
          { subject: subjects[5]._id, writtenMarks: 61, ceMarks: 10, totalMarks: 71 },
          { subject: subjects[6]._id, writtenMarks: 73, ceMarks: 0, totalMarks: 73 },
        ],
        grandTotal: 477,
        percentage: 68.1,
        rank: 7,
      },
      {
        student: students[3]._id, // M. KABEER T.T (1031)
        subjects: [
          { subject: subjects[0]._id, writtenMarks: 51, ceMarks: 6, totalMarks: 57 },
          { subject: subjects[1]._id, writtenMarks: 59, ceMarks: 8, totalMarks: 67 },
          { subject: subjects[2]._id, writtenMarks: 57, ceMarks: 8, totalMarks: 65 },
          { subject: subjects[3]._id, writtenMarks: 58, ceMarks: 8, totalMarks: 66 },
          { subject: subjects[4]._id, writtenMarks: 82, ceMarks: 7, totalMarks: 89 },
          { subject: subjects[5]._id, writtenMarks: 56, ceMarks: 7, totalMarks: 63 },
          { subject: subjects[6]._id, writtenMarks: 79, ceMarks: 0, totalMarks: 79 },
        ],
        grandTotal: 486,
        percentage: 69.4,
        rank: 5,
      },
      {
        student: students[4]._id, // M. SWALIH E.T (1034)
        subjects: [
          { subject: subjects[0]._id, writtenMarks: 51, ceMarks: 10, totalMarks: 61 },
          { subject: subjects[1]._id, writtenMarks: 50, ceMarks: 9, totalMarks: 59 },
          { subject: subjects[2]._id, writtenMarks: 60, ceMarks: 9, totalMarks: 69 },
          { subject: subjects[3]._id, writtenMarks: 46, ceMarks: 9, totalMarks: 55 },
          { subject: subjects[4]._id, writtenMarks: 80, ceMarks: 10, totalMarks: 90 },
          { subject: subjects[5]._id, writtenMarks: 52, ceMarks: 10, totalMarks: 62 },
          { subject: subjects[6]._id, writtenMarks: 79, ceMarks: 0, totalMarks: 79 },
        ],
        grandTotal: 475,
        percentage: 67.8,
        rank: 8,
      },
      {
        student: students[5]._id, // M. SWALIH P (1035)
        subjects: [
          { subject: subjects[0]._id, writtenMarks: 80, ceMarks: 10, totalMarks: 90 },
          { subject: subjects[1]._id, writtenMarks: 60, ceMarks: 9, totalMarks: 69 },
          { subject: subjects[2]._id, writtenMarks: 60, ceMarks: 9, totalMarks: 69 },
          { subject: subjects[3]._id, writtenMarks: 64, ceMarks: 9, totalMarks: 73 },
          { subject: subjects[4]._id, writtenMarks: 84, ceMarks: 10, totalMarks: 94 },
          { subject: subjects[5]._id, writtenMarks: 78, ceMarks: 10, totalMarks: 88 },
          { subject: subjects[6]._id, writtenMarks: 86, ceMarks: 0, totalMarks: 86 },
        ],
        grandTotal: 569,
        percentage: 81.2,
        rank: 1,
      },
      {
        student: students[6]._id, // RINSHAD C.P (1038)
        subjects: [
          { subject: subjects[0]._id, writtenMarks: 69, ceMarks: 10, totalMarks: 79 },
          { subject: subjects[1]._id, writtenMarks: 54, ceMarks: 9, totalMarks: 63 },
          { subject: subjects[2]._id, writtenMarks: 57, ceMarks: 8, totalMarks: 65 },
          { subject: subjects[3]._id, writtenMarks: 52, ceMarks: 9, totalMarks: 61 },
          { subject: subjects[4]._id, writtenMarks: 82, ceMarks: 10, totalMarks: 92 },
          { subject: subjects[5]._id, writtenMarks: 58, ceMarks: 10, totalMarks: 68 },
          { subject: subjects[6]._id, writtenMarks: 85, ceMarks: 0, totalMarks: 85 },
        ],
        grandTotal: 513,
        percentage: 73.2,
        rank: 3,
      },
      {
        student: students[7]._id, // SAHAL M (1040)
        subjects: [
          { subject: subjects[0]._id, writtenMarks: 75, ceMarks: 10, totalMarks: 85 },
          { subject: subjects[1]._id, writtenMarks: 58, ceMarks: 9, totalMarks: 67 },
          { subject: subjects[2]._id, writtenMarks: 69, ceMarks: 9, totalMarks: 78 },
          { subject: subjects[3]._id, writtenMarks: 66, ceMarks: 9, totalMarks: 75 },
          { subject: subjects[4]._id, writtenMarks: 87, ceMarks: 10, totalMarks: 97 },
          { subject: subjects[5]._id, writtenMarks: 73, ceMarks: 10, totalMarks: 83 },
          { subject: subjects[6]._id, writtenMarks: 80, ceMarks: 0, totalMarks: 80 },
        ],
        grandTotal: 565,
        percentage: 80.7,
        rank: 2,
      },
      {
        student: students[8]._id, // AFTHAB NOUSHAD (1046)
        subjects: [
          { subject: subjects[0]._id, writtenMarks: 40, ceMarks: 6, totalMarks: 46 },
          { subject: subjects[1]._id, writtenMarks: 36, ceMarks: 8, totalMarks: 44 },
          { subject: subjects[2]._id, writtenMarks: 42, ceMarks: 8, totalMarks: 50 },
          { subject: subjects[3]._id, writtenMarks: 40, ceMarks: 8, totalMarks: 48 },
          { subject: subjects[4]._id, writtenMarks: 75, ceMarks: 7, totalMarks: 82 },
          { subject: subjects[5]._id, writtenMarks: 53, ceMarks: 7, totalMarks: 60 },
          { subject: subjects[6]._id, writtenMarks: 75, ceMarks: 0, totalMarks: 75 },
        ],
        grandTotal: 405,
        percentage: 57.8,
        rank: 9,
      },
    ]

    await Result.insertMany(
      resultsData.map((result) => ({
        ...result,
        batch: batch._id,
      })),
    )

    return NextResponse.json({
      success: true,
      message: "Sample data seeded successfully!",
      data: {
        subjects: subjects.length,
        batches: 1,
        students: students.length,
        results: resultsData.length,
      },
    })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 })
  }
}
