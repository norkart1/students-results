"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface SystemStatus {
  database: {
    connected: boolean
    collections: {
      students: number
      subjects: number
      batches: number
      results: number
    }
  }
  sampleData: {
    loaded: boolean
    lastUpdated: string | null
  }
  apis: {
    students: boolean
    subjects: boolean
    batches: boolean
    results: boolean
    reports: boolean
  }
}

export default function SystemStatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/system-status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch system status:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
          <p className="text-gray-600 mt-2">Checking system components...</p>
        </div>
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading system status...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
          <p className="text-gray-600 mt-2">Monitor database connectivity and data status</p>
        </div>
        <Button onClick={checkSystemStatus} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Status
        </Button>
      </div>

      {/* Database Status */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            MongoDB Database Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <StatusIcon status={status?.database.connected || false} />
                <span className="ml-2">Connection Status</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {status?.database.connected
                  ? "✅ Successfully connected to MongoDB"
                  : "❌ Failed to connect to MongoDB"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Data Collections</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Students:</span>
                  <span className="font-medium">{status?.database.collections.students || 0} records</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subjects:</span>
                  <span className="font-medium">{status?.database.collections.subjects || 0} records</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Batches:</span>
                  <span className="font-medium">{status?.database.collections.batches || 0} records</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Results:</span>
                  <span className="font-medium">{status?.database.collections.results || 0} records</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Status */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>API Endpoints Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Students API</span>
              <StatusIcon status={status?.apis.students || false} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Subjects API</span>
              <StatusIcon status={status?.apis.subjects || false} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Batches API</span>
              <StatusIcon status={status?.apis.batches || false} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Results API</span>
              <StatusIcon status={status?.apis.results || false} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Reports API</span>
              <StatusIcon status={status?.apis.reports || false} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Data Source Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Dynamic Data (From MongoDB)
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• All student records and personal information</li>
                <li>• Subject definitions with Arabic names</li>
                <li>• Batch/class configurations</li>
                <li>• Examination results and marks</li>
                <li>• Rankings and percentages (calculated dynamically)</li>
                <li>• Reports and analytics data</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Static/Template Data
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• UI labels and interface text</li>
                <li>• Grade calculation formulas (A+, A, B+, etc.)</li>
                <li>• Color schemes for performance indicators</li>
                <li>• Result card layout and styling</li>
                <li>• System messages and notifications</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Sample Data Status</h3>
              <p className="text-sm text-yellow-700">
                {status?.sampleData.loaded
                  ? `✅ Sample data is loaded (Last updated: ${status.sampleData.lastUpdated})`
                  : "❌ No sample data found - Use 'Load Sample Data' to populate the system"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Data Flow */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Real-time Data Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-medium">User searches for result by registration number</p>
                <p className="text-sm text-gray-600">Frontend sends API request to /api/results/student/[regNumber]</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-medium">API queries MongoDB database</p>
                <p className="text-sm text-gray-600">Finds student → Fetches result → Populates subject details</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-medium">Dynamic result card generation</p>
                <p className="text-sm text-gray-600">
                  Real-time calculation of grades, percentages, and performance indicators
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                ✓
              </div>
              <div>
                <p className="font-medium">Professional result display</p>
                <p className="text-sm text-gray-600">
                  Renders with live data, Arabic fonts, and print-optimized layout
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
