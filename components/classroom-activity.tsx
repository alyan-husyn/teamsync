"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageCircle,
  ThumbsUp,
  Check,
  X,
  Clock,
  Filter,
  ExternalLink,
  ActivityIcon as Assignment,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { ClientTime } from "@/components/client-time"

interface ActivityTabProps {
  chatroomId: string
}

export function ActivityTab({ chatroomId }: ActivityTabProps) {
  const { user } = useAuth()
  const { posts } = usePosts()
  const [filter, setFilter] = useState({ type: "all", tag: "all" })

  // Get user's posts in this chatroom
  const userPosts = posts.filter((post) => post.chatroomId === chatroomId && post.author === user?.username)

  // Generate activity items from user's posts
  const activities = userPosts.flatMap((post) => {
    const items = []

    // Add reactions as activities
    post.reactions.forEach((reaction, index) => {
      items.push({
        id: `${post.id}-reaction-${reaction.user}-${reaction.emoji}`,
        type: "reaction",
        postId: post.id,
        postTitle: post.content.substring(0, 50) + (post.content.length > 50 ? "..." : ""),
        postTag: post.categories?.[0] || "General",
        user: reaction.user,
        content: reaction.emoji,
        timestamp: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000), // Predictable time based on index
      })
    })

    // Add comments as activities
    post.comments.forEach((comment, index) => {
      items.push({
        id: `${post.id}-comment-${comment.user}`,
        type: "comment",
        postId: post.id,
        postTitle: post.content.substring(0, 50) + (post.content.length > 50 ? "..." : ""),
        postTag: post.categories?.[0] || "General",
        user: comment.user,
        content: comment.content,
        timestamp: new Date(Date.now() - (index + 2) * 24 * 60 * 60 * 1000), // Predictable time based on index
      })
    })

    // Add status updates as activities
    if (post.status !== "pending") {
      items.push({
        id: `${post.id}-status-${post.status}`,
        type: "status",
        postId: post.id,
        postTitle: post.content.substring(0, 50) + (post.content.length > 50 ? "..." : ""),
        postTag: post.categories?.[0] || "General",
        user: "Admin",
        content: post.status,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Predictable time
      })
    }

    return items
  })

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    if (filter.type !== "all" && activity.type !== filter.type) return false
    if (filter.tag !== "all" && activity.postTag !== filter.tag) return false
    return true
  })

  // Sort by timestamp (newest first)
  const sortedActivities = filteredActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "reaction":
        return <ThumbsUp className="w-4 h-4" />
      case "comment":
        return <MessageCircle className="w-4 h-4" />
      case "status":
        return <Assignment className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="w-3 h-3" />
      case "rejected":
        return <X className="w-3 h-3" />
      case "needs-work":
        return <Clock className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <div className="flex justify-center flex-col gap-6 px-3 sm:px-4 overflow-x-auto max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-4">
        {/* Header */}
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-normal text-foreground mb-1 sm:mb-0">
            Recent Activity
          </h2>
        </div>

        {/* Filters */} 
        <Card className="p-3 sm:p-4 shadow-sm w-full sm:w-auto border-0 outline-none" >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Select value={filter.type} onValueChange={(value) => setFilter((prev) => ({ ...prev, type: value }))}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activity</SelectItem>
                  <SelectItem value="reaction">Reactions</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="status">Status Updates</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filter.tag} onValueChange={(value) => setFilter((prev) => ({ ...prev, tag: value }))}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  <SelectItem value="Blog">Blog</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Landing Page">Landing Page</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>



      {/* Activity Feed */}
      <div className="space-y-3 sm:space-y-4">
        {sortedActivities.map((activity) => (
          <Card
            key={activity.id}
            className="shadow-sm border-0 outline-none"
          >
            <div className="p-3 sm:p-4 m-0">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {activity.user.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm sm:text-base">
                        {activity.user}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {activity.type === "reaction" && "reacted to your post"}
                      {activity.type === "comment" && "commented on your post"}
                      {activity.type === "status" && `marked your post as ${activity.content.replace("-", " ")}`}
                    </span>
                    <Badge variant="outline" className="text-xs w-fit">
                      {activity.postTag}
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 bg-muted p-2 rounded break-words">
                    "{activity.postTitle}"
                  </p>

                  {activity.type === "reaction" && <div className="text-xl sm:text-2xl mb-2">{activity.content}</div>}

                  {activity.type === "comment" && (
                    <div className="bg-muted border p-2 sm:p-3 rounded text-xs sm:text-sm mb-2 break-words">
                      {activity.content}
                    </div>
                  )}

                  {activity.type === "status" && (
                    <Badge
                      className={
                        activity.content === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : activity.content === "rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                      }
                    >
                      {getStatusIcon(activity.content)}
                      <span className="ml-1 capitalize">{activity.content.replace("-", " ")}</span>
                    </Badge>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 sm:mt-3 pt-2 border-t border-border gap-2 sm:gap-0">
                    <span className="text-xs text-muted-foreground">
                      <ClientTime date={activity.timestamp} />
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary text-xs justify-start sm:justify-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sortedActivities.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Assignment className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-medium mb-2">No activity yet</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Activity on your posts will appear here when others interact with them
          </p>
        </div>
      )}
    </div>
  )
}
