"use client"

import { useState } from "react"
import SettingsScreenComponent from "@/screens/SettingsScreen"
import EditProfileSettings from "@/screens/settings/EditProfileSettings"
import ChangePasswordSettings from "@/screens/settings/ChangePasswordSettings"
import PrivacySettings from "@/screens/settings/PrivacySettings"
import ReferralDashboardScreen from "@/screens/settings/ReferralDashboardScreen"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"

type SettingScreen = "main" | "editProfile" | "changePassword" | "privacy" | "referral"

export default function SettingsPage() {
  const [screen, setScreen] = useState<SettingScreen>("main")
  const currentUser = useStore((state) => state.currentUser)
  const router = useRouter()

  if (!currentUser) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  const handleClose = () => {
    router.back()
  }

  return (
    <div>
      {screen === "main" && (
        <SettingsScreenComponent
          onClose={handleClose}
          onNavigate={(newScreen) => setScreen(newScreen as SettingScreen)}
        />
      )}
      {screen === "editProfile" && (
        <EditProfileSettings currentUser={currentUser} onUpdateProfile={() => {}} onBack={() => setScreen("main")} />
      )}
      {screen === "changePassword" && <ChangePasswordSettings onBack={() => setScreen("main")} />}
      {screen === "privacy" && <PrivacySettings currentUser={currentUser} onBack={() => setScreen("main")} />}
      {screen === "referral" && <ReferralDashboardScreen currentUser={currentUser} onBack={() => setScreen("main")} />}
    </div>
  )
}
