"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Send,
  Paperclip,
  ThumbsUp,
  MessageCircle,
  FileText,
  Check,
  X,
  Clock,
  Trash2,
  Tag,
  X as XIcon,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { ClientTime } from "@/components/client-time"
import ReactSelect, { MultiValue } from "react-select"

interface StreamTabProps {
  chatroomId: string
  chatroom: any
}

interface TagOption {
  value: string
  label: string
  color: string
}

export function StreamTab({ chatroomId, chatroom }: StreamTabProps) {
  const { user } = useAuth()
  const { posts, createPost, updatePost, addReaction, addComment, updatePostStatus, deleteComment } = usePosts()
  const [newPost, setNewPost] = useState({ content: "", tags: [] as TagOption[], attachment: "" })
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [reactionPopup, setReactionPopup] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const emojiCollection = ["👍", "❤️", "😊", "🎉", "🔥", "👏", "💯", "✨", "🚀", "💪", "🤔", "😍"]
  const [commentingPost, setCommentingPost] = useState<string | null>(null)
  const [commentContent, setCommentContent] = useState("")

  const chatroomPosts = posts.filter((post) => post.chatroomId === chatroomId)

  // Tag options for react-select
  const tagOptions: TagOption[] = [
    { value: "Blog", label: "Blog", color: "#3B82F6" },
    { value: "Social", label: "Social", color: "#10B981" },
    { value: "Landing Page", label: "Landing Page", color: "#8B5CF6" },
    { value: "General", label: "General", color: "#6B7280" },
    { value: "Newsletter", label: "Newsletter", color: "#F59E0B" },
    { value: "Portfolio", label: "Portfolio", color: "#6366F1" },
    { value: "E-commerce", label: "E-commerce", color: "#EF4444" },
    { value: "Documentation", label: "Documentation", color: "#14B8A6" },
  ]

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.content.trim()) {
      createPost({
        chatroomId,
        content: newPost.content,
        categories: newPost.tags.length > 0 ? newPost.tags.map(tag => tag.value) : ["General"],
        attachment: newPost.attachment,
      })
      setNewPost({ content: "", tags: [], attachment: "" })
      setShowCreateForm(false)
    }
  }

  const handleCancelCreate = () => {
    setNewPost({ content: "", tags: [], attachment: "" })
    setShowCreateForm(false)
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

  const handleAddReaction = (postId: string, emoji: string) => {
    addReaction(postId, emoji)
    setReactionPopup(null)
  }

  const handleToggleCommentInput = (postId: string) => {
    if (commentingPost === postId) {
      setCommentingPost(null)
      setCommentContent("")
    } else {
      setCommentingPost(postId)
      setCommentContent("")
    }
  }

  const handleAddComment = (postId: string) => {
    if (commentContent.trim()) {
      addComment(postId, commentContent)
      setCommentContent("")
      setCommentingPost(null)
    }
  }

  const handleDeleteComment = (postId: string, commentIndex: number) => {
    deleteComment(postId, commentIndex)
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
        return "text-muted-foreground"
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reactionPopup && !(event.target as Element).closest(".reaction-popup")) {
        setReactionPopup(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [reactionPopup])

  return (
    <div className="flex justify-center flex-col gap-6 px-3 sm:px-4 overflow-x-auto max-w-screen-xl mx-auto">
      {/* Hero Banner */}
      <div className="relative h-48 lg:h-64 rounded-xl overflow-hidden shadow-sm">
        <div
          className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-gray-500"
          style={{
            backgroundImage: `url('/images/classroom-hero1.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/90 via-orange-500/90 to-gray-500/90" />
        </div>
        <div className="absolute inset-0 flex items-center p-6 lg:p-8">
          <div className="text-white">
            <h1 className="text-2xl lg:text-4xl font-light mb-2">{chatroom.name}</h1>
            <p className="text-lg lg:text-xl opacity-90">{chatroom.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Announcement Card or Create Post Form */}
        {!showCreateForm ? (
          <Card className="p-4" style={{
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 1px, rgba(0, 0, 0, 0.05) 0px 2px 2px, rgba(0, 0, 0, 0.05) 0px 4px 4px, rgba(0, 0, 0, 0.05) 0px 8px 8px, rgba(0, 0, 0, 0.05) 0px 10px 10px"
          }}>
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                className="flex-1 text-left text-muted-foreground hover:text-foreground rounded-full px-4 py-3 transition-colors"
                onClick={() => setShowCreateForm(true)}
              >
                Announce something to your class
              </button>
            </div>
          </Card>
        ) : (
          <Card className="p-4" style={{
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 1px, rgba(0, 0, 0, 0.05) 0px 2px 2px, rgba(0, 0, 0, 0.05) 0px 4px 4px, rgba(0, 0, 0, 0.05) 0px 8px 8px, rgba(0, 0, 0, 0.05) 0px 10px 10px"
          }}>
            <form onSubmit={handleCreatePost} className="space-y-3">
              {/* Text Input Area */}
              <div className="min-h-[120px] p-3 bg-background rounded outline-none border-none">
                <Textarea
                  id="post-textarea"
                  placeholder="Announce something to your class"
                  value={newPost.content}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                  maxLength={500}
                  rows={4}
                  className="resize-none border-0 focus:ring-0 focus:outline-none p-0 text-base min-h-[100px] bg-transparent text-foreground placeholder:text-muted-foreground outline-none border-none"
                />
              </div>

              {/* Separator Line */}
              <div className="border-t border-1 border-dark border-primary/40"></div>

              {/* Bottom Section with Attachments and Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                {/* Attachment Options */}
                <div className="flex flex-col sm:flex-row flex-wrap items-start gap-4 w-full md:w-1/2">

                  {/* Multi-select for Ideas/Tags */} 
                  <div className="min-w-[200px] sm:min-w-[250px] md:min-w-[300px]">
                    <ReactSelect
                      options={tagOptions}
                      isMulti
                      placeholder="Select tags..."
                      value={newPost.tags}
                      onChange={(selected) => {
                        const selectedArray = selected ? Array.from(selected) : []
                        setNewPost((prev) => ({ ...prev, tags: selectedArray }))
                      }}
                      className="w-full"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          background: 'hsl(var(--background))',
                          borderColor: state.isFocused ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                          boxShadow: state.isFocused ? '0 0 0 1px hsl(var(--primary))' : 'none',
                          borderRadius: '12px',
                          outline: 'none',
                          border: '0',
                          minHeight: '36px',
                          '&:hover': {
                            borderColor: 'hsl(var(--primary))',
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          background: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                          zIndex: 9999,
                        }),
                        option: (base, state) => ({
                          ...base,
                          background: state.isSelected
                            ? 'hsl(var(--primary))'
                            : state.isFocused
                              ? 'hsl(var(--accent))'
                              : 'transparent',
                          color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                          '&:hover': {
                            background: 'hsl(var(--accent))',
                          },
                        }),
                        multiValue: (base) => ({
                          ...base,
                          background: 'hsl(var(--background))',
                          borderRadius: '8px',
                          border: '1px solid hsl(var(--border))',
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: 'hsl(var(--foreground))',
                          fontWeight: '500',
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          color: 'hsl(var(--muted-foreground))',
                          '&:hover': {
                            background: 'hsl(var(--destructive))',
                            color: 'hsl(var(--destructive-foreground))',
                          },
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: 'hsl(var(--muted-foreground))',
                        }),
                        input: (base) => ({
                          ...base,
                          color: 'hsl(var(--foreground))',
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: 'hsl(var(--foreground))',
                        }),
                        indicatorSeparator: (base) => ({
                          ...base,
                          backgroundColor: 'hsl(var(--border))',
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          color: 'hsl(var(--muted-foreground))',
                          '&:hover': {
                            color: 'hsl(var(--foreground))',
                          },
                        }),
                      }}
                    />
                  </div>

                  {/* Selected Tags */}
                  {newPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 w-full">
                      {newPost.tags.map((tag, index) => (
                        <div
                          key={tag.value}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium break-words"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="truncate">{tag.label}</span>
                          <button
                            onClick={() => {
                              const updatedTags = newPost.tags.filter((_, i) => i !== index)
                              setNewPost((prev) => ({ ...prev, tags: updatedTags }))
                            }}
                            className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors shrink-0"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-12 shrink-0 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancelCreate}
                    className="text-primary hover:text-primary px-0 py-0 h-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!newPost.content.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-8 py-2 rounded-full"
                  >
                    Post
                  </Button>
                </div>
              </div>

            </form>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {chatroomPosts.map((post) => (
            <Card
              key={post.id}
              className="shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Post Header */}
              <div className="flex items-start gap-4 p-6 pb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{post.author}</span>
                    <span className="text-sm text-muted-foreground">
                      posted an update
                    </span>
                    {/* {post.categories && post.categories.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        • {post.categories.join(", ")}
                      </span>
                    )} */}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span><ClientTime date={post.createdAt} /></span>
                    {post.status !== "pending" && (
                      <>
                        <span>•</span>
                        <span className={getStatusColor(post.status)}>
                          {post.status.replace("-", " ").toUpperCase()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground flex-shrink-0"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user?.username === post.author && (
                      <DropdownMenuItem onClick={() => handleEditPost(post.id)}>Edit</DropdownMenuItem>
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
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                {editingPost === post.id ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      maxLength={500}
                    />
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
                    <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                    {/* Categories/Tags Display */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {post.categories.map((category, index) => {
                          const tagOption = tagOptions.find(tag => tag.value === category)
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: tagOption ? `${tagOption.color}20` : '#6B728020',
                                color: tagOption ? tagOption.color : '#6B7280',
                              }}
                            >
                              <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: tagOption ? tagOption.color : '#6B7280' }}
                              />
                              <span className="truncate">{category}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {post.attachment && (
                      <div className="mb-4 p-3 bg-muted rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <a
                            href={post.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm break-all"
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
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 bg-accent text-accent-foreground rounded-full px-3 py-1 text-sm"
                          >
                            {reaction.emoji} <span>{reaction.user}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-3 mb-4 pl-4 border-l-2 border-border">
                        {post.comments.map((comment, index) => (
                          <div key={index} className="flex items-start justify-between group">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm">
                                <span className="font-medium text-foreground">{comment.user}:</span>{" "}
                                <span className="text-muted-foreground">{comment.content}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                <ClientTime date={comment.timestamp} />
                              </span>
                            </div>
                            {user?.username === comment.user && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComment(post.id, index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive p-1 h-auto"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Comment Input */}
                    {commentingPost === post.id && (
                      <div className="mb-4 pl-4 border-l-2 border-primary">
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Write your comment..."
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            rows={2}
                            className="flex-1 text-sm"
                          />
                          <div className="flex flex-col gap-1">
                            <Button
                              onClick={() => handleAddComment(post.id)}
                              disabled={!commentContent.trim()}
                              size="sm"
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                            <Button onClick={() => handleToggleCommentInput(post.id)} variant="outline" size="sm">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReactionPopup(reactionPopup === post.id ? null : post.id)}
                          className="text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          React
                        </Button>

                        {reactionPopup === post.id && (
                          <div className="absolute bottom-full left-0 mb-2 bg-background border border-border rounded-lg shadow-lg p-3 z-50 min-w-max reaction-popup">
                            <div className="grid grid-cols-6 gap-2">
                              {emojiCollection.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleAddReaction(post.id, emoji)}
                                  className="text-xl hover:bg-accent rounded p-1 transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleCommentInput(post.id)}
                        className="text-muted-foreground hover:text-foreground hover:bg-accent"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Comment
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        {chatroomPosts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Be the first to share something with the class!</p>
          </div>
        )}
      </div>
    </div>
  )
}
