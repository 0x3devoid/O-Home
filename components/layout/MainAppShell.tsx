import React, { useState, useEffect, useMemo, useCallback } from 'react';
import BottomNav from './BottomNav';
import SideNav from './SideNav';
import Header from './Header';
import HomeContainerScreen from '../../screens/HomeContainerScreen';
import SearchScreen from '../../screens/SearchScreen';
import MessagesScreen from '../../screens/MessagesScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import CommentsScreen from '../../screens/CommentsScreen';
import NotificationsScreen from '../../screens/NotificationsScreen';
import VerificationTaskModal from '../verification/VerificationTaskModal';
import VerificationCameraView from '../verification/VerificationCameraView';
import ReviewModal from '../profile/ReviewModal';
import AgentDashboardScreen from '../../screens/AgentDashboardScreen';
import NeighborhoodHubScreen from '../../screens/NeighborhoodHubScreen';
import StoryViewer from '../stories/StoryViewer';
import CreateTeamModal from '../teams/CreateTeamModal';
import SettingsScreen from '../../screens/SettingsScreen';
import PaymentModal from '../chat/PaymentModal';
import AgreementModal from '../chat/AgreementModal';
import ConfirmationModal from '../common/ConfirmationModal';
import EditProfileSettings from '../../screens/settings/EditProfileSettings';
import ChangePasswordSettings from '../../screens/settings/ChangePasswordSettings';
import PrivacySettings from '../../screens/settings/PrivacySettings';
import ReferralDashboardScreen from '../../screens/settings/ReferralDashboardScreen';
import TourSchedulingModal from '../tours/TourSchedulingModal';
import VerifyScreen from '../../screens/VerifyScreen';
import MobileSideMenu from './MobileSideMenu';
import { Property, Conversation, Message, User, Notification, Review, Neighborhood, Story, SearchTeam, SharedProperty, TeamComment, Answer, Question, ScheduledTour } from '../../types';
import { conversations as initialConversations, properties as initialProperties, users as initialUsers, currentUserId, neighborhoods as initialNeighborhoods, searchTeams as initialSearchTeams, scheduledTours as initialTours } from '../../data/mockData';
import { NewPropertyData } from '../post/PostForm';
import { HomeIcon, SearchIcon, ChatBubbleIcon, UserCircleIcon, DashboardIcon, ShieldCheckIcon } from '../Icons';
import { logger } from '../../utils/logger';

interface MainAppShellProps {
  onLogout: () => void;
}

export type Tab = 'home' | 'search' | 'messages' | 'profile' | 'dashboard' | 'verify';
export type SettingsScreenView = 'main' | 'editProfile' | 'changePassword' | 'privacy' | 'referral' | 'closed';

interface NavItem {
  tab: Tab;
  label: string;
  icon: React.ElementType;
}

interface InitialSearchState {
    query: string;
    coords: { lat: number; lng: number };
    viewMode: 'map' | 'list';
}

