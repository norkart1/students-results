"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Subject {
  _id?: string
  name: string
  nameArabic: string
  code: string
  maxMarks: number
  writtenMarks: number
  ceMarks: number
}

interface SubjectModalProps {
  isOpen: boolean
  onClose: () => void
  subject: Subject | null
  onSave: () => void
}

export default function SubjectModal({ isOpen, onClose, subject, onSave }: SubjectModalProps) {
  const [formData, setFormData] = useState<Subject>({
    name: "",
    nameArabic: "",
    code: "",
    maxMarks: 100,
    writtenMarks: 90,
    ceMarks: 10,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (subject) {
        setFormData(subject)
      } else {
        setFormData({
          name: "",
          nameArabic: "",
          code: "",
          maxMarks: 100,
          writtenMarks: 90,
          ceMarks: 10,
        })
      }
    }
  }, [isOpen, subject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = subject ? `/api/subjects/${subject._id}` : "/api/subjects"
      const method = subject ? "PUT" : "POST"

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
      console.error("Failed to save subject:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{subject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">Subject Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Subject Name (English)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="nameArabic">Subject Name (Arabic)</Label>
            <Input
              id="nameArabic"
              value={formData.nameArabic}
              onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
              className="arabic-text text-lg"
              dir="rtl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="writtenMarks">Written Marks</Label>
              <Input
                id="writtenMarks"
                type="number"
                value={formData.writtenMarks}
                onChange={(e) => setFormData({ ...formData, writtenMarks: Number.parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="ceMarks">CE Marks</Label>
              <Input
                id="ceMarks"
                type="number"
                value={formData.ceMarks}
                onChange={(e) => setFormData({ ...formData, ceMarks: Number.parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="maxMarks">Total Marks</Label>
            <Input
              id="maxMarks"
              type="number"
              value={formData.maxMarks}
              onChange={(e) => setFormData({ ...formData, maxMarks: Number.parseInt(e.target.value) })}
              required
            />
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
