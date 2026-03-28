import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserQueries } from '../hooks/useUserQueries';

type UserDetail = {
  _id?: string;
  role?: string;
  companyName?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  trustScore?: number;
  kyc?: {
    gstNumber?: string;
    panNumber?: string;
  };
  address?: {
    city?: string;
  };
};

const BuyerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetUserDetails } = useUserQueries();
  const { data, isLoading, isError } = useGetUserDetails(id);

  const user: UserDetail | undefined = data;

  return (
    <div className="min-h-screen bg-[#111111] text-gray-300 font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded text-sm font-bold text-white hover:bg-gray-800 transition-all"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">User Details</h1>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-8">
          {isLoading ? (
            <p className="text-gray-400">Loading user details...</p>
          ) : isError ? (
            <p className="text-red-400">Failed to load user details. Please try again.</p>
          ) : !user ? (
            <p className="text-gray-400">No user found for ID: {id}</p>
          ) : (
            <>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-[#d4af37] flex items-center justify-center text-black font-bold text-2xl">
                  {user.ownerName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{user.ownerName || 'Unknown User'}</h2>
                  <p className="text-gray-400">Role: {user.role || 'N/A'} · ID: {id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">Basic Information</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="text-gray-500">Company:</span> {user.companyName || 'N/A'}</p>
                    <p><span className="text-gray-500">Email:</span> {user.email || 'N/A'}</p>
                    <p><span className="text-gray-500">Phone:</span> {user.phone || 'N/A'}</p>
                    <p><span className="text-gray-500">City:</span> {user.address?.city || 'N/A'}</p>
                    <p><span className="text-gray-500">Trust Score:</span> {user.trustScore !== undefined ? user.trustScore : 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">KYC</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="text-gray-500">GST Number:</span> {user.kyc?.gstNumber || 'N/A'}</p>
                    <p><span className="text-gray-500">PAN Number:</span> {user.kyc?.panNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDetails;