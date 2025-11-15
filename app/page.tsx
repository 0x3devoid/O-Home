"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import ErrorBoundary from "@/components/ErrorBoundary"
import { useStore } from "@/lib/store"
import axios from "@/api/axios"
// Dynamically import components to avoid SSR issues
const WelcomeScreen = dynamic(() => import("@/components/WelcomeScreen"), { ssr: false })
const SignUpFlow = dynamic(() => import("@/components/SignUpFlow"), { ssr: false })

type AuthScreen = "welcome" | "signup"

export default function Home() {
  const [authScreen, setAuthScreen] = useState<AuthScreen>("welcome")
  const {  isAuthenticated } = useStore()
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

  const handleSignUpComplete = async () => {
    router.push("/login")

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
