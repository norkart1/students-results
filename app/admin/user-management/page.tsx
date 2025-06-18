"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("admin")
  const [sidebarRestrict, setSidebarRestrict] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [editId, setEditId] = useState<string|null>(null)
  const [editRole, setEditRole] = useState("")
  const [editSidebarRestrict, setEditSidebarRestrict] = useState(true)

  const fetchAdmins = async () => {
    setLoading(true)
    const res = await fetch("/api/admins")
    const data = await res.json()
    setAdmins(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  // Set localStorage for sidebar restriction when logging in or updating self
  useEffect(() => {
    // Assume current admin is the first in the list (replace with real auth logic)
    if (admins.length > 0) {
      const current = admins[0] as any;
      window.localStorage.setItem('adminRole', current.role);
      window.localStorage.setItem('sidebarRestrict', current.sidebarRestrict === false ? 'no' : 'yes');
    }
  }, [admins])

  const handleAddAdmin = async () => {
    setError("")
    setLoading(true)
    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role, sidebarRestrict })
    })
    const data = await res.json()
    if (!res.ok) setError(data.error || "Failed to add admin")
    setUsername("")
    setPassword("")
    setRole("admin")
    setSidebarRestrict(true)
    fetchAdmins()
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    setError("")
    setLoading(true)
    const res = await fetch("/api/admins/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    const data = await res.json()
    if (!res.ok) setError(data.error || "Failed to delete admin")
    fetchAdmins()
    setLoading(false)
  }

  // Edit admin (role/sidebarRestrict)
  const handleEdit = (admin: any) => {
    setEditId(admin._id)
    setEditRole(admin.role)
    setEditSidebarRestrict(admin.sidebarRestrict !== false)
  }
  const handleUpdate = async () => {
    setError("")
    setLoading(true)
    const res = await fetch("/api/admins/update-role", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, role: editRole, sidebarRestrict: editSidebarRestrict })
    })
    const data = await res.json()
    if (!res.ok) setError(data.error || "Failed to update admin")
    setEditId(null)
    fetchAdmins()
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label>Username</Label>
            <Input value={username} onChange={e => setUsername(e.target.value)} className="mb-2" />
            <Label>Password</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mb-2" />
            <Label>Role</Label>
            <select value={role} onChange={e => setRole(e.target.value)} className="mb-2 w-full border rounded p-2">
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            <Label>Sidebar Restriction</Label>
            <select value={sidebarRestrict ? "yes" : "no"} onChange={e => setSidebarRestrict(e.target.value === "yes")} className="mb-2 w-full border rounded p-2">
              <option value="yes">Enabled (restrict non-superadmin)</option>
              <option value="no">Disabled (show all menus)</option>
            </select>
            <Button onClick={handleAddAdmin} disabled={loading || !username || !password} className="w-full mt-2">Add Admin</Button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Current Admins</h3>
            <ul>
              {admins.map((admin: any) => (
                <li key={admin._id} className="flex items-center justify-between border-b py-2">
                  <span>{admin.username} <span className="text-xs text-gray-500">({admin.role})</span></span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(admin)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(admin._id)} disabled={admin.role === 'superadmin' && admins.filter((a:any)=>a.role==='superadmin').length === 1}>Remove</Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {editId && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <h4 className="font-semibold mb-2">Edit Admin</h4>
              <Label>Role</Label>
              <select value={editRole} onChange={e => setEditRole(e.target.value)} className="mb-2 w-full border rounded p-2">
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <Label>Sidebar Restriction</Label>
              <select value={editSidebarRestrict ? "yes" : "no"} onChange={e => setEditSidebarRestrict(e.target.value === "yes") } className="mb-2 w-full border rounded p-2">
                <option value="yes">Enabled (restrict non-superadmin)</option>
                <option value="no">Disabled (show all menus)</option>
              </select>
              <div className="flex gap-2">
                <Button onClick={handleUpdate} disabled={loading}>Save</Button>
                <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
              </div>
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
