import React, { useState, useRef, useEffect } from 'react';
import { Property, User } from '../../types';
import { CameraIcon, MapPinIcon, CloseIcon, CheckIcon, AlertIcon } from '../Icons';

interface EnhancedVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  currentUser: User;
  onSubmitVerification: (verificationData: VerificationData) => void;
}

interface VerificationData {
  propertyId: number;
  verifierId: number;
  photos: string[];
  geolocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  };
  notes: string;
}

const EnhancedVerificationModal: React.FC<EnhancedVerificationModalProps> = ({
  isOpen,
  onClose,
  property,
  currentUser,
  onSubmitVerification
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'accept' | 'capture' | 'location' | 'review'>('accept');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Property location for comparison
  const propertyLocation = {
    latitude: 6.5244, // Default Lagos coordinates - in real app, this would come from property data
    longitude: 3.3792,
  };

  const maxDistanceMeters = 0.5; // 0.5 meter radius requirement

  useEffect(() => {
    if (isOpen && verificationStep === 'location') {
      getCurrentLocation();
    }
  }, [isOpen, verificationStep]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setCurrentLocation(location);
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError(getLocationErrorMessage(error));
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const getLocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location permission denied. Please enable location access.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable.';
      case error.TIMEOUT:
        return 'Location request timed out.';
      default:
        return 'An unknown error occurred while getting location.';
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const isWithinRequiredRadius = (): boolean => {
    if (!currentLocation) return false;
    
    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      propertyLocation.latitude,
      propertyLocation.longitude
    );
    
    return distance <= maxDistanceMeters;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const photoData = canvas.toDataURL('image/jpeg', 0.9);
        setPhotos(prev => [...prev, photoData]);
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPhotos(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async () => {
    if (!currentLocation || !isWithinRequiredRadius()) {
      alert('You must be within 0.5 meters of the property location to submit verification.');
      return;
    }

    if (photos.length === 0) {
      alert('Please capture at least one photo of the property.');
      return;
    }

    setIsSubmitting(true);

    const verificationData: VerificationData = {
      propertyId: property.id,
      verifierId: currentUser.id,
      photos,
      geolocation: {
        ...currentLocation,
        timestamp: new Date().toISOString(),
      },
      notes,
    };

    try {
      await onSubmitVerification(verificationData);
      onClose();
      // Reset state
      setPhotos([]);
      setNotes('');
      setCurrentLocation(null);
      setVerificationStep('accept');
      stopCamera();
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert('Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Verify Property</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <CloseIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{property.location}</h3>
            <p className="text-sm text-gray-600">{property.description}</p>
            <p className="text-xs text-gray-500 mt-2">Listed by: {property.lister.name}</p>
          </div>

          {/* Step 1: Accept Verification */}
          {verificationStep === 'accept' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <AlertIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Verification Requirements</p>
                  <p className="text-sm text-blue-700 mt-1">
                    You must be within 0.5 meters of the property location and capture clear photos of the property.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-violet-600 rounded" />
                  <span className="text-sm text-gray-700">I am at the property location</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-violet-600 rounded" />
                  <span className="text-sm text-gray-700">I will capture clear, accurate photos</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-violet-600 rounded" />
                  <span className="text-sm text-gray-700">I understand this is a legal verification</span>
                </label>
              </div>

              <button
                onClick={() => setVerificationStep('location')}
                className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
              >
                Start Verification
              </button>
            </div>
          )}

          {/* Step 2: Location Verification */}
          {verificationStep === 'location' && (
            <div className="space-y-4">
              <div className="text-center">
                <MapPinIcon className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Location</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You must be within 0.5 meters of the property to proceed.
                </p>
              </div>

              {isGettingLocation && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600">Getting your location...</p>
                </div>
              )}

              {locationError && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">{locationError}</p>
                </div>
              )}

              {currentLocation && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${isWithinRequiredRadius() ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isWithinRequiredRadius() ? (
                        <CheckIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertIcon className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-medium ${isWithinRequiredRadius() ? 'text-green-900' : 'text-red-900'}`}>
                        {isWithinRequiredRadius() ? 'Location Verified' : 'Too Far From Property'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your location: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Accuracy: ±{currentLocation.accuracy.toFixed(0)} meters
                    </p>
                    {!isWithinRequiredRadius() && (
                      <p className="text-sm text-red-700 mt-2">
                        Please move within 0.5 meters of the property location.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={getCurrentLocation}
                    className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Refresh Location
                  </button>

                  {isWithinRequiredRadius() && (
                    <button
                      onClick={() => setVerificationStep('capture')}
                      className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
                    >
                      Continue to Photo Capture
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Photo Capture */}
          {verificationStep === 'capture' && (
            <div className="space-y-4">
              <div className="text-center">
                <CameraIcon className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Capture Property Photos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Take clear photos of the property exterior and key features.
                </p>
              </div>

              {/* Camera View */}
              {!isCapturing ? (
                <div className="space-y-4">
                  <button
                    onClick={startCamera}
                    className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CameraIcon className="w-5 h-5" />
                    Open Camera
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Upload Photos from Gallery
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                      <button
                        onClick={capturePhoto}
                        className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <CameraIcon className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={stopCamera}
                        className="p-4 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <CloseIcon className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Photo Preview */}
              {photos.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Captured Photos ({photos.length})</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Property photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {photos.length > 0 && (
                <button
                  onClick={() => setVerificationStep('review')}
                  className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
                >
                  Review & Submit
                </button>
              )}
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {verificationStep === 'review' && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Verification</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please review your verification details before submitting.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Location Status</h4>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">Within required radius</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Photos Captured</h4>
                  <p className="text-sm text-gray-600">{photos.length} photo(s)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Add any additional notes about the property verification..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setVerificationStep('capture')}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Verification'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedVerificationModal;
