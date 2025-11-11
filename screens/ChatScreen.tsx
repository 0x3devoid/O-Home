import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, Property, User, SearchTeam } from '../types';
import { SendIcon, SpinnerIcon, ClipboardListIcon, CalendarIcon, CashIcon, MicrophoneIcon, TrashIcon } from '../components/Icons';
import TenancyAgreement from '../components/chat/TenancyAgreement';
import TeamPropertiesView from '../components/teams/TeamPropertiesView';
import AudioPlayer from '../components/chat/AudioPlayer';

interface ChatScreenProps {
  conversation: Conversation;
  properties: Property[];
  allUsers: User[];
  currentUser: User;
  onBack: () => void;
  onMarkAsRead: (conversationId: number) => void;
  onSendMessage: (conversationId: number, text: string) => Promise<void>;
  onSendAudioMessage: (conversationId: number, audio: { url: string, duration: number }) => Promise<void>;
  onOpenPaymentModal: (conversation: Conversation) => void;
  onOpenAgreementModal: (conversation: Conversation) => void;
  onLeaveReview: (user: User) => void;
  searchTeam?: SearchTeam;
  onAddTeamComment: (teamId: number, propertyId: number, text: string) => void;
  onScheduleTour: (property: Property) => void;
}

const SystemMessage: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-center text-xs text-gray-500 my-2 px-4 py-1 bg-gray-100 rounded-full self-center">
    {text}
  </div>
);

