import React, { useState, useMemo, useEffect } from 'react';
import { Property, User, Neighborhood } from '../types';
import { MapIcon, ListIcon, SearchIcon, FilterIcon, UsersIcon } from '../components/Icons';
import MapView from '../components/map/MapView';
import PropertyCard from '../components/property/PropertyCard';
import FilterModal, { FilterState } from '../components/search/FilterModal';
import NeighborhoodHubCard from '../components/neighborhood/NeighborhoodHubCard';

const defaultFilters: FilterState = {
  type: 'all',
  minPrice: '',
  maxPrice: '',
  beds: 0,
  baths: 0,
};

interface InitialSearchState {
    query: string;
    coords: { lat: number; lng: number };
    viewMode: 'map' | 'list';
}

interface SearchScreenProps {
  currentUser: User;
  allProperties: Property[];
  allNeighborhoods: Neighborhood[];
  onViewNeighborhood: (neighborhoodId: number) => void;
  onOpenCreateTeam: () => void;
  initialState: InitialSearchState | null;
  onClearInitialState: () => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ currentUser, allProperties, allNeighborhoods, onViewNeighborhood, onOpenCreateTeam, initialState, onClearInitialState }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (initialState) {
        setSearchQuery(initialState.query);
        setMapCenter(initialState.coords);
        setViewMode(initialState.viewMode);
        onClearInitialState();
    }
  }, [initialState, onClearInitialState]);


  const matchingHub = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return null;
    return allNeighborhoods.find(n => n.name.toLowerCase() === trimmedQuery);
  }, [searchQuery, allNeighborhoods]);

  const filteredProperties = useMemo(() => {
    return allProperties
      .filter(property => {
        if (property.postType === 'normal') return false; 

        if (searchQuery && !property.location?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        if (appliedFilters.type !== 'all' && property.type !== appliedFilters.type) {
          return false;
        }
        const minPrice = parseInt(appliedFilters.minPrice, 10);
        if (!isNaN(minPrice) && (property.price ?? 0) < minPrice) {
          return false;
        }
        const maxPrice = parseInt(appliedFilters.maxPrice, 10);
        if (!isNaN(maxPrice) && (property.price ?? 0) > maxPrice) {
          return false;
        }
        if (appliedFilters.beds > 0 && (property.beds ?? 0) < appliedFilters.beds) {
          return false;
        }
        if (appliedFilters.baths > 0 && (property.baths ?? 0) < appliedFilters.baths) {
          return false;
        }
        return true;
      });
  }, [searchQuery, appliedFilters, allProperties]);
  
  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    setIsFilterModalOpen(false);
  };
  
  const handleClearFilters = () => {
    setAppliedFilters(defaultFilters);
    setIsFilterModalOpen(false);
  };

  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFilterModalOpen]);

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="p-4 bg-white">
           <div className="flex items-center gap-2">
              <button 
                  onClick={onOpenCreateTeam}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                  aria-label="Start a team search"
                >
                  <UsersIcon className="h-5 w-5 text-gray-700" />
                </button>
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search by location (e.g., Lekki, Yaba)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon className="h-6 w-6" />
                </div>
              </div>
               <button 
                  onClick={() => setIsFilterModalOpen(true)}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                  aria-label="Open filters"
                >
                  <FilterIcon className="h-5 w-5 text-gray-700" />
                </button>
            </div>
        </div>
        
        <main className="flex-grow relative">
          {viewMode === 'map' ? (
            <MapView properties={filteredProperties} neighborhoods={allNeighborhoods} onSelectNeighborhood={onViewNeighborhood} centerCoordinates={mapCenter} />
          ) : (
            <div className="p-4 space-y-4 pb-24 md:pb-4">
              {matchingHub && (
                <NeighborhoodHubCard 
                  neighborhood={matchingHub}
                  onClick={() => onViewNeighborhood(matchingHub.id)}
                />
              )}
              {filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))
              ) : (
                 !matchingHub && <p className="text-center text-gray-500 mt-8">No properties found matching your criteria.</p>
              )}
            </div>
          )}
        </main>

        <div className="absolute bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center bg-gray-800 text-white rounded-full shadow-lg p-1">
            <button 
              onClick={() => setViewMode('map')} 
              className={`px-4 py-1.5 flex items-center gap-2 rounded-full text-sm font-semibold transition-colors ${viewMode === 'map' ? 'bg-violet-600' : ''}`}
            >
              <MapIcon className="w-5 h-5" />
              Map
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`px-4 py-1.5 flex items-center gap-2 rounded-full text-sm font-semibold transition-colors ${viewMode === 'list' ? 'bg-violet-600' : ''}`}
            >
              <ListIcon className="w-5 h-5" />
              List
            </button>
          </div>
        </div>
      </div>
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={appliedFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </>
  );
};

export default SearchScreen;