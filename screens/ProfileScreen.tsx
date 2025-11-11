import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropertyPost from '../components/property/PropertyPost';
import { Property, Review, User, SearchTeam } from '../types';
import AgentApplicationForm from '../components/profile/AgentApplicationForm';
import ReviewItem from '../components/profile/ReviewItem';
import { GiftIcon, PencilIcon, MapPinIcon, CameraIcon, ChatAltIcon, CogIcon, StarIcon } from '../components/Icons';
import UserVerifiedBadge from '../components/common/UserVerifiedBadge';

interface ProfileScreenProps {
    user: User;
    currentUser: User;
    allProperties: Property[];
    allUsers: User[];
    onToggleFollow: (userId: number) => void;
    onViewComments: (property: Property) => void;
    onStartVerification: (property: Property) => void;
    onMessageLister: (lister: User, property: Property) => void;
    onViewProfile: (userId: number) => void;
    onUpdateProfile: (userId: number, updates: Partial<Pick<User, 'name' | 'username' | 'bio' | 'location' | 'avatar' | 'bannerImage'>>) => void;
    onViewNeighborhood: (neighborhoodId: number) => void;
    onShareToTeam: (teamId: number, property: Property) => void;
    onShare: (property: Property) => void;
    onRepost: (property: Property, quote?: string) => void;
    teams: SearchTeam[];
    onStartDM: (userId: number) => void;
    onViewOnMap: (property: Property) => void;
    onViewSettings: () => void;
    onOpenDeleteModal: (property: Property) => void;
    onBlockUser: (userId: number) => void;
    onViewStory: (user: User) => void;
}

const Stat: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="font-bold text-lg">{value}</p>
    <p className="text-sm text-gray-500 capitalize">{label}</p>
  </div>
);

