"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useChatrooms } from "@/lib/chatroom-context"
import { usePosts } from "@/lib/posts-context"
import { ClassroomHeader } from "@/components/classroom-header"
import { LeftSidebar } from "@/components/left-sidebar"
import { StreamTab } from "@/components/classroom-stream"
import { PeopleTab } from "@/components/classroom-people"
import { ActivityTab } from "@/components/classroom-activity"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ChatroomPage() {
  const [mounted, setMounted] = useState(false)

  // Only access hooks after component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <ChatroomPageContent />
}

function ChatroomPageContent() {
  const { user, isLoading: authLoading } = useAuth()
  const { chatrooms, isLoading: chatroomsLoading } = useChatrooms()
  const { isLoading: postsLoading } = usePosts()
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("stream")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  const chatroomId = params.id as string
  const chatroom = chatrooms.find((c) => c.id === chatroomId)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  if (authLoading || chatroomsLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading chatroom...</p>
        </div>
      </div>
    )
  }

  if (!user || !chatroom) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Chatroom not found</h2>
          <p className="text-muted-foreground mb-4">The chatroom you're looking for doesn't exist.</p>
          <button onClick={() => router.push("/content-types")} className="text-primary hover:underline">
            Go back to chatrooms
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Left Sidebar */}
      <LeftSidebar activeItem="classes" onExpandedChange={setSidebarExpanded} />

      {/* Main Content Area */}
      <div className={cn("transition-all duration-300 ease-in-out", sidebarExpanded ? "ml-64" : "ml-16")}>
        {/* Header */}
        <ClassroomHeader
          chatroom={chatroom}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <main className="w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === "stream" && <StreamTab chatroomId={chatroomId} chatroom={chatroom} />}
            {activeTab === "people" && <PeopleTab chatroomId={chatroomId} />}
            {activeTab === "activity" && <ActivityTab chatroomId={chatroomId} />}
          </div>
        </main>
      </div>
    </div>
  )
}
