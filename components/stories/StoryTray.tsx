import React, { useRef } from 'react';
import { User } from '../../types';
import { PlusCircleIcon, PlayIcon } from '../Icons';

interface StoryTrayProps {
    currentUser: User;
    usersWithStories: User[];
    onAddStory: (file: File) => void;
    onViewStory: (user: User) => void;
}

const StoryCard: React.FC<{ user: User; onClick: () => void }> = ({ user, onClick }) => {
    const latestStory = user.stories?.[0];
    if (!latestStory) return null;

    return (
        <button 
            onClick={onClick} 
            className="relative w-28 h-44 rounded-xl overflow-hidden flex-shrink-0 group transition-transform duration-200 ease-in-out hover:scale-105"
        >
            {latestStory.type === 'image' ? (
                <img src={latestStory.url} alt={`${user.name}'s story`} className="w-full h-full object-cover" />
            ) : (
                <>
                    <video src={latestStory.url} muted playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <PlayIcon className="w-8 h-8 text-white/80 drop-shadow-lg" />
                    </div>
                </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute top-2 left-2 p-0.5 border-2 border-violet-500 rounded-full">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            </div>
            <p className="absolute bottom-2 left-2 text-white text-xs font-semibold truncate w-[90%] text-left">{user.name}</p>
        </button>
    );
};

const AddStoryCard: React.FC<{ user: User; onAdd: (file: File) => void }> = ({ user, onAdd }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onAdd(file);
        }
    };
    
    return (
        <div className="w-28 h-44 rounded-xl flex-shrink-0 overflow-hidden relative group transition-transform duration-200 ease-in-out hover:scale-105">
             <button onClick={() => fileInputRef.current?.click()} className="w-full h-full">
                <img src={user.avatar} alt="Your Story" className="w-full h-full object-cover blur-[2px]" />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 text-white">
                    <div className="bg-violet-600 rounded-full p-1 border-2 border-white">
                        <PlusCircleIcon />
                    </div>
                    <p className="text-xs font-semibold mt-2">Create Story</p>
                </div>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
            />
        </div>
    );
};

const StoryTray: React.FC<StoryTrayProps> = ({ currentUser, usersWithStories, onAddStory, onViewStory }) => {
    const otherUsersWithStories = usersWithStories.filter(u => u.id !== currentUser.id);

    return (
        <div className="p-3 bg-white">
            <div className="flex space-x-3 overflow-x-auto no-scrollbar">
                <AddStoryCard user={currentUser} onAdd={onAddStory} />
                {otherUsersWithStories.map(user => (
                    <StoryCard key={user.id} user={user} onClick={() => onViewStory(user)} />
                ))}
            </div>
        </div>
    );
};

export default StoryTray;
