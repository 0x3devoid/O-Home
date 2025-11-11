import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Property, User, SearchTeam } from '../../types';
import { HeartIcon, MessageCircleIcon, ShareIcon, ChatAltIcon, RepostIcon, BookmarkIcon, EyeIcon, ArrowLeftIcon, ArrowRightIcon, MapPinIcon, DotsHorizontalIcon, PlayIcon } from '../Icons';
import VerificationBadge from '../common/VerificationBadge';
import UserVerifiedBadge from '../common/UserVerifiedBadge';
import PostOptionsMenu from './PostOptionsMenu';

interface PropertyPostProps {
  property: Property;
  currentUser: User;
  onViewComments: () => void;
  onStartVerification: () => void;
  onMessageLister: (lister: User, property: Property) => void;
  onViewProfile: (userId: number) => void;
  onViewNeighborhood: (neighborhoodId: number) => void;
  onShareToTeam: (teamId: number, property: Property) => void;
  onRepost: (property: Property, quote?: string) => void;
  teams: SearchTeam[];
  onViewOnMap: () => void;
  onOpenDeleteModal: () => void;
  onBlockUser: () => void;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
};

const formatPrice = (price: number, type?: 'rent' | 'sale' | 'business', interval?: 'year' | 'month' | 'week' | 'day' | 'night' | 'hour') => {
    const priceString = `₦${price.toLocaleString()}`;
    if (type === 'sale') {
      return priceString;
    }
    if (type === 'business') {
      const intervalString = interval || 'night';
      return `${priceString} / ${intervalString}`;
    }
    const intervalString = interval || 'year';
    return `${priceString} / ${intervalString}`;
};

