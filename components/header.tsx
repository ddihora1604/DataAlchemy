"use client"

import { Bell, Info, AlertTriangle, Lightbulb, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/contexts/notification-context"

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'recommendation':
      return <Lightbulb className="h-4 w-4 text-yellow-500" />
    case 'insight':
      return <Activity className="h-4 w-4 text-blue-500" />
    case 'alert':
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    default:
      return <Info className="h-4 w-4 text-green-500" />
  }
}

export default function Header() {
  const { notifications, markAsRead, clearNotifications } = useNotifications()
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 justify-end space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2 border-b sticky top-0 bg-background z-10">
              <span className="font-medium">Notifications</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearNotifications}
              >
                Clear All
              </Button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={`${notification.id}-${notification.time}`}
                    className="flex flex-col items-start p-4 space-y-1 cursor-pointer hover:bg-accent border-b last:border-b-0"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-center w-full gap-2">
                      {getNotificationIcon(notification.type)}
                      <span className="font-medium flex-1">{notification.title}</span>
                      {notification.unread && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
      </div>
    </header>
  )
}