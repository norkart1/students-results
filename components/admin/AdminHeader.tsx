"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react"

export default function AdminHeader() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notification count and list from API
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotificationCount(data.count || 0);
          setNotifications(data.notifications || []);
        } else {
          setNotificationCount(0);
          setNotifications([]);
        }
      } catch {
        setNotificationCount(0);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 w-full">
          <div className="relative w-full max-w-xs sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search..." className="pl-10 w-full" />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
              ) : (
                notifications.slice(0, 5).map((n: any) => (
                  <DropdownMenuItem key={n._id || n.id} className={!n.read ? "font-semibold" : ""}>
                    {n.message}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 hidden xs:inline">Admin</span>
          </div>

          {/* Logout Button */}
          <form
            action="/api/admin-logout" method="POST"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch('/api/admin-logout', { method: 'POST' });
                if (res.ok) {
                  window.location.href = '/admin-login';
                } else {
                  alert('Logout failed.');
                }
              } catch {
                alert('Logout failed.');
              }
            }}
          >
            <Button type="submit" variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
