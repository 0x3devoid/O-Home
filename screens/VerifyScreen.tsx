import React, { useState } from 'react';
import { ShieldCheckIcon, UserCircleIcon, CheckmarkBadgeIcon } from '../components/Icons';
import { useStore } from '../lib/store';

const BenefitItem: React.FC<{ text: string }> = ({ text }) => (
    <li className="flex items-start gap-2">
        <CheckmarkBadgeIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <span>{text}</span>
    </li>
);

const VerifyScreen: React.FC = () => {
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const { currentUser, setCurrentUser } = useStore();

  const handleVerifyAsAgent = () => {
    setShowAgentModal(true);
  };

  const handleVerifyAsBusiness = () => {
    setShowBusinessModal(true);
  };

  const handleAgentVerificationSubmit = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        agentStatus: 'verified' as const,
      });
      setShowAgentModal(false);
    }
  };

  const handleBusinessVerificationSubmit = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        businessStatus: 'verified' as const,
        listerStatus: 'verified' as const,
      });
      setShowBusinessModal(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center">
        <div className="w-full max-w-2xl bg-white">
            <main className="flex-grow overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">edQorta Verification</h2>
                    <p className="mt-2 text-gray-600 max-w-xl mx-auto">Build trust and unlock exclusive features by getting verified. Choose the verification path that's right for you.</p>
                </div>

                <div className="space-y-6">
                    {/* Individual Realtor/Agent Verification */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4">
                            <UserCircleIcon className="w-10 h-10 text-blue-500" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">For Individual Realtors/Agents</h3>
                                <p className="text-sm text-gray-500">Become a trusted agent in the community.</p>
                            </div>
                        </div>
                        <div className="mt-4 pl-2 text-gray-700 space-y-2">
                            <ul className="space-y-2">
                                <BenefitItem text="Receive a blue verified agent badge on your profile." />
                                <BenefitItem text="Earn commissions by verifying properties ('Agent Bounties')." />
                                <BenefitItem text="Get access to the Agent Dashboard to manage tasks." />
                                <BenefitItem text="Increased visibility and trust from potential clients." />
                            </ul>
                        </div>
                        <button 
                            onClick={handleVerifyAsAgent}
                            className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700"
                        >
                            Verify as an Agent
                        </button>
                    </div>

                    {/* Business/Company Verification */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                         <div className="flex items-center gap-4">
                            <ShieldCheckIcon className="w-10 h-10 text-green-500" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">For Businesses & Companies</h3>
                                <p className="text-sm text-gray-500">For agencies, hotels, and shortlet providers.</p>
                            </div>
                        </div>
                        <div className="mt-4 pl-2 text-gray-700 space-y-2">
                            <ul className="space-y-2">
                                <BenefitItem text="Get a green verified business badge for maximum trust." />
                                <BenefitItem text="Unlock advanced posting options (e.g., price per night, week, month)." />
                                <BenefitItem text="List your company profile and gain corporate visibility." />
                                <BenefitItem text="Access business-specific analytics and tools (coming soon)." />
                            </ul>
                        </div>
                        <button 
                            onClick={handleVerifyAsBusiness}
                            className="w-full mt-6 py-2.5 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700"
                        >
                            Verify as a Business
                        </button>
                    </div>
                </div>
            </main>
        </div>

        {/* Agent Verification Modal */}
        {showAgentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Agent Verification</h3>
                    <p className="text-gray-600 mb-6">
                        Upload your government-issued ID to verify your identity as a real estate agent.
                    </p>
                    <div className="space-y-4 mb-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-violet-400 transition-colors cursor-pointer">
                            <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm text-gray-600">Click to upload ID</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowAgentModal(false)}
                            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAgentVerificationSubmit}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700"
                        >
                            Submit ID
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Business Verification Modal */}
        {showBusinessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Business Verification</h3>
                    <p className="text-gray-600 mb-6">
                        Upload your business registration certificate (e.g., CAC) to verify your business.
                    </p>
                    <div className="space-y-4 mb-6">
                        <input
                            type="text"
                            placeholder="Business Registration Number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors cursor-pointer">
                            <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm text-gray-600">Click to upload certificate</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowBusinessModal(false)}
                            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleBusinessVerificationSubmit}
                            className="flex-1 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700"
                        >
                            Submit Certificate
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default VerifyScreen;
