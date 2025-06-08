"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Users } from "lucide-react"
import BatchModal from "@/components/admin/BatchModal"

interface Batch {
  _id: string
  name: string
  year: number
  semester: string
  examTitle: string
  subjects: Array<{
    _id: string
    name: string
    nameArabic: string
  }>
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)

  useEffect(() => {
    fetchBatches()
  }, [])

  useEffect(() => {
    const filtered = batches.filter(
      (batch) =>
        batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.examTitle.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredBatches(filtered)
  }, [batches, searchTerm])

  const fetchBatches = async () => {
    try {
      const response = await fetch("/api/batches")
      const data = await response.json()
      setBatches(data)
    } catch (error) {
      console.error("Failed to fetch batches:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this batch?")) {
      try {
        await fetch(`/api/batches/${id}`, { method: "DELETE" })
        fetchBatches()
      } catch (error) {
        console.error("Failed to delete batch:", error)
      }
    }
  }

  const handleEdit = (batch: Batch) => {
    setSelectedBatch(batch)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedBatch(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Batches</h1>
          <p className="text-gray-600 mt-2">Manage examination batches and classes</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Batch
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Batch List</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map((batch) => (
              <Card key={batch._id} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{batch.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(batch)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(batch._id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Year: {batch.year}</p>
                    <p className="text-sm text-gray-600">Semester: {batch.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Exam Title:</p>
                    <p className="text-xs text-gray-600">{batch.examTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Subjects ({batch.subjects?.length || 0})
                    </p>
                    <div className="space-y-1">
                      {batch.subjects?.slice(0, 3).map((subject) => (
                        <div key={subject._id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {subject.name}
                        </div>
                      ))}
                      {batch.subjects?.length > 3 && (
                        <div className="text-xs text-gray-500">+{batch.subjects.length - 3} more</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <BatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        batch={selectedBatch}
        onSave={fetchBatches}
      />
    </div>
  )
}
