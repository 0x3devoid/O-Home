"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import AgentDashboardScreen from "@/screens/AgentDashboardScreen"

export default function AgentVerifyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const currentUser = useStore((state) => state.currentUser)
  const properties = useStore((state) => state.properties)
  const conversations = useStore((state) => state.conversations)
  const scheduledTours = useStore((state) => state.scheduledTours)
  const confirmTour = useStore((state) => state.handleConfirmTour)
  const addConversationMessage = useStore((state) => state.handleSendMessage)

  useEffect(() => {
    // Simulate data loading - in production this would fetch from API
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!currentUser) {
    router.push("/")
    return null
  }

  return (
    <AgentDashboardScreen
      currentUser={currentUser}
      properties={properties}
      conversations={conversations}
      tours={scheduledTours}
      onNavigateToChat={(conversationId) => {
        router.push(`/messages`)
      }}
      onConfirmTour={(tourId, time) => {
        confirmTour(tourId, time)
      }}
    />
  )
}
