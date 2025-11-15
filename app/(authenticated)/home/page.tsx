"use client"

import { useMemo, useCallback, useEffect } from "react"
import HomeContainerScreen from "@/screens/HomeContainerScreen"
import { useStore } from "@/lib/store"

export default function HomePage() {
  const currentUser = useStore((state) => state.currentUser)
  const properties = useStore((state) => state.properties)
  const isLoading = useStore((state) => state.isLoading)
  const users = useStore((state) => state.users)
  const neighborhoods = useStore((state) => state.neighborhoods)
  const blockedUserIds = useStore((state) => state.blockedUserIds)
  const setViewingCommentsFor = useStore((state) => state.setViewingCommentsFor)
  const setVerifyingProperty = useStore((state) => state.setVerifyingProperty)
  const handleMessageLister = useStore((state) => state.handleMessageLister)
  const handleCreatePost = useStore((state) => state.handleCreatePost)
  const setViewingProfileId = useStore((state) => state.setViewingProfileId)
  const setViewingNeighborhoodId = useStore((state) => state.setViewingNeighborhoodId)
  const handleAddStory = useStore((state) => state.handleAddStory)
  const setViewingStoryUser = useStore((state) => state.setViewingStoryUser)
  const setPostToDelete = useStore((state) => state.setPostToDelete)
  const handleRefresh = useStore((state) => state.handleRefresh)
  const handleShare = useStore((state) => state.handleShare)
  const handleRepost = useStore((state) => state.handleRepost)

  useEffect(() => {
    console.log(currentUser);
  })

  const feedProperties = useMemo(() => {
    if (!currentUser) return []
    const followedIds = currentUser.followingIds || []
    return properties
      .filter((p) => [...followedIds, currentUser.id].includes(p.lister.id) && !blockedUserIds.includes(p.lister.id))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [properties, currentUser, blockedUserIds])

  const discoverProperties = useMemo(() => {
    return properties
      .filter(
        (p) => !blockedUserIds.includes(p.lister.id) && (p.images.length > 0 || (p.videos && p.videos.length > 0)),
      )
      .sort(() => Math.random() - 0.5)
  }, [properties, blockedUserIds])

  const usersWithStories = useMemo(() => users.filter((user) => user.stories && user.stories.length > 0), [users])

  const handleMessageListerWrapper = useCallback(
    (lister: any, property: any) => {
      if (currentUser) {
        handleMessageLister(lister, property, currentUser)
      }
    },
    [handleMessageLister, currentUser],
  )

  const handleCreatePostWrapper = useCallback(
    async (data: any) => {
      if (currentUser) {
        await handleCreatePost(data, currentUser)
      }
    },
    [handleCreatePost, currentUser],
  )

  const handleAddStoryWrapper = useCallback(
    (file: File) => {
      if (currentUser) {
        handleAddStory(file, currentUser)
      }
    },
    [handleAddStory, currentUser],
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
    <HomeContainerScreen
      feedProperties={feedProperties}
      discoverProperties={discoverProperties}
      currentUser={currentUser}
      isLoading={isLoading}
      onViewComments={setViewingCommentsFor}
      onStartVerification={setVerifyingProperty}
      onMessageLister={handleMessageListerWrapper}
      onCreatePost={handleCreatePostWrapper}
      onViewProfile={setViewingProfileId}
      onViewNeighborhood={setViewingNeighborhoodId}
      usersWithStories={usersWithStories}
      onAddStory={handleAddStoryWrapper}
      onViewStory={setViewingStoryUser}
      onShareToTeam={() => {}}
      onShare={handleShare}
      onRepost={handleRepostWrapper}
      teams={[]}
      onViewOnMap={() => {}}
      onOpenDeleteModal={setPostToDelete}
      onBlockUser={() => {}}
      onRefresh={async () => handleRefresh()}
    />
  )
}
