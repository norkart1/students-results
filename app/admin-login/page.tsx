"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const redirect = searchParams.get("redirect") || "/admin"
      const response = await fetch(`/api/admin-login?redirect=${encodeURIComponent(redirect)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        window.localStorage.setItem("adminUsername", username)
        window.location.href = redirect
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      onSubmit={handleSubmit}
    >
      <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900">Admin Login</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div>
        <label className="block text-gray-700 mb-2 text-sm sm:text-base" htmlFor="username">Username</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2 text-sm sm:text-base" htmlFor="password">Password</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 rounded hover:from-blue-600 hover:to-purple-700 transition text-sm sm:text-base disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <a
        href="/"
        className="block w-full mt-4 text-center text-blue-600 hover:underline text-sm sm:text-base"
      >
        ← Back to Home
      </a>
    </form>
  )
}
