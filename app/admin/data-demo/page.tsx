"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database, Eye } from "lucide-react"

interface LiveData {
  students: any[]
  subjects: any[]
  results: any[]
  recentResult?: any
}

export default function DataDemoPage() {
  const [liveData, setLiveData] = useState<LiveData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchLiveData()
  }, [])

  const fetchLiveData = async () => {
    try {
      setRefreshing(true)

      const [studentsRes, subjectsRes, resultsRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/subjects"),
        fetch("/api/results"),
      ])

      const [students, subjects, results] = await Promise.all([
        studentsRes.json(),
        subjectsRes.json(),
        resultsRes.json(),
      ])

      // Get a sample result to demonstrate
      let recentResult = null
      if (results.length > 0) {
        const resultRes = await fetch(`/api/results/student/${results[0].student.regNumber}`)
        if (resultRes.ok) {
          recentResult = await resultRes.json()
        }
      }

      setLiveData({
        students: students.slice(0, 5), // Show first 5
        subjects: subjects.slice(0, 5),
        results: results.slice(0, 5),
        recentResult,
      })
    } catch (error) {
      console.error("Failed to fetch live data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Data Demonstration</h1>
          <p className="text-gray-600 mt-2">Fetching real-time data from MongoDB...</p>
        </div>
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading live data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Data Demonstration</h1>
          <p className="text-gray-600 mt-2">Real-time data from MongoDB database</p>
        </div>
        <Button onClick={fetchLiveData} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Live Students Data */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Live Students Data (MongoDB)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Reg Number</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Database ID</th>
                </tr>
              </thead>
              <tbody>
                {liveData?.students.map((student) => (
                  <tr key={student._id} className="border-b">
                    <td className="py-2 font-mono text-blue-600">{student.regNumber}</td>
                    <td className="py-2">{student.name}</td>
                    <td className="py-2 text-sm text-gray-600">{student.email}</td>
                    <td className="py-2 font-mono text-xs text-gray-500">{student._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Live Subjects Data */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-green-600" />
            Live Subjects Data (MongoDB)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveData?.subjects.map((subject) => (
              <div key={subject._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{subject.name}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{subject.code}</span>
                </div>
                <p className="arabic-text text-lg text-blue-700 mb-2">{subject.nameArabic}</p>
                <div className="text-sm text-gray-600">
                  <p>
                    Written: {subject.writtenMarks} | CE: {subject.ceMarks}
                  </p>
                  <p className="font-mono text-xs mt-1">ID: {subject._id}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Results Data */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-purple-600" />
            Live Results Data (MongoDB)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liveData?.results.map((result) => (
              <div key={result._id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{result.student.name}</h3>
                    <p className="text-sm text-gray-600">Reg: {result.student.regNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{result.percentage}%</p>
                    <p className="text-sm text-gray-600">Rank: {result.rank}</p>
                  </div>
                </div>
                <p className="font-mono text-xs text-gray-500 mt-2">Database ID: {result._id}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Result Demonstration */}
      {liveData?.recentResult && (
        <Card className="shadow-lg border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-green-600" />
              Sample Result (Dynamically Generated)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">
                {liveData.recentResult.student.name} (Reg: {liveData.recentResult.student.regNumber})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <label className="text-gray-600">Total Marks:</label>
                  <p className="font-bold">{liveData.recentResult.grandTotal}</p>
                </div>
                <div>
                  <label className="text-gray-600">Percentage:</label>
                  <p className="font-bold text-blue-600">{liveData.recentResult.percentage}%</p>
                </div>
                <div>
                  <label className="text-gray-600">Rank:</label>
                  <p className="font-bold text-purple-600">{liveData.recentResult.rank}</p>
                </div>
                <div>
                  <label className="text-gray-600">Subjects:</label>
                  <p className="font-bold">{liveData.recentResult.subjects.length}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ✅ This data is fetched live from MongoDB and calculated in real-time
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