const MainAppShell: React.FC<MainAppShellProps> = ({ onLogout }) => {
  logger.log('Component:MainAppShell', 'Component rendering or re-rendering.');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [searchTeams, setSearchTeams] = useState<SearchTeam[]>([]);
  const [scheduledTours, setScheduledTours] = useState<ScheduledTour[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [viewingCommentsFor, setViewingCommentsFor] = useState<Property | null>(null);
  const [viewingNotifications, setViewingNotifications] = useState(false);
  const [viewingProfileId, setViewingProfileId] = useState<number | null>(null);
  
  const [verifyingProperty, setVerifyingProperty] = useState<Property | null>(null);
  const [isCameraViewOpen, setIsCameraViewOpen] = useState(false);
  const [userToReview, setUserToReview] = useState<User | null>(null);
  const [viewingNeighborhoodId, setViewingNeighborhoodId] = useState<number | null>(null);
  const [viewingStoryUser, setViewingStoryUser] = useState<User | null>(null);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [initialSearchState, setInitialSearchState] = useState<InitialSearchState | null>(null);
  const [schedulingTourFor, setSchedulingTourFor] = useState<Property | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // New state for screens and modals
  const [activeSettingsScreen, setActiveSettingsScreen] = useState<SettingsScreenView>('closed');
  const [paymentModalConversation, setPaymentModalConversation] = useState<Conversation | null>(null);
  const [agreementModalConversation, setAgreementModalConversation] = useState<Conversation | null>(null);
  const [postToDelete, setPostToDelete] = useState<Property | null>(null);
  const [blockedUserIds, setBlockedUserIds] = useState<number[]>([]);

  // Memoized current user
  const currentUser = useMemo(() => users.find(u => u.id === currentUserId), [users]);

  useEffect(() => {
    logger.log('Component:MainAppShell', 'Mounted. Starting data load simulation.');
    const timer = setTimeout(() => {
        logger.log('Component:MainAppShell', 'Data load simulation finished. Updating state.');
        setProperties(initialProperties);
        setConversations(initialConversations);
        setUsers(initialUsers);
        setNeighborhoods(initialNeighborhoods);
        setSearchTeams(initialSearchTeams);
        setScheduledTours(initialTours);
        setIsLoading(false);
        logger.log('Component:MainAppShell', 'State updated with initial data.');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const createNotification = (message: string, type: Notification['type'], contextId?: number) => {
    const newNotification: Notification = { id: Date.now(), message, timestamp: new Date().toISOString(), read: false, type, contextId };
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  const handleMessageLister = (lister: User, property: Property) => {
    if (!currentUser) return;
    const existingConvo = conversations.find(c => 
        c.propertyId === property.id &&
        c.participants.some(p => p.id === currentUser.id) &&
        c.participants.some(p => p.id === lister.id)
    );

    if (existingConvo) {
        setActiveConversationId(existingConvo.id);
    } else {
        const newConvo: Conversation = {
            id: Date.now(),
            participants: [currentUser, lister],
            messages: [{
                id: Date.now(),
                senderId: currentUser.id,
                text: `Hi, I'm interested in your property at ${property.location}.`,
                timestamp: new Date().toISOString(),
                read: false,
                type: 'user',
            }],
            propertyId: property.id,
        };
        setConversations(prev => [newConvo, ...prev]);
        setActiveConversationId(newConvo.id);
    }
    setActiveTab('messages');
  };

  const handleSendMessage = async (conversationId: number, text: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      read: true, // It's read by the sender
      type: 'user',
    };

    setConversations(prev =>
      prev.map(convo => {
        if (convo.id === conversationId) {
          // Mark previous messages as read
          const updatedMessages = convo.messages.map(m => ({ ...m, read: true }));
          return {
            ...convo,
            messages: [...updatedMessages, newMessage],
          };
        }
        return convo;
      })
    );
  };
  
  const handleSendAudioMessage = async (conversationId: number, audio: { url: string; duration: number }) => {
    if (!currentUser) return;
    const newMessage: Message = {
        id: Date.now(),
        senderId: currentUser.id,
        audio,
        timestamp: new Date().toISOString(),
        read: true,
        type: 'user',
    };
    setConversations(prev =>
        prev.map(convo => {
            if (convo.id === conversationId) {
                const updatedMessages = convo.messages.map(m => ({ ...m, read: true }));
                return { ...convo, messages: [...updatedMessages, newMessage] };
            }
            return convo;
        })
    );
  };

  const handleCreatePost = async (data: NewPropertyData) => {
    if (!currentUser) return;

    const newProperty: Property = {
        id: Date.now(),
        lister: currentUser,
        description: data.description,
        images: data.images.map(file => URL.createObjectURL(file)),
        videos: data.videos.map(file => URL.createObjectURL(file)),
        postType: data.postType,
        likes: 0,
        comments: [],
        reposts: 0,
        timestamp: new Date().toISOString(),
        views: 0,
        
        // Property-specific fields
        price: data.price,
        priceInterval: data.priceInterval,
        location: data.location,
        beds: data.beds,
        baths: data.baths,
        verificationStatus: 'unverified',
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude,
    };

    setProperties(prev => [newProperty, ...prev]);
  };


  const handleScheduleTour = (property: Property) => {
    setSchedulingTourFor(property);
  };

  const handleScheduleTourRequest = (propertyId: number, proposedTimes: string[]) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property || !currentUser) return;

    // Use the verifier if they exist, otherwise fall back to the lister.
    const agentForTour = property.verifier || property.lister;

    const newTour: ScheduledTour = {
      id: Date.now(),
      property,
      renter: currentUser,
      agent: agentForTour,
      proposedTimes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setScheduledTours(prev => [newTour, ...prev]);
    createNotification(`${currentUser.name} requested a tour for ${property.location}`, 'tour', agentForTour.id);
    setSchedulingTourFor(null);
    alert('Tour request sent!');
  };

  const handleConfirmTour = (tourId: number, time: string) => {
    let conversationToUpdate: Conversation | undefined;
    const tourToConfirm = scheduledTours.find(tour => tour.id === tourId);
    if (!tourToConfirm) return;

    setScheduledTours(prev => prev.map(tour => {
      if (tour.id === tourId) {
        createNotification(`Your tour for ${tour.property.location} is confirmed for ${new Date(time).toLocaleDateString()}`, 'tour', tour.renter.id);
        conversationToUpdate = conversations.find(c => 
            c.propertyId === tour.property.id &&
            c.participants.some(p => p.id === tour.renter.id)
        );
        return { ...tour, status: 'confirmed', confirmedTime: time };
      }
      return tour;
    }));

    if (conversationToUpdate) {
        const agent = tourToConfirm.agent;
        if (agent && !conversationToUpdate.participants.some(p => p.id === agent.id)) {
            setConversations(prev => prev.map(convo => {
                if (convo.id === conversationToUpdate!.id) {
                    return {
                        ...convo,
                        participants: [...convo.participants, agent],
                        messages: [
                            ...convo.messages,
                            {
                                id: Date.now(),
                                senderId: 0,
                                text: `${agent.name} (Agent) has joined the conversation to coordinate the tour.`,
                                timestamp: new Date().toISOString(),
                                read: true,
                                type: 'system'
                            }
                        ]
                    };
                }
                return convo;
            }));
        }
    }
  };

  const handleConfirmPayment = () => {
    if (!paymentModalConversation) return;

    setConversations(prev => prev.map(c => 
        c.id === paymentModalConversation.id 
            ? { ...c, dealStatus: 'agreement_pending' } 
            : c
    ));

    const property = properties.find(p => p.id === paymentModalConversation.propertyId);
    createNotification(
        `Your payment for ${property?.location} was successful. Please review the agreement.`,
        'deal',
        paymentModalConversation.id
    );

    setPaymentModalConversation(null);
  };
  
  const handleSignAgreement = () => {
    if (!agreementModalConversation) return;

    setConversations(prev => prev.map(c => 
        c.id === agreementModalConversation.id 
            ? { ...c, dealStatus: 'complete' } 
            : c
    ));

    const property = properties.find(p => p.id === agreementModalConversation.propertyId);
    createNotification(
        `Deal for ${property?.location} is complete! Funds have been released to the lister.`,
        'deal',
        agreementModalConversation.id
    );

    setAgreementModalConversation(null);
  };

  const handleReviewSubmit = (rating: number, text: string) => {
    if (!userToReview || !currentUser) return;

    const newReview: Review = {
        id: Date.now(),
        reviewer: currentUser,
        rating,
        text,
        timestamp: new Date().toISOString(),
    };

    setUsers(prevUsers => 
        prevUsers.map(user => {
            if (user.id === userToReview.id) {
                return {
                    ...user,
                    reviews: [...(user.reviews || []), newReview],
                };
            }
            return user;
        })
    );

    createNotification(
        `${currentUser.name} left you a ${rating}-star review.`,
        'deal',
        userToReview.id
    );
    
    setUserToReview(null);
  };

  const handleConfirmDeletePost = useCallback(() => {
    if (!postToDelete) return;
    setProperties(prev => prev.filter(p => p.id !== postToDelete.id));
    logger.log('Component:MainAppShell', 'Post deleted', { postId: postToDelete.id });
    setPostToDelete(null);
  }, [postToDelete]);

  const handleNavigateSettings = (screen: SettingsScreenView | 'referral') => {
    if (screen === 'referral') {
      setActiveSettingsScreen('referral');
    } else {
      setActiveSettingsScreen(screen);
    }
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuNavigate = (tab: 'dashboard' | 'verify' | 'settings') => {
    if (tab === 'settings') {
      setActiveSettingsScreen('main');
    } else {
      setActiveTab(tab);
    }
    setIsMobileMenuOpen(false);
  };
  
  const handleNavigateToProfile = useCallback((userId: number) => {
    logger.log('Component:MainAppShell', `Navigating to profile for user ${userId}.`);
    setViewingProfileId(userId);
    setActiveTab('profile');
  }, []);

  const handleAddStory = (file: File) => {
    if (!currentUser) return;

    const newStory: Story = {
        id: Date.now(),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file), // Use object URL for local preview
        timestamp: new Date().toISOString(),
        duration: 5 // Default duration for images
    };
    
    const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
            const updatedStories = [newStory, ...(user.stories || [])];
            return { ...user, stories: updatedStories };
        }
        return user;
    });

    setUsers(updatedUsers);
    
    const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
    if (updatedCurrentUser) {
        setViewingStoryUser(updatedCurrentUser);
    }
  };

  // Memoized values
  const viewingNeighborhood = useMemo(() => neighborhoods.find(n => n.id === viewingNeighborhoodId), [viewingNeighborhoodId, neighborhoods]);
  const usersWithStories = useMemo(() => users.filter(user => user.stories && user.stories.length > 0), [users]);
  const viewingProfile = useMemo(() => users.find(u => u.id === viewingProfileId), [viewingProfileId, users]);
  const activeConversation = useMemo(() => conversations.find(c => c.id === activeConversationId), [activeConversationId, conversations]);
  const relatedPropertyForPayment = useMemo(() => {
    if (!paymentModalConversation) return null;
    return properties.find(p => p.id === paymentModalConversation.propertyId);
  }, [paymentModalConversation, properties]);
  const relatedPropertyForAgreement = useMemo(() => {
    if (!agreementModalConversation) return null;
    return properties.find(p => p.id === agreementModalConversation.propertyId);
  }, [agreementModalConversation, properties]);
  
  // Nav items setup
  const { sideNavItems, bottomNavItems } = useMemo(() => {
    if (!currentUser) return { sideNavItems: [], bottomNavItems: [] };
    
    const sideNav: NavItem[] = [
        { tab: 'home', label: 'Home', icon: HomeIcon },
        { tab: 'search', label: 'Search', icon: SearchIcon },
        { tab: 'verify', label: 'Verify', icon: ShieldCheckIcon },
    ];
    if (currentUser.agentStatus === 'verified') {
        sideNav.push({ tab: 'dashboard', label: 'Dashboard', icon: DashboardIcon });
    }
    sideNav.push(
        { tab: 'messages', label: 'Messages', icon: ChatBubbleIcon },
        { tab: 'profile', label: 'Profile', icon: UserCircleIcon }
    );

    const bottomNav: NavItem[] = [
        { tab: 'home', label: 'Home', icon: HomeIcon },
        { tab: 'search', label: 'Search', icon: SearchIcon },
        { tab: 'messages', label: 'Messages', icon: ChatBubbleIcon },
        { tab: 'profile', label: 'Profile', icon: UserCircleIcon },
    ];

    return { sideNavItems: sideNav, bottomNavItems: bottomNav };
  }, [currentUser]);

  const feedProperties = useMemo(() => {
    if (!currentUser) return [];
    const followedIds = currentUser.followingIds || [];
    return properties
      .filter(p => [...followedIds, currentUser.id].includes(p.lister.id) && !blockedUserIds.includes(p.lister.id))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [properties, currentUser, blockedUserIds]);
  
  const discoverProperties = useMemo(() => {
    return properties.filter(p => !blockedUserIds.includes(p.lister.id) && (p.images.length > 0 || (p.videos && p.videos.length > 0))).sort(() => Math.random() - 0.5);
  }, [properties, blockedUserIds]);

  // Other handlers
  const handleRefresh = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProperties(prev => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  const handleHeaderBack = () => {
    if(viewingProfileId) setViewingProfileId(null);
    else if (activeConversationId) setActiveConversationId(null);
  };
  
  const renderScreen = () => {
    if (!currentUser) return null;
    switch (activeTab) {
      case 'home': 
        return <HomeContainerScreen
            feedProperties={feedProperties}
            discoverProperties={discoverProperties}
            currentUser={currentUser}
            isLoading={isLoading}
            onViewComments={setViewingCommentsFor}
            onStartVerification={setVerifyingProperty}
            onMessageLister={handleMessageLister}
            onCreatePost={handleCreatePost}
            onViewProfile={handleNavigateToProfile}
            onViewNeighborhood={setViewingNeighborhoodId}
            usersWithStories={usersWithStories}
            onAddStory={handleAddStory}
            onViewStory={setViewingStoryUser}
            onShareToTeam={() => {}} // Dummy for now
            teams={[]} // Dummy for now
            onViewOnMap={() => {}} // Dummy for now
            onOpenDeleteModal={setPostToDelete}
            onBlockUser={() => {}} // Dummy for now
            onRefresh={handleRefresh}
          />;
      case 'search': return <SearchScreen currentUser={currentUser} allProperties={properties.filter(p => !blockedUserIds.includes(p.lister.id))} allNeighborhoods={neighborhoods} onViewNeighborhood={setViewingNeighborhoodId} onOpenCreateTeam={() => setIsCreateTeamModalOpen(true)} initialState={initialSearchState} onClearInitialState={() => setInitialSearchState(null)} />;
      case 'messages': return <MessagesScreen conversations={conversations} properties={properties} currentUser={currentUser} isLoading={isLoading} onSelectConversation={setActiveConversationId} activeConversationId={activeConversationId} onSendMessage={handleSendMessage} onSendAudioMessage={handleSendAudioMessage} onMarkAsRead={() => {}} onOpenPaymentModal={setPaymentModalConversation} onOpenAgreementModal={setAgreementModalConversation} onLeaveReview={setUserToReview} searchTeams={searchTeams} onAddTeamComment={() => {}} users={users} onScheduleTour={handleScheduleTour} />;
      case 'profile': return <ProfileScreen user={viewingProfile || currentUser} currentUser={currentUser} allProperties={properties} allUsers={users} onToggleFollow={() => {}} onViewComments={setViewingCommentsFor} onStartVerification={setVerifyingProperty} onMessageLister={handleMessageLister} onViewProfile={handleNavigateToProfile} onUpdateProfile={() => {}} onViewNeighborhood={setViewingNeighborhoodId} onShareToTeam={() => {}} teams={[]} onStartDM={() => {}} onViewOnMap={() => {}} onViewSettings={() => setActiveSettingsScreen('main')} onOpenDeleteModal={setPostToDelete} onBlockUser={() => {}} onViewStory={setViewingStoryUser} />;
      case 'dashboard': return <AgentDashboardScreen currentUser={currentUser} properties={properties} conversations={conversations} tours={scheduledTours} onNavigateToChat={setActiveConversationId} onConfirmTour={handleConfirmTour} />;
      case 'verify': return <VerifyScreen />;
      default:
        return <HomeContainerScreen feedProperties={feedProperties} discoverProperties={discoverProperties} currentUser={currentUser} isLoading={isLoading} onViewComments={setViewingCommentsFor} onStartVerification={setVerifyingProperty} onMessageLister={handleMessageLister} onCreatePost={handleCreatePost} onViewProfile={handleNavigateToProfile} onViewNeighborhood={setViewingNeighborhoodId} usersWithStories={usersWithStories} onAddStory={handleAddStory} onViewStory={setViewingStoryUser} onShareToTeam={() => {}} teams={[]} onViewOnMap={() => {}} onOpenDeleteModal={setPostToDelete} onBlockUser={() => {}} onRefresh={handleRefresh} />;
    }
  };

  const getHeaderTitle = () => {
    if (!currentUser) return 'Loading...';
    if (activeTab === 'profile' && viewingProfile) return viewingProfile.name;
    if (activeTab === 'messages' && activeConversation) {
        const otherParticipants = activeConversation.participants.filter(p => p && p.id !== currentUser.id);
        const team = searchTeams.find(t => t.id === activeConversation.teamId);
        if (team) return team.name;
        return otherParticipants.length > 0 ? otherParticipants.map(p => p.name).join(', ') : 'Chat';
    }
    switch (activeTab) {
      case 'home': return 'edQorta';
      case 'search': return 'Search';
      case 'dashboard': return 'Agent Dashboard';
      case 'messages': return 'Messages';
      case 'profile': return 'Profile';
      case 'verify': return 'Verification';
      default: return 'edQorta';
    }
  };

  // Conditional Rendering for full-screen modals/views
  if (!currentUser) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;

  if (viewingNeighborhood) {
    return <NeighborhoodHubScreen neighborhood={viewingNeighborhood} allProperties={properties} allUsers={users} currentUser={currentUser} onClose={() => setViewingNeighborhoodId(null)} onViewProfile={handleNavigateToProfile} onMessageLister={handleMessageLister} onStartVerification={setVerifyingProperty} onViewComments={setViewingCommentsFor} teams={[]} onShareToTeam={()=>{}} onAskQuestion={()=>{}} onAddAnswer={()=>{}} onViewOnMap={()=>{}} onOpenDeleteModal={setPostToDelete} onBlockUser={()=>{}} />
  }
  if (viewingCommentsFor) return <CommentsScreen property={viewingCommentsFor} currentUser={currentUser} onBack={() => setViewingCommentsFor(null)} onViewProfile={handleNavigateToProfile} />
  if (isCameraViewOpen) return <VerificationCameraView property={verifyingProperty} onClose={() => { setIsCameraViewOpen(false); setVerifyingProperty(null); }} onSubmit={() => {}} />
  if (activeSettingsScreen !== 'closed') {
      switch(activeSettingsScreen) {
        case 'main': return <SettingsScreen onClose={() => setActiveSettingsScreen('closed')} onNavigate={handleNavigateSettings} />;
        case 'editProfile': return <EditProfileSettings currentUser={currentUser} onUpdateProfile={()=>{}} onBack={() => setActiveSettingsScreen('main')} />;
        case 'changePassword': return <ChangePasswordSettings onBack={() => setActiveSettingsScreen('main')} />;
        case 'privacy': return <PrivacySettings currentUser={currentUser} onBack={() => setActiveSettingsScreen('main')} />;
        case 'referral': return <ReferralDashboardScreen currentUser={currentUser} onBack={() => setActiveSettingsScreen('main')} />;
      }
  }

  return (
    <div className="md:flex h-screen bg-white">
      <SideNav activeTab={activeTab} setActiveTab={setActiveTab} navItems={sideNavItems} />
      <MobileSideMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={handleMobileMenuNavigate}
        onLogout={onLogout}
        currentUser={currentUser}
      />
      <main className="flex-1 flex flex-col md:overflow-y-hidden pb-16 md:pb-0">
        {viewingNotifications ? (
            <NotificationsScreen notifications={notifications} onBack={() => setViewingNotifications(false)} onNotificationClick={()=>{}} />
        ) : (
          <>
            <Header 
              title={getHeaderTitle()} 
              unreadCount={notifications.filter(n => !n.read).length} 
              onNotificationClick={() => setViewingNotifications(true)}
              showLogout={activeTab === 'profile' && !viewingProfileId}
              onLogout={onLogout}
              showBack={(activeTab === 'messages' && !!activeConversationId) || (activeTab === 'profile' && !!viewingProfileId)}
              onBack={handleHeaderBack}
              onMenuClick={() => setIsMobileMenuOpen(true)}
            />
            <div className="flex-grow overflow-y-auto no-scrollbar border-t border-gray-200">
              {renderScreen()}
            </div>
          </>
        )}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} navItems={bottomNavItems} />
      
      {/* Modals */}
      {schedulingTourFor && (
        <TourSchedulingModal 
          isOpen={!!schedulingTourFor}
          onClose={() => setSchedulingTourFor(null)}
          onSubmit={handleScheduleTourRequest}
          property={schedulingTourFor}
        />
      )}
      {verifyingProperty && !isCameraViewOpen && <VerificationTaskModal property={verifyingProperty} onAccept={() => {}} onDecline={() => setVerifyingProperty(null)} />}
      {userToReview && <ReviewModal isOpen={!!userToReview} onClose={() => setUserToReview(null)} onSubmit={handleReviewSubmit} userToReview={userToReview} />}
      {viewingStoryUser && <StoryViewer users={usersWithStories} initialUser={viewingStoryUser} onClose={() => setViewingStoryUser(null)} />}
      {isCreateTeamModalOpen && <CreateTeamModal users={users.filter(u => u.id !== currentUser.id)} onClose={() => setIsCreateTeamModalOpen(false)} onCreateTeam={() => {}} />}
      {relatedPropertyForPayment && (
          <PaymentModal
              isOpen={!!paymentModalConversation}
              onClose={() => setPaymentModalConversation(null)}
              onConfirm={handleConfirmPayment}
              property={relatedPropertyForPayment}
          />
      )}
      {agreementModalConversation && relatedPropertyForAgreement && (
          <AgreementModal
              isOpen={!!agreementModalConversation}
              onClose={() => setAgreementModalConversation(null)}
              onSign={handleSignAgreement}
              conversation={agreementModalConversation}
              property={relatedPropertyForAgreement}
              currentUser={currentUser}
          />
      )}
      {postToDelete && (
        <ConfirmationModal
            isOpen={!!postToDelete}
            onClose={() => setPostToDelete(null)}
            onConfirm={handleConfirmDeletePost}
            title="Delete Post?"
            message="Are you sure you want to permanently delete this post? This action cannot be undone."
            confirmText="Delete"
        />
      )}
    </div>
  );
};

export default MainAppShell;