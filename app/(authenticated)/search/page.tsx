"use client"

import SearchScreen from "@/screens/SearchScreen"
import { useStore } from "@/lib/store"

export default function SearchPage() {
  const currentUser = useStore((state) => state.currentUser)
  const properties = useStore((state) => state.properties)
  const neighborhoods = useStore((state) => state.neighborhoods)
  const blockedUserIds = useStore((state) => state.blockedUserIds)
  const setViewingNeighborhoodId = useStore((state) => state.setViewingNeighborhoodId)
  const setIsCreateTeamModalOpen = useStore((state) => state.setIsCreateTeamModalOpen)
  const handleMessageLister = useStore((state) => state.handleMessageLister)

  if (!currentUser) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <SearchScreen
      currentUser={currentUser}
      allProperties={properties.filter((p) => !blockedUserIds.includes(p.lister.id))}
      allNeighborhoods={neighborhoods}
      onViewNeighborhood={setViewingNeighborhoodId}
      onOpenCreateTeam={() => setIsCreateTeamModalOpen(true)}
      initialState={null}
      onClearInitialState={() => {}}
      onMessageLister={handleMessageLister}
    />
  )
}
