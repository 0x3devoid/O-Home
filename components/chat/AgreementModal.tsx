import React from 'react';
import { Conversation, Property, User } from '../../types';
import TenancyAgreement from './TenancyAgreement';

interface AgreementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSign: () => void;
    conversation: Conversation;
    property: Property;
    currentUser: User;
}

const AgreementModal: React.FC<AgreementModalProps> = ({ isOpen, onClose, onSign, conversation, property, currentUser }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 text-center">Finalize Your Agreement</h2>
                </header>
                <main className="p-6 max-h-[60vh] overflow-y-auto">
                    <TenancyAgreement conversation={conversation} property={property} currentUser={currentUser} />
                </main>
                 <footer className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex flex-col items-center">
                    <button 
                        onClick={onSign}
                        className="w-full max-w-xs py-2.5 text-sm font-semibold bg-violet-600 text-white rounded-full hover:bg-violet-700"
                    >
                        Agree to Terms & Finalize Deal
                    </button>
                    <button 
                        onClick={onClose} 
                        className="mt-2 text-sm text-gray-600 hover:underline"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AgreementModal;