const ChatBubble: React.FC<{ message: Message; isOutgoing: boolean }> = ({ message, isOutgoing }) => (
  <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
      isOutgoing
        ? 'bg-violet-600 text-white rounded-br-none'
        : 'bg-gray-200 text-gray-800 rounded-bl-none'
    }`}>
      {message.audio ? (
        <AudioPlayer url={message.audio.url} duration={message.audio.duration} />
      ) : (
        <p>{message.text}</p>
      )}
    </div>
  </div>
);

const InspectionContextHeader: React.FC<{ property: Property }> = ({ property }) => (
    <div className="sticky top-0 bg-violet-50 border-b border-violet-200 p-3 z-20">
        <div className="flex items-center gap-3">
            <ClipboardListIcon className="w-6 h-6 text-violet-600 flex-shrink-0" />
            <div className="min-w-0">
                <p className="text-sm font-bold text-violet-800 truncate">Property Inquiry</p>
                <p className="text-xs text-violet-700 truncate">
                    {property.location}
                </p>
            </div>
        </div>
    </div>
);


const ChatScreen: React.FC<ChatScreenProps> = (props) => {
  const {
    conversation, properties, allUsers, currentUser, onBack, onMarkAsRead, 
    onSendMessage, onSendAudioMessage, onOpenPaymentModal, onOpenAgreementModal, 
    onLeaveReview, searchTeam, onAddTeamComment, onScheduleTour,
  } = props;
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'properties'>('chat');

  // Voice message state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<number | null>(null);
  
  const otherParticipants = conversation.participants.filter(p => p && p.id !== currentUser.id);
  const relatedProperty = properties.find(p => p.id === conversation.propertyId);
  
  const lister = relatedProperty?.lister;
  const renter = lister ? conversation.participants.find(p => p && p.id !== lister.id && (!relatedProperty.verifier || p.id !== relatedProperty.verifier.id)) : null;

  const isCurrentUserRenter = currentUser.id === renter?.id;
  const isCurrentUserLister = currentUser.id === lister?.id;
  const userToReview = isCurrentUserRenter ? lister : (isCurrentUserLister ? renter : null);
  const hasReviewed = userToReview?.reviews?.some(r => r.reviewer.id === currentUser.id);
  
  useEffect(() => { onMarkAsRead(conversation.id); }, [conversation.id, onMarkAsRead]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversation.messages, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isSending) return;
    setIsSending(true);
    try {
      await onSendMessage(conversation.id, newMessage.trim());
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Get duration
        const audio = new Audio(audioUrl);
        audio.onloadedmetadata = () => {
          onSendAudioMessage(conversation.id, { url: audioUrl, duration: audio.duration });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Microphone access was denied. Please allow microphone access in your browser settings.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const handleCancelRecording = () => {
    if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
    }
     setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
        }
    }
  }, []);

  if (otherParticipants.length === 0 && !searchTeam) {
      return (
          <div className="flex flex-col h-full items-center justify-center">
              <p>Loading chat...</p>
              <button onClick={onBack} className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg">Back</button>
          </div>
      );
  }

  const renderChatContent = () => (
    <>
      {conversation.messages.map(message =>
        message.type === 'system' ? (
          <SystemMessage key={message.id} text={message.text!} />
        ) : (
          <ChatBubble key={message.id} message={message} isOutgoing={message.senderId === currentUser.id} />
        )
      )}
       {relatedProperty && conversation.dealStatus && conversation.dealStatus === 'complete' && (
          <TenancyAgreement conversation={conversation} property={relatedProperty} currentUser={currentUser} />
       )}
      <div ref={messagesEndRef} />
    </>
  );

  return (
    <div className="flex flex-col h-full bg-white relative">
      {relatedProperty && !searchTeam && <InspectionContextHeader property={relatedProperty} />}
      {searchTeam && (
        <div className="border-b border-gray-200">
            <nav className="flex justify-around">
                 <button onClick={() => setActiveTab('chat')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'chat' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Chat</button>
                 <button onClick={() => setActiveTab('properties')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'properties' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Shared Properties ({searchTeam.sharedProperties.length})</button>
            </nav>
        </div>
      )}
      
      <main className={`flex-grow overflow-y-auto no-scrollbar flex flex-col ${activeTab === 'chat' ? 'p-4 space-y-4' : 'bg-gray-50'}`}>
        {activeTab === 'chat' && renderChatContent()}
        {activeTab === 'properties' && searchTeam && (
            <TeamPropertiesView 
                team={searchTeam}
                allProperties={properties}
                currentUser={currentUser}
                onAddComment={onAddTeamComment}
            />
        )}
      </main>

      <footer className="p-2 sm:p-4 bg-white border-t border-gray-100">
        {activeTab === 'chat' && (
          <>
            {relatedProperty && conversation.dealStatus === 'agreement_pending' && isCurrentUserRenter && (
                 <button onClick={() => onOpenAgreementModal(conversation)} className="w-full mb-2 py-2.5 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700">
                    Review & Sign Agreement
                </button>
            )}
            {conversation.dealStatus === 'complete' && userToReview && !hasReviewed && (
                <button onClick={() => onLeaveReview(userToReview)} className="w-full mb-2 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700">
                    Leave a Review for {userToReview.name}
                </button>
            )}
            {isRecording ? (
                <div className="flex items-center space-x-2">
                    <button onClick={handleCancelRecording} className="p-3 text-white bg-red-500 rounded-full">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                    <div className="flex-grow px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-mono text-sm">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                        <span className="text-gray-500 text-sm animate-pulse">Recording...</span>
                    </div>
                    <button onMouseUp={handleStopRecording} onTouchEnd={handleStopRecording} className="p-3 bg-violet-600 text-white rounded-full">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  {!searchTeam && (
                    <>
                        <button
                            type="button"
                            onClick={() => relatedProperty && onScheduleTour(relatedProperty)}
                            disabled={!relatedProperty}
                            className="p-2 text-gray-500 rounded-full hover:bg-violet-100 hover:text-violet-600 transition-colors flex-shrink-0 disabled:text-gray-300 disabled:hover:bg-transparent"
                            aria-label="Schedule a tour"
                        >
                            <CalendarIcon className="w-6 h-6" />
                        </button>
                        <button
                            type="button"
                            onClick={() => relatedProperty && onOpenPaymentModal(conversation)}
                            disabled={!relatedProperty}
                            className="p-2 text-gray-500 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors flex-shrink-0 disabled:text-gray-300 disabled:hover:bg-transparent"
                            aria-label="Make payment"
                        >
                            <CashIcon className="w-6 h-6" />
                        </button>
                    </>
                  )}
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow px-4 py-2 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 caret-black"
                  />
                  {newMessage.trim() ? (
                    <button type="submit" className="p-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-violet-300 flex-shrink-0" disabled={!newMessage.trim() || isSending}>
                      {isSending ? <SpinnerIcon className="w-5 h-5"/> : <SendIcon className="w-5 h-5"/>}
                    </button>
                  ) : (
                    <button type="button" onMouseDown={handleStartRecording} onTouchStart={handleStartRecording} onMouseUp={handleStopRecording} onTouchEnd={handleStopRecording} className="p-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 flex-shrink-0">
                      <MicrophoneIcon className="w-5 h-5" />
                    </button>
                  )}
                </form>
            )}
          </>
        )}
      </footer>
    </div>
  );
};

export default ChatScreen;
