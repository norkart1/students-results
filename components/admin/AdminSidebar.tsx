"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, BookOpen, GraduationCap, FileText, BarChart3, Settings, Home, Database } from "lucide-react"
import React from "react"

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
	// Responsive sidebar state
	const [open, setOpen] = React.useState(false)
	const pathname = usePathname()

	// Close sidebar on route change (mobile)
	React.useEffect(() => {
		setOpen(false)
	}, [pathname])

	return (
		<>
			{/* Mobile sidebar toggle button */}
			<button
				className="sm:hidden fixed top-4 left-4 z-30 bg-white rounded-full shadow p-2 border border-gray-200"
				onClick={() => setOpen(true)}
				aria-label="Open sidebar"
			>
				<svg
					className="w-6 h-6 text-blue-600"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>

			{/* Overlay for mobile sidebar */}
			{open && (
				<div
					className="fixed inset-0 bg-black bg-opacity-40 z-20 sm:hidden"
					onClick={() => setOpen(false)}
				></div>
			)}

			{/* Sidebar */}
			<div
				className={`fixed sm:static z-30 top-0 left-0 h-screen w-64 bg-gradient-to-b from-white via-blue-50 to-purple-50 shadow-2xl rounded-r-3xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
				style={{ maxHeight: "100vh" }}
			>
				<div className="flex flex-col items-center p-6 gap-4">
					<div className="flex items-center gap-2 w-full justify-center">
						<img src="/images/logo.webp" alt="Logo" className="w-10 h-10 rounded-full shadow-md border border-blue-200 bg-white" />
						<h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Result Management</h1>
					</div>
				</div>
				<nav className="mt-4 flex flex-col gap-1 px-2">
					{menuItems.map((item) => {
						const Icon = item.icon
						const isActive = pathname === item.href

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center gap-3 px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 cursor-pointer select-none
									${isActive
										? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-l-4 border-blue-600"
										: "text-gray-700 hover:bg-blue-100/60 hover:text-blue-700"}
								`}
								onClick={() => setOpen(false)}
							>
								<Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-blue-500"}`} />
								<span>{item.label}</span>
							</Link>
						)
					})}
				</nav>
				<div className="flex-1" />
				<div className="px-6 pb-6 mt-auto text-xs text-gray-400">© {new Date().getFullYear()} ASAS Results</div>
			</div>
		</>
	)
}
