"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FlipVerticalIcon as MoreVert, UserMinus, Crown, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useChatrooms } from "@/lib/chatroom-context"

interface PeopleTabProps {
  chatroomId: string
}

export function PeopleTab({ chatroomId }: PeopleTabProps) {
  const { user } = useAuth()
  const { chatrooms, removeMemberFromChatroom } = useChatrooms()

  const chatroom = chatrooms.find((c) => c.id === chatroomId)
  const members = chatroom?.members || []
  const teachers = members.filter((m) => m.role === "admin")
  const students = members.filter((m) => m.role === "user")

  const handleRemoveMember = (memberId: string) => {
    if (user?.role === "admin") {
      removeMemberFromChatroom(chatroomId, memberId)
    }
  }

  return (
    <div className="flex justify-center flex-col gap-6 px-3 sm:px-4 overflow-x-auto max-w-screen-xl mx-auto">
      {/* Teachers Section */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-normal text-foreground">Teachers</h2>
          <span className="text-sm text-muted-foreground">{teachers.length}</span>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {teachers.map((teacher) => (
            <Card
              key={teacher.id}
              className="p-3 sm:p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-lg">
                      {teacher.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm sm:text-base truncate">
                        {teacher.name}
                      </h3>
                      <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Administrator</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground w-8 h-8 sm:w-10 sm:h-10"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground w-8 h-8 sm:w-10 sm:h-10"
                      >
                        <MoreVert className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Send email</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Students Section */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-normal text-foreground">Students</h2>
          <span className="text-sm text-muted-foreground">{students.length}</span>
        </div>

        <div className="grid gap-y-0 border-0 outline-none">
          {students.map((student) => (
            <Card key={student.id} style={{ borderBottom: "1px solid #aaa", borderRadius: "0" }} className="border-b border-black p-3 sm:p-4 border-0 outline-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm sm:text-lg">
                      {student.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-base truncate">
                      {student.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Student</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground w-8 h-8 sm:w-10 sm:h-10"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>

                  {user?.role === "admin" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground w-8 h-8 sm:w-10 sm:h-10"
                        >
                          <MoreVert className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Send email</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRemoveMember(student.id)} className="text-destructive">
                          <UserMinus className="w-4 h-4 mr-2" />
                          Remove from class
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {members.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-medium mb-2">No members yet</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Members will appear here when they join the class
          </p>
        </div>
      )}
    </div>
  )
}
