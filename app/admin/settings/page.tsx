"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, RefreshCw, Trash2, Download, Upload, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const [seeding, setSeeding] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [message, setMessage] = useState("")

  const handleSeedData = async () => {
    if (!confirm("This will clear all existing data and add sample data. Are you sure?")) {
      return
    }

    setSeeding(true)
    setMessage("")

    try {
      const response = await fetch("/api/seed", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        setMessage(
          `✅ ${data.message} Created ${data.data.subjects} subjects, ${data.data.students} students, and ${data.data.results} results.`,
        )
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Failed to seed data: ${error.message}`)
    } finally {
      setSeeding(false)
    }
  }

  const handleClearData = async () => {
    if (
      !confirm(
        "⚠️ This will permanently delete ALL data including students, subjects, batches, and results. This action cannot be undone. Are you absolutely sure?",
      )
    ) {
      return
    }

    if (
      !confirm("Last chance! This will delete EVERYTHING. Type 'DELETE' to confirm.") ||
      prompt("Type 'DELETE' to confirm:") !== "DELETE"
    ) {
      return
    }

    setClearing(true)
    setMessage("")

    try {
      const response = await fetch("/api/clear-data", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        setMessage("✅ All data cleared successfully!")
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Failed to clear data: ${error.message}`)
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage system settings and data</p>
      </div>

      {message && (
        <Card
          className={`border-l-4 ${message.includes("✅") ? "border-l-green-500 bg-green-50" : "border-l-red-500 bg-red-50"}`}
        >
          <CardContent className="p-4">
            <p className={message.includes("✅") ? "text-green-700" : "text-red-700"}>{message}</p>
          </CardContent>
        </Card>
      )}

      {/* Sample Data Management */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Sample Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Load Sample Data</h3>
            <p className="text-gray-600 mb-4">
              Populate the system with sample data to get started quickly. This includes students, subjects, batches,
              and results based on your examination format.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Sample Data Includes:</h4>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• 9 Students (JAMSHAD O.B, M. SWALIH P, SAHAL M, etc.)</li>
                <li>• 7 Subjects with Arabic names (بیماری, بخاری, مسلم, etc.)</li>
                <li>• 1 Batch: NIHAYA 2 - Final Semester 2024-25</li>
                <li>• 4 Complete Results with proper rankings and percentages</li>
                <li>• Realistic marks distribution matching your result format</li>
              </ul>
            </div>

            <Button
              onClick={handleSeedData}
              disabled={seeding}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {seeding ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading Sample Data...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Load Sample Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trash2 className="w-5 h-5 mr-2 text-red-600" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-red-700">Danger Zone</h3>
            <p className="text-gray-600 mb-4">
              These actions are irreversible. Please be careful when using these options.
            </p>

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="font-semibold text-red-900">Clear All Data</h4>
              </div>
              <p className="text-red-800 text-sm mb-3">
                This will permanently delete all students, subjects, batches, and results from the database.
              </p>
              <Button
                onClick={handleClearData}
                disabled={clearing}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                {clearing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Clearing Data...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Export */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2 text-green-600" />
            Backup & Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Data Export</h3>
            <p className="text-gray-600 mb-4">Export your data for backup or migration purposes.</p>

            <div className="flex space-x-4">
              <Button variant="outline" disabled>
                <Download className="w-4 h-4 mr-2" />
                Export Students (Coming Soon)
              </Button>
              <Button variant="outline" disabled>
                <Download className="w-4 h-4 mr-2" />
                Export Results (Coming Soon)
              </Button>
              <Button variant="outline" disabled>
                <Upload className="w-4 h-4 mr-2" />
                Import Data (Coming Soon)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
