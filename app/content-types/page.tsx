"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Users, MessageSquare, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useChatrooms } from "@/lib/chatroom-context"
import { Header } from "@/components/header"

export default function ContentTypesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { chatrooms, createChatroom, isLoading: chatroomsLoading } = useChatrooms()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newChatroom, setNewChatroom] = useState({ name: "", description: "" })
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  const handleCreateChatroom = (e: React.FormEvent) => {
    e.preventDefault()
    if (newChatroom.name.trim()) {
      createChatroom(newChatroom.name, newChatroom.description)
      setNewChatroom({ name: "", description: "" })
      setIsCreateModalOpen(false)
    }
  }

  const handleChatroomClick = (id: string) => {
    router.push(`/content-types/${id}`)
  }

  if (authLoading || chatroomsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading chatrooms...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Chatrooms</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {user.role === "admin"
                ? "Create and manage your collaborative spaces"
                : "Join and participate in collaborative spaces"}
            </p>
          </div>

          {user.role === "admin" && (
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Chatroom
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Chatroom</DialogTitle>
                  <DialogDescription>
                    Create a new collaborative space for your team
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateChatroom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Chatroom Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter chatroom name"
                      value={newChatroom.name}
                      onChange={(e) => setNewChatroom((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Enter chatroom description"
                      value={newChatroom.description}
                      onChange={(e) => setNewChatroom((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Create
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {chatrooms.map((chatroom) => (
            <Card
              key={chatroom.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleChatroomClick(chatroom.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="truncate">{chatroom.name}</span>
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {chatroom.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{chatroom.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{chatroom.postCount} posts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {chatrooms.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No chatrooms yet</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
              {user.role === "admin"
                ? "Create your first chatroom to get started"
                : "Ask an administrator to create chatrooms"}
            </p>
            {user.role === "admin" && (
              <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create First Chatroom
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
