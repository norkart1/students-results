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
import Papa from "papaparse"

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
  key: string;
  label: string;
  max?: number;
  computed?: boolean;
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
  const [csvUploadModalOpen, setCsvUploadModalOpen] = useState(false)
  const [csvPreview, setCsvPreview] = useState<any[]>([])
  const [csvError, setCsvError] = useState<string|null>(null)
  const [csvSubjects, setCsvSubjects] = useState<any[]>([])
  const [addAbsent, setAddAbsent] = useState<{ [idx: number]: boolean }>({})
  const [editAbsent, setEditAbsent] = useState<{ [idx: number]: boolean }>({})
  const [addComponentAbsent, setAddComponentAbsent] = useState<{ [idx: number]: { [key: string]: boolean } }>({})
  const [editComponentAbsent, setEditComponentAbsent] = useState<{ [idx: number]: { [key: string]: boolean } }>({})
  // Calculate batchMaxTotal for selected batch (used for all students in the batch)
  const [batchMaxTotal, setBatchMaxTotal] = useState<number>(0);

  useEffect(() => {
    fetchData()
  }, [])

  // Fetch students for add modal
  useEffect(() => {
    if (addModalOpen && students.length === 0) {
      fetch("/api/students").then(res => res.json()).then(setStudents)
    }
  }, [addModalOpen])

  // Fetch subjects for selected batch
  useEffect(() => {
    if (addBatchId) {
      fetch(`/api/batches/${addBatchId}`)
        .then(res => res.json())
        .then(batch => {
          // batch.subjects is an array of subject IDs
          // Fetch subject details for these IDs
          fetch(`/api/subjects?ids=${batch.subjects.join(",")}`)
            .then(res => res.json())
            .then(subjects => {
              setAddSubjects(subjects.map((s: any) => ({
                subject: s,
                marks: Object.fromEntries(
                  (s.scoringScheme || []).map((comp: any) => [comp.key, 0])
                )
              })))
            })
        })
    } else {
      setAddSubjects([])
    }
  }, [addBatchId])

  // Calculate batchMaxTotal for selected batch (used for all students in the batch)
  useEffect(() => {
    async function fetchBatchMaxTotal() {
      if (selectedBatch === "all") {
        setBatchMaxTotal(0);
        return;
      }
      const batchRes = await fetch(`/api/batches/${selectedBatch}`);
      const batch = await batchRes.json();
      const subjectsRes = await fetch(`/api/subjects?ids=${batch.subjects.join(",")}`);
      const subjects = await subjectsRes.json();
      const maxTotal = subjects.reduce((sum: number, subj: any) => {
        return sum + (subj.scoringScheme || []).filter((c: any) => !c.computed && typeof c.max === 'number').reduce((acc: number, c: any) => acc + c.max, 0);
      }, 0);
      setBatchMaxTotal(maxTotal);
    }
    fetchBatchMaxTotal();
  }, [selectedBatch]);

  // Calculate and assign ranks with tie handling and reg number as tie-breaker
  useEffect(() => {
    let filtered = [...results];
    if (selectedBatch !== "all") {
      filtered = filtered.filter((result) => result.batch?._id === selectedBatch);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (result) =>
          result.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.student?.regNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    // Sort by grandTotal desc, then regNumber asc
    filtered.sort((a, b) => {
      if (b.grandTotal !== a.grandTotal) return b.grandTotal - a.grandTotal;
      return a.student.regNumber.localeCompare(b.student.regNumber);
    });
    // Assign ranks (same marks = same rank, next rank is not skipped)
    let lastTotal: number | null = null;
    let lastRank = 0;
    let sameRankCount = 0;
    filtered.forEach((result, idx) => {
      if (result.grandTotal === lastTotal) {
        result.rank = lastRank;
        sameRankCount++;
      } else {
        lastRank = idx + 1;
        result.rank = lastRank;
        lastTotal = result.grandTotal;
        sameRankCount = 1;
      }
      // Recalculate percentage using batchMaxTotal if available
      if (batchMaxTotal > 0) {
        result.percentage = parseFloat(((result.grandTotal / batchMaxTotal) * 100).toFixed(1));
      }
    });
    setFilteredResults(filtered);
  }, [results, searchTerm, selectedBatch, batchMaxTotal]);

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

  const openEditModal = async (result: Result) => {
    setEditResult(result)
    try {
      // Fetch full result with subjects and batch info
      const [resultRes, batchRes] = await Promise.all([
        fetch(`/api/results/${result._id}`),
        fetch(`/api/batches/${result.batch._id}`)
      ])
      const resultData = await resultRes.json()
      const batchData = await batchRes.json()
      // batchData.subjects is an array of subject IDs
      // Fetch subject details for these IDs
      const subjectsRes = await fetch(`/api/subjects?ids=${batchData.subjects.join(",")}`)
      const subjects = await subjectsRes.json()
      // Merge: for each subject in batch, find marks in result (if any)
      const mergedSubjects = subjects.map((s: any) => {
        const found = (resultData.subjects || []).find((subj: any) => subj.subject._id === s._id || subj.subject === s._id)
        return {
          subject: s,
          marks: found ? found.marks : Object.fromEntries((s.scoringScheme || []).map((comp: any) => [comp.key, 0]))
        }
      })
      setEditSubjects(mergedSubjects)
      setEditModalOpen(true)
    } catch {
      setEditSubjects([])
      setEditModalOpen(true)
    }
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
        // Sum all non-computed max values from scoringScheme
        return sum + (subj.subject.scoringScheme || []).filter((c: any) => !c.computed).reduce((acc: number, c: any) => acc + (c.max || 0), 0)
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

  // Download CSV template for selected batch
  const handleDownloadTemplate = async () => {
    if (!selectedBatch || selectedBatch === "all") return
    // Fetch batch and subjects
    const batchRes = await fetch(`/api/batches/${selectedBatch}`)
    const batch = await batchRes.json()
    const subjectsRes = await fetch(`/api/subjects?ids=${batch.subjects.join(",")}`)
    const subjects = await subjectsRes.json()
    setCsvSubjects(subjects)
    // Build columns: regNumber, [subject code + scoring key ...]
    let columns = ["regNumber"]
    subjects.forEach((subj: any) => {
      (subj.scoringScheme || []).forEach((comp: any) => {
        if (!comp.computed) {
          columns.push(`${subj.code}_${comp.key}`)
        }
      })
    })
    // Dummy row
    let dummy = { regNumber: "STU001" }
    subjects.forEach((subj: any) => {
      (subj.scoringScheme || []).forEach((comp: any) => {
        if (!comp.computed) {
          dummy[`${subj.code}_${comp.key}`] = ""
        }
      })
    })
    const csv = Papa.unparse([columns, Object.values(dummy)])
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `results-template-${batch.name}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle CSV upload
  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null)
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        // Validate columns
        if (!selectedBatch || selectedBatch === "all") {
          setCsvError("Please select a batch first.")
          return
        }
        // Fetch batch and subjects for validation
        const batchRes = await fetch(`/api/batches/${selectedBatch}`)
        const batch = await batchRes.json()
        const subjectsRes = await fetch(`/api/subjects?ids=${batch.subjects.join(",")}`)
        const subjects = await subjectsRes.json()
        setCsvSubjects(subjects)
        // Build expected columns
        let expected = ["regNumber"]
        subjects.forEach((subj: any) => {
          (subj.scoringScheme || []).forEach((comp: any) => {
            if (!comp.computed) expected.push(`${subj.code}_${comp.key}`)
          })
        })
        const actual = results.meta.fields || []
        for (let col of expected) {
          if (!actual.includes(col)) {
            setCsvError(`Missing column: ${col}`)
            return
          }
        }
        setCsvPreview(results.data)
        setCsvUploadModalOpen(true)
      },
      error: (err) => setCsvError("Failed to parse CSV: " + err.message)
    })
  }

  // Submit bulk upload
  const handleBulkUpload = async () => {
    setCsvError(null)
    try {
      // Transform preview data to API format
      const data = csvPreview.map((row) => {
        // Find student by regNumber (assume already exists)
        return {
          regNumber: row.regNumber,
          subjects: csvSubjects.map((subj: any) => {
            let marks: Record<string, number> = {}
            subj.scoringScheme.forEach((comp: any) => {
              if (!comp.computed) {
                marks[comp.key] = Number(row[`${subj.code}_${comp.key}`] || 0)
              }
            })
            return { subject: subj._id, marks }
          })
        }
      })
      // POST to backend
      const res = await fetch("/api/results/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch: selectedBatch, results: data })
      })
      let result
      try {
        result = await res.json()
      } catch {
        throw new Error("Bulk upload failed (invalid response)")
      }
      if (!res.ok) {
        if (result && result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
          setCsvError(result.errors)
        } else if (result && result.error) {
          setCsvError(result.error)
        } else {
          setCsvError("Bulk upload failed")
        }
        return
      }
      if (result.errors && result.errors.length > 0) {
        setCsvError(result.errors)
        return
      }
      setCsvUploadModalOpen(false)
      setCsvPreview([])
      fetchData()
    } catch (err: any) {
      setCsvError(err.message || "Bulk upload failed")
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
                    <div className="font-semibold mb-1 text-base truncate" title={subj.subject.name}>
                      {subj.subject.name} <span className="text-xs text-gray-400">({subj.subject.code})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id={`edit-absent-${idx}`}
                        checked={Boolean(editAbsent[idx]) || Boolean(editSubjects[idx].marks && typeof editSubjects[idx].marks === 'object' && 'absent' in editSubjects[idx].marks && editSubjects[idx].marks.absent)}
                        onChange={e => {
                          setEditAbsent(prev => ({ ...prev, [idx]: e.target.checked }));
                          setEditSubjects(prev => prev.map((s, i) =>
                            i === idx
                              ? { ...s, marks: e.target.checked ? { absent: true } : Object.fromEntries((s.subject.scoringScheme || []).map((comp) => [comp.key, 0])) }
                              : s
                          ));
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`edit-absent-${idx}`} className="text-sm text-red-600 font-semibold">Absent</label>
                    </div>
                    {(subj.subject.scoringScheme || []).map((comp: any) => (
                      <div key={comp.key} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Label className="w-24 min-w-max">{comp.label}</Label>
                        <Input
                          type="number"
                          value={
                            subj.marks && typeof subj.marks === 'object' && 'absent' in subj.marks && subj.marks.absent
                              ? ''
                              : (subj.marks && typeof subj.marks === 'object' && typeof (subj.marks as Record<string, number>)[comp.key] === 'number')
                                ? (subj.marks as Record<string, number>)[comp.key]
                                : 0
                          }
                          min={0}
                          onChange={e => handleSubjectMarkChange(idx, comp.key, Number(e.target.value))}
                          className="w-full sm:w-24"
                          required={!comp.computed && !(editAbsent[idx] || (subj.marks && typeof subj.marks === 'object' && 'absent' in subj.marks && subj.marks.absent))}
                          inputMode="numeric"
                          readOnly={!!comp.computed || !!editAbsent[idx] || (subj.marks && typeof subj.marks === 'object' && 'absent' in subj.marks && subj.marks.absent)}
                          style={comp.computed || editAbsent[idx] || (subj.marks && typeof subj.marks === 'object' && 'absent' in subj.marks && subj.marks.absent) ? { background: '#f3f4f6' } : {}}
                          disabled={!!editAbsent[idx] || (subj.marks && typeof subj.marks === 'object' && 'absent' in subj.marks && subj.marks.absent)}
                        />
                        <input
                          type="checkbox"
                          checked={!!editComponentAbsent[idx]?.[comp.key]}
                          onChange={e => {
                            setEditComponentAbsent(prev => ({
                              ...prev,
                              [idx]: { ...prev[idx], [comp.key]: e.target.checked }
                            }));
                            setEditSubjects(prev => prev.map((s, i) =>
                              i === idx
                                ? { ...s, marks: { ...s.marks, [comp.key]: e.target.checked ? 'A' : 0 } }
                                : s
                            ));
                          }}
                          className="ml-2"
                        />
                        <label className="text-xs text-red-600">Absent</label>
                      </div>
                    ))}
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
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id={`absent-${idx}`}
                        checked={!!addAbsent[idx]}
                        onChange={e => {
                          setAddAbsent(prev => ({ ...prev, [idx]: e.target.checked }));
                          setAddSubjects(prev => prev.map((s, i) =>
                            i === idx
                              ? { ...s, marks: e.target.checked ? { absent: true } : Object.fromEntries((s.subject.scoringScheme || []).map((comp) => [comp.key, 0])) }
                              : s
                          ));
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`absent-${idx}`} className="text-sm text-red-600 font-semibold">Absent</label>
                    </div>
                    {(subj.subject.scoringScheme || []).map((comp: any) => (
                      <div key={comp.key} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Label className="w-24 min-w-max">{comp.label}</Label>
                        <Input
                          type="number"
                          value={
                            subj.marks && typeof subj.marks === 'object' && subj.marks[comp.key] === 'A'
                              ? ''
                              : typeof subj.marks[comp.key] === 'number'
                                ? subj.marks[comp.key]
                                : 0
                          }
                          min={0}
                          onChange={e => handleAddSubjectMarkChange(idx, comp.key, Number(e.target.value))}
                          className="w-full sm:w-24"
                          required={!comp.computed && !addAbsent[idx] && !addComponentAbsent[idx]?.[comp.key]}
                          inputMode="numeric"
                          readOnly={!!comp.computed || !!addAbsent[idx] || !!addComponentAbsent[idx]?.[comp.key]}
                          style={comp.computed || addAbsent[idx] || !!addComponentAbsent[idx]?.[comp.key] ? { background: '#f3f4f6' } : {}}
                          disabled={!!addAbsent[idx] || !!addComponentAbsent[idx]?.[comp.key]}
                        />
                        <input
                          type="checkbox"
                          checked={!!addComponentAbsent[idx]?.[comp.key]}
                          onChange={e => {
                            setAddComponentAbsent(prev => ({
                              ...prev,
                              [idx]: { ...prev[idx], [comp.key]: e.target.checked }
                            }));
                            setAddSubjects(prev => prev.map((s, i) =>
                              i === idx
                                ? { ...s, marks: { ...s.marks, [comp.key]: e.target.checked ? 'A' : 0 } }
                                : s
                            ));
                          }}
                          className="ml-2"
                        />
                        <label className="text-xs text-red-600">Absent</label>
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

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          disabled={selectedBatch === "all"}
          onClick={handleDownloadTemplate}
        >
          Download CSV Template
        </Button>
        <label className="inline-block">
          <span className="sr-only">Upload CSV</span>
          <Input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCsvUpload}
            disabled={selectedBatch === "all"}
          />
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={selectedBatch === "all"}
          >
            <span>Bulk Upload Results</span>
          </Button>
        </label>
      </div>
      {/* CSV Upload Modal */}
      <Dialog open={csvUploadModalOpen} onOpenChange={setCsvUploadModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Upload Preview</DialogTitle>
          </DialogHeader>
          {/* Improved error display for failed rows */}
          {Array.isArray(csvError) && csvError.length > 0 ? (
            <div className="mb-4">
              <div className="text-red-600 font-semibold mb-2">Some rows failed to upload:</div>
              <ul className="list-disc pl-6 text-sm text-red-500 max-h-40 overflow-y-auto">
                {csvError.map((err: any, idx: number) => (
                  <li key={idx}>
                    Reg Number <span className="font-mono">{err.regNumber}</span>: {err.error}
                  </li>
                ))}
              </ul>
            </div>
          ) : csvError && (
            <div className="text-red-500 mb-2">{csvError}</div>
          )}
          <div className="overflow-x-auto max-h-96 mb-4">
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  {csvSubjects.length > 0 && (
                    <>
                      <th className="px-2 py-1">Reg Number</th>
                      {csvSubjects.map((subj: any) =>
                        subj.scoringScheme.filter((c: any) => !c.computed).map((c: any) => (
                          <th key={`${subj.code}_${c.key}`} className="px-2 py-1">{subj.code} {c.label}</th>
                        ))
                      )}
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {csvPreview.map((row, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{row.regNumber}</td>
                    {csvSubjects.map((subj: any) =>
                      subj.scoringScheme.filter((c: any) => !c.computed).map((c: any) => (
                        <td key={`${subj.code}_${c.key}`} className="border px-2 py-1">{row[`${subj.code}_${c.key}`]}</td>
                      ))
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCsvUploadModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleBulkUpload}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
            >
              Upload Results
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
