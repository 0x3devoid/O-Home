export interface Story {
  id: number;
  type: 'image' | 'video';
  url: string;
  timestamp: string;
  duration?: number; // duration in seconds for images
}

export interface User {
  id: number;
  fullname?: string;
  name?: string;
  username: string;
  avatar: string;
  bannerImage?: string;
  agentStatus: 'none' | 'pending' | 'verified';
  listerStatus: 'unverified' | 'verified';
  bio?: string;
  location?: string;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  followerIds?: number[];
  followingIds?: number[];
  referralCode?: string;
  referralStats?: {
    clicks: number;
    signups: number;
    earnings: number;
  };
  ratings?: string;
  trustScore?: number;
  feedbacksCount?: number;
  likedPropertyIds?: number[];
  reviews?: Review[];
  stories?: Story[];
  activeInNeighborhoods?: number[];
  blockedUserIds?: number[];
  isPrivate?: boolean;
  accountType?: 'personal' | 'business';
  businessStatus?: 'none' | 'pending' | 'verified';
  businessType?: 'agency' | 'hotel' | 'shortlet';
}

export interface Review {
  id: number;
  reviewer: User;
  rating: number;
  text: string;
  timestamp: string;
}

export interface TourBooking {
  id: number;
  propertyId: number;
  listerId: number;
  requesterId: number;
  agentId?: number;
  requestedDate: string;
  requestedTime: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  participants: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  propertyId: number;
  bookerId: number;
  listerId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingType: 'instant' | 'request';
  createdAt: string;
  updatedAt: string;
  message?: string;
}

export interface Comment {
  id: number;
  user: User;
  text: string;
  timestamp:string;
}

export interface Property {
  id: number;
  lister: User;
  description: string;
  images: string[];
  videos?: string[];
  postType: 'property' | 'text';
  likes: number;
  views?: number;
  reposts?: number;
  saves?: number;
  comments: Comment[];
  timestamp: string;
  location: string;
  price?: number;
  priceInterval?: 'year' | 'month' | 'week' | 'day' | 'night' | 'hour';
  beds?: number;
  baths?: number;
  type?: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verifier?: User;
  verificationData?: {
    photos: string[];
    geolocation: {
      latitude: number;
      longitude: number;
      accuracy: number;
      timestamp: string;
    };
    notes: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  originalPostId?: number;
  amenities?: string[];
  latitude?: number;
  longitude?: number;
  verificationFee?: number;
  verificationAssignedAt?: string;
  verificationCompletedAt?: string;
  neighborhoodId?: number;
  
  // Business booking fields
  availableRooms?: number;
  totalRooms?: number;
  checkInTime?: string;
  checkOutTime?: string;
  minimumStay?: number;
  bookingType?: 'instant' | 'request';
  businessAccount?: boolean;
  
  // Service posting fields
  serviceType?: 'general' | 'painting' | 'decorating' | 'cleaning' | 'maintenance' | 'landscaping' | 'renovation' | 'other';
}

export interface ScheduledTour {
  id: number;
  property: Property;
  renter: User;
  agent: User;
  proposedTimes: string[];
  confirmedTime?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface Message {
  id: number;
  senderId: number;
  text?: string;
  audio?: {
    url: string;
    duration: number; // in seconds
  };
  timestamp: string;
  read: boolean;
  type?: 'user' | 'system';
}

export interface Conversation {
  id: number;
  participants: User[];
  messages: Message[];
  propertyId?: number;
  dealStatus?: 'payment_pending' | 'agreement_pending' | 'complete';
  teamId?: number;
}

export interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'message' | 'verification' | 'deal' | 'follow' | 'tour' | 'like' | 'comment' | 'repost';
  contextId?: number; // e.g., conversationId or propertyId or userId
}

// FIX: Add missing ServiceProvider interface.
export interface ServiceProvider {
    id: number;
    name: string;
    avatar: string;
    service: string;
    rating: string;
    reviewsCount: number;
}

export interface Answer {
    id: number;
    text: string;
    author: User;
    timestamp: string;
}

export interface Question {
    id: number;
    text: string;
    author: User;
    timestamp: string;
    upvotes: number;
    answers: Answer[];
}

export interface NeighborhoodReview {
    id: number;
    author: User;
    ratings: {
        security: number; // 1-5
        power: number;
        internet: number;
    };
    text: string;
    timestamp: string;
}

export interface Neighborhood {
    id: number;
    name: string;
    image: string;
    questions: Question[];
    reviews?: NeighborhoodReview[];
    latitude?: number;
    longitude?: number;
}


export interface TeamComment {
    id: number;
    author: User;
    text: string;
    timestamp: string;
}

export interface SharedProperty {
    propertyId: number;
    comments: TeamComment[];
    sharerId: number;
    timestamp: string;
}

export interface SearchTeam {
    id: number;
    name: string;
    memberIds: number[];
    sharedProperties: SharedProperty[];
    conversationId: number;
}
