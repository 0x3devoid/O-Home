import React, { useState, useEffect, useRef } from 'react';
import { Property, User } from '../../types';
import { HeartIcon, MessageCircleIcon, ShareIcon, PlayIcon, VolumeOffIcon, VolumeOnIcon } from '../Icons';

interface DiscoverPostProps {
  property: Property;
  currentUser: User;
  onViewComments: () => void;
  onShare: () => void;
  isActive: boolean;
}

const DiscoverPost: React.FC<DiscoverPostProps> = ({ property, currentUser, onViewComments, onShare, isActive }) => {
  const mediaUrl = property.videos?.[0] || property.images[0];
  const isVideo = !!property.videos?.[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isLiked, setIsLiked] = useState(currentUser.likedPropertyIds?.includes(property.id) || false);
  const [likeCount, setLikeCount] = useState(property.likes);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

  useEffect(() => {
    setIsLiked(currentUser.likedPropertyIds?.includes(property.id) || false);
    setLikeCount(property.likes);
  }, [property, currentUser]);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(error => {
          console.log('Video autoplay prevented, trying with mute:', error);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  const handleLike = () => {
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(prev => !prev);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 600);
  };

  const handleShare = async () => {
    onShare();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setShowPlayIcon(false);
      } else {
        videoRef.current.pause();
        setShowPlayIcon(true);
      }
    }
  };

  return (
    <div className="relative h-full w-full bg-black">
      {isVideo ? (
        <video 
          ref={videoRef} 
          src={mediaUrl} 
          loop 
          autoPlay 
          muted={isMuted}
          playsInline 
          className="h-full w-full object-cover"
          onClick={handleVideoClick}
          onPlay={() => setShowPlayIcon(false)}
          onPause={() => setShowPlayIcon(true)}
        />
      ) : (
        <img src={mediaUrl} alt="property" className="h-full w-full object-cover" />
      )}

      {/* Play/Pause Icon Overlay for Videos */}
      {isVideo && showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <PlayIcon className="w-12 h-12 text-white" />
          </div>
        </div>
      )}

      {/* Like Animation */}
      {likeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <HeartIcon className="w-32 h-32 text-white animate-ping" isLiked={true} />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 p-4 text-white flex flex-col justify-between">
        {/* Top Controls */}
        <div className="flex justify-between items-start">
          {/* Property Type Badge */}
          <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-medium">
              {property.postType === 'property' ? 
                (property.type === 'business' ? 'Business' : property.type || 'Property') : 
                (property.serviceType ? property.serviceType.charAt(0).toUpperCase() + property.serviceType.slice(1) : 'Post')
              }
            </span>
          </div>
          
          {/* Mute Button for Videos */}
          {isVideo && (
            <button 
              onClick={toggleMute}
              className="bg-black/30 backdrop-blur-sm p-2 rounded-full"
            >
              {isMuted ? <VolumeOffIcon className="w-5 h-5" /> : <VolumeOnIcon className="w-5 h-5" />}
            </button>
          )}
        </div>
      
        {/* Bottom Content */}
        <div className="flex justify-between items-end">
          {/* Content (Left side) */}
          <div className="pb-16 md:pb-0 pr-20 flex-1">
            <div className="flex items-center gap-3">
              <img src={property.lister.avatar} alt={property.lister.name} className="w-12 h-12 rounded-full border-2 border-white" />
              <div>
                <p className="font-bold text-lg drop-shadow-lg">{property.lister.name}</p>
                <p className="text-sm drop-shadow-lg">@{property.lister.username}</p>
              </div>
            </div>
            <p className="mt-3 text-sm line-clamp-3 drop-shadow-lg">{property.description}</p>
            {property.postType === 'property' && (
              <div className="font-bold mt-2 text-lg drop-shadow-lg">
                ₦{property.price?.toLocaleString()}
                {property.priceInterval && `/${property.priceInterval}`}
                <span className="font-medium text-base block">{property.location}</span>
              </div>
            )}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons (Right side) */}
          <div className="absolute right-4 bottom-20 md:bottom-4 flex flex-col items-center gap-6">
            <button onClick={handleLike} className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full transition-all transform hover:scale-110 bg-black/30 backdrop-blur-sm ${isLiked ? 'bg-red-500/60 scale-110' : ''}`}>
                <HeartIcon className="w-7 h-7" isLiked={isLiked} />
              </div>
              <span className="text-sm font-semibold mt-1.5 drop-shadow-lg">{likeCount.toLocaleString()}</span>
            </button>
            <button onClick={onViewComments} className="flex flex-col items-center text-center">
              <div className="bg-black/30 backdrop-blur-sm p-3 rounded-full transform hover:scale-110 transition-all">
                <MessageCircleIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold mt-1.5 drop-shadow-lg">{property.comments.length.toLocaleString()}</span>
            </button>
            <button onClick={handleShare} className="flex flex-col items-center text-center">
              <div className="bg-black/30 backdrop-blur-sm p-3 rounded-full transform hover:scale-110 transition-all">
                <ShareIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold mt-1.5 drop-shadow-lg">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPost;
