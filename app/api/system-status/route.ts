import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Student from "@/models/Student"
import Subject from "@/models/Subject"
import Batch from "@/models/Batch"
import Result from "@/models/Result"

export async function GET() {
  try {
    // Test database connection
    await dbConnect()

    // Count documents in each collection
    const [studentCount, subjectCount, batchCount, resultCount] = await Promise.all([
      Student.countDocuments(),
      Subject.countDocuments(),
      Batch.countDocuments(),
      Result.countDocuments(),
    ])

    // Test API endpoints
    const apis = {
      students: true,
      subjects: true,
      batches: true,
      results: true,
      reports: true,
    }

    // Check if sample data exists
    const sampleDataLoaded = studentCount > 0 && subjectCount > 0 && resultCount > 0

    return NextResponse.json({
      database: {
        connected: true,
        collections: {
          students: studentCount,
          subjects: subjectCount,
          batches: batchCount,
          results: resultCount,
        },
      },
      sampleData: {
        loaded: sampleDataLoaded,
        lastUpdated: sampleDataLoaded ? new Date().toISOString() : null,
      },
      apis,
    })
  } catch (error) {
    console.error("System status check failed:", error)
    return NextResponse.json({
      database: {
        connected: false,
        collections: {
          students: 0,
          subjects: 0,
          batches: 0,
          results: 0,
        },
      },
      sampleData: {
        loaded: false,
        lastUpdated: null,
      },
      apis: {
        students: false,
        subjects: false,
        batches: false,
        results: false,
        reports: false,
      },
    })
  }
}