const PropertyPost: React.FC<PropertyPostProps> = (props) => {
  const { property, currentUser, onViewComments, onStartVerification, onMessageLister, onViewProfile, onShareToTeam, onRepost, teams, onViewOnMap, onOpenDeleteModal, onBlockUser } = props;
  const { lister, price, location, beds, baths, images, videos, verificationStatus, verifier, description, type, postType, likes, comments, timestamp, views, reposts, saves } = property;
  
  const [isLiked, setIsLiked] = useState(() => currentUser.likedPropertyIds?.includes(property.id) || false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  const media = useMemo(() => [
    ...(images || []).map(url => ({ type: 'image' as const, url })),
    ...(videos || []).map(url => ({ type: 'video' as const, url }))
  ], [images, videos]);

  useEffect(() => {
    setIsLiked(currentUser.likedPropertyIds?.includes(property.id) || false);
    setLikeCount(property.likes);
    setCurrentMediaIndex(0);
  }, [property.id, property.likes, currentUser.likedPropertyIds]);
  
  const useClickOutside = (ref: React.RefObject<HTMLDivElement | null>, callback: () => void) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
  };

  useClickOutside(optionsMenuRef, () => setIsOptionsMenuOpen(false));

  const handleLike = () => {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
      if (newLikedState) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 300);
      }
  };
  
  const nextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex(prev => (prev + 1) % media.length);
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex(prev => (prev - 1 + media.length) % media.length);
  };
  
  const goToMedia = (index: number) => {
    setCurrentMediaIndex(index);
  };

  const canVerify = currentUser.agentStatus === 'verified' && lister.id !== currentUser.id && postType === 'property' && verificationStatus === 'unverified';

  return (
    <article className="bg-white">
      <div className="flex items-center justify-between p-3">
        <button onClick={() => onViewProfile(lister.id)} className="flex items-center gap-3 group">
          <img src={lister.avatar} alt={lister.name} className="w-10 h-10 rounded-full" />
          <div>
            <div className="flex items-center gap-1.5">
                <p className="font-bold text-gray-800 group-hover:underline text-sm">{lister.name}</p>
                <UserVerifiedBadge user={lister} />
            </div>
            {postType === 'property' && <p className="text-xs text-gray-500">{location}</p>}
          </div>
        </button>
        <div className="relative" ref={optionsMenuRef}>
           <button onClick={() => setIsOptionsMenuOpen(prev => !prev)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <DotsHorizontalIcon className="w-5 h-5" />
           </button>
           {isOptionsMenuOpen && (
              <PostOptionsMenu
                  isOwner={currentUser.id === lister.id}
                  onClose={() => setIsOptionsMenuOpen(false)}
                  onDelete={onOpenDeleteModal}
                  onBlockUser={onBlockUser}
                  onReport={() => alert('Post reported!')}
                  onMute={() => alert('User muted!')}
              />
           )}
        </div>
      </div>

      {media.length > 0 && (
        <div className="relative group aspect-square bg-black">
          {media.map((item, index) => (
            <div key={index} className={`w-full h-full absolute transition-opacity duration-300 ${index === currentMediaIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {item.type === 'image' ? (
                  <img src={item.url} alt={`Property at ${location}`} className="w-full h-full object-cover" />
                ) : (
                  <video src={item.url} controls className="w-full h-full object-contain bg-black" />
                )}
            </div>
          ))}

          {media[currentMediaIndex].type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <PlayIcon className="w-16 h-16 text-white/70 drop-shadow-lg" />
              </div>
          )}
          
          {media.length > 1 && (
            <>
              <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10">
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10">
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {media.map((_, index) => (
                    <button key={index} onClick={() => goToMedia(index)} className={`w-2 h-2 rounded-full transition-colors ${index === currentMediaIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-3">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-16">
                 <button 
                      onClick={handleLike} 
                      className={`flex items-center space-x-2 transition-all duration-200 ease-in-out active:scale-95 group`}
                  >
                       <HeartIcon className={`w-7 h-7 transform transition-transform duration-300 group-hover:scale-110 ${isAnimating ? 'scale-125' : 'scale-100'} ${isLiked ? 'text-red-500' : 'text-gray-800'}`} isLiked={isLiked}/>
                       <span className="text-sm font-medium text-gray-600">{likeCount.toLocaleString()}</span>
                  </button>
                   <button 
                      onClick={onViewComments} 
                      className="flex items-center space-x-2 text-gray-800 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95"
                   >
                      <MessageCircleIcon className="w-7 h-7" />
                      <span className="text-sm font-medium text-gray-600">{comments.length}</span>
                  </button>
                  <button 
                      onClick={() => onRepost(property)}
                      className="flex items-center space-x-2 text-gray-800 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95"
                  >
                      <RepostIcon className="w-7 h-7" />
                      <span className="text-sm font-medium text-gray-600">{reposts || 0}</span>
                  </button>
                  <div className="flex items-center space-x-2 text-gray-600">
                      <EyeIcon className="w-7 h-7" />
                      <span className="text-sm font-medium">{views?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                      <BookmarkIcon className="w-7 h-7" />
                      <span className="text-sm font-medium">{saves || 0}</span>
                  </div>
                  {postType === 'property' && lister.id !== currentUser.id && (
                      <button
                          onClick={() => onMessageLister(lister, property)}
                          className="flex items-center space-x-2 text-gray-800 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95"
                          aria-label={`Message ${lister.name}`}
                          title={`Message ${lister.name}`}
                      >
                          <ChatAltIcon className="w-7 h-7" />
                      </button>
                  )}
              </div>
              {postType === 'property' && 
                <VerificationBadge 
                    status={verificationStatus!} 
                    onClick={canVerify ? onStartVerification : undefined}
                    actionText="Verify"
                />
              }
          </div>
          
          <div className="mt-1 text-sm">
            <button onClick={() => onViewProfile(lister.id)} className="font-bold mr-1">{lister.username}</button>
            <span>{description}</span>
          </div>

          {postType === 'property' && (
              <div className="mt-2">
                <p className="text-base font-bold text-violet-700">
                  {formatPrice(price!, type as 'rent' | 'sale' | 'business', property.priceInterval as 'year' | 'month' | 'week' | 'day' | 'night' | 'hour')}
                </p>
                <div className="flex items-center space-x-2 text-gray-600 text-xs font-medium mt-1">
                  <span>{beds} {beds === 1 ? 'bed' : 'beds'}</span>
                  <span>•</span>
                  <span>{baths} {baths === 1 ? 'bath' : 'baths'}</span>
                </div>
              </div>
          )}

          {comments.length > 0 && 
            <button onClick={onViewComments} className="text-sm text-gray-500 mt-1">
              View all {comments.length} comments
            </button>
          }
          <p className="text-xs text-gray-400 mt-2">{timeAgo(timestamp)}</p>
      </div>
      
    </article>
  );
};

export default PropertyPost;
