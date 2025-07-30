"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  username: string
  role: "admin" | "user"
}

interface AuthContextType {
  user: User | null
  login: (role: "admin" | "user", username: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("classroom-user")
    const loginTimestamp = localStorage.getItem("classroom-login-timestamp")

    if (storedUser && loginTimestamp) {
      try {
        const userData = JSON.parse(storedUser)
        const loginTime = Number.parseInt(loginTimestamp)
        const currentTime = Date.now()
        const sessionDuration = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

        // Check if session is still valid (within 7 days)
        if (currentTime - loginTime < sessionDuration) {
          setUser(userData)
        } else {
          // Session expired, clear storage
          localStorage.removeItem("classroom-user")
          localStorage.removeItem("classroom-login-timestamp")
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("classroom-user")
        localStorage.removeItem("classroom-login-timestamp")
      }
    }

    setIsLoading(false)
  }, [])

  const login = (role: "admin" | "user", username: string) => {
    const userData = { username, role }
    const timestamp = Date.now().toString()

    setUser(userData)
    localStorage.setItem("classroom-user", JSON.stringify(userData))
    localStorage.setItem("classroom-login-timestamp", timestamp)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("classroom-user")
    localStorage.removeItem("classroom-login-timestamp")

    // Preserve user activity data on logout
    // localStorage.removeItem("classroom-chatrooms")
    // localStorage.removeItem("classroom-posts")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}
