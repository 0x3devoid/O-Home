import React from 'react';
import { ServiceProvider } from '../types';
import { ArrowLeftIcon } from '../components/Icons';
import ServiceProviderCard from '../components/services/ServiceProviderCard';

interface ServicesScreenProps {
  serviceProviders: ServiceProvider[];
  onClose: () => void;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ serviceProviders, onClose }) => {
  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200 p-4 flex items-center space-x-4">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">edQorta Concierge</h1>
      </header>
      
      <main className="flex-grow overflow-y-auto no-scrollbar p-4 bg-gray-50">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Verified Service Providers</h2>
            <p className="text-gray-600 mt-2">Find trusted professionals for all your home needs, vetted by edQorta.</p>
        </div>
        <div className="space-y-4">
            {serviceProviders.map(provider => (
                <ServiceProviderCard key={provider.id} provider={provider} />
            ))}
        </div>
      </main>
    </div>
  );
};

export default ServicesScreen;
