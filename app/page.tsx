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
  const [isClient, setIsClient] = useState(false)
  const { isAuthenticated, hydrateAuth } = useStore()
  const router = useRouter()

  // Set client-side flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Hydrate auth state from localStorage on mount
  useEffect(() => {
    if (isClient) {
      hydrateAuth()
    }
  }, [isClient, hydrateAuth])

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isClient && isAuthenticated) {
      router.push("/home")
    }
  }, [isClient, isAuthenticated, router])

  const handleStartSignUp = () => {
    setAuthScreen("signup")
  }

  const handleSignUpComplete = async () => {
    router.push("/login")
  }

  const handleBackToWelcome = () => {
    setAuthScreen("welcome")
  }

  // Don't render until we're on the client
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // Don't render if authenticated (will redirect)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Redirecting...</div>
      </div>
    )
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