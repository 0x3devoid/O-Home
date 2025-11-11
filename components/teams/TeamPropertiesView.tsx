import React, { useState } from 'react';
import { SearchTeam, Property, User, SharedProperty, TeamComment } from '../../types';
import { SendIcon } from '../Icons';
import PropertyCard from '../property/PropertyCard';

interface TeamPropertiesViewProps {
    team: SearchTeam;
    allProperties: Property[];
    currentUser: User;
    onAddComment: (teamId: number, propertyId: number, text: string) => void;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000; if (interval > 1) return `${Math.floor(interval)}y`;
    interval = seconds / 2592000; if (interval > 1) return `${Math.floor(interval)}mo`;
    interval = seconds / 86400; if (interval > 1) return `${Math.floor(interval)}d`;
    interval = seconds / 3600; if (interval > 1) return `${Math.floor(interval)}h`;
    interval = seconds / 60; if (interval > 1) return `${Math.floor(interval)}m`;
    return `${Math.floor(seconds)}s`;
};

const CommentForm: React.FC<{ onSubmit: (text: string) => void }> = ({ onSubmit }) => {
    const [text, setText] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(text.trim()) {
            onSubmit(text.trim());
            setText('');
        }
    };
    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
            <input 
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Add a private comment..."
                className="flex-grow px-3 py-1.5 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm"
            />
            <button type="submit" className="p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-violet-300" disabled={!text.trim()}>
                <SendIcon className="w-4 h-4" />
            </button>
        </form>
    );
};

const TeamPropertyCard: React.FC<{ sharedProp: SharedProperty, property: Property, teamId: number, onAddComment: (teamId: number, propertyId: number, text: string) => void }> = ({ sharedProp, property, teamId, onAddComment }) => {
    return (
        <div className="bg-white p-3 rounded-lg border border-gray-200">
            <PropertyCard property={property} />
            <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">Team Comments ({sharedProp.comments.length})</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {sharedProp.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-2 text-sm">
                            <img src={comment.author.avatar} alt={comment.author.name} className="w-6 h-6 rounded-full flex-shrink-0" />
                            <div>
                                <div>
                                    <span className="font-semibold text-gray-800">{comment.author.name}</span>
                                    <span className="text-xs text-gray-500 ml-1">@{comment.author.username}</span>
                                </div>
                                <p className="text-gray-600">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <CommentForm onSubmit={(text) => onAddComment(teamId, property.id, text)} />
            </div>
        </div>
    );
};


const TeamPropertiesView: React.FC<TeamPropertiesViewProps> = ({ team, allProperties, currentUser, onAddComment }) => {
    return (
        <div className="p-4 space-y-4">
            {team.sharedProperties.length > 0 ? (
                team.sharedProperties.map(sharedProp => {
                    const property = allProperties.find(p => p.id === sharedProp.propertyId);
                    if (!property) return null;
                    return (
                        <TeamPropertyCard 
                            key={sharedProp.propertyId}
                            sharedProp={sharedProp}
                            property={property}
                            teamId={team.id}
                            onAddComment={onAddComment}
                        />
                    );
                })
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-700">Property Shortlist is Empty</h3>
                    <p className="text-gray-500 mt-1">Share properties to this team to start collaborating.</p>
                </div>
            )}
        </div>
    );
};

export default TeamPropertiesView;
