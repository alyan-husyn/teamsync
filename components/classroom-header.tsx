"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { VideoIcon as VideoCall, Calendar, AppWindowIcon as Apps, Sun, Moon, LogOut, Home } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

interface ClassroomHeaderProps {
  chatroom: any
  activeTab: string
  onTabChange: (tab: string) => void
  onMenuClick: () => void
}

export function ClassroomHeader({ chatroom, activeTab, onTabChange, onMenuClick }: ClassroomHeaderProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleHome = () => {
    router.push("/content-types")
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          {/* Removed Button element and its content */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs sm:text-sm font-medium">📚</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-foreground min-w-0">
              <span className="text-lg sm:text-xl font-normal hidden sm:inline">Dashboard</span>
              <span className="text-muted-foreground hidden sm:inline">›</span>
              <div className="min-w-0">
                <div className="font-medium text-sm sm:text-base truncate">{chatroom.name}</div>
                <div className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
                  {chatroom.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Theme toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-muted-foreground hover:bg-accent"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 ml-1 sm:ml-2 p-1 sm:p-2">
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                    {user?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center px-3 sm:px-4 overflow-x-auto max-w-screen-xl mx-auto">
        <div className="flex min-w-max">
          {[
            { id: "stream", label: "Stream" },
            { id: "activity", label: "Activity" },
            { id: "people", label: "People" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
