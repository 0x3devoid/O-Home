"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import ErrorBoundary from "@/components/ErrorBoundary"
import { useStore } from "@/lib/store"

// Dynamically import components to avoid SSR issues
const WelcomeScreen = dynamic(() => import("@/components/WelcomeScreen"), { ssr: false })
const SignUpFlow = dynamic(() => import("@/components/SignUpFlow"), { ssr: false })

type AuthScreen = "welcome" | "signup"

export default function Home() {
  const [authScreen, setAuthScreen] = useState<AuthScreen>("welcome")
  const { setCurrentUser, isAuthenticated } = useStore()
  const router = useRouter()

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home")
    }
  }, [isAuthenticated, router])

  const handleStartSignUp = () => {
    setAuthScreen("signup")
  }

  const handleSignUpComplete = () => {
    // Create a mock user for demo purposes
    const mockUser = {
      id: Date.now(),
      name: 'New User',
      username: 'new_user',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      accountType: 'personal' as const,
      agentStatus: 'none' as const,
      listerStatus: 'unverified' as const,
      bio: '',
      location: '',
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      followerIds: [],
      followingIds: [],
      ratings: "0",
      trustScore: 0,
      feedbacksCount: 0,
      likedPropertyIds: [],
      reviews: [],
      stories: []
    }
    // Set user in store
    setCurrentUser(mockUser)
    // Redirect to home page
    router.push("/home")
  }

  const handleBackToWelcome = () => {
    setAuthScreen("welcome")
  }

  const renderContent = () => {
    if (authScreen === "welcome") {
      return <WelcomeScreen onStartSignUp={handleStartSignUp} />
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="h-screen w-full max-w-md md:h-auto md:max-h-[750px] bg-white md:rounded-2xl md:shadow-lg">
          <SignUpFlow onComplete={handleSignUpComplete} onBack={handleBackToWelcome} />
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 text-gray-800">{renderContent()}</div>
    </ErrorBoundary>
  )
}
