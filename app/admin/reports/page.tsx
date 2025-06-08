"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Users, Award, FileText, Download, PieChart, Target, BookOpen } from "lucide-react"

interface ReportData {
  totalStudents: number
  totalResults: number
  averagePercentage: number
  passRate: number
  topPerformers: Array<{
    name: string
    regNumber: string
    percentage: number
    rank: number
  }>
  gradeDistribution: Array<{
    grade: string
    count: number
    percentage: number
  }>
  subjectPerformance: Array<{
    subject: string
    subjectArabic: string
    averageMarks: number
    passRate: number
  }>
  batchComparison: Array<{
    batchName: string
    averagePercentage: number
    totalStudents: number
    passRate: number
  }>
}

interface Batch {
  _id: string
  name: string
  year: number
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBatches()
  }, [])

  useEffect(() => {
    fetchReportData()
  }, [selectedBatch])

  const fetchBatches = async () => {
    try {
      const response = await fetch("/api/batches")
      const data = await response.json()
      setBatches(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch batches:", error)
    }
  }

  const fetchReportData = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = selectedBatch === "all" ? "/api/reports" : `/api/reports?batch=${selectedBatch}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch report data")
      }

      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error("Failed to fetch report data:", error)
      setError("Failed to load report data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "bg-green-500"
      case "A":
        return "bg-green-400"
      case "B+":
        return "bg-blue-500"
      case "B":
        return "bg-blue-400"
      case "C+":
        return "bg-yellow-500"
      case "C":
        return "bg-yellow-400"
      case "D":
        return "bg-orange-500"
      case "F":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const exportReport = () => {
    // This would implement PDF/Excel export functionality
    alert("Export functionality will be implemented soon!")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive performance analysis</p>
          </div>
        </div>
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reports...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !reportData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive performance analysis</p>
          </div>
        </div>
        <Card className="shadow-lg border-red-200">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">{error || "No data available"}</p>
            <Button onClick={fetchReportData} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive performance analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batches.map((batch) => (
                <SelectItem key={batch._id} value={batch._id}>
                  {batch.name} - {batch.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{reportData.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{reportData.averagePercentage.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{reportData.passRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Results</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{reportData.totalResults}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topPerformers.map((student, index) => (
                <div key={student.regNumber} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-gray-400"
                            : index === 2
                              ? "bg-orange-500"
                              : "bg-gray-300"
                      }`}
                    >
                      {student.rank}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600">Reg: {student.regNumber}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{student.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-purple-600" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.gradeDistribution.map((grade) => (
                <div key={grade.grade} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${getGradeColor(grade.grade)}`}></div>
                    <span className="font-medium">Grade {grade.grade}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{grade.count} students</span>
                    <span className="font-semibold">{grade.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-green-600" />
            Subject-wise Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Arabic Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Average Marks</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Pass Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Performance</th>
                </tr>
              </thead>
              <tbody>
                {reportData.subjectPerformance.map((subject) => (
                  <tr key={subject.subject} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">{subject.subject}</td>
                    <td className="py-3 px-4 arabic-text text-lg">{subject.subjectArabic}</td>
                    <td className="py-3 px-4 font-semibold">{subject.averageMarks.toFixed(1)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          subject.passRate >= 80
                            ? "text-green-600 bg-green-50"
                            : subject.passRate >= 60
                              ? "text-blue-600 bg-blue-50"
                              : subject.passRate >= 40
                                ? "text-yellow-600 bg-yellow-50"
                                : "text-red-600 bg-red-50"
                        }`}
                      >
                        {subject.passRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            subject.averageMarks >= 80
                              ? "bg-green-500"
                              : subject.averageMarks >= 60
                                ? "bg-blue-500"
                                : subject.averageMarks >= 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }`}
                          style={{ width: `${(subject.averageMarks / 100) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Batch Comparison */}
      {reportData.batchComparison.length > 1 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Batch Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportData.batchComparison.map((batch) => (
                <Card key={batch.batchName} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">{batch.batchName}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Students:</span>
                        <span className="font-medium">{batch.totalStudents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average:</span>
                        <span className="font-medium">{batch.averagePercentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pass Rate:</span>
                        <span className="font-medium">{batch.passRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
