// Sample data seeding script for MongoDB
import dbConnect from "../lib/mongodb.js"
import Student from "../models/Student.js"
import Subject from "../models/Subject.js"
import Batch from "../models/Batch.js"
import Result from "../models/Result.js"

async function seedData() {
  await dbConnect()

  console.log("🌱 Starting data seeding...")

  // Clear existing data
  await Student.deleteMany({})
  await Subject.deleteMany({})
  await Batch.deleteMany({})
  await Result.deleteMany({})

  // Create subjects
  const subjects = await Subject.insertMany([
    { name: "BAIDHAVI", nameArabic: "بيضاوي", code: "BAI", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
    { name: "BUKHARI", nameArabic: "بخاری", code: "BUK", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
    { name: "MUSLIM", nameArabic: "مسلم", code: "MUS", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
    { name: "IBNU MAJAH", nameArabic: "ابن ماجہ ونسائی", code: "IBN", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
    { name: "TURMUDHEY", nameArabic: "ترمذی", code: "TUR", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
    { name: "JAM", nameArabic: "جمع", code: "JAM", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
    { name: "LANGUAGE", nameArabic: "اللغة", code: "LANG", maxMarks: 100, writtenMarks: 90, ceMarks: 10 },
  ])

  // Create batch
  const batch = await Batch.create({
    name: "NIHAYA 2",
    year: 2025,
    semester: "First Semester",
    examTitle: "ASAS MALIKI FINAL SEMESTER EXAMINATION 2024-2025",
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
      email: `${student.name.toLowerCase().replace(/\s+/g, ".")}@miconline.org`,
      phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    })),
  )

  // Create sample results based on the image data
  const resultsData = [
    {
      student: students[0]._id, // JAMSHAD O.B
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
      student: students[5]._id, // M. SWALIH P
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
      student: students[7]._id, // SAHAL M
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
  ]

  await Result.insertMany(
    resultsData.map((result) => ({
      ...result,
      batch: batch._id,
    })),
  )

  console.log("✅ Data seeding completed successfully!")
  console.log(`Created ${subjects.length} subjects`)
  console.log(`Created 1 batch`)
  console.log(`Created ${students.length} students`)
  console.log(`Created ${resultsData.length} results`)
}

seedData().catch(console.error)