const IntegrityRatingBar: React.FC<{ score: number }> = ({ score }) => {
    const percentage = (score / 10) * 100;

    const getColor = (s: number) => {
        if (s <= 2) return 'text-red-500';
        if (s <= 4) return 'text-orange-400';
        if (s <= 6) return 'text-yellow-400';
        if (s <= 8) return 'text-green-500';
        return 'text-violet-500';
    };
    const colorClass = getColor(score);

    return (
        <div className="relative w-max" title={`Trust Score: ${score}/10`}>
            {/* Background stars (empty) */}
            <div className={`flex -space-x-1.5 text-gray-300`}>
                {Array.from({ length: 10 }).map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5" />
                ))}
            </div>
            {/* Filled stars (clipped) */}
            <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${percentage}%` }}>
                <div className={`flex -space-x-1.5 ${colorClass}`}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 flex-shrink-0" filled />
                    ))}
                </div>
            </div>
        </div>
    );
 };

const ProfileScreen: React.FC<ProfileScreenProps> = (props) => {
  const { 
      user, currentUser, allProperties, allUsers, onToggleFollow, onViewComments, onStartVerification, 
      onMessageLister, onViewProfile, onUpdateProfile, onViewNeighborhood, 
      onShareToTeam, onShare, onRepost, teams, onStartDM, onViewOnMap, onViewSettings,
      onOpenDeleteModal, onBlockUser, onViewStory
  } = props;
  const [isApplying, setIsApplying] = useState(false);
  const [agentStatus, setAgentStatus] = useState(user.agentStatus);
  const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'reviews'>('posts');
  const [activeReviewTab, setActiveReviewTab] = useState<'received' | 'given'>('received');

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedBio, setEditedBio] = useState(user.bio || '');
  const [editedLocation, setEditedLocation] = useState(user.location || '');
  const [editedAvatarPreview, setEditedAvatarPreview] = useState<string | null>(null);
  const [editedBannerPreview, setEditedBannerPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAgentStatus(user.agentStatus);
    setIsEditing(false);
    setEditedName(user.name);
    setEditedBio(user.bio || '');
    setEditedLocation(user.location || '');
    setEditedAvatarPreview(null);
    setEditedBannerPreview(null);
    if(avatarInputRef.current) avatarInputRef.current.value = '';
    if(bannerInputRef.current) bannerInputRef.current.value = '';
  }, [user]);

  // This prevents memory leaks when the component unmounts or the previews change.
  useEffect(() => {
    return () => {
      if (editedAvatarPreview) {
        URL.revokeObjectURL(editedAvatarPreview);
      }
      if (editedBannerPreview) {
        URL.revokeObjectURL(editedBannerPreview);
      }
    };
  }, [editedAvatarPreview, editedBannerPreview]);

  const isOwnProfile = user.id === currentUser.id;
  const isFollowing = currentUser.followingIds?.includes(user.id) ?? false;

  const userProperties = useMemo(() => allProperties.filter(p => p.lister.id === user.id), [user.id, allProperties]);
  const likedProperties = useMemo(() => allProperties.filter(p => user.likedPropertyIds?.includes(p.id)), [user.id, user.likedPropertyIds, allProperties]);
  const userReviews = useMemo(() => user.reviews || [], [user.reviews]);
  
  const reviewsGiven = useMemo(() => {
    const given: { review: Review; reviewedUser: User }[] = [];
    allUsers.forEach(u => {
        if (u.reviews && u.id !== user.id) {
            u.reviews.forEach(review => {
                if (review.reviewer.id === user.id) {
                    given.push({ review, reviewedUser: u });
                }
            });
        }
    });
    return given;
  }, [user.id, allUsers]);

  const handleApplicationSubmit = () => { setAgentStatus('pending'); setIsApplying(false); };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (editedAvatarPreview) {
        URL.revokeObjectURL(editedAvatarPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setEditedAvatarPreview(previewUrl);
    }
  };
  
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (editedBannerPreview) {
        URL.revokeObjectURL(editedBannerPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setEditedBannerPreview(previewUrl);
    }
  };

  const handleSaveChanges = () => {
    const updates: Partial<Pick<User, 'name' | 'bio' | 'location' | 'avatar' | 'bannerImage'>> = {};
    if (editedName !== user.name) updates.name = editedName;
    if (editedBio !== (user.bio || '')) updates.bio = editedBio;
    if (editedLocation !== (user.location || '')) updates.location = editedLocation;
    if (editedAvatarPreview) updates.avatar = editedAvatarPreview;
    if (editedBannerPreview) updates.bannerImage = editedBannerPreview;
    
    if(Object.keys(updates).length > 0) {
      onUpdateProfile(user.id, updates);
    }
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(user.name);
    setEditedBio(user.bio || '');
    setEditedLocation(user.location || '');
    setEditedAvatarPreview(null);
    setEditedBannerPreview(null);
    if(avatarInputRef.current) avatarInputRef.current.value = '';
    if(bannerInputRef.current) bannerInputRef.current.value = '';
  };

  const stats = [
      { value: userProperties.length, label: 'Posts', visible: true },
      { value: user.followersCount ?? 0, label: 'Followers', visible: true },
      { value: user.followingCount ?? 0, label: 'Following', visible: true },
      { value: (user.trustScore ?? 0).toFixed(1), label: 'Trust Score', visible: true },
  ];

  const hasStories = user.stories && user.stories.length > 0;

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-full max-w-2xl bg-white md:border-x md:border-gray-200">
        <main>
            <div className="relative">
                <div className="h-48 bg-gray-300">
                    <img
                        src={editedBannerPreview || user.bannerImage || 'https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?q=80&w=2070&auto=format&fit=crop'}
                        alt={`${user.name}'s banner`}
                        className="w-full h-full object-cover"
                    />
                </div>
                {isEditing && (
                    <>
                        <button
                            onClick={() => bannerInputRef.current?.click()}
                            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                            aria-label="Change banner image"
                        >
                            <CameraIcon className="w-5 h-5" />
                        </button>
                        <input
                            type="file"
                            ref={bannerInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleBannerChange}
                        />
                    </>
                )}
            </div>

            <div className="p-4 border-b border-gray-100">
                <div className="flex items-end justify-between -mt-14">
                    <div className="p-1 bg-white rounded-full flex-shrink-0">
                        <div className="relative w-20 h-20">
                            <div className={`p-0.5 rounded-full transition-colors duration-300 ${!isEditing && hasStories ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500' : ''}`}>
                                <div className={`p-0.5 bg-white rounded-full`}>
                                    <img
                                        src={editedAvatarPreview || user.avatar}
                                        alt={user.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                            </div>

                            {!isEditing && hasStories && (
                                <button onClick={() => onViewStory(user)} className="absolute inset-0 rounded-full" aria-label={`View ${user.name}'s story`}></button>
                            )}

                            {isEditing && (
                                <>
                                    <button
                                        onClick={() => avatarInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                                        aria-label="Change profile picture"
                                    >
                                        <CameraIcon className="w-6 h-6" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={avatarInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                        {isEditing ? (
                            <>
                            <button onClick={handleCancelEdit} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                            <button onClick={handleSaveChanges} className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700">Save Changes</button>
                            </>
                        ) : isOwnProfile ? (
                            <>
                                {agentStatus !== 'verified' && agentStatus !== 'pending' && user.accountType !== 'business' && (
                                    <button onClick={() => setIsApplying(true)} className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700">
                                        Become an Agent
                                    </button>
                                )}
                                <button onClick={onViewSettings} className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0">
                                    <CogIcon className="w-5 h-5 text-gray-500" />
                                </button>
                                <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0">
                                    <PencilIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 w-full">
                            <button
                                onClick={() => onToggleFollow(user.id)}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                    isFollowing
                                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    : 'bg-violet-600 text-white hover:bg-violet-700'
                                }`}
                                >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                                <button
                                onClick={() => onStartDM(user.id)}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                                aria-label={`Message ${user.name}`}
                                >
                                    <ChatAltIcon className="w-5 h-5 text-gray-700" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-4">
                    <div className="flex items-center gap-2 flex-grow min-w-0">
                        {isEditing ? (
                            <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} className="text-xl font-bold p-1 -m-1 border rounded-md w-full" autoFocus/>
                        ) : (
                            <h2 className="text-xl font-bold text-gray-800 truncate">{user.name}</h2>
                        )}
                        <UserVerifiedBadge user={user} />
                    </div>

                    {!isEditing && (
                    <div className="flex items-center gap-2 text-md text-gray-500 flex-wrap">
                        <span>@{user.username}</span>
                        {user.location && (
                            <>
                            <span className="text-gray-300">·</span>
                            <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {user.location}</span>
                            </>
                        )}
                    </div>
                    )}
                    
                    <div className="mt-2">
                        <IntegrityRatingBar score={user.trustScore ?? 0} />
                    </div>
                    
                    {isEditing ? (
                    <textarea value={editedBio} onChange={(e) => setEditedBio(e.target.value)} className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 resize-none text-sm" rows={3} />
                    ) : (
                    <p className="text-sm text-gray-600 mt-2">{user.bio || 'No bio yet.'}</p>
                    )}
                </div>
                
                <div className="mt-4 grid grid-cols-4 gap-y-4 text-center w-full border-t border-gray-100 pt-4">
                    {stats.filter(s => s.visible).map(stat => <Stat key={stat.label} {...stat} />)}
                </div>
            </div>
            
            <div className="border-b border-gray-200">
                <nav className="flex justify-around">
                    <button onClick={() => setActiveTab('posts')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'posts' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Posts</button>
                    <button onClick={() => setActiveTab('liked')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'liked' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Liked</button>
                    <button onClick={() => setActiveTab('reviews')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'reviews' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Reviews</button>
                </nav>
            </div>
            
            <div>
                {activeTab === 'posts' && (
                    <div className="divide-y divide-gray-100">{userProperties.length > 0 ? userProperties.map(p => <PropertyPost key={p.id} property={p} currentUser={currentUser} onViewComments={() => onViewComments(p)} onStartVerification={() => onStartVerification(p)} onMessageLister={onMessageLister} onViewProfile={onViewProfile} onViewNeighborhood={onViewNeighborhood} onShareToTeam={onShareToTeam} onRepost={onRepost} teams={teams} onViewOnMap={() => onViewOnMap(p)} onOpenDeleteModal={() => onOpenDeleteModal(p)} onBlockUser={() => onBlockUser(p.lister.id)} />) : <p className="p-8 text-center text-gray-500">No properties posted yet.</p>}</div>
                )}
                {activeTab === 'liked' && (
                    <div className="divide-y divide-gray-100">{likedProperties.length > 0 ? likedProperties.map(p => <PropertyPost key={p.id} property={p} currentUser={currentUser} onViewComments={() => onViewComments(p)} onStartVerification={() => onStartVerification(p)} onMessageLister={onMessageLister} onViewProfile={onViewProfile} onViewNeighborhood={onViewNeighborhood} onShareToTeam={onShareToTeam} onRepost={onRepost} teams={teams} onViewOnMap={() => onViewOnMap(p)} onOpenDeleteModal={() => onOpenDeleteModal(p)} onBlockUser={() => onBlockUser(p.lister.id)} />) : <p className="p-8 text-center text-gray-500">No liked properties yet.</p>}</div>
                )}
                {activeTab === 'reviews' && (
                    <div>
                        <div className="flex border-b border-gray-200">
                        <button onClick={() => setActiveReviewTab('received')} className={`flex-1 py-2 text-sm font-semibold text-center transition-colors ${activeReviewTab === 'received' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Reviews Received ({userReviews.length})</button>
                        <button onClick={() => setActiveReviewTab('given')} className={`flex-1 py-2 text-sm font-semibold text-center transition-colors ${activeReviewTab === 'given' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Reviews Given ({reviewsGiven.length})</button>
                        </div>
                        <div className="divide-y divide-gray-100">
                        {activeReviewTab === 'received' && (userReviews.length > 0 ? userReviews.map(r => <ReviewItem key={r.id} review={r} onViewProfile={onViewProfile} />) : <p className="p-8 text-center text-gray-500">No reviews received yet.</p>)}
                        {activeReviewTab === 'given' && (reviewsGiven.length > 0 ? reviewsGiven.map(item => <ReviewItem key={`${item.review.id}-${item.reviewedUser.id}`} review={item.review} reviewedUser={item.reviewedUser} onViewProfile={onViewProfile} />) : <p className="p-8 text-center text-gray-500">You haven't reviewed anyone yet.</p>)}
                        </div>
                    </div>
                )}
            </div>
        </main>
        {isApplying && <AgentApplicationForm onClose={() => setIsApplying(false)} onSubmit={handleApplicationSubmit} />}
      </div>
    </div>
  );
};

export default ProfileScreen;
