"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

interface Reaction {
  emoji: string
  user: string
}

interface Comment {
  content: string
  user: string
  timestamp: Date
}

interface Post {
  id: string
  chatroomId: string
  content: string
  author: string
  categories: string[] // Changed from single tag to array of categories
  attachment?: string
  status: "pending" | "approved" | "rejected" | "needs-work"
  reactions: Reaction[]
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}

interface PostsContextType {
  posts: Post[]
  createPost: (data: { chatroomId: string; content: string; categories: string[]; attachment?: string }) => void
  updatePost: (postId: string, data: { content: string }) => void
  addReaction: (postId: string, emoji: string) => void
  addComment: (postId: string, content: string) => void
  updatePostStatus: (postId: string, status: Post["status"]) => void
  deleteComment: (postId: string, commentIndex: number) => void
  isLoading: boolean
}

const PostsContext = createContext<PostsContextType | null>(null)

const defaultPosts: Post[] = [
  {
    id: "1",
    chatroomId: "1",
    content:
      "Welcome to The Hive! Let's start by sharing our ideas and collaborating on exciting projects.",
    author: "admin",
    categories: ["General"],
    status: "approved",
    reactions: [
      { emoji: "👍", user: "user" },
      { emoji: "🎉", user: "Alice Johnson" },
    ],
    comments: [
      { content: "Excited to be here!", user: "user", timestamp: new Date() },
      { content: "Looking forward to learning together", user: "Bob Smith", timestamp: new Date() },
    ],
    createdAt: new Date("2024-01-15T10:00:00"),
    updatedAt: new Date("2024-01-15T10:00:00"),
  },
  {
    id: "2",
    chatroomId: "1",
    content:
      "I've been working on a new React component library. Here's a preview of the button component with various states and animations.",
    author: "user",
    categories: ["Blog", "Portfolio"],
    attachment: "https://example.com/component-preview.png",
    status: "needs-work",
    reactions: [{ emoji: "🔥", user: "admin" }],
    comments: [
      { content: "Great work! Consider adding more accessibility features.", user: "admin", timestamp: new Date() },
    ],
    createdAt: new Date("2024-01-16T14:30:00"),
    updatedAt: new Date("2024-01-16T14:30:00"),
  },
  {
    id: "3",
    chatroomId: "2",
    content:
      "Here's our new project documentation. It includes project updates, milestones, and important discussions.",
    author: "admin",
    categories: ["Landing Page", "Documentation"],
    attachment: "https://example.com/project-docs",
    status: "approved",
    reactions: [
      { emoji: "✨", user: "user" },
      { emoji: "👏", user: "David Wilson" },
    ],
    comments: [],
    createdAt: new Date("2024-01-20T09:15:00"),
    updatedAt: new Date("2024-01-20T09:15:00"),
  },
]

export function usePosts() {
  const context = useContext(PostsContext)
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider")
  }
  return context
}

export function PostsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load posts from localStorage on mount
  useEffect(() => {
    const storedPosts = localStorage.getItem("classroom-posts")

    if (storedPosts) {
      try {
        const parsedPosts = JSON.parse(storedPosts)
        // Convert date strings back to Date objects
        const postsWithDates = parsedPosts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          comments: post.comments.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp),
          })),
        }))
        setPosts(postsWithDates)
      } catch (error) {
        console.error("Error parsing stored posts:", error)
        setPosts(defaultPosts)
        localStorage.setItem("classroom-posts", JSON.stringify(defaultPosts))
      }
    } else {
      // First time loading, use default data
      setPosts(defaultPosts)
      localStorage.setItem("classroom-posts", JSON.stringify(defaultPosts))
    }

    setIsLoading(false)
  }, [])

  // Save to localStorage whenever posts change
  useEffect(() => {
    if (!isLoading && posts.length > 0) {
      localStorage.setItem("classroom-posts", JSON.stringify(posts))
    }
  }, [posts, isLoading])

  const createPost = (data: { chatroomId: string; content: string; categories: string[]; attachment?: string }) => {
    if (!user) return

    const newPost: Post = {
      id: Date.now().toString(),
      chatroomId: data.chatroomId,
      content: data.content,
      author: user.username,
      categories: data.categories,
      attachment: data.attachment,
      status: user.role === "admin" ? "approved" : "pending", // Admin posts approved by default, user posts pending
      reactions: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setPosts((prev) => {
      const updated = [newPost, ...prev]
      localStorage.setItem("classroom-posts", JSON.stringify(updated))
      return updated
    })
  }

  const updatePost = (postId: string, data: { content: string }) => {
    setPosts((prev) => {
      const updated = prev.map((post) =>
        post.id === postId ? { ...post, content: data.content, updatedAt: new Date() } : post,
      )
      localStorage.setItem("classroom-posts", JSON.stringify(updated))
      return updated
    })
  }

  const addReaction = (postId: string, emoji: string) => {
    if (!user) return

    setPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          // Remove existing reaction from this user if any
          const filteredReactions = post.reactions.filter((r) => r.user !== user.username)
          return {
            ...post,
            reactions: [...filteredReactions, { emoji, user: user.username }],
            updatedAt: new Date(),
          }
        }
        return post
      })
      localStorage.setItem("classroom-posts", JSON.stringify(updated))
      return updated
    })
  }

  const addComment = (postId: string, content: string) => {
    if (!user) return

    setPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, { content, user: user.username, timestamp: new Date() }],
            updatedAt: new Date(),
          }
        }
        return post
      })
      localStorage.setItem("classroom-posts", JSON.stringify(updated))
      return updated
    })
  }

  const updatePostStatus = (postId: string, status: Post["status"]) => {
    setPosts((prev) => {
      const updated = prev.map((post) => (post.id === postId ? { ...post, status, updatedAt: new Date() } : post))
      localStorage.setItem("classroom-posts", JSON.stringify(updated))
      return updated
    })
  }

  const deleteComment = (postId: string, commentIndex: number) => {
    setPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments.filter((_, index) => index !== commentIndex)
          return {
            ...post,
            comments: updatedComments,
            updatedAt: new Date(),
          }
        }
        return post
      })
      localStorage.setItem("classroom-posts", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        createPost,
        updatePost,
        addReaction,
        addComment,
        updatePostStatus,
        deleteComment,
        isLoading,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}
