"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Member {
  id: string
  name: string
  role: "admin" | "user"
  isOnline: boolean
}

interface Chatroom {
  id: string
  name: string
  description: string
  memberCount: number
  postCount: number
  members: Member[]
  createdAt: Date
}

interface ChatroomContextType {
  chatrooms: Chatroom[]
  createChatroom: (name: string, description: string) => void
  removeMemberFromChatroom: (chatroomId: string, memberId: string) => void
  isLoading: boolean
}

const ChatroomContext = createContext<ChatroomContextType | null>(null)

const defaultChatrooms: Chatroom[] = [
  {
    id: "1",
    name: "The Hive",
    description: "Collaboration and Ideas",
    memberCount: 12,
    postCount: 8,
    members: [
      { id: "1", name: "admin", role: "admin", isOnline: true },
      { id: "2", name: "user", role: "user", isOnline: true },
      { id: "3", name: "Alice Johnson", role: "user", isOnline: false },
      { id: "4", name: "Bob Smith", role: "user", isOnline: true },
      { id: "5", name: "Carol Davis", role: "user", isOnline: false },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Mission Control",
    description: "Project updates and discussions",
    memberCount: 8,
    postCount: 5,
    members: [
      { id: "1", name: "admin", role: "admin", isOnline: true },
      { id: "2", name: "user", role: "user", isOnline: true },
      { id: "6", name: "David Wilson", role: "user", isOnline: true },
      { id: "7", name: "Eva Brown", role: "user", isOnline: false },
    ],
    createdAt: new Date("2024-01-20"),
  },
]

export function useChatrooms() {
  const context = useContext(ChatroomContext)
  if (!context) {
    throw new Error("useChatrooms must be used within a ChatroomProvider")
  }
  return context
}

export function ChatroomProvider({ children }: { children: ReactNode }) {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load chatrooms from localStorage on mount
  useEffect(() => {
    const storedChatrooms = localStorage.getItem("classroom-chatrooms")

    if (storedChatrooms) {
      try {
        const parsedChatrooms = JSON.parse(storedChatrooms)
        // Convert date strings back to Date objects
        const chatroomsWithDates = parsedChatrooms.map((chatroom: any) => ({
          ...chatroom,
          createdAt: new Date(chatroom.createdAt),
        }))
        setChatrooms(chatroomsWithDates)
      } catch (error) {
        console.error("Error parsing stored chatrooms:", error)
        setChatrooms(defaultChatrooms)
        localStorage.setItem("classroom-chatrooms", JSON.stringify(defaultChatrooms))
      }
    } else {
      // First time loading, use default data
      setChatrooms(defaultChatrooms)
      localStorage.setItem("classroom-chatrooms", JSON.stringify(defaultChatrooms))
    }

    setIsLoading(false)
  }, [])

  // Save to localStorage whenever chatrooms change
  useEffect(() => {
    if (!isLoading && chatrooms.length > 0) {
      localStorage.setItem("classroom-chatrooms", JSON.stringify(chatrooms))
    }
  }, [chatrooms, isLoading])

  const createChatroom = (name: string, description: string) => {
    const newChatroom: Chatroom = {
      id: Date.now().toString(),
      name,
      description,
      memberCount: 1,
      postCount: 0,
      members: [{ id: "1", name: "admin", role: "admin", isOnline: true }],
      createdAt: new Date(),
    }

    setChatrooms((prev) => {
      const updated = [...prev, newChatroom]
      localStorage.setItem("classroom-chatrooms", JSON.stringify(updated))
      return updated
    })
  }

  const removeMemberFromChatroom = (chatroomId: string, memberId: string) => {
    setChatrooms((prev) => {
      const updated = prev.map((chatroom) => {
        if (chatroom.id === chatroomId) {
          const updatedMembers = chatroom.members.filter((member) => member.id !== memberId)
          return {
            ...chatroom,
            members: updatedMembers,
            memberCount: updatedMembers.length,
          }
        }
        return chatroom
      })
      localStorage.setItem("classroom-chatrooms", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <ChatroomContext.Provider value={{ chatrooms, createChatroom, removeMemberFromChatroom, isLoading }}>
      {children}
    </ChatroomContext.Provider>
  )
}
