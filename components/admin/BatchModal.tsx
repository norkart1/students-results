"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface Subject {
  _id: string
  name: string
  nameArabic: string
  code: string
}

interface Batch {
  _id?: string
  name: string
  year: number
  semester: string
  examTitle: string
  subjects: string[]
}

interface BatchModalProps {
  isOpen: boolean
  onClose: () => void
  batch: any
  onSave: () => void
}

export default function BatchModal({ isOpen, onClose, batch, onSave }: BatchModalProps) {
  const [formData, setFormData] = useState<Batch>({
    name: "",
    year: new Date().getFullYear(),
    semester: "",
    examTitle: "",
    subjects: [],
  })
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchSubjects()
      if (batch) {
        setFormData({
          name: batch.name,
          year: batch.year,
          semester: batch.semester,
          examTitle: batch.examTitle,
          subjects: batch.subjects?.map((s: any) => s._id || s) || [],
        })
      } else {
        setFormData({
          name: "",
          year: new Date().getFullYear(),
          semester: "",
          examTitle: "",
          subjects: [],
        })
      }
    }
  }, [isOpen, batch])

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/subjects")
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error("Failed to fetch subjects:", error)
    }
  }

  const handleSubjectToggle = (subjectId: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter((id) => id !== subjectId)
        : [...prev.subjects, subjectId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = batch ? `/api/batches/${batch._id}` : "/api/batches"
      const method = batch ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSave()
        onClose()
      }
    } catch (error) {
      console.error("Failed to save batch:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{batch ? "Edit Batch" : "Add New Batch"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Batch Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="semester">Semester</Label>
            <Input
              id="semester"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="examTitle">Examination Title</Label>
            <Textarea
              id="examTitle"
              value={formData.examTitle}
              onChange={(e) => setFormData({ ...formData, examTitle: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Subjects</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-3">
              {subjects.map((subject) => (
                <div key={subject._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject._id}
                    checked={formData.subjects.includes(subject._id)}
                    onCheckedChange={() => handleSubjectToggle(subject._id)}
                  />
                  <Label htmlFor={subject._id} className="text-sm">
                    {subject.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-purple-600">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
