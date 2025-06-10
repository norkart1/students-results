import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function AdminLoginPage() {
  // This is a server component, but we'll render a client form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-2 sm:px-0">
      <form
        className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
        method="POST"
        action="/api/admin-login"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900">Admin Login</h1>
        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base" htmlFor="username">Username</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            type="text"
            name="username"
            id="username"
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
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 rounded hover:from-blue-600 hover:to-purple-700 transition text-sm sm:text-base"
        >
          Login
        </button>
      </form>
    </div>
  )
}
