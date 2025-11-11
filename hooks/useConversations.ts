"use client"

import { useCallback, useMemo } from "react"
import { useStore } from "@/lib/store"

export function useConversations(userId?: number) {
  const conversations = useStore((state) => state.conversations)
  const addConversationMessage = useStore((state) => state.addConversationMessage)
  const updateConversationDealStatus = useStore((state) => state.updateConversationDealStatus)
  const createConversation = useStore((state) => state.createConversation)

  const userConversations = useMemo(() => {
    return userId ? conversations.filter((c) => c.participants.some((p) => p?.id === userId)) : conversations
  }, [conversations, userId])

  const activeConversations = useMemo(() => {
    return userConversations.filter((c) => c.dealStatus !== "complete")
  }, [userConversations])

  const handleSendMessage = useCallback(
    (conversationId: number, text: string, senderId: number) => {
      addConversationMessage(conversationId, {
        id: Date.now(),
        senderName: "",
        text,
        timestamp: new Date(),
        senderId,
      })
    },
    [addConversationMessage],
  )

  return {
    conversations: userConversations,
    activeConversations,
    sendMessage: handleSendMessage,
    updateDealStatus: updateConversationDealStatus,
    createConversation,
  }
}
