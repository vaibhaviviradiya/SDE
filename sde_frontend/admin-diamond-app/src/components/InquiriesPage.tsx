import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useInquiriesQueries } from '../hooks/useInquiriesQueries';
import { useDiamondQueries } from '../hooks/useDiamondQueries';
import type { Diamond as DiamondType } from '../hooks/useDiamondQueries';
import type { Inquiry } from '../hooks/useInquiriesQueries';

const InquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDiamondId, setSelectedDiamondId] = useState<string>('');

  const { useGetAllInquiries, useGetDiamondInquiries, useUpdateInquiryStatus } = useInquiriesQueries();
  const { useGetAllDiamonds } = useDiamondQueries();

  const { data: allInquiries, isLoading: allLoading, isError: allError } = useGetAllInquiries();
  const { data: diamondInquiries, isLoading: diamondLoading, isError: diamondError } = useGetDiamondInquiries(selectedDiamondId);
  const { data: diamonds = [], isLoading: diamondsLoading, isError: diamondsError } = useGetAllDiamonds();

  const updateStatusMutation = useUpdateInquiryStatus();

  const inquiriesToShow = selectedDiamondId ? diamondInquiries : allInquiries;
  const loading = selectedDiamondId ? diamondLoading : allLoading;
  const error = selectedDiamondId ? diamondError : allError;

  const handleAcceptInquiry = async (inquiryId: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: inquiryId,
        statusData: { status: 'accepted' }
      });
      // Optionally invalidate queries to refresh the list
    } catch (error) {
      console.error('Failed to accept inquiry:', error);
    }
  };

  const handleRejectInquiry = async (inquiryId: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: inquiryId,
        statusData: { status: 'rejected' }
      });
      // Optionally invalidate queries to refresh the list
    } catch (error) {
      console.error('Failed to reject inquiry:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-gray-300 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded text-sm font-bold text-white hover:bg-gray-800 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">Inquiries</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label htmlFor="diamondSelect" className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Diamond
            </label>
            <select
              id="diamondSelect"
              className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200"
              value={selectedDiamondId}
              onChange={(e) => setSelectedDiamondId(e.target.value)}
            >
              <option value="">All Diamonds</option>
              {diamonds.map((diamond: DiamondType) => (
                <option key={diamond._id ?? 'unknown'} value={diamond._id ?? ''}>
                  {diamond.shape || 'Unknown'} {diamond.carat ? `${diamond.carat}ct` : ''} ({diamond.color || 'N/A'})
                </option>
              ))}
            </select>
            {diamondsLoading && <p className="text-gray-400 mt-2">Loading diamond selector...</p>}
            {diamondsError && <p className="text-red-400 mt-2">Failed to load diamonds for filter.</p>}
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
          {loading ? (
            <p className="text-gray-400">Loading inquiries...</p>
          ) : error ? (
            <p className="text-red-400">Failed to load inquiries.</p>
          ) : !inquiriesToShow || inquiriesToShow.length === 0 ? (
            <p className="text-gray-500">
              {selectedDiamondId
                ? 'No inquiries found for this diamond.'
                : 'No inquiries found.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase text-gray-500 border-b border-gray-800">
                    <th className="px-4 py-3">Inquiry</th>
                    <th className="px-4 py-3">Diamond</th>
                    <th className="px-4 py-3">Buyer</th>
                    <th className="px-4 py-3">Seller</th>
                    <th className="px-4 py-3">Offered</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {inquiriesToShow.map((inquiry: Inquiry) => (
                    <tr key={inquiry._id} className="hover:bg-[#222222] transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-300">{inquiry._id}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {inquiry.diamondId?.shape} ({inquiry.diamondId?.carat} ct)
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {inquiry.buyerId?.ownerName || inquiry.buyerId?.companyName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {inquiry.sellerId?.ownerName || inquiry.sellerId?.companyName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">₹{inquiry.offeredPrice}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{inquiry.currentStatus}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {new Date(inquiry.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          {inquiry.currentStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAcceptInquiry(inquiry._id)}
                                disabled={updateStatusMutation.isPending}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                <Check size={14} />
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectInquiry(inquiry._id)}
                                disabled={updateStatusMutation.isPending}
                                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                <X size={14} />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiriesPage;
