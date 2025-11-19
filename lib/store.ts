import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type {
  Property,
  Conversation,
  Message,
  User,
  Notification,
  Review,
  Neighborhood,
  Story,
  SearchTeam,
  ScheduledTour,
  TourBooking,
} from "@/types"
import type { NewPropertyData } from "@/components/post/PostForm"
import type { TourBookingData } from "@/components/booking/TourBookingModal"
import {
  conversations as initialConversations,
  properties as initialProperties,
  users as initialUsers,
  neighborhoods as initialNeighborhoods,
  searchTeams as initialSearchTeams,
  scheduledTours as initialTours,
} from "@/data/mockData"

export type Tab = "home" | "search" | "messages" | "profile" | "dashboard" | "verify"
export type SettingsScreenView = "main" | "editProfile" | "changePassword" | "privacy" | "referral" | "closed"

interface AppState {
  // Auth/User state
  currentUser: User | null
  isAuthenticated: boolean
  authToken: string | null

  // Data
  conversations: Conversation[]
  properties: Property[]
  users: User[]
  neighborhoods: Neighborhood[]
  searchTeams: SearchTeam[]
  scheduledTours: ScheduledTour[]
  notifications: Notification[]
  blockedUserIds: number[]

  // UI State
  activeTab: Tab
  activeConversationId: number | null
  viewingCommentsFor: Property | null
  viewingNotifications: boolean
  viewingProfileId: number | null
  verifyingProperty: Property | null
  isCameraViewOpen: boolean
  userToReview: User | null
  viewingNeighborhoodId: number | null
  viewingStoryUser: User | null
  isCreateTeamModalOpen: boolean
  schedulingTourFor: Property | null
  isMobileMenuOpen: boolean
  activeSettingsScreen: SettingsScreenView
  paymentModalConversation: Conversation | null
  agreementModalConversation: Conversation | null
  postToDelete: Property | null
  bookingTourFor: Property | null
  isLoading: boolean
  initialSearchState: { query: string; coords: { lat: number; lng: number }; viewMode: "map" | "list" } | null

  // Auth Actions
  setCurrentUser: (user: User | null, token?: string) => void
  logout: () => void
  hydrateAuth: () => void

  // UI setters and other actions remain the same...
  setActiveTab: (tab: Tab) => void
  setActiveConversationId: (id: number | null) => void
  setViewingCommentsFor: (property: Property | null) => void
  setViewingNotifications: (viewing: boolean) => void
  setViewingProfileId: (id: number | null) => void
  setVerifyingProperty: (property: Property | null) => void
  setIsCameraViewOpen: (open: boolean) => void
  setUserToReview: (user: User | null) => void
  setViewingNeighborhoodId: (id: number | null) => void
  setViewingStoryUser: (user: User | null) => void
  setIsCreateTeamModalOpen: (open: boolean) => void
  setSchedulingTourFor: (property: Property | null) => void
  setIsMobileMenuOpen: (open: boolean) => void
  setActiveSettingsScreen: (screen: SettingsScreenView) => void
  setPaymentModalConversation: (convo: Conversation | null) => void
  setAgreementModalConversation: (convo: Conversation | null) => void
  setPostToDelete: (property: Property | null) => void
  setBookingTourFor: (property: Property | null) => void
  setInitialSearchState: (
    state: { query: string; coords: { lat: number; lng: number }; viewMode: "map" | "list" } | null,
  ) => void

