import React, { useState } from 'react';
import { Property, User } from '../../types';
import { CalendarIcon, ClockIcon, MapPinIcon, UserCircleIcon } from '../Icons';

interface TourBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: Property;
    currentUser: User;
    onBookTour: (data: TourBookingData) => void;
}

export interface TourBookingData {
    propertyId: number;
    listerId: number;
    agentId?: number;
    requestedDate: string;
    requestedTime: string;
    message: string;
    participants: number[];
}

const TourBookingModal: React.FC<TourBookingModalProps> = ({ 
    isOpen, 
    onClose, 
    property, 
    currentUser, 
    onBookTour 
}) => {
    const [requestedDate, setRequestedDate] = useState('');
    const [requestedTime, setRequestedTime] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestedDate || !requestedTime || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const participants = [property.lister.id];
            
            // Add agent to participants if property is verified by an agent
            if (property.verifier && property.verifier.id !== property.lister.id) {
                participants.push(property.verifier.id);
            }

            const tourData: TourBookingData = {
                propertyId: property.id,
                listerId: property.lister.id,
                agentId: property.verifier?.id,
                requestedDate,
                requestedTime,
                message,
                participants
            };

            await onBookTour(tourData);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <header className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Schedule Property Tour</h2>
                    <p className="text-sm text-gray-600 mt-1">Book a tour to visit this property in person</p>
                </header>

                <div className="p-6">
                    {/* Property Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <img 
                                src={property.images[0]} 
                                alt={property.location} 
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 truncate">{property.location}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {property.beds} beds • {property.baths} baths • ₦{property.price?.toLocaleString()}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <UserCircleIcon className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{property.lister.name}</span>
                                    {property.verifier && property.verifier.id !== property.lister.id && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-sm text-blue-600">Agent: {property.verifier.name}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Date Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarIcon className="w-4 h-4 inline mr-1" />
                                Preferred Date
                            </label>
                            <input
                                type="date"
                                value={requestedDate}
                                onChange={(e) => setRequestedDate(e.target.value)}
                                min={minDate}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Time Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <ClockIcon className="w-4 h-4 inline mr-1" />
                                Preferred Time
                            </label>
                            <select
                                value={requestedTime}
                                onChange={(e) => setRequestedTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select a time</option>
                                <option value="09:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="17:00">5:00 PM</option>
                            </select>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message (Optional)
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Any specific questions or requests for the tour?"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Participants Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                                <strong>Tour Participants:</strong>
                            </p>
                            <ul className="text-sm text-blue-700 mt-1 space-y-1">
                                <li>• {property.lister.name} (Property Lister)</li>
                                {property.verifier && property.verifier.id !== property.lister.id && (
                                    <li>• {property.verifier.name} (Verified Agent)</li>
                                )}
                                <li>• You (Tour Requester)</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 px-4 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Booking...' : 'Book Tour'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TourBookingModal;
