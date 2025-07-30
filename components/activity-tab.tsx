"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MessageCircle, ThumbsUp, Check, X, Clock, Filter, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { format, isToday, isYesterday } from "date-fns"
import { ClientTime } from "@/components/client-time"

interface ActivityTabProps {
  chatroomId: string
}

export function ActivityTab({ chatroomId }: ActivityTabProps) {
  const { user } = useAuth()
  const { posts } = usePosts()
  const [filter, setFilter] = useState({ type: "all", tag: "all" })

  // Get all posts in this chatroom
  const chatroomPosts = posts.filter((post) => post.chatroomId === chatroomId)

  // Generate activity items from all posts in the chatroom
  const activities = chatroomPosts.flatMap((post) => {
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

    // Add status updates as activities - show for all statuses
    items.push({
      id: `${post.id}-status-${post.status}`,
      type: "status",
      postId: post.id,
      postTitle: post.content.substring(0, 50) + (post.content.length > 50 ? "..." : ""),
      postTag: post.categories?.[0] || "General",
      user: "Admin",
      content: post.status,
      timestamp: post.updatedAt, // Use the actual update time
    })

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

  // Group activities by date
  const groupedActivities = sortedActivities.reduce(
    (groups, activity) => {
      let dateKey
      if (isToday(activity.timestamp)) {
        dateKey = "Today"
      } else if (isYesterday(activity.timestamp)) {
        dateKey = "Yesterday"
      } else {
        dateKey = format(activity.timestamp, "MMMM d, yyyy")
      }

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(activity)
      return groups
    },
    {} as Record<string, typeof sortedActivities>,
  )

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "reaction":
        return <ThumbsUp className="w-4 h-4" />
      case "comment":
        return <MessageCircle className="w-4 h-4" />
      case "status":
        return <Check className="w-4 h-4" />
      default:
        return null
    }
  }

  const getActivityColor = (type: string, content?: string) => {
    switch (type) {
      case "reaction":
        return "text-primary"
      case "comment":
        return "text-green-600 dark:text-green-400"
      case "status":
        switch (content) {
          case "approved":
            return "text-green-600 dark:text-green-400"
          case "rejected":
            return "text-red-600 dark:text-red-400"
          case "needs-work":
            return "text-yellow-600 dark:text-yellow-400"
          default:
            return "text-muted-foreground"
        }
      default:
        return "text-muted-foreground"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 dark:text-green-400"
      case "rejected":
        return "text-red-600 dark:text-red-400"
      case "needs-work":
        return "text-yellow-600 dark:text-yellow-400"
      case "pending":
        return "text-muted-foreground"
      default:
        return "text-foreground"
    }
  }

  const handleViewPost = (postId: string) => {
    // In a real app, this would scroll to the post in the Stream tab
    console.log("Navigate to post:", postId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Your Activity</h3>
          <p className="text-muted-foreground">Activity on your posts in this chatroom</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <Select value={filter.type} onValueChange={(value) => setFilter((prev) => ({ ...prev, type: value }))}>
          <SelectTrigger className="w-40">
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
          <SelectTrigger className="w-32">
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

      {/* Activity Feed */}
      <div className="space-y-6">
        {Object.entries(groupedActivities).map(([date, activities]) => (
          <div key={date}>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-2">{date}</h4>
            <div className="space-y-3">
              {activities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${getActivityColor(activity.type, activity.content)}`}>
                        {activity.type === "status" ? getStatusIcon(activity.content) : getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{activity.user}</span>
                          <span className="text-sm text-muted-foreground">
                            {activity.type === "reaction" && "reacted to your post"}
                            {activity.type === "comment" && "commented on your post"}
                            {activity.type === "status" && `marked your post as ${activity.content.replace("-", " ")}`}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {activity.postTag}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">"{activity.postTitle}"</p>

                        {activity.type === "reaction" && <div className="text-lg mb-2">{activity.content}</div>}

                        {activity.type === "comment" && (
                          <div className="bg-muted p-2 rounded text-sm mb-2">{activity.content}</div>
                        )}

                        {activity.type === "status" && (
                          <Badge
                            className={
                              activity.content === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : activity.content === "rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }
                          >
                            {getStatusIcon(activity.content)}
                            <span className="ml-1 capitalize">{activity.content.replace("-", " ")}</span>
                          </Badge>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            <ClientTime date={activity.timestamp} />
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPost(activity.postId)}
                            className="text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {sortedActivities.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No activity yet</h3>
          <p className="text-muted-foreground">
            Activity on your posts will appear here when others interact with them
          </p>
        </div>
      )}
    </div>
  )
}
