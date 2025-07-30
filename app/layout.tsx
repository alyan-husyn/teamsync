import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { ChatroomProvider } from "@/lib/chatroom-context"
import { PostsProvider } from "@/lib/posts-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Collaboration Platform",
  description: "A collaborative platform for ideas and collaboration, and team interaction.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ChatroomProvider>
              <PostsProvider>{children}</PostsProvider>
            </ChatroomProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
