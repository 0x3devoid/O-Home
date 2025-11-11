import React from 'react';
import { Property, User } from '../../types';
import { DirectionsIcon, ChatAltIcon } from '../Icons';

interface PropertyCardProps {
    property: Property;
    showDirectionsButton?: boolean;
    onClose?: () => void;
    currentUser?: User;
    onMessageLister?: (lister: User, property: Property, currentUser: User) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, showDirectionsButton, onClose, currentUser, onMessageLister }) => {
    const handleGetDirections = () => {
        // In a real app, this would open a deep link to a map application.
        // e.g., `window.open(`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`)`
        const message = `Simulating navigation to property at coordinates:\nLatitude: ${property.latitude}\nLongitude: ${property.longitude}`;
        console.log(message);
        alert(message);
    };

    const handleMessageLister = () => {
        if (onMessageLister && currentUser) {
            onMessageLister(property.lister, property, currentUser);
        }
    };

    return (
        <article className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
            <div className="flex">
                <img src={property.images[0]} alt={property.location} className="w-1/3 h-auto object-cover" />
                <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{property.location}</p>
                        <p className="text-lg font-bold text-violet-700 mt-1">₦{property.price?.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 text-xs font-medium mt-2">
                        <span>{property.beds} {property.beds === 1 ? 'bed' : 'beds'}</span>
                        <span>•</span>
                        <span>{property.baths} {property.baths === 1 ? 'bath' : 'baths'}</span>
                    </div>
                </div>
            </div>
            {(showDirectionsButton || (currentUser && onMessageLister && property.lister.id !== currentUser.id)) && (
                <div className="border-t border-gray-100 p-2">
                    <div className="flex gap-2">
                        {showDirectionsButton && (
                            <button 
                                onClick={handleGetDirections}
                                className="flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-semibold text-violet-600 bg-violet-50 rounded-md hover:bg-violet-100 transition-colors"
                            >
                                <DirectionsIcon className="w-4 h-4" />
                                Get Directions
                            </button>
                        )}
                        {currentUser && onMessageLister && property.lister.id !== currentUser.id && (
                            <button 
                                onClick={handleMessageLister}
                                className="flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                title={`Message ${property.lister.name}`}
                            >
                                <ChatAltIcon className="w-4 h-4" />
                                Message
                            </button>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
};

export default PropertyCard;
