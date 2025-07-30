"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Edit, ThumbsUp, MessageCircle, Filter, Send, Paperclip, Check, X, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { ClientTime } from "@/components/client-time"

interface StreamTabProps {
  chatroomId: string
}

export function StreamTab({ chatroomId }: StreamTabProps) {
  const { user } = useAuth()
  const { posts, createPost, updatePost, addReaction, addComment, updatePostStatus } = usePosts()
  const [newPost, setNewPost] = useState({ content: "", tag: "", attachment: "" })
  const [filter, setFilter] = useState({ tag: "all", status: "all" })
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [commentingPost, setCommentingPost] = useState<string | null>(null)
  const [commentContent, setCommentContent] = useState("")
  const [reactionEmoji, setReactionEmoji] = useState("")
  const [reactionPost, setReactionPost] = useState<string | null>(null)

  const chatroomPosts = posts.filter((post) => post.chatroomId === chatroomId)
  const filteredPosts = chatroomPosts.filter((post) => {
    if (filter.tag !== "all" && !post.categories?.includes(filter.tag)) return false
    if (filter.status !== "all" && post.status !== filter.status) return false
    return true
  })

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.content.trim()) {
      createPost({
        chatroomId,
        content: newPost.content,
        categories: newPost.tag ? [newPost.tag] : ["General"],
        attachment: newPost.attachment,
      })
      setNewPost({ content: "", tag: "", attachment: "" })
    }
  }

  const handleEditPost = (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (post) {
      setEditingPost(postId)
      setEditContent(post.content)
    }
  }

  const handleSaveEdit = () => {
    if (editingPost && editContent.trim()) {
      updatePost(editingPost, { content: editContent })
      setEditingPost(null)
      setEditContent("")
    }
  }

  const handleAddReaction = (postId: string) => {
    if (reactionEmoji.trim()) {
      addReaction(postId, reactionEmoji)
      setReactionEmoji("")
      setReactionPost(null)
    }
  }

  const handleAddComment = (postId: string) => {
    if (commentContent.trim()) {
      addComment(postId, commentContent)
      setCommentContent("")
      setCommentingPost(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "needs-work":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-muted text-muted-foreground"
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
    <div className="space-y-6">
      {/* Create Post - Hidden for now */}
      {/* <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Share with your class</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <Textarea
              placeholder="Share something with your class..."
              value={newPost.content}
              onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
              maxLength={500}
              rows={3}
            />
            <div className="flex gap-4">
              <Select value={newPost.tag} onValueChange={(value) => setNewPost((prev) => ({ ...prev, tag: value }))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blog">Blog</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Landing Page">Landing Page</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Add attachment URL..."
                value={newPost.attachment}
                onChange={(e) => setNewPost((prev) => ({ ...prev, attachment: e.target.value }))}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{newPost.content.length}/500 characters</span>
              <Button type="submit" disabled={!newPost.content.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card> */}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
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
        {user?.role === "admin" && (
          <Select value={filter.status} onValueChange={(value) => setFilter((prev) => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="needs-work">Needs Work</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{post.author}</p>
                    <p className="text-sm text-muted-foreground">
                      <ClientTime date={post.createdAt} />
                    </p>
                  </div>
                  <Badge variant="secondary">{post.categories?.[0] || "General"}</Badge>
                  <Badge className={getStatusColor(post.status)}>
                    {getStatusIcon(post.status)}
                    <span className="ml-1 capitalize">{post.status.replace("-", " ")}</span>
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {(user?.username === post.author || user?.role === "admin") && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {user?.username === post.author && (
                          <DropdownMenuItem onClick={() => handleEditPost(post.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {user?.role === "admin" && (
                          <>
                            <DropdownMenuItem onClick={() => updatePostStatus(post.id, "approved")}>
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updatePostStatus(post.id, "rejected")}>
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updatePostStatus(post.id, "needs-work")}>
                              <Clock className="w-4 h-4 mr-2" />
                              Needs Work
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingPost === post.id ? (
                <div className="space-y-4">
                  <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} maxLength={500} />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} size="sm">
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingPost(null)} size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-4">{post.content}</p>
                  {post.attachment && (
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        <a
                          href={post.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {post.attachment}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Reactions */}
                  {post.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.reactions.map((reaction, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {reaction.emoji} {reaction.user}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="space-y-2 mb-4 pl-4 border-l-2 border-muted">
                      {post.comments.map((comment, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{comment.user}:</span> {comment.content}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {user?.username !== post.author && (
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setReactionPost(post.id)}>
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            React
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Reaction</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Label htmlFor="emoji">Emoji</Label>
                            <Input
                              id="emoji"
                              placeholder="Enter emoji (e.g., 👍, ❤️, 😊)"
                              value={reactionEmoji}
                              onChange={(e) => setReactionEmoji(e.target.value)}
                            />
                            <Button onClick={() => handleAddReaction(post.id)} className="w-full">
                              Add Reaction
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setCommentingPost(post.id)}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Comment
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Comment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Write your comment..."
                              value={commentContent}
                              onChange={(e) => setCommentContent(e.target.value)}
                              rows={3}
                            />
                            <Button onClick={() => handleAddComment(post.id)} className="w-full">
                              Add Comment
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground">Be the first to share something with the class!</p>
        </div>
      )}
    </div>
  )
}
