import React, { useState, useMemo } from 'react';
import { Neighborhood, Property, User, SearchTeam, Question } from '../types';
import { ArrowLeftIcon, SendIcon, StarIcon } from '../components/Icons';
import QuestionCard from '../components/neighborhood/QuestionCard';
import PropertyPost from '../components/property/PropertyPost';
import UserVerifiedBadge from '../components/common/UserVerifiedBadge';
import NeighborhoodReviewCard from '../components/neighborhood/NeighborhoodReviewCard';
import NeighborhoodRatingSummary from '../components/neighborhood/NeighborhoodRatingSummary';

interface NeighborhoodHubScreenProps {
    neighborhood: Neighborhood;
    allProperties: Property[];
    allUsers: User[];
    currentUser: User;
    onClose: () => void;
    onViewProfile: (userId: number) => void;
    onViewComments: (property: Property) => void;
    onStartVerification: (property: Property) => void;
    onMessageLister: (lister: User, property: Property) => void;
    onShareToTeam: (teamId: number, property: Property) => void;
    onShare: (property: Property) => void;
    onRepost: (property: Property, quote?: string) => void;
    teams: SearchTeam[];
    onAskQuestion: (neighborhoodId: number, text: string) => void;
    onAddAnswer: (neighborhoodId: number, questionId: number, text: string) => void;
    onViewOnMap: (property: Property) => void;
    onOpenDeleteModal: (property: Property) => void;
    onBlockUser: (userId: number) => void;
}

const AgentCard: React.FC<{ agent: User; onViewProfile: (userId: number) => void; }> = ({ agent, onViewProfile }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
            <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full" />
            <div>
                <div className="flex items-center gap-1.5">
                    <p className="font-bold text-gray-800">{agent.name}</p>
                    <UserVerifiedBadge user={agent} />
                </div>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">{agent.bio}</p>
            </div>
        </div>
        <button 
            onClick={() => onViewProfile(agent.id)}
            className="px-3 py-1.5 text-xs font-semibold bg-violet-100 text-violet-700 rounded-full hover:bg-violet-200"
        >
            View Profile
        </button>
    </div>
);


const NeighborhoodHubScreen: React.FC<NeighborhoodHubScreenProps> = (props) => {
    const { 
        neighborhood, allProperties, allUsers, currentUser, onClose, onViewProfile, 
        teams, onShareToTeam, onShare, onRepost, onAskQuestion, onAddAnswer, onViewOnMap,
        onOpenDeleteModal, onBlockUser, onMessageLister, onStartVerification, onViewComments
    } = props;
    const [activeTab, setActiveTab] = useState<'qa' | 'listings' | 'agents' | 'reviews'>('qa');
    const [newQuestion, setNewQuestion] = useState('');

    const verifiedListings = useMemo(() => 
        allProperties.filter(p => p.neighborhoodId === neighborhood.id && p.verificationStatus === 'verified'),
        [allProperties, neighborhood.id]
    );

    const localAgents = useMemo(() => 
        allUsers.filter(u => u.agentStatus === 'verified' && u.activeInNeighborhoods?.includes(neighborhood.id)),
        [allUsers, neighborhood.id]
    );
    
    const handleAskQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newQuestion.trim()) {
            onAskQuestion(neighborhood.id, newQuestion.trim());
            setNewQuestion('');
        }
    };
    
    const handleAddAnswerSubmit = (questionId: number, text: string) => {
        onAddAnswer(neighborhood.id, questionId, text);
    };

    return (
        <div className="absolute inset-0 bg-white z-40 flex flex-col">
            <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-20">
                <div className="p-4 flex items-center space-x-4">
                    <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">{neighborhood.name} Hub</h1>
                </div>
                 <div className="border-b border-gray-200">
                    <nav className="flex justify-around">
                        <button onClick={() => setActiveTab('qa')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'qa' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Q&A</button>
                        <button onClick={() => setActiveTab('reviews')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'reviews' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Reviews</button>
                        <button onClick={() => setActiveTab('listings')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'listings' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Listings</button>
                        <button onClick={() => setActiveTab('agents')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'agents' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Agents</button>
                    </nav>
                </div>
            </header>
            
            <main className="flex-grow overflow-y-auto bg-gray-50">
                {activeTab === 'qa' && (
                    <>
                        <div className="p-4 bg-white border-b border-gray-200">
                            <h3 className="font-semibold mb-2 text-gray-800">Have a question? Ask the community!</h3>
                            <form onSubmit={handleAskQuestionSubmit} className="flex items-center space-x-2">
                                <img src={currentUser.avatar} alt="Your avatar" className="w-9 h-9 rounded-full" />
                                <input
                                    type="text"
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    placeholder={`Ask about ${neighborhood.name}...`}
                                    className="flex-grow px-4 py-2 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                                <button type="submit" className="p-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-violet-300" disabled={!newQuestion.trim()}>
                                    <SendIcon className="w-5 h-5"/>
                                </button>
                            </form>
                        </div>
                        <div className="p-4 space-y-4">
                            {neighborhood.questions.map(q => <QuestionCard key={q.id} question={q} onViewProfile={onViewProfile} currentUser={currentUser} onAddAnswer={handleAddAnswerSubmit} />)}
                        </div>
                    </>
                )}
                 {activeTab === 'reviews' && (
                    <div className="p-4 space-y-4">
                        <NeighborhoodRatingSummary reviews={neighborhood.reviews || []} />
                        <button className="w-full py-2.5 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700">Write a Review</button>
                        {(neighborhood.reviews || []).map(review => (
                            <NeighborhoodReviewCard key={review.id} review={review} onViewProfile={onViewProfile} />
                        ))}
                    </div>
                )}
                {activeTab === 'listings' && (
                     <div className="divide-y divide-gray-100 bg-white">
                        {verifiedListings.length > 0 ? (
                           verifiedListings.map(p => 
                                <PropertyPost 
                                    key={p.id} 
                                    property={p} 
                                    currentUser={currentUser} 
                                    onViewProfile={onViewProfile} 
                                    onViewComments={() => onViewComments(p)} 
                                    onStartVerification={() => onStartVerification(p)} 
                                    onMessageLister={onMessageLister} 
                                    onViewNeighborhood={() => {}} 
                                    onShareToTeam={onShareToTeam} 
                                    onRepost={onRepost}
                                    teams={teams} 
                                    onViewOnMap={() => onViewOnMap(p)}
                                    onOpenDeleteModal={() => onOpenDeleteModal(p)}
                                    onBlockUser={() => onBlockUser(p.lister.id)}
                                />
                            )
                        ) : (
                           <p className="p-8 text-center text-gray-500">No edQorta-Verified properties in this area yet.</p>
                        )}
                    </div>
                )}
                {activeTab === 'agents' && (
                     <div className="p-4 space-y-3">
                        {localAgents.length > 0 ? (
                           localAgents.map(agent => <AgentCard key={agent.id} agent={agent} onViewProfile={onViewProfile} />)
                        ) : (
                           <p className="p-8 text-center text-gray-500">No active local agents in this area yet.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default NeighborhoodHubScreen;
