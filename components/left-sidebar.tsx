"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Home, Calendar, Users, GraduationCap, Archive, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface LeftSidebarProps {
  activeItem?: string
  onExpandedChange?: (expanded: boolean) => void
}

export function LeftSidebar({ activeItem = "settings", onExpandedChange }: LeftSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const toggleSidebar = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onExpandedChange?.(newExpanded)
  }

  const menuItems = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      onClick: () => router.push("/content-types"),
    },
    {
      id: "calendar",
      icon: Calendar,
      label: "Calendar",
      onClick: () => {},
    },
    {
      id: "people",
      icon: Users,
      label: "People",
      onClick: () => {},
    },
    {
      id: "classes",
      icon: GraduationCap,
      label: "Classes",
      onClick: () => router.push("/content-types"),
    },
    {
      id: "archive",
      icon: Archive,
      label: "Archived",
      onClick: () => {},
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      onClick: () => {},
    },
  ]

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-background border-r border-border z-40 transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="w-8 h-8 text-muted-foreground hover:bg-accent"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          <div className="space-y-2 px-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={item.onClick}
                className={cn(
                  "w-full transition-all duration-200",
                  isExpanded ? "justify-start px-4 h-12" : "justify-center px-0 h-12 w-12 mx-auto",
                  activeItem === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent",
                )}
                title={!isExpanded ? item.label : undefined}
              >
                <item.icon className={cn("w-5 h-5", isExpanded && "mr-3")} />
                {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
