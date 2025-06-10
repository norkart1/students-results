"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import StudentAvatarUploader from "@/components/admin/StudentAvatarUploader"

interface Student {
  _id?: string
  regNumber: string
  name: string
  batch: string
  email?: string
  phone?: string
  address?: string
  profilePhoto?: string // new field for photo filename
}

interface Batch {
  _id: string
  name: string
  year: number
}

interface StudentModalProps {
  isOpen: boolean
  onClose: () => void
  student: Student | null
  onSave: () => void
}

export default function StudentModal({ isOpen, onClose, student, onSave }: StudentModalProps) {
  const [formData, setFormData] = useState<Student>({
    regNumber: "",
    name: "",
    batch: "",
    email: "",
    phone: "",
    address: "",
  })
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchBatches()
      if (student) {
        setFormData(student)
        setPhotoPreview(student.profilePhoto ? student.profilePhoto : null)
        setAvatarUrl(student.profilePhoto || "")
      } else {
        setFormData({
          regNumber: "",
          name: "",
          batch: "",
          email: "",
          phone: "",
          address: "",
          profilePhoto: "",
        })
        setPhotoPreview(null)
        setAvatarUrl("")
      }
    }
  }, [isOpen, student])

  const fetchBatches = async () => {
    try {
      const response = await fetch("/api/batches")
      const data = await response.json()
      setBatches(data)
    } catch (error) {
      console.error("Failed to fetch batches:", error)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url)
    setFormData((prev) => ({ ...prev, profilePhoto: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = student ? `/api/students/${student._id}` : "/api/students"
      const method = student ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, profilePhoto: avatarUrl }),
      })
      if (response.ok) {
        onSave()
        onClose()
      }
    } catch (error) {
      console.error("Failed to save student:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{student ? "Edit Student" : "Add New Student"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="regNumber">Registration Number</Label>
            <Input
              id="regNumber"
              value={formData.regNumber}
              onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="batch">Batch</Label>
            <Select value={formData.batch} onValueChange={(value) => setFormData({ ...formData, batch: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch._id} value={batch._id}>
                    {batch.name} - {batch.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="profilePhoto">Profile Photo</Label>
            <StudentAvatarUploader regNumber={formData.regNumber} onUpload={handleAvatarUpload} />
            {avatarUrl && (
              <img src={avatarUrl} alt="Profile Preview" className="mt-2 w-20 h-20 rounded-full object-cover border" />
            )}
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
