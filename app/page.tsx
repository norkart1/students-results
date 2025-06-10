"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Users, FileText, BarChart3, Search, Cloud } from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const [regNumber, setRegNumber] = useState("")

  const handleResultSearch = () => {
    if (regNumber.trim()) {
      window.location.href = `/result/${regNumber}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Result Management System
                </h1>
                <p className="text-sm text-gray-600">ASAS MALIKI EXAMINATION</p>
              </div>
            </div>
            {/* <Link href="/admin">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Admin Panel
              </Button>
            </Link> */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Check Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Results</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Enter your registration number to view your examination results instantly
          </p>

          {/* Result Search Card */}
          <Card className="max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Search Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="regNumber" className="text-left block mb-2">
                  Registration Number
                </Label>
                <Input
                  id="regNumber"
                  placeholder="Enter your reg number (e.g., 1027)"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="text-center text-lg font-semibold"
                  onKeyPress={(e) => e.key === "Enter" && handleResultSearch()}
                />
              </div>
              <Button
                onClick={handleResultSearch}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-3"
                disabled={!regNumber.trim()}
              >
                <Search className="w-5 h-5 mr-2" />
                View Result
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">System Features</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive result management system provides everything needed for academic administration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow bg-blue-50 border-0">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Student Management</h4>
                <p className="text-gray-600 text-sm">
                  Complete student records with registration, contact details, and batch management
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-green-50 border-0">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Result Processing</h4>
                <p className="text-gray-600 text-sm">
                  Automated result calculation with ranking, percentage, and grade computation
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-purple-50 border-0">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Subject Management</h4>
                <p className="text-gray-600 text-sm">
                  Multi-language subject support with Arabic text and customizable marking schemes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-orange-50 border-0">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Reports</h4>
                <p className="text-gray-600 text-sm">
                  Comprehensive reporting with performance analytics and statistical insights
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Result Preview */}
      {/* <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Sample Result Format</h3>
            <p className="text-gray-600">Professional result cards with detailed subject-wise performance</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 text-center">
                <h4 className="text-xl font-bold">ASAS MALIKI FINAL SEMESTER EXAMINATION 2024-2025</h4>
              </div>
              <div className="bg-gray-100 p-3 text-center border-b">
                <h5 className="font-bold">RESULT - SAMPLE FORMAT</h5>
              </div>
              <CardContent className="p-6">
                <div className="text-center text-gray-600">
                  <p className="mb-4">✓ Color-coded performance indicators</p>
                  <p className="mb-4">✓ Arabic subject names with custom fonts</p>
                  <p className="mb-4">✓ Detailed marks breakdown (Written + CE)</p>
                  <p className="mb-4">✓ Automatic ranking and percentage calculation</p>
                  <p className="mb-6">✓ Print and PDF download options</p>

                  <div className="flex justify-center space-x-4">
                    <Button variant="outline">View Sample Result</Button>
                    <Link href="/admin">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600">Access Admin Panel</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h5 className="text-lg font-bold">Result Management</h5>
              </div>
              <p className="text-gray-400">
                Comprehensive examination result management system for educational institutions.
              </p>
            </div>

            <div>
              <h6 className="font-semibold mb-4">Quick Links</h6>
              <ul className="space-y-2 text-gray-400">
                <li>
                  {/* <Link href="/admin" className="hover:text-white transition-colors">
                    Admin Panel
                  </Link> */}
                </li>
                <li>
                  {/* <Link href="/admin/students" className="hover:text-white transition-colors">
                    Student Management
                  </Link> */}
                </li>
                <li>
                  {/* <Link href="/admin/results" className="hover:text-white transition-colors">
                    Results
                  </Link> */}
                </li>
                <li>
                  {/* <Link href="/admin/reports" className="hover:text-white transition-colors">
                    Reports
                  </Link> */}
                </li>
              </ul>
            </div>

            <div>
              <h6 className="font-semibold mb-4">Contact Info</h6>
              <div className="text-gray-400 space-y-2">
                <p>ASAS MALIKI EXAMINATION</p>
                <p>Email: micthrissur@gmail.com</p>
                <p>Phone: 0487 244 5828</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm print:hidden flex flex-col md:flex-row items-center justify-center gap-2">
            <span>
              &copy; {new Date().getFullYear()} MIC ASAS. All rights reserved.
            </span>
            <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
              Powered by
              <a href="https://digibayt.com" target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline font-medium flex items-center gap-1">
                DigiBayt
                <Cloud className="lucide lucide-cloud ml-1 w-4 h-4 text-blue-400" aria-label="cloud" />
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
