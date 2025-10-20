

import React, { useState, useRef, useEffect } from 'react';
import HomeScreen from './HomeScreen';
import DiscoverScreen from './DiscoverScreen';
import { Property, User, SearchTeam, Story } from '../types';
import { NewPropertyData } from '../components/post/PostForm';
import PullToRefresh from '../components/common/PullToRefresh';
import { logger } from '../utils/logger';

// Props need to include everything for both HomeScreen and DiscoverScreen
interface HomeContainerScreenProps {
  feedProperties: Property[];
  discoverProperties: Property[];
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
  teams: SearchTeam[];
  onViewOnMap: (property: Property) => void;
  onOpenDeleteModal: (property: Property) => void;
  onBlockUser: (userId: number) => void;
  onRefresh: () => Promise<any>;
}

const HomeContainerScreen: React.FC<HomeContainerScreenProps> = (props) => {
  logger.log('Component:HomeContainerScreen', 'Component rendering or re-rendering.');
  const [activeView, setActiveView] = useState<'feed' | 'discover'>('feed');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logger.log('Component:HomeContainerScreen', 'Mounted.');
  }, []);

  useEffect(() => {
    logger.log('Component:HomeContainerScreen', 'State changed: activeView', { activeView });
  }, [activeView]);
  
  const handleSwitchView = (view: 'feed' | 'discover') => {
    if (scrollContainerRef.current) {
        const screenWidth = scrollContainerRef.current.offsetWidth;
        scrollContainerRef.current.scrollTo({
            left: view === 'feed' ? 0 : screenWidth,
            behavior: 'smooth'
        });
    }
    setActiveView(view);
  };
  
  useEffect(() => {
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, offsetWidth } = scrollContainerRef.current;
            if (scrollLeft < offsetWidth / 2) {
                setActiveView('feed');
            } else {
                setActiveView('discover');
            }
        }
    };

    const container = scrollContainerRef.current;
    if (container) {
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const { feedProperties, discoverProperties, onRefresh, ...rest } = props;

  logger.log('Component:HomeContainerScreen', 'Render logic continues. Current view:', { activeView });
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-30 border-b border-gray-200">
        <div className="flex justify-center items-center gap-8 p-3">
          <button onClick={() => handleSwitchView('feed')} className={`font-bold transition-colors ${activeView === 'feed' ? 'text-violet-600' : 'text-gray-400'}`}>
            For You
            {activeView === 'feed' && <div className="w-full h-1 bg-violet-600 rounded-full mt-1"></div>}
          </button>
          <button onClick={() => handleSwitchView('discover')} className={`font-bold transition-colors ${activeView === 'discover' ? 'text-violet-600' : 'text-gray-400'}`}>
            Discover
            {activeView === 'discover' && <div className="w-full h-1 bg-violet-600 rounded-full mt-1"></div>}
          </button>
        </div>
      </header>

      <main 
        ref={scrollContainerRef}
        className="flex-1 flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        <div className="w-full flex-shrink-0 snap-start h-full">
          {logger.log('Component:HomeContainerScreen', 'Rendering HomeScreen (For You feed).')}
          <PullToRefresh onRefresh={onRefresh} className="h-full">
            <HomeScreen 
              properties={feedProperties} 
              {...rest}
            />
          </PullToRefresh>
        </div>
        <div className="w-full flex-shrink-0 snap-start h-full">
          {logger.log('Component:HomeContainerScreen', 'Rendering DiscoverScreen.')}
          <PullToRefresh onRefresh={onRefresh} className="h-full">
            <DiscoverScreen 
              properties={discoverProperties}
              currentUser={props.currentUser}
              onViewComments={props.onViewComments}
            />
          </PullToRefresh>
        </div>
      </main>
    </div>
  );
};

export default HomeContainerScreen;