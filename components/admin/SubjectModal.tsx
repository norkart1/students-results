"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ScoringComponent {
  key: string
  label: string
  max?: number
  computed?: boolean
}

interface Subject {
  _id?: string
  name: string
  nameArabic: string
  code: string
  scoringScheme: ScoringComponent[]
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
    scoringScheme: [
      { key: "W", label: "Written", max: 90 },
      { key: "CE", label: "CE", max: 10 },
      { key: "T", label: "Total", computed: true },
    ],
  })
  const [scoringScheme, setScoringScheme] = useState<ScoringComponent[]>([
    { key: "W", label: "Written", max: 90 },
    { key: "CE", label: "CE", max: 10 },
    { key: "T", label: "Total", computed: true },
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (subject) {
        setFormData(subject)
        setScoringScheme(subject.scoringScheme || [
          { key: "W", label: "Written", max: 90 },
          { key: "CE", label: "CE", max: 10 },
          { key: "T", label: "Total", computed: true },
        ])
      } else {
        setFormData({
          name: "",
          nameArabic: "",
          code: "",
          scoringScheme: [
            { key: "W", label: "Written", max: 90 },
            { key: "CE", label: "CE", max: 10 },
            { key: "T", label: "Total", computed: true },
          ],
        })
        setScoringScheme([
          { key: "W", label: "Written", max: 90 },
          { key: "CE", label: "CE", max: 10 },
          { key: "T", label: "Total", computed: true },
        ])
      }
    }
  }, [isOpen, subject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = subject ? `/api/subjects/${subject._id}` : "/api/subjects"
      const method = subject ? "PUT" : "POST"

      const payload = { ...formData, scoringScheme }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

          {/* Add UI for editing scoringScheme */}
          <div className="mb-4">
            <Label>Scoring Scheme</Label>
            {scoringScheme.map((component, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <Input
                  className="w-24"
                  placeholder="Key"
                  value={component.key}
                  onChange={e => {
                    const updated = [...scoringScheme]
                    updated[idx].key = e.target.value
                    setScoringScheme(updated)
                  }}
                />
                <Input
                  className="w-32"
                  placeholder="Label"
                  value={component.label}
                  onChange={e => {
                    const updated = [...scoringScheme]
                    updated[idx].label = e.target.value
                    setScoringScheme(updated)
                  }}
                />
                <Input
                  className="w-20"
                  placeholder="Max"
                  type="number"
                  value={component.max ?? ''}
                  onChange={e => {
                    const updated = [...scoringScheme]
                    updated[idx].max = e.target.value ? Number(e.target.value) : undefined
                    setScoringScheme(updated)
                  }}
                  disabled={component.computed}
                />
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={!!component.computed}
                    onChange={e => {
                      const updated = [...scoringScheme]
                      updated[idx].computed = e.target.checked
                      setScoringScheme(updated)
                    }}
                  /> Computed
                </label>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setScoringScheme(scoringScheme.filter((_, i) => i !== idx))
                  }}
                  disabled={scoringScheme.length <= 1}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setScoringScheme([...scoringScheme, { key: '', label: '', max: undefined, computed: false }])}
            >
              + Add Component
            </Button>
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
