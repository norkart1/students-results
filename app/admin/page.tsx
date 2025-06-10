"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, GraduationCap, FileText, TrendingUp, Award, Database, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Stats {
  totalStudents: number
  totalSubjects: number
  totalBatches: number
  totalResults: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalSubjects: 0,
    totalBatches: 0,
    totalResults: 0,
  })

  const [seeding, setSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState("")

  useEffect(() => {
    // Simulate fetching stats
    setStats({
      totalStudents: 150,
      totalSubjects: 8,
      totalBatches: 5,
      totalResults: 120,
    })
  }, [])

  const handleSeedData = async () => {
    if (!confirm("This will clear all existing data and add sample data. Are you sure?")) {
      return
    }

    setSeeding(true)
    setSeedMessage("")

    try {
      const response = await fetch("/api/seed", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        setSeedMessage(
          `✅ ${data.message} Created ${data.data.subjects} subjects, ${data.data.students} students, and ${data.data.results} results.`,
        )
        // Refresh stats after seeding
        setStats({
          totalStudents: data.data.students,
          totalSubjects: data.data.subjects,
          totalBatches: data.data.batches,
          totalResults: data.data.results,
        })
      } else {
        setSeedMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setSeedMessage(`❌ Failed to seed data: ${error.message}`)
    } finally {
      setSeeding(false)
    }
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Subjects",
      value: stats.totalSubjects,
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Batches",
      value: stats.totalBatches,
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Results",
      value: stats.totalResults,
      icon: FileText,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6 px-2 sm:px-0 pb-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Welcome to the Result Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className={`${card.bgColor} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Seed Data Section */}
      <Card className="shadow-lg border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Sample Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm sm:text-base">
            <p className="text-gray-600">
              Get started quickly by loading sample data including students, subjects, batches, and results.
            </p>

            {seedMessage && (
              <div
                className={`p-3 rounded-lg ${seedMessage.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
              >
                {seedMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={handleSeedData}
                disabled={seeding}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto"
              >
                {seeding ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Seeding Data...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Load Sample Data
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-gray-500 flex items-center">
              <div className="space-y-1">
                <div>• 9 Sample Students (from your result image)</div>
                <div>• 7 Subjects with Arabic names</div>
                <div>• 1 Batch (NIHAYA 2 - 2025)</div>
                <div>• 4 Complete Results with rankings</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-700">New student registered: Ahmed Ali</p>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-700">Results published for Batch 2025</p>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm text-gray-700">New subject added: Islamic Studies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <span className="font-medium">M. SWALIH P</span>
                </div>
                <span className="text-sm font-bold text-yellow-600">81.2%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <span className="font-medium">SAHAL M</span>
                </div>
                <span className="text-sm font-bold text-gray-600">80.7%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <span className="font-medium">RINSHAD C.P</span>
                </div>
                <span className="text-sm font-bold text-orange-600">73.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
