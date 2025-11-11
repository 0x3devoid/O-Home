"use client"

import ProfileScreen from "@/screens/ProfileScreen"
import { useStore } from "@/lib/store"
import { useCallback } from "react"

export default function ProfilePage() {
  const currentUser = useStore((state) => state.currentUser)
  const properties = useStore((state) => state.properties)
  const users = useStore((state) => state.users)
  const viewingProfileId = useStore((state) => state.viewingProfileId)
  const setViewingCommentsFor = useStore((state) => state.setViewingCommentsFor)
  const setVerifyingProperty = useStore((state) => state.setVerifyingProperty)
  const handleMessageLister = useStore((state) => state.handleMessageLister)
  const setViewingProfileId = useStore((state) => state.setViewingProfileId)
  const setViewingNeighborhoodId = useStore((state) => state.setViewingNeighborhoodId)
  const setActiveSettingsScreen = useStore((state) => state.setActiveSettingsScreen)
  const setPostToDelete = useStore((state) => state.setPostToDelete)
  const setViewingStoryUser = useStore((state) => state.setViewingStoryUser)
  const handleShare = useStore((state) => state.handleShare)
  const handleRepost = useStore((state) => state.handleRepost)

  const viewingProfile = users.find((u) => u.id === viewingProfileId)

  const handleMessageListerWrapper = useCallback(
    (lister: any, property: any) => {
      if (currentUser) {
        handleMessageLister(lister, property, currentUser)
      }
    },
    [handleMessageLister, currentUser],
  )

  const handleRepostWrapper = useCallback(
    (property: any, quote?: string) => {
      if (currentUser) {
        handleRepost(property, currentUser, quote)
      }
    },
    [handleRepost, currentUser],
  )

  if (!currentUser) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <ProfileScreen
      user={viewingProfile || currentUser}
      currentUser={currentUser}
      allProperties={properties}
      allUsers={users}
      onToggleFollow={() => {}}
      onViewComments={setViewingCommentsFor}
      onStartVerification={setVerifyingProperty}
      onMessageLister={handleMessageListerWrapper}
      onViewProfile={setViewingProfileId}
      onUpdateProfile={() => {}}
      onViewNeighborhood={setViewingNeighborhoodId}
      onShareToTeam={() => {}}
      onShare={handleShare}
      onRepost={handleRepostWrapper}
      teams={[]}
      onStartDM={() => {}}
      onViewOnMap={() => {}}
      onViewSettings={() => setActiveSettingsScreen("main")}
      onOpenDeleteModal={setPostToDelete}
      onBlockUser={() => {}}
      onViewStory={setViewingStoryUser}
    />
  )
}
