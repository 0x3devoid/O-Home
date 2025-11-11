import React from 'react';
import PropertyPost from '../components/property/PropertyPost';
import { NewPropertyData } from '../components/post/PostForm';
import { Property, User, SearchTeam, Story } from '../types';
import PropertyPostSkeleton from '../components/skeletons/PropertyPostSkeleton';
import PostComposer from '../components/post/PostComposer';
import StoryTray from '../components/stories/StoryTray';

interface HomeScreenProps {
  properties: Property[];
  currentUser: User;
  isLoading: boolean;
  onViewComments: (property: Property) => void;
  onStartVerification: (property: Property) => void;
  onMessageLister: (lister: User, property: Property) => void;
  onCreatePost: (data: NewPropertyData) => Promise<void>;
  onViewProfile: (userId: number) => void;
  onViewNeighborhood: (neighborhoodId: number) => void;
  usersWithStories: User[];
  onAddStory: (file: File) => void;
  onViewStory: (user: User) => void;
  onShareToTeam: (teamId: number, property: Property) => void;
  onShare: (property: Property) => void;
  onRepost: (property: Property, quote?: string) => void;
  teams: SearchTeam[];
  onViewOnMap: (property: Property) => void;
  onOpenDeleteModal: (property: Property) => void;
  onBlockUser: (userId: number) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
  const { 
    properties, currentUser, isLoading, onViewComments, onStartVerification, 
    onMessageLister, onCreatePost, onViewProfile, onViewNeighborhood, 
    usersWithStories, onAddStory, onViewStory, onShareToTeam, onShare, onRepost, teams, onViewOnMap,
    onOpenDeleteModal, onBlockUser
  } = props;
  
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-full max-w-2xl bg-white">
        <main>
          <div className="border-b border-gray-200">
            <StoryTray 
              currentUser={currentUser}
              usersWithStories={usersWithStories}
              onAddStory={onAddStory}
              onViewStory={onViewStory}
            />
          </div>
          <PostComposer onCreatePost={onCreatePost} currentUser={currentUser} onAddStory={onAddStory} />
          <div className="divide-y divide-gray-100">
              {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => <PropertyPostSkeleton key={index} />)
              ) : properties.length > 0 ? (
                  properties.map(property => (
                      <PropertyPost 
                          key={property.id} 
                          property={property}
                          currentUser={currentUser}
                          onViewComments={() => onViewComments(property)}
                          onStartVerification={() => onStartVerification(property)}
                          onMessageLister={onMessageLister}
                          onViewProfile={onViewProfile}
                          onViewNeighborhood={onViewNeighborhood}
                          onShareToTeam={onShareToTeam}
                          onRepost={onRepost}
                          teams={teams}
                          onViewOnMap={() => onViewOnMap(property)}
                          onOpenDeleteModal={() => onOpenDeleteModal(property)}
                          onBlockUser={() => onBlockUser(property.lister.id)}
                      />
                  ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                    <h2 className="text-xl font-semibold">Welcome to your Feed!</h2>
                    <p className="mt-2">Follow users to see their posts here. Use the search tab to discover new properties and people.</p>
                </div>
              )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeScreen;
