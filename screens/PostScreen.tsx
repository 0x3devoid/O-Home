import React from 'react';
import PostComposer from '../components/post/PostComposer';
import { NewPropertyData } from '../components/post/PostForm';
import { User } from '../types';

// The props for this component would need to be passed down from a parent router.
interface PostScreenProps {
    onCreatePost: (data: NewPropertyData) => Promise<void>;
    currentUser: User;
    onAddStory: (file: File) => void;
}

const PostScreen: React.FC<PostScreenProps> = ({ onCreatePost, currentUser, onAddStory }) => {
    return (
        <div className="w-full h-full bg-white pt-4">
            <div className="max-w-2xl mx-auto">
                 <PostComposer 
                    onCreatePost={onCreatePost} 
                    currentUser={currentUser} 
                    onAddStory={onAddStory}
                />
            </div>
        </div>
    );
};

export default PostScreen;
