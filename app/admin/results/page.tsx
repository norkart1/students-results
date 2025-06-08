"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Eye, Edit, Trash2, AlertCircle } from "lucide-react"
import Link from "next/link"

interface Result {
  _id: string
  student: {
    _id: string
    regNumber: string
    name: string
  }
  batch: {
    _id: string
    name: string
    examTitle: string
  }
  grandTotal: number
  percentage: number
  rank: number
}

interface Batch {
  _id: string
  name: string
  year: number
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [filteredResults, setFilteredResults] = useState<Result[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterResults()
  }, [results, searchTerm, selectedBatch])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [resultsResponse, batchesResponse] = await Promise.all([fetch("/api/results"), fetch("/api/batches")])

      if (!resultsResponse.ok || !batchesResponse.ok) {
        throw new Error("Failed to fetch data")
      }

      const resultsData = await resultsResponse.json()
      const batchesData = await batchesResponse.json()

      setResults(Array.isArray(resultsData) ? resultsData : [])
      setBatches(Array.isArray(batchesData) ? batchesData : [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setError("Failed to load results. Please try again.")
      setResults([])
      setBatches([])
    } finally {
      setLoading(false)
    }
  }

  const filterResults = () => {
    try {
      let filtered = [...results]

      if (selectedBatch !== "all") {
        filtered = filtered.filter((result) => result.batch?._id === selectedBatch)
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (result) =>
            result.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.student?.regNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      setFilteredResults(filtered)
    } catch (error) {
      console.error("Error filtering results:", error)
      setFilteredResults([])
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this result?")) {
      try {
        const response = await fetch(`/api/results/${id}`, { method: "DELETE" })
        if (response.ok) {
          fetchData()
        } else {
          throw new Error("Failed to delete result")
        }
      } catch (error) {
        console.error("Failed to delete result:", error)
        alert("Failed to delete result. Please try again.")
      }
    }
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-50"
    if (percentage >= 70) return "text-blue-600 bg-blue-50"
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50"
    if (percentage >= 50) return "text-orange-600 bg-orange-50"
    return "text-red-600 bg-red-50"
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-yellow-500 text-white"
    if (rank === 2) return "bg-gray-400 text-white"
    if (rank === 3) return "bg-orange-500 text-white"
    return "bg-gray-200 text-gray-700"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Results</h1>
            <p className="text-gray-600 mt-2">Manage student examination results</p>
          </div>
        </div>
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading results...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Results</h1>
            <p className="text-gray-600 mt-2">Manage student examination results</p>
          </div>
        </div>
        <Card className="shadow-lg border-red-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700">
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
          <h1 className="text-3xl font-bold text-gray-900">Results</h1>
          <p className="text-gray-600 mt-2">Manage student examination results</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Result
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Results List ({filteredResults.length})</CardTitle>
            <div className="flex items-center space-x-4">
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by batch" />
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

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No results found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Reg No</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Batch</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Marks</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Percentage</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result) => (
                    <tr key={result._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadge(result.rank)}`}
                        >
                          {result.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-blue-600">{result.student?.regNumber || "N/A"}</td>
                      <td className="py-3 px-4 font-medium">{result.student?.name || "N/A"}</td>
                      <td className="py-3 px-4 text-gray-600">{result.batch?.name || "N/A"}</td>
                      <td className="py-3 px-4 font-semibold">{result.grandTotal}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-semibold ${getGradeColor(result.percentage)}`}
                        >
                          {result.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link href={`/result/${result.student?.regNumber}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(result._id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
