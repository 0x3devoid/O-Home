"use client"

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Property, Neighborhood, User } from '../../types';
import { MapPinIcon, ChatAltIcon } from '../Icons';
import PropertyCard from '../property/PropertyCard';

interface MapViewProps {
    properties: Property[];
    neighborhoods: Neighborhood[];
    centerCoordinates: { lat: number; lng: number } | null;
    onSelectNeighborhood: (id: number) => void;
    currentUser?: User;
    onMessageLister?: (lister: User, property: Property, currentUser: User) => void;
}

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Custom marker icons
const createPropertyIcon = (isSelected: boolean) => {
  if (typeof window === 'undefined') return null;
  
  const L = require('leaflet');
  const iconHtml = `
    <div class="relative">
      <svg class="w-8 h-8 ${isSelected ? 'text-violet-600' : 'text-red-500'}" 
           style="transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'}; transition: all 0.2s;" 
           fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const createNeighborhoodIcon = (questionCount: number) => {
  if (typeof window === 'undefined') return null;
  
  const L = require('leaflet');
  const iconHtml = `
    <div class="relative group">
      <svg class="w-9 h-9 text-blue-600 transition-transform group-hover:scale-110" 
           fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
      <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
        ${questionCount}
      </div>
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

// Map centering component
const MapCenterer: React.FC<{ center: { lat: number; lng: number } | null }> = ({ center }) => {
  const map = require('react-leaflet').useMap();
  
  useEffect(() => {
    if (center && map) {
      map.setView([center.lat, center.lng], 13);
    }
  }, [center, map]);
  
  return null;
};

const MapView: React.FC<MapViewProps> = ({ 
  properties, 
  neighborhoods, 
  centerCoordinates, 
  onSelectNeighborhood,
  currentUser,
  onMessageLister
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Default center (Lagos, Nigeria)
  const defaultCenter = { lat: 6.5244, lng: 3.3792 };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const renderMap = () => {
    if (!isClient) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <div className="text-gray-500">Loading map...</div>
        </div>
      );
    }

    return (
      <MapContainer
        center={[centerCoordinates?.lat || defaultCenter.lat, centerCoordinates?.lng || defaultCenter.lng]}
        zoom={13}
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenterer center={centerCoordinates} />
        
        {/* Property markers */}
        {properties.map(property => {
          if (!property.latitude || !property.longitude) return null;
          const isSelected = selectedProperty?.id === property.id;
          
          return (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createPropertyIcon(isSelected)}
              eventHandlers={{
                click: () => handlePropertyClick(property),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-sm mb-1">{property.location || 'Property'}</h3>
                  <p className="text-xs text-gray-600 mb-2">{property.description.substring(0, 100)}...</p>
                  <p className="text-sm font-medium text-blue-600">
                    {property.price ? `$${property.price.toLocaleString()}` : 'Price not available'}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Neighborhood markers */}
        {neighborhoods.map(hub => {
          if (!hub.latitude || !hub.longitude) return null;
          
          return (
            <Marker
              key={`hub-${hub.id}`}
              position={[hub.latitude, hub.longitude]}
              icon={createNeighborhoodIcon(hub.questions.length)}
              eventHandlers={{
                click: () => onSelectNeighborhood(hub.id),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[150px]">
                  <h3 className="font-semibold text-sm mb-1">{hub.name}</h3>
                  <p className="text-xs text-gray-600">{hub.questions.length} questions</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    );
  };

  return (
    <div className="relative w-full h-full">
      {renderMap()}
      
      {/* Selected property card */}
      {selectedProperty && (
        <div className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-[90%] sm:w-80">
          <PropertyCard 
            property={selectedProperty} 
            showDirectionsButton={true}
            onClose={() => setSelectedProperty(null)}
            currentUser={currentUser}
            onMessageLister={onMessageLister}
          />
        </div>
      )}
    </div>
  );
};

export default MapView;