  // Data mutations (keeping existing implementations)
  createNotification: (message: string, type: Notification["type"], contextId?: number) => void
  markNotificationAsRead: (notificationId: number) => void
  handleMessageLister: (lister: User, property: Property, currentUser: User) => void
  handleSendMessage: (conversationId: number, text: string, currentUser: User) => void
  handleSendAudioMessage: (conversationId: number, audio: { url: string; duration: number }, currentUser: User) => void
  handleCreatePost: (data: NewPropertyData, currentUser: User) => void
  handleScheduleTourRequest: (propertyId: number, proposedTimes: string[], currentUser: User) => void
  handleShare: (property: Property) => void
  handleConfirmTour: (tourId: number, time: string) => void
  handleBookTour: (data: TourBookingData) => void
  handleConfirmPayment: () => void
  handleSignAgreement: () => void
  handleReviewSubmit: (rating: number, text: string, userToReview: User, currentUser: User) => void
  handleConfirmDeletePost: () => void
  handleAddStory: (file: File, currentUser: User) => void
  handleRefresh: () => void
  initializeData: () => void
  blockUser: (userId: number) => void
  addConversationMessage: (conversationId: number, message: any) => void
  updateConversationDealStatus: (conversationId: number, status: any) => void
  createConversation: (participants: User[], propertyId?: number) => void
  addProperty: (property: Property) => void
  updateProperty: (propertyId: number, updates: Partial<Property>) => void
  deleteProperty: (propertyId: number) => void
  handleSimplifiedPost: (data: any, currentUser: User) => void
  addComment: (propertyId: number, comment: any) => void
  handleAddComment: (propertyId: number, text: string, currentUser: User) => void
  handleRepost: (property: Property, currentUser: User, quote?: string) => void
  handleEnhancedVerification: (verificationData: any) => void
  togglePropertyLike: (propertyId: number, userId: number) => void
  confirmTour: (tourId: number, time: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      authToken: null,
      conversations: [],
      properties: [],
      users: [],
      neighborhoods: [],
      searchTeams: [],
      scheduledTours: [],
      notifications: [],
      blockedUserIds: [],
      activeTab: "home",
      activeConversationId: null,
      viewingCommentsFor: null,
      viewingNotifications: false,
      viewingProfileId: null,
      verifyingProperty: null,
      isCameraViewOpen: false,
      userToReview: null,
      viewingNeighborhoodId: null,
      viewingStoryUser: null,
      isCreateTeamModalOpen: false,
      schedulingTourFor: null,
      isMobileMenuOpen: false,
      activeSettingsScreen: "closed",
      paymentModalConversation: null,
      agreementModalConversation: null,
      postToDelete: null,
      bookingTourFor: null,
      isLoading: true,
      initialSearchState: null,

      // Auth actions
      setCurrentUser: (user, token) => {
        set({ 
          currentUser: user, 
          isAuthenticated: !!user,
          authToken: token || null
        })
      },

      logout: () => {
        set({ 
          currentUser: null, 
          isAuthenticated: false, 
          authToken: null,
          activeTab: "home" 
        })
        // Clear persisted state
        localStorage.removeItem('edqorta-auth-storage')
      },

      hydrateAuth: () => {
        // This will be called on app initialization to restore auth state
        const state = get()
        if (state.authToken && state.currentUser) {
          set({ isAuthenticated: true })
        }
      },

      // UI setters (keeping existing implementations)
      setActiveTab: (tab) => set({ activeTab: tab }),
      setActiveConversationId: (id) => set({ activeConversationId: id }),
      setViewingCommentsFor: (property) => set({ viewingCommentsFor: property }),
      setViewingNotifications: (viewing) => set({ viewingNotifications: viewing }),
      setViewingProfileId: (id) => set({ viewingProfileId: id }),
      setVerifyingProperty: (property) => set({ verifyingProperty: property }),
      setIsCameraViewOpen: (open) => set({ isCameraViewOpen: open }),
      setUserToReview: (user) => set({ userToReview: user }),
      setViewingNeighborhoodId: (id) => set({ viewingNeighborhoodId: id }),
      setViewingStoryUser: (user) => set({ viewingStoryUser: user }),
      setIsCreateTeamModalOpen: (open) => set({ isCreateTeamModalOpen: open }),
      setSchedulingTourFor: (property) => set({ schedulingTourFor: property }),
      setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setActiveSettingsScreen: (screen) => set({ activeSettingsScreen: screen }),
      setPaymentModalConversation: (convo) => set({ paymentModalConversation: convo }),
      setAgreementModalConversation: (convo) => set({ agreementModalConversation: convo }),
      setPostToDelete: (property) => set({ postToDelete: property }),
      setBookingTourFor: (property) => set({ bookingTourFor: property }),
      setInitialSearchState: (state) => set({ initialSearchState: state }),

      // All other methods remain the same...
      initializeData: () => {
        const initializedUsers = initialUsers
        const currentUser = initializedUsers[0] || null
      },

      createNotification: (message, type, contextId) => {
        const newNotification: Notification = {
          id: Date.now(),
          message,
          timestamp: new Date().toISOString(),
          read: false,
          type,
          contextId,
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }))
      },

      markNotificationAsRead: (notificationId: number) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          ),
        }))
      },

      handleMessageLister: (lister, property, currentUser) => {
        set((state) => {
          const existingConvo = state.conversations.find(
            (c) =>
              c.propertyId === property.id &&
              c.participants.some((p) => p.id === currentUser.id) &&
              c.participants.some((p) => p.id === lister.id),
          )

          if (existingConvo) {
            return {
              activeConversationId: existingConvo.id,
              activeTab: "messages",
            }
          }

          let participants = [currentUser, lister];
          
          if (property.verifier && property.verifier.id !== lister.id && property.verifier.id !== currentUser.id) {
            participants.push(property.verifier);
          }

          const newConvo = {
            id: Date.now(),
            participants,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            propertyId: property.id,
          }

          return {
            conversations: [newConvo, ...state.conversations],
            activeConversationId: newConvo.id,
            activeTab: "messages",
          }
        })
      },

      handleSendMessage: (conversationId, text, currentUser) => {
        const newMessage: Message = {
          id: Date.now(),
          senderId: currentUser.id,
          text,
          timestamp: new Date().toISOString(),
          read: true,
          type: "user",
        }

        set((state) => ({
          conversations: state.conversations.map((convo) => {
            if (convo.id === conversationId) {
              const updatedMessages = convo.messages.map((m) => ({ ...m, read: true }))
              return {
                ...convo,
                messages: [...updatedMessages, newMessage],
              }
            }
            return convo
          }),
        }))
      },

      handleSendAudioMessage: (conversationId, audio, currentUser) => {
        const newMessage: Message = {
          id: Date.now(),
          senderId: currentUser.id,
          audio,
          timestamp: new Date().toISOString(),
          read: true,
          type: "user",
        }

        set((state) => ({
          conversations: state.conversations.map((convo) => {
            if (convo.id === conversationId) {
              const updatedMessages = convo.messages.map((m) => ({ ...m, read: true }))
              return { ...convo, messages: [...updatedMessages, newMessage] }
            }
            return convo
          }),
        }))
      },

      handleCreatePost: (data, currentUser) => {
        let verificationStatus: "unverified" | "pending" | "verified" = "unverified";
        let verifier: User | undefined = undefined;
        
        if (data.postType === 'property' && !data.needsAgent && currentUser.agentStatus === 'verified') {
          verificationStatus = "verified";
          verifier = currentUser;
        }

        const newProperty: Property = {
          id: Date.now(),
          lister: currentUser,
          description: data.description,
          images: data.images.map((file: File) => URL.createObjectURL(file)),
          videos: data.videos.map((file: File) => URL.createObjectURL(file)),
          postType: data.postType,
          likes: 0,
          views: 0,
          reposts: 0,
          saves: 0,
          comments: [],
          timestamp: new Date().toISOString(),
          price: data.price,
          priceInterval: data.priceInterval,
          location: data.location || '',
          beds: data.beds,
          baths: data.baths,
          verificationStatus,
          verifier,
          type: data.type,
          latitude: data.latitude,
          longitude: data.longitude,
          serviceType: data.serviceType,
          
          ...(data.type === 'business' && {
            availableRooms: data.availableRooms,
            totalRooms: data.totalRooms,
            amenities: data.amenities,
            checkInTime: data.checkInTime,
            checkOutTime: data.checkOutTime,
            minimumStay: data.minimumStay,
            bookingType: data.bookingType,
            businessAccount: true,
          }),
        }

        set((state) => ({
          properties: [newProperty, ...state.properties],
        }))
      },

      handleScheduleTourRequest: (propertyId, proposedTimes, currentUser) => {
        set((state) => {
          const property = state.properties.find((p) => p.id === propertyId)
          if (!property) return state

          const agentForTour = property.verifier || property.lister

          const newTour: ScheduledTour = {
            id: Date.now(),
            property,
            renter: currentUser,
            agent: agentForTour,
            proposedTimes,
            status: "pending",
            createdAt: new Date().toISOString(),
          }

          get().createNotification(`${currentUser.fullname} requested a tour for ${property.location}`, "tour", agentForTour.id)

          return {
            scheduledTours: [newTour, ...state.scheduledTours],
            schedulingTourFor: null,
          }
        })
      },

      handleConfirmTour: (tourId, time) => {
        set((state) => {
          const tour = state.scheduledTours.find((t) => t.id === tourId)
          if (!tour) return state

          get().createNotification(
            `Tour for ${tour.property.location} has been confirmed for ${time}`,
            "tour",
            tourId,
          )

          return {
            scheduledTours: state.scheduledTours.map((tour) =>
              tour.id === tourId ? { ...tour, status: "confirmed", confirmedTime: time } : tour,
            ),
          }
        })
      },

      handleBookTour: (data: TourBookingData) => {
        const newTour: TourBooking = {
          id: Date.now(),
          propertyId: data.propertyId,
          listerId: data.listerId,
          requesterId: data.participants.find(p => !data.listerId && !data.agentId) || 0,
          agentId: data.agentId,
          requestedDate: data.requestedDate,
          requestedTime: data.requestedTime,
          message: data.message,
          status: 'pending',
          participants: data.participants,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => {
          const property = state.properties.find((p) => p.id === data.propertyId)
          
          data.participants.forEach(participantId => {
            if (participantId !== state.currentUser?.id) {
              get().createNotification(
                `New tour request for ${property?.location} on ${data.requestedDate} at ${data.requestedTime}`,
                "tour",
                newTour.id,
              )
            }
          })

          return {
            ...state,
            bookingTourFor: null,
          }
        })
      },

      handleConfirmPayment: () => {
        set((state) => {
          if (!state.paymentModalConversation) return state

          const property = state.properties.find((p) => p.id === state.paymentModalConversation!.propertyId)

          get().createNotification(
            `Your payment for ${property?.location} was successful. Please review the agreement.`,
            "deal",
            state.paymentModalConversation.id,
          )

          return {
            conversations: state.conversations.map((c) =>
              c.id === state.paymentModalConversation!.id ? { ...c, dealStatus: "agreement_pending" } : c,
            ),
            paymentModalConversation: null,
          }
        })
      },

      handleSignAgreement: () => {
        set((state) => {
          if (!state.agreementModalConversation) return state

          const property = state.properties.find((p) => p.id === state.agreementModalConversation!.propertyId)

          get().createNotification(
            `Deal for ${property?.location} is complete! Funds have been released to the lister.`,
            "deal",
            state.agreementModalConversation.id,
          )

          return {
            conversations: state.conversations.map((c) =>
              c.id === state.agreementModalConversation!.id ? { ...c, dealStatus: "complete" } : c,
            ),
            agreementModalConversation: null,
          }
        })
      },

      handleReviewSubmit: (rating, text, userToReview, currentUser) => {
        const newReview: Review = {
          id: Date.now(),
          reviewer: currentUser,
          rating,
          text,
          timestamp: new Date().toISOString(),
        }

        get().createNotification(`${currentUser.fullname} left you a ${rating}-star review.`, "deal", userToReview.id)

        set((state) => ({
          users: state.users.map((user) => {
            if (user.id === userToReview.id) {
              return {
                ...user,
                reviews: [...(user.reviews || []), newReview],
              }
            }
            return user
          }),
          userToReview: null,
        }))
      },

      handleConfirmDeletePost: () => {
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== state.postToDelete?.id),
          postToDelete: null,
        }))
      },

      handleAddStory: (file, currentUser) => {
        if (typeof window === 'undefined') return
        
        const newStory: Story = {
          id: Date.now(),
          type: file.type.startsWith("image/") ? "image" : "video",
          url: URL.createObjectURL(file),
          timestamp: new Date().toISOString(),
          duration: 5,
        }

        set((state) => {
          const updatedUsers = state.users.map((user) => {
            if (user.id === currentUser.id) {
              return {
                ...user,
                stories: [newStory, ...(user.stories || [])],
              }
            }
            return user
          })

          const updatedCurrentUser = updatedUsers.find((u) => u.id === currentUser.id)

          return {
            users: updatedUsers,
            viewingStoryUser: updatedCurrentUser || null,
          }
        })
      },

      handleRefresh: () => {
        set((state) => ({
          properties: [...state.properties].sort(() => Math.random() - 0.5),
        }))
      },

      addConversationMessage: (conversationId, message) => {
        set((state) => ({
          conversations: state.conversations.map((convo) =>
            convo.id === conversationId
              ? { ...convo, messages: [...convo.messages, message] }
              : convo
          ),
        }))
      },

      updateConversationDealStatus: (conversationId, status) => {
        set((state) => ({
          conversations: state.conversations.map((convo) =>
            convo.id === conversationId
              ? { ...convo, dealStatus: status }
              : convo
          ),
        }))
      },

      createConversation: (participants, propertyId) => {
        const newConversation = {
          id: Date.now(),
          participants,
          messages: [],
          propertyId,
        }
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
        }))
      },

      addProperty: (property) => {
        set((state) => ({
          properties: [property, ...state.properties],
        }))
      },

      updateProperty: (propertyId, updates) => {
        set((state) => ({
          properties: state.properties.map((property) =>
            property.id === propertyId ? { ...property, ...updates } : property
          ),
        }))
      },

      deleteProperty: (propertyId) => {
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== propertyId),
        }))
      },

      handleSimplifiedPost: (data, currentUser) => {
        const newProperty: Property = {
          id: Date.now(),
          lister: currentUser,
          description: data.description,
          images: data.images.map((file: File) => URL.createObjectURL(file)),
          videos: data.videos.map((file: File) => URL.createObjectURL(file)),
          postType: data.postType,
          likes: 0,
          views: 0,
          reposts: 0,
          saves: 0,
          comments: [],
          timestamp: new Date().toISOString(),
          location: data.location || '',
          price: data.price,
          beds: data.beds,
          baths: data.baths,
          type: data.type,
        }

        set((state) => ({
          properties: [newProperty, ...state.properties],
        }))

        if (currentUser.followingIds && currentUser.followingIds.length > 0) {
          get().createNotification(
            `${currentUser.fullname} posted a new property: ${newProperty.location}`,
            "message",
            newProperty.id,
          )
        }
      },

      addComment: (propertyId, comment) => {
        set((state) => ({
          properties: state.properties.map((property) =>
            property.id === propertyId
              ? { ...property, comments: [...property.comments, comment] }
              : property
          ),
        }))
      },

      handleAddComment: (propertyId, text, currentUser) => {
        const newComment = {
          id: Date.now(),
          user: currentUser,
          text,
          timestamp: new Date().toISOString(),
        }

        get().addComment(propertyId, newComment)

        const property = get().properties.find((p) => p.id === propertyId)
        if (property && property.lister.id !== currentUser.id) {
          get().createNotification(
            `${currentUser.fullname} commented on your property: ${property.location}`,
            "comment",
            propertyId,
          )
        }
      },

      handleShare: async (property) => {
        const shareUrl = `https://edqorta.com/property/${property.id}`
        const shareData = {
          title: `Check out this property on edQorta`,
          text: `${property.description?.substring(0, 100)}... at ${property.location}`,
          url: shareUrl,
        }

        try {
          if (navigator.share) {
            await navigator.share(shareData)
          } else {
            await navigator.clipboard.writeText(shareData.url)
            alert('Link copied to clipboard!')
          }
        } catch (err) {
          console.error('Share failed:', err)
          try {
            await navigator.clipboard.writeText(shareData.url)
            alert('Sharing not available. Link copied to clipboard!')
          } catch (clipboardErr) {
            console.error('Clipboard write failed:', clipboardErr)
            alert('Sharing and copying failed. Please copy the link manually.')
          }
        }
      },

      handleRepost: (property, currentUser, quote) => {
        const repostProperty: Property = {
          id: Date.now(),
          lister: currentUser,
          description: quote || property.description,
          images: property.images,
          videos: property.videos,
          postType: 'property',
          likes: 0,
          views: 0,
          reposts: 0,
          saves: 0,
          comments: [],
          timestamp: new Date().toISOString(),
          location: property.location,
          price: property.price,
          beds: property.beds,
          baths: property.baths,
          type: property.type,
          originalPostId: property.id,
        };

        set((state) => ({
          properties: [repostProperty, ...state.properties],
        }));

        if (property.lister.id !== currentUser.id) {
          get().createNotification(
            `${currentUser.fullname} reposted your property: ${property.location}`,
            "repost",
            property.id,
          );
        }
      },

      handleEnhancedVerification: (verificationData) => {
        set((state) => ({
          properties: state.properties.map((property) => {
            if (property.id === verificationData.propertyId) {
              return {
                ...property,
                verificationStatus: 'pending',
                verificationData: {
                  ...verificationData,
                  submittedAt: new Date().toISOString(),
                  status: 'pending'
                }
              }
            }
            return property
          })
        }))

        const property = get().properties.find((p) => p.id === verificationData.propertyId)
        if (property) {
          get().createNotification(
            `Verification submitted for your property: ${property.location}`,
            "verification",
            verificationData.propertyId,
          )
        }
      },

      togglePropertyLike: (propertyId, userId) => {
        set((state) => ({
          properties: state.properties.map((property) => {
            if (property.id === propertyId) {
              const likes = property.likes + 1
              return { ...property, likes }
            }
            return property
          }),
          users: state.users.map((user) => {
            if (user.id === userId) {
              const likedPropertyIds = user.likedPropertyIds || []
              const isLiked = likedPropertyIds.includes(propertyId)
              if (isLiked) {
                return {
                  ...user,
                  likedPropertyIds: likedPropertyIds.filter((id) => id !== propertyId),
                }
              } else {
                return {
                  ...user,
                  likedPropertyIds: [...likedPropertyIds, propertyId],
                }
              }
            }
            return user
          }),
        }))
      },

      confirmTour: (tourId, time) => {
        set((state) => ({
          scheduledTours: state.scheduledTours.map((tour) =>
            tour.id === tourId ? { ...tour, confirmedTime: time, status: 'confirmed' as const } : tour
          ),
        }))
      },

      blockUser: (userId) => {
        set((state) => ({
          blockedUserIds: [...state.blockedUserIds, userId],
        }))
      },
    }),
    {
      name: 'edqorta-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        authToken: state.authToken,
      }),
    }
  )
)