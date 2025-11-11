"use client"

import MessagesScreen from "@/screens/MessagesScreen"
import { useStore } from "@/lib/store"
import { useCallback } from "react"

export default function MessagesPage() {
  const currentUser = useStore((state) => state.currentUser)
  const conversations = useStore((state) => state.conversations)
  const properties = useStore((state) => state.properties)
  const isLoading = useStore((state) => state.isLoading)
  const users = useStore((state) => state.users)
  const searchTeams = useStore((state) => state.searchTeams)
  const setActiveConversationId = useStore((state) => state.setActiveConversationId)
  const activeConversationId = useStore((state) => state.activeConversationId)
  const handleSendMessage = useStore((state) => state.handleSendMessage)
  const handleSendAudioMessage = useStore((state) => state.handleSendAudioMessage)
  const setPaymentModalConversation = useStore((state) => state.setPaymentModalConversation)
  const setAgreementModalConversation = useStore((state) => state.setAgreementModalConversation)
  const setUserToReview = useStore((state) => state.setUserToReview)
  const setSchedulingTourFor = useStore((state) => state.setSchedulingTourFor)

  const handleSendMessageWrapper = useCallback(
    async (id: number, text: string) => {
      if (currentUser) {
        handleSendMessage(id, text, currentUser)
      }
    },
    [handleSendMessage, currentUser],
  )

  const handleSendAudioMessageWrapper = useCallback(
    async (id: number, audio: { url: string; duration: number }) => {
      if (currentUser) {
        handleSendAudioMessage(id, audio, currentUser)
      }
    },
    [handleSendAudioMessage, currentUser],
  )

  if (!currentUser) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <MessagesScreen
      conversations={conversations}
      properties={properties}
      currentUser={currentUser}
      isLoading={isLoading}
      onSelectConversation={setActiveConversationId}
      activeConversationId={activeConversationId}
      onSendMessage={handleSendMessageWrapper}
      onSendAudioMessage={handleSendAudioMessageWrapper}
      onMarkAsRead={() => {}}
      onOpenPaymentModal={setPaymentModalConversation}
      onOpenAgreementModal={setAgreementModalConversation}
      onLeaveReview={setUserToReview}
      searchTeams={searchTeams}
      onAddTeamComment={() => {}}
      users={users}
      onScheduleTour={setSchedulingTourFor}
    />
  )
}
