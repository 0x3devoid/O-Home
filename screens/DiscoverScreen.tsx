

import React, { useState, useEffect, useRef } from 'react';
import { Property, User } from '../types';
import DiscoverPost from '../components/discover/DiscoverPost';
import { logger } from '../utils/logger';

interface DiscoverScreenProps {
  properties: Property[];
  currentUser: User;
  onViewComments: (property: Property) => void;
}

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ properties, currentUser, onViewComments }) => {
  logger.log('Component:DiscoverScreen', 'Component rendering or re-rendering.');
  const [activePropertyId, setActivePropertyId] = useState<number | null>(null);
  const postRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  logger.log('Component:DiscoverScreen', 'Current state', { activePropertyId, propertiesCount: properties.length });

  // Effect 1: Set the initial active property only when the list loads for the first time.
  useEffect(() => {
    logger.log('Component:DiscoverScreen', 'Effect 1 (initial active property) triggered.');
    if (properties.length > 0 && activePropertyId === null) {
      logger.log('Component:DiscoverScreen', 'Effect 1: Conditions met. Setting activePropertyId to first property.', { id: properties[0].id });
      setActivePropertyId(properties[0].id);
    } else {
      logger.log('Component:DiscoverScreen', 'Effect 1: Conditions not met.', { propertiesLength: properties.length, activePropertyId });
    }
  }, [properties, activePropertyId]);

  // Effect 2: Set up the intersection observer to track which post is visible.
  useEffect(() => {
    logger.log('Component:DiscoverScreen', 'Effect 2 (IntersectionObserver setup) triggered.');
    if (observerRef.current) {
      logger.log('Component:DiscoverScreen', 'Effect 2: Disconnecting previous observer.');
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        logger.log('Component:DiscoverScreen', 'IntersectionObserver callback fired.', { entriesCount: entries.length });
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const propertyId = Number(entry.target.getAttribute('data-property-id'));
            logger.log('Component:DiscoverScreen', 'IntersectionObserver: Entry is intersecting.', { propertyId });
            if (propertyId) {
              setActivePropertyId(propertyId);
            }
          }
        });
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.7, // Trigger when 70% of the post is visible
      }
    );
    observerRef.current = observer;
    logger.log('Component:DiscoverScreen', 'Effect 2: New observer created.');

    const currentRefs = postRefs.current;
    logger.log('Component:DiscoverScreen', 'Effect 2: Observing refs.', { refCount: currentRefs.size });
    currentRefs.forEach(postEl => {
      if (postEl) observer.observe(postEl);
    });

    return () => {
      logger.log('Component:DiscoverScreen', 'Effect 2 cleanup: Disconnecting observer.');
      observer.disconnect();
    };
  }, [properties]); // Dependency is correct now.

  // Effect 3: Update the URL when the active post changes.
  useEffect(() => {
    logger.log('Component:DiscoverScreen', 'Effect 3 (URL update) triggered.');
    if (activePropertyId !== null) {
      try {
        const newUrl = `${window.location.pathname}?view=discover&post=${activePropertyId}`;
        logger.log('Component:DiscoverScreen', 'Effect 3: Attempting to update URL.', { newUrl });
        window.history.replaceState({ path: newUrl }, '', newUrl);
      } catch (error) {
        logger.warn('Component:DiscoverScreen', 'Could not update URL. This may happen in sandboxed environments (e.g., with blob: URLs). The app will continue to function.', { error });
      }
    }
  }, [activePropertyId]);

  logger.log('Component:DiscoverScreen', 'Preparing to return JSX.');
  if (properties.length === 0) {
    logger.warn('Component:DiscoverScreen', 'No properties to render. Returning empty div.');
    return <div className="h-full w-full bg-black flex items-center justify-center text-white">No discoverable posts available.</div>
  }

  return (
    <div ref={scrollContainerRef} className="relative h-full w-full snap-y snap-mandatory overflow-y-auto no-scrollbar bg-black">
      {properties.map(property => {
        logger.log('Component:DiscoverScreen', `Mapping property to DiscoverPost component`, { propertyId: property.id });
        return (
          <div 
            key={property.id} 
            ref={el => {
              if (el) {
                postRefs.current.set(property.id, el);
              } else {
                postRefs.current.delete(property.id);
              }
            }}
            data-property-id={property.id}
            className="h-full w-full snap-start flex-shrink-0"
          >
            <DiscoverPost 
              property={property} 
              currentUser={currentUser}
              onViewComments={() => onViewComments(property)}
              isActive={activePropertyId === property.id}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DiscoverScreen;