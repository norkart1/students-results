"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, BookOpen, GraduationCap, FileText, BarChart3, Settings, Home, Database } from "lucide-react"

const menuItems = [
  { href: "/admin", icon: Home, label: "Dashboard" },
  { href: "/admin/students", icon: Users, label: "Students" },
  { href: "/admin/subjects", icon: BookOpen, label: "Subjects" },
  { href: "/admin/batches", icon: GraduationCap, label: "Batches" },
  { href: "/admin/results", icon: FileText, label: "Results" },
  { href: "/admin/reports", icon: BarChart3, label: "Reports" },
  { href: "/admin/system-status", icon: Database, label: "System Status" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-xl border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Result Management
        </h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-r-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
