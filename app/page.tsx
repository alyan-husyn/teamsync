"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, UserCheck, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"admin" | "user" | null>(null)
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { user, login, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/content-types")
    } else if (!isLoading && !user) {
      setIsModalOpen(true)
    }
  }, [user, isLoading, router])

  const handleRoleSelect = (role: "admin" | "user") => {
    setSelectedRole(role)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Hardcoded credentials for demo
    const validCredentials = {
      admin: { username: "admin", password: "admin123" },
      user: { username: "user", password: "user123" },
    }

    if (
      selectedRole &&
      credentials.username === validCredentials[selectedRole].username &&
      credentials.password === validCredentials[selectedRole].password
    ) {
      login(selectedRole, credentials.username)
      // Reset states
      setIsModalOpen(false)
      setSelectedRole(null)
      setCredentials({ username: "", password: "" })
      setIsLoggingIn(false)
      router.push("/content-types")
    } else {
      alert("Invalid credentials")
      setIsLoggingIn(false)
    }
  }

  const handleBack = () => {
    setSelectedRole(null)
    setCredentials({ username: "", password: "" })
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render login modal if user is already authenticated
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Dialog open={isModalOpen} onOpenChange={() => {}}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              {selectedRole ? "Sign In" : "Welcome to TeamSync"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {selectedRole
                ? `Sign in as ${selectedRole === "admin" ? "Administrator" : "User"}`
                : "Choose your role to get started"}
            </DialogDescription>
          </DialogHeader>

          {!selectedRole ? (
            <div className="grid grid-cols-1 gap-4 py-4">
              <Card
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleRoleSelect("admin")}
              >
                <CardHeader className="text-center pb-2">
                  <UserCheck className="w-12 h-12 mx-auto mb-2 text-primary" />
                  <CardTitle>Administrator</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center">
                    Create and manage chatrooms, moderate content, and manage users
                  </CardDescription>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleRoleSelect("user")}
              >
                <CardHeader className="text-center pb-2">
                  <Users className="w-12 h-12 mx-auto mb-2 text-primary" />
                  <CardTitle>User</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center">
                    Join chatrooms, post content, and interact with others
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  required
                  disabled={isLoggingIn}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={isLoggingIn}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 bg-transparent"
                  disabled={isLoggingIn}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                {/* <p>Demo credentials:</p>
                <p>Admin: admin / admin123</p>
                <p>User: user / user123</p> */}
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
