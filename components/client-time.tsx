"use client"

import { formatDistanceToNow } from "date-fns"
import { useClientOnly } from "@/hooks/use-client-only"

interface ClientTimeProps {
  date: Date
  addSuffix?: boolean
}

export function ClientTime({ date, addSuffix = true }: ClientTimeProps) {
  const isClient = useClientOnly()

  if (!isClient) {
    return <span>Loading...</span>
  }

  return <span>{formatDistanceToNow(date, { addSuffix })}</span>
} 