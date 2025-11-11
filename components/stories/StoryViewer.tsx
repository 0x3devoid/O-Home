import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User } from '../../types';
import { CloseIcon } from '../Icons';

interface StoryViewerProps {
    users: User[];
    initialUser: User;
    onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ users, initialUser, onClose }) => {
    const [currentUserIndex, setCurrentUserIndex] = useState(() => users.findIndex(u => u.id === initialUser.id));
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const currentUser = users[currentUserIndex];
    const currentStory = currentUser?.stories?.[currentStoryIndex];

    // This effect is the key fix. It handles all cases where the viewer becomes invalid.
    // By placing the onClose call inside a useEffect, we ensure it runs *after* the render,
    // preventing the "Cannot update a component while rendering..." error.
    useEffect(() => {
        if (!currentUser || !currentStory) {
            onClose();
        }
    }, [currentUser, currentStory, onClose]);

    const goToNextUser = useCallback(() => {
        if (currentUserIndex < users.length - 1) {
            setCurrentUserIndex(prev => prev + 1);
            setCurrentStoryIndex(0);
        } else {
            onClose();
        }
    }, [currentUserIndex, users.length, onClose]);

    const goToNextStory = useCallback(() => {
        if (currentStoryIndex < (currentUser?.stories?.length ?? 0) - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else {
            goToNextUser();
        }
    }, [currentStoryIndex, currentUser, goToNextUser]);
    
    const goToPrevUser = useCallback(() => {
        if (currentUserIndex > 0) {
            const prevUserIndex = currentUserIndex - 1;
            const prevUser = users[prevUserIndex];
            setCurrentUserIndex(prevUserIndex);
            const storiesLength = prevUser.stories?.length ?? 0;
            setCurrentStoryIndex(storiesLength > 0 ? storiesLength - 1 : 0);
        }
    }, [currentUserIndex, users]);

    const goToPrevStory = useCallback(() => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
        } else {
            goToPrevUser();
        }
    }, [currentStoryIndex, goToPrevUser]);

    // This effect now only handles video playback. Story progression for images
    // is handled by the onAnimationEnd event on the progress bar.
    useEffect(() => {
        const video = videoRef.current;
        if (currentStory?.type === 'video' && video) {
            if (isPaused) {
                video.pause();
            } else {
                // When a new video story comes up or resumes, play it from the start.
                video.currentTime = 0;
                video.play().catch(e => console.error("Video play failed", e));
            }
        }
    }, [currentStory, isPaused]);

    const handleMouseDown = () => {
        setIsPaused(true);
        if (currentStory?.type === 'video' && videoRef.current) videoRef.current.pause();
    };
    
    const handleMouseUp = () => {
        setIsPaused(false);
         if (currentStory?.type === 'video' && videoRef.current) videoRef.current.play().catch(e => console.error("Video play failed", e));
    };

    // This guard prevents rendering with invalid data before the useEffect can close the component.
    if (!currentUser || !currentStory) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center select-none" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}>
            <div className="relative w-full h-full max-w-sm max-h-screen bg-gray-900 rounded-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-full p-2 z-20">
                    <div className="flex items-center gap-2">
                        {(currentUser.stories ?? []).map((story, index) => (
                            <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                                {index < currentStoryIndex && <div className="h-full bg-white"></div>}
                                {index === currentStoryIndex && (
                                    // MODIFIED: Added key to restart animation on story change and onAnimationEnd to progress to the next story.
                                    <div 
                                        key={`${currentUserIndex}-${currentStoryIndex}`}
                                        className="h-full bg-white" 
                                        style={{ 
                                            animation: `progress ${currentStory.type === 'image' ? (currentStory.duration ?? 5) : 0}s linear`,
                                            animationPlayState: isPaused ? 'paused' : 'running'
                                        }}
                                        onAnimationEnd={() => {
                                            if (currentStory.type === 'image' && !isPaused) {
                                                goToNextStory();
                                            }
                                        }}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                         <div className="flex items-center gap-2">
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                            <span className="text-white font-semibold text-sm">{currentUser.name}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-white">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                {currentStory.type === 'image' ? (
                    <img src={currentStory.url} alt="story" className="w-full h-full object-contain" />
                ) : (
                    <video ref={videoRef} src={currentStory.url} onEnded={goToNextStory} className="w-full h-full object-contain" playsInline />
                )}

                <div className="absolute inset-0 flex">
                    <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); goToPrevStory(); }}></div>
                    <div className="w-1/3 h-full"></div>
                    <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); goToNextStory(); }}></div>
                </div>
            </div>
             <style>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default StoryViewer;
