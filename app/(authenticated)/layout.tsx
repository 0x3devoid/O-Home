"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import BottomNav from "@/components/layout/BottomNav"
import SideNav from "@/components/layout/SideNav"
import Header from "@/components/layout/Header"
import MobileSideMenu from "@/components/layout/MobileSideMenu"
import VerificationTaskModal from "@/components/verification/VerificationTaskModal"
import PaymentModal from "@/components/chat/PaymentModal"
import AgreementModal from "@/components/chat/AgreementModal"
import TourBookingModal from "@/components/booking/TourBookingModal"
import StoryViewer from "@/components/stories/StoryViewer"
import CommentsModal from "@/components/comments/CommentsModal"
import EnhancedVerificationModal from "@/components/verification/EnhancedVerificationModal"
import NotificationsScreen from "@/screens/NotificationsScreen"
import {
  HomeIcon,
  SearchIcon,
  ChatBubbleIcon,
  UserCircleIcon,
  DashboardIcon,
  ShieldCheckIcon,
} from "@/components/Icons"
import { useStore } from "@/lib/store"
import type { NavItem } from "@/components/layout/types"
import { useMemo } from "react"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const currentUser = useStore((state) => state.currentUser)
  const activeTab = useStore((state) => state.activeTab)
  const setActiveTab = useStore((state) => state.setActiveTab)
  const isMobileMenuOpen = useStore((state) => state.isMobileMenuOpen)
  const setIsMobileMenuOpen = useStore((state) => state.setIsMobileMenuOpen)
  const notifications = useStore((state) => state.notifications)
  const setViewingNotifications = useStore((state) => state.setViewingNotifications)
  const viewingNotifications = useStore((state) => state.viewingNotifications)
  const logout = useStore((state) => state.logout)
  const verifyingProperty = useStore((state) => state.verifyingProperty)
  const setVerifyingProperty = useStore((state) => state.setVerifyingProperty)
  const paymentModalConversation = useStore((state) => state.paymentModalConversation)
  const agreementModalConversation = useStore((state) => state.agreementModalConversation)
  const setPaymentModalConversation = useStore((state) => state.setPaymentModalConversation)
  const setAgreementModalConversation = useStore((state) => state.setAgreementModalConversation)
  const properties = useStore((state) => state.properties)
  const bookingTourFor = useStore((state) => state.bookingTourFor)
  const setBookingTourFor = useStore((state) => state.setBookingTourFor)
  const handleBookTour = useStore((state) => state.handleBookTour)
  const viewingStoryUser = useStore((state) => state.viewingStoryUser)
  const setViewingStoryUser = useStore((state) => state.setViewingStoryUser)
  const users = useStore((state) => state.users)
  const viewingCommentsFor = useStore((state) => state.viewingCommentsFor)
  const setViewingCommentsFor = useStore((state) => state.setViewingCommentsFor)
  const handleAddComment = useStore((state) => state.handleAddComment)
  const handleEnhancedVerification = useStore((state) => state.handleEnhancedVerification)

  useEffect(() => {
    if (!currentUser) {
      router.push("/")
    }
  }, [currentUser, router])

  useEffect(() => {
    // Only initialize data on client side
    if (typeof window !== 'undefined') {
      const initializeData = useStore.getState().initializeData
      initializeData()
    }
  }, [])

  const { sideNavItems, bottomNavItems } = useMemo(() => {
    if (!currentUser) return { sideNavItems: [], bottomNavItems: [] }

    const sideNav: NavItem[] = [
      { tab: "home", label: "Home", icon: HomeIcon },
      { tab: "search", label: "Search", icon: SearchIcon },
      { tab: "verify", label: "Verify", icon: ShieldCheckIcon },
    ]
    if (currentUser.agentStatus === "verified") {
      sideNav.push({ tab: "dashboard", label: "Dashboard", icon: DashboardIcon })
    }
    sideNav.push(
      { tab: "messages", label: "Messages", icon: ChatBubbleIcon },
      { tab: "profile", label: "Profile", icon: UserCircleIcon },
    )

    const bottomNav: NavItem[] = [
      { tab: "home", label: "Home", icon: HomeIcon },
      { tab: "search", label: "Search", icon: SearchIcon },
      { tab: "messages", label: "Messages", icon: ChatBubbleIcon },
      { tab: "profile", label: "Profile", icon: UserCircleIcon },
    ]

    return { sideNavItems: sideNav, bottomNavItems: bottomNav }
  }, [currentUser])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleNotificationClick = (notification: any) => {
    // Mark notification as read
    const markAsRead = useStore.getState().markNotificationAsRead
    markAsRead(notification.id)
    
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'message':
        setActiveTab('messages')
        router.push('/messages')
        break
      case 'like':
      case 'comment':
      case 'repost':
        if (notification.contextId) {
          router.push(`/property/${notification.contextId}`)
        }
        break
      case 'verification':
        setActiveTab('verify')
        router.push('/verify')
        break
      case 'follow':
        // Navigate to user profile
        if (notification.contextId) {
          router.push(`/profile`)
        }
        break
      default:
        // Close notifications
        setViewingNotifications(false)
    }
  }

  const handleBackFromNotifications = () => {
    setViewingNotifications(false)
  }

  // Add test notification for debugging
  useEffect(() => {
    if (notifications.length === 0 && currentUser) {
      const createNotification = useStore.getState().createNotification
      createNotification(
        "Welcome to edQorta! Your account is ready to use.",
        "verification"
      )
    }
  }, [notifications.length, currentUser])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any)
    router.push(`/${tab}`)
  }

  const handleAcceptVerification = () => {
    if (verifyingProperty && currentUser) {
      // Update property status to pending verification
      // In a real app, this would make an API call
      console.log('Accepted verification for property:', verifyingProperty.id)
      setVerifyingProperty(null)
    }
  }

  const handleDeclineVerification = () => {
    setVerifyingProperty(null)
  }

  const handleConfirmPayment = () => {
    if (paymentModalConversation && currentUser) {
      // Process payment logic
      console.log('Payment confirmed for conversation:', paymentModalConversation.id)
      setPaymentModalConversation(null)
    }
  }

  const handleSignAgreement = () => {
    if (agreementModalConversation && currentUser) {
      // Sign agreement logic
      console.log('Agreement signed for conversation:', agreementModalConversation.id)
      setAgreementModalConversation(null)
    }
  }

  if (!currentUser) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="md:flex h-screen bg-white">
      <SideNav activeTab={activeTab} setActiveTab={handleTabChange} navItems={sideNavItems} />
      <MobileSideMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={(tab) => {
          if (tab === "settings") {
            router.push("/settings")
          } else {
            handleTabChange(tab)
          }
          setIsMobileMenuOpen(false)
        }}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      <main className="flex-1 flex flex-col md:overflow-y-hidden pb-16 md:pb-0">
        {viewingNotifications ? (
          <NotificationsScreen
            notifications={notifications}
            onBack={handleBackFromNotifications}
            onNotificationClick={handleNotificationClick}
          />
        ) : (
          <>
            <Header
              title="edQorta"
              unreadCount={notifications.filter((n) => !n.read).length}
              onNotificationClick={() => setViewingNotifications(true)}
              showLogout={false}
              onLogout={handleLogout}
              showBack={false}
              onBack={() => {}}
              onMenuClick={() => setIsMobileMenuOpen(true)}
            />
            <div className="flex-grow overflow-y-auto no-scrollbar border-t border-gray-200">{children}</div>
          </>
        )}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} navItems={bottomNavItems} />
      
      {/* Verification Modal */}
      {verifyingProperty && (
        <VerificationTaskModal
          property={verifyingProperty}
          onAccept={handleAcceptVerification}
          onDecline={handleDeclineVerification}
        />
      )}

      {/* Payment Modal */}
      {paymentModalConversation && (
        <PaymentModal
          isOpen={true}
          onClose={() => setPaymentModalConversation(null)}
          onConfirm={handleConfirmPayment}
          property={properties.find(p => p.id === paymentModalConversation.propertyId)!}
        />
      )}

      {/* Agreement Modal */}
      {agreementModalConversation && (
        <AgreementModal
          isOpen={true}
          onClose={() => setAgreementModalConversation(null)}
          onSign={handleSignAgreement}
          conversation={agreementModalConversation}
          property={properties.find(p => p.id === agreementModalConversation.propertyId)!}
          currentUser={currentUser}
        />
      )}

      {/* Tour Booking Modal */}
      {bookingTourFor && (
        <TourBookingModal
          isOpen={true}
          onClose={() => setBookingTourFor(null)}
          property={bookingTourFor}
          currentUser={currentUser}
          onBookTour={handleBookTour}
        />
      )}

      {/* Story Viewer */}
      {viewingStoryUser && (
        <StoryViewer
          users={users.filter(u => u.stories && u.stories.length > 0)}
          initialUser={viewingStoryUser}
          onClose={() => setViewingStoryUser(null)}
        />
      )}

      {/* Comments Modal */}
      {viewingCommentsFor && currentUser && (
        <CommentsModal
          isOpen={true}
          onClose={() => setViewingCommentsFor(null)}
          property={viewingCommentsFor}
          currentUser={currentUser}
          onAddComment={(text) => handleAddComment(viewingCommentsFor.id, text, currentUser)}
          onLikeComment={(commentId) => {
            // TODO: Implement comment liking
            console.log('Like comment:', commentId);
          }}
        />
      )}

      {/* Enhanced Verification Modal */}
      {verifyingProperty && currentUser && (
        <EnhancedVerificationModal
          isOpen={true}
          onClose={() => setVerifyingProperty(null)}
          property={verifyingProperty}
          currentUser={currentUser}
          onSubmitVerification={handleEnhancedVerification}
        />
      )}
    </div>
  )
}
