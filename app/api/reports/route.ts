import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Result from "@/models/Result"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const batchId = searchParams.get("batch")

    // Build query filter
    const query = batchId ? { batch: batchId } : {}

    // Fetch results with populated data
    const results = await Result.find(query).populate("student").populate("batch").populate("subjects.subject")

    if (results.length === 0) {
      return NextResponse.json({
        totalStudents: 0,
        totalResults: 0,
        averagePercentage: 0,
        passRate: 0,
        topPerformers: [],
        gradeDistribution: [],
        subjectPerformance: [],
        batchComparison: [],
      })
    }

    // Calculate basic stats
    const totalResults = results.length
    const totalStudents = new Set(results.map((r) => r.student._id.toString())).size
    const averagePercentage = results.reduce((sum, r) => sum + r.percentage, 0) / totalResults
    const passedStudents = results.filter((r) => r.percentage >= 50).length
    const passRate = (passedStudents / totalResults) * 100

    // Top performers (top 5)
    const topPerformers = results
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 5)
      .map((r) => ({
        name: r.student.name,
        regNumber: r.student.regNumber,
        percentage: r.percentage,
        rank: r.rank,
      }))

    // Grade distribution
    const getGrade = (percentage: number) => {
      if (percentage >= 90) return "A+"
      if (percentage >= 80) return "A"
      if (percentage >= 70) return "B+"
      if (percentage >= 60) return "B"
      if (percentage >= 50) return "C+"
      if (percentage >= 40) return "C"
      if (percentage >= 30) return "D"
      return "F"
    }

    const gradeMap = new Map()
    results.forEach((r) => {
      const grade = getGrade(r.percentage)
      gradeMap.set(grade, (gradeMap.get(grade) || 0) + 1)
    })

    const gradeDistribution = Array.from(gradeMap.entries()).map(([grade, count]) => ({
      grade,
      count,
      percentage: (count / totalResults) * 100,
    }))

    // Subject performance
    const subjectMap = new Map()
    results.forEach((result) => {
      result.subjects.forEach((subjectResult) => {
        const subjectId = subjectResult.subject._id.toString()
        if (!subjectMap.has(subjectId)) {
          subjectMap.set(subjectId, {
            subject: subjectResult.subject.name,
            subjectArabic: subjectResult.subject.nameArabic,
            totalMarks: 0,
            count: 0,
            passCount: 0,
          })
        }
        const subjectData = subjectMap.get(subjectId)
        subjectData.totalMarks += subjectResult.totalMarks
        subjectData.count += 1
        if (subjectResult.totalMarks >= 50) {
          subjectData.passCount += 1
        }
      })
    })

    const subjectPerformance = Array.from(subjectMap.values()).map((subject) => ({
      subject: subject.subject,
      subjectArabic: subject.subjectArabic,
      averageMarks: subject.totalMarks / subject.count,
      passRate: (subject.passCount / subject.count) * 100,
    }))

    // Batch comparison (only if viewing all batches)
    let batchComparison = []
    if (!batchId) {
      const batchMap = new Map()
      results.forEach((result) => {
        const batchId = result.batch._id.toString()
        if (!batchMap.has(batchId)) {
          batchMap.set(batchId, {
            batchName: result.batch.name,
            totalPercentage: 0,
            count: 0,
            passCount: 0,
          })
        }
        const batchData = batchMap.get(batchId)
        batchData.totalPercentage += result.percentage
        batchData.count += 1
        if (result.percentage >= 50) {
          batchData.passCount += 1
        }
      })

      batchComparison = Array.from(batchMap.values()).map((batch) => ({
        batchName: batch.batchName,
        averagePercentage: batch.totalPercentage / batch.count,
        totalStudents: batch.count,
        passRate: (batch.passCount / batch.count) * 100,
      }))
    }

    return NextResponse.json({
      totalStudents,
      totalResults,
      averagePercentage,
      passRate,
      topPerformers,
      gradeDistribution,
      subjectPerformance,
      batchComparison,
    })
  } catch (error) {
    console.error("Reports API error:", error)
    return NextResponse.json({ error: "Failed to generate reports" }, { status: 500 })
  }
}
