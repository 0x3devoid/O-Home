"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import HomeScreen from "./HomeScreen"
import DiscoverScreen from "./DiscoverScreen"
import type { Property, User, SearchTeam } from "../types"
import type { NewPropertyData } from "../components/post/PostForm"
import PullToRefresh from "../components/common/PullToRefresh"

interface HomeContainerScreenProps {
  feedProperties: Property[]
  discoverProperties: Property[]
  currentUser: User
  isLoading: boolean
  onViewComments: (property: Property) => void
  onStartVerification: (property: Property) => void
  onMessageLister: (lister: User, property: Property) => void
  onCreatePost: (data: NewPropertyData) => Promise<void>
  onViewProfile: (userId: number) => void
  onViewNeighborhood: (neighborhoodId: number) => void
  usersWithStories: User[]
  onAddStory: (file: File) => void
  onViewStory: (user: User) => void
  onShareToTeam: (teamId: number, property: Property) => void
  onShare: (property: Property) => void
  onRepost: (property: Property, quote?: string) => void
  teams: SearchTeam[]
  onViewOnMap: (property: Property) => void
  onOpenDeleteModal: (property: Property) => void
  onBlockUser: (userId: number) => void
  onRefresh: () => Promise<any>
}

const HomeContainerScreen: React.FC<HomeContainerScreenProps> = (props) => {
  const [activeView, setActiveView] = useState<"feed" | "discover">("feed")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleSwitchView = (view: "feed" | "discover") => {
    if (scrollContainerRef.current) {
      const screenWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: view === "feed" ? 0 : screenWidth,
        behavior: "smooth",
      })
    }
    setActiveView(view)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, offsetWidth } = scrollContainerRef.current
        if (scrollLeft < offsetWidth / 2) {
          setActiveView("feed")
        } else {
          setActiveView("discover")
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const { feedProperties, discoverProperties, onRefresh, ...rest } = props

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-30 border-b border-gray-200">
        <div className="flex justify-center items-center gap-8 p-3">
          <button
            onClick={() => handleSwitchView("feed")}
            className={`font-bold transition-colors ${activeView === "feed" ? "text-violet-600" : "text-gray-400"}`}
          >
            For You
            {activeView === "feed" && <div className="w-full h-1 bg-violet-600 rounded-full mt-1"></div>}
          </button>
          <button
            onClick={() => handleSwitchView("discover")}
            className={`font-bold transition-colors ${activeView === "discover" ? "text-violet-600" : "text-gray-400"}`}
          >
            Discover
            {activeView === "discover" && <div className="w-full h-1 bg-violet-600 rounded-full mt-1"></div>}
          </button>
        </div>
      </header>

      <main ref={scrollContainerRef} className="flex-1 flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar">
        <div className="w-full flex-shrink-0 snap-start h-full">
          <PullToRefresh onRefresh={onRefresh} className="h-full">
            <HomeScreen properties={feedProperties} {...rest} />
          </PullToRefresh>
        </div>
        <div className="w-full flex-shrink-0 snap-start h-full">
          <PullToRefresh onRefresh={onRefresh} className="h-full">
            <DiscoverScreen
              properties={discoverProperties}
              currentUser={props.currentUser}
              onViewComments={props.onViewComments}
              onShare={props.onShare}
            />
          </PullToRefresh>
        </div>
      </main>
    </div>
  )
}

export default HomeContainerScreen
