"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Eye, Edit, Trash2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

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

interface ScoringComponent {
  // Define the structure of your scoring component here
  // For example:
  type: string; // 'W' | 'CE' | 'T' | etc.
  maxMarks: number;
}

interface SubjectMark {
  subject: {
    _id: string;
    name: string;
    code: string;
    scoringScheme: ScoringComponent[];
  };
  marks: Record<string, number>; // e.g., { W: 80, CE: 10, T: 90 }
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [filteredResults, setFilteredResults] = useState<Result[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editResult, setEditResult] = useState<Result | null>(null)
  const [editSubjects, setEditSubjects] = useState<SubjectMark[]>([])
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addStudentId, setAddStudentId] = useState<string>("")
  const [addBatchId, setAddBatchId] = useState<string>("")
  const [addSubjects, setAddSubjects] = useState<SubjectMark[]>([])
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterResults()
  }, [results, searchTerm, selectedBatch])

  // Fetch students for add modal
  useEffect(() => {
    if (addModalOpen && students.length === 0) {
      fetch("/api/students").then(res => res.json()).then(setStudents)
    }
  }, [addModalOpen])

  // Fetch subjects for selected batch
  useEffect(() => {
    if (addBatchId) {
      fetch(`/api/subjects?batch=${addBatchId}`)
        .then(res => res.json())
        .then(subjects => {
          setAddSubjects(subjects.map((s: any) => ({
            subject: s,
            marks: Object.fromEntries(
              (s.scoringScheme || []).map((comp: any) => [comp.key, 0])
            )
          })))
        })
    } else {
      setAddSubjects([])
    }
  }, [addBatchId])

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

  const openEditModal = (result: Result) => {
    setEditResult(result)
    // Fetch full result with subjects if not present
    fetch(`/api/results/${result._id}`)
      .then((res) => res.json())
      .then((data) => {
        setEditSubjects(data.subjects || [])
        setEditModalOpen(true)
      })
      .catch(() => {
        setEditSubjects([])
        setEditModalOpen(true)
      })
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditResult(null)
    setEditSubjects([])
    setEditError(null)
  }

  const handleSubjectMarkChange = (idx: number, field: string, value: number) => {
    setEditSubjects((prev) =>
      prev.map((subj, i) =>
        i === idx ? { ...subj, marks: { ...subj.marks, [field]: value } } : subj
      )
    )
  }

  const handleEditSave = async () => {
    if (!editResult) return
    setEditLoading(true)
    setEditError(null)
    try {
      // Calculate grandTotal and percentage
      const grandTotal = editSubjects.reduce((sum, subj) => sum + (subj.marks.T || 0), 0)
      // Calculate max possible marks
      const maxTotal = editSubjects.reduce((sum, subj) => {
        // Try to get max marks from subject object if available, fallback to 100
        // You may want to adjust this if you have maxMarks in subj.subject
        return sum + (subj.subject.maxMarks || 100)
      }, 0)
      const percentage = maxTotal > 0 ? parseFloat(((grandTotal / maxTotal) * 100).toFixed(2)) : 0

      const response = await fetch(`/api/results/${editResult._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjects: editSubjects,
          grandTotal,
          percentage,
        }),
      })
      if (!response.ok) throw new Error("Failed to update result")
      closeEditModal()
      fetchData()
    } catch (err) {
      setEditError("Failed to update marks. Please try again.")
    } finally {
      setEditLoading(false)
    }
  }

  // Auto-calculate computed fields (like Total) in addSubjects
  const handleAddSubjectMarkChange = (idx: number, key: string, value: number) => {
    setAddSubjects(prev => prev.map((subj, i) => {
      if (i !== idx) return subj
      const newMarks = { ...subj.marks, [key]: value }
      // If subject has a computed Total, recalculate it
      const totalComp = (subj.subject.scoringScheme || []).find((c: any) => !!c.computed && (c.key && (c.key.toLowerCase() === 't' || (c.label && c.label.toLowerCase() === 'total'))))
      if (totalComp && totalComp.key) {
        // Sum all non-computed fields
        const sum = (subj.subject.scoringScheme || [])
          .filter((c: any) => !c.computed)
          .reduce((acc: number, c: any) => acc + (Number(newMarks[c.key]) || 0), 0)
        newMarks[totalComp.key] = sum
      }
      return { ...subj, marks: newMarks }
    }))
  }

  const handleAddSave = async () => {
    setAddLoading(true)
    setAddError(null)
    try {
      const grandTotal = addSubjects.reduce((sum, subj) => sum + (subj.marks.T || 0), 0)
      const maxTotal = addSubjects.reduce((sum, subj) => {
        // Try to get max marks from subject object if available, fallback to 100
        // You may want to adjust this if you have maxWritten and maxCE in subj.subject
        const maxWritten = subj.subject.maxWritten || 0
        const maxCE = subj.subject.maxCE || 0
        return sum + (maxWritten + maxCE > 0 ? maxWritten + maxCE : 100)
      }, 0)
      const percentage = maxTotal > 0 ? parseFloat(((grandTotal / maxTotal) * 100).toFixed(2)) : 0
      const response = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: addStudentId,
          batch: addBatchId,
          subjects: addSubjects,
          grandTotal,
          percentage
        })
      })
      if (!response.ok) throw new Error("Failed to add result")
      setAddModalOpen(false)
      setAddStudentId("")
      setAddBatchId("")
      setAddSubjects([])
      fetchData()
    } catch (err) {
      setAddError("Failed to add result. Please try again.")
    } finally {
      setAddLoading(false)
    }
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
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" onClick={() => setAddModalOpen(true)}>
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
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(result)}>
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

      {/* Edit Subject Marks Modal */}
      <Dialog open={editModalOpen} onOpenChange={closeEditModal}>
        <DialogContent className="max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subject Marks</DialogTitle>
          </DialogHeader>
          {editError && <div className="text-red-500 mb-2">{editError}</div>}
          {editSubjects.length === 0 ? (
            <div>No subjects found for this result.</div>
          ) : (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {editSubjects.map((subj, idx) => (
                  <div key={subj.subject._id} className="border rounded p-3 bg-gray-50 flex flex-col gap-2 shadow-sm">
                    <div className="font-semibold mb-1 text-base truncate" title={subj.subject.name}>{subj.subject.name} <span className="text-xs text-gray-400">({subj.subject.code})</span></div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Label className="w-24 min-w-max">Written</Label>
                      <Input
                        type="number"
                        value={subj.marks.W}
                        min={0}
                        onChange={e => handleSubjectMarkChange(idx, "W", Number(e.target.value))}
                        className="w-full sm:w-24"
                        required
                        inputMode="numeric"
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Label className="w-24 min-w-max">CE</Label>
                      <Input
                        type="number"
                        value={subj.marks.CE}
                        min={0}
                        onChange={e => handleSubjectMarkChange(idx, "CE", Number(e.target.value))}
                        className="w-full sm:w-24"
                        required
                        inputMode="numeric"
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Label className="w-24 min-w-max">Total</Label>
                      <Input type="number" value={subj.marks.T} readOnly className="w-full sm:w-24 bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeEditModal} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" disabled={editLoading} className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600">
                  {editLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Result Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Result</DialogTitle>
          </DialogHeader>
          {addError && <div className="text-red-500 mb-2">{addError}</div>}
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleAddSave(); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Student</Label>
                <Select value={addStudentId} onValueChange={setAddStudentId} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s._id} value={s._id}>{s.name} ({s.regNumber})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Batch</Label>
                <Select value={addBatchId} onValueChange={setAddBatchId} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch._id} value={batch._id}>{batch.name} - {batch.year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {addSubjects.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addSubjects.map((subj, idx) => (
                  <div key={subj.subject._id} className="border rounded p-3 bg-gray-50 flex flex-col gap-2 shadow-sm">
                    <div className="font-semibold mb-1 text-base truncate" title={subj.subject.name}>
                      {subj.subject.name} <span className="text-xs text-gray-400">({subj.subject.code})</span>
                    </div>
                    {(subj.subject.scoringScheme || []).map((comp: any) => (
                      <div key={comp.key} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Label className="w-24 min-w-max">{comp.label}</Label>
                        <Input
                          type="number"
                          value={subj.marks[comp.key] ?? 0}
                          min={0}
                          onChange={e => handleAddSubjectMarkChange(idx, comp.key, Number(e.target.value))}
                          className="w-full sm:w-24"
                          required={!comp.computed}
                          inputMode="numeric"
                          readOnly={!!comp.computed}
                          style={comp.computed ? { background: '#f3f4f6' } : {}}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button type="submit" disabled={addLoading} className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600">
                {addLoading ? "Saving..." : "Save Result"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
