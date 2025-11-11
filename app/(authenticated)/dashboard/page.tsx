"use client"

import { useRouter } from "next/navigation"
import AgentDashboardScreen from "@/screens/AgentDashboardScreen"
import { useStore } from "@/lib/store"

export default function DashboardPage() {
  const currentUser = useStore((state) => state.currentUser)
  const properties = useStore((state) => state.properties)
  const conversations = useStore((state) => state.conversations)
  const scheduledTours = useStore((state) => state.scheduledTours)
  const handleConfirmTour = useStore((state) => state.handleConfirmTour)
  const router = useRouter()

  if (!currentUser) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  if (currentUser.agentStatus !== "verified") {
    return <div className="h-screen flex items-center justify-center">Not authorized</div>
  }

  return (
    <AgentDashboardScreen
      currentUser={currentUser}
      properties={properties}
      conversations={conversations}
      tours={scheduledTours}
      onNavigateToChat={(id) => router.push(`/messages?conversation=${id}`)}
      onConfirmTour={handleConfirmTour}
    />
  )
}
