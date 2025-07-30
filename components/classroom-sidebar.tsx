"use client"
import { Home, Calendar, Users, BookOpen, Settings, Archive } from "lucide-react"
import { useRouter } from "next/navigation"

interface ClassroomSidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed?: boolean
}

export function ClassroomSidebar({ isOpen, onClose, isCollapsed = false }: ClassroomSidebarProps) {
  const router = useRouter()

  const menuItems = [
    { icon: Home, label: "Home", onClick: () => router.push("/content-types") },
    { icon: Calendar, label: "Calendar", onClick: () => {} },
    { icon: Users, label: "People", onClick: () => {} },
    { icon: BookOpen, label: "Classes", onClick: () => router.push("/content-types") },
    { icon: Archive, label: "Archived classes", onClick: () => {} },
    { icon: Settings, label: "Settings", onClick: () => {} },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && !isCollapsed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}
    </>
  )
}
