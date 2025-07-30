"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, UserMinus, Users, Crown } from "lucide-react"
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

  const handleRemoveMember = (memberId: string) => {
    if (user?.role === "admin") {
      removeMemberFromChatroom(chatroomId, memberId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Class Members</h3>
          <p className="text-muted-foreground">
            {members.length} member{members.length !== 1 ? "s" : ""} in this chatroom
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                        {member.role === "admin" && <Crown className="w-3 h-3 mr-1" />}
                        {member.role}
                      </Badge>
                      {member.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full" title="Online" />}
                    </div>
                  </div>
                </div>

                {user?.role === "admin" && member.role !== "admin" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="text-destructive">
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove from chatroom
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No members yet</h3>
          <p className="text-muted-foreground">Members will appear here when they join the chatroom</p>
        </div>
      )}
    </div>
  )
}
