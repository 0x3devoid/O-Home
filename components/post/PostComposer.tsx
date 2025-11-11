import React, { useState, useRef, useEffect } from 'react';
import PostForm, { NewPropertyData } from './PostForm';
import { User } from '../../types';
import { CameraIcon, CloseIcon } from '../Icons';

interface PostComposerProps {
    onCreatePost: (data: NewPropertyData) => Promise<void>;
    currentUser: User;
    onAddStory: (file: File) => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ onCreatePost, currentUser, onAddStory }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const composerRef = useRef<HTMLDivElement>(null);

    // Click outside to collapse
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (composerRef.current && !composerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePostSuccess = () => {
        setIsExpanded(false);
    };

    const handleCancel = () => {
        setIsExpanded(false);
    };

    if (isExpanded) {
        return (
            <div className="p-4 border-b border-gray-200 bg-white">
                <PostForm
                    onSubmit={onCreatePost}
                    currentUser={currentUser}
                    onAddStory={onAddStory}
                    onCancel={handleCancel}
                    onPostSuccess={handlePostSuccess}
                />
            </div>
        );
    }

    return (
        <div ref={composerRef} className="p-4 border-b border-gray-200 bg-white">
            <div 
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
                <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <p className="text-gray-500">Share a property or post an update...</p>
                </div>
                <button className="p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors">
                    <CameraIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default PostComposer;
