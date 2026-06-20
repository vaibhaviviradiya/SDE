import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisputeQueries } from '../hooks/useDisputeQueries';

const DisputesPage: React.FC = () => {
  const navigate = useNavigate();
  const { useGetAllDisputes } = useDisputeQueries();
  const { data: disputes, isLoading } = useGetAllDisputes();

  return (
    <div className="min-h-screen p-6 bg-black">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Disputes</h2>
        <button className="text-sm text-gray-400" onClick={() => navigate(-1)}>Back</button>
      </div>

      <div className="bg-black rounded-lg border border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase text-gray-500 border-b border-gray-800">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Agreed Price</th>
              <th className="px-4 py-3">Payment Status</th>
              <th className="px-4 py-3">Order Status</th>
              <th className="px-4 py-3">Raised By</th>
              <th className="px-4 py-3">Raised Against</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr><td colSpan={8} className="px-4 py-6 text-gray-500">Loading...</td></tr>
            ) : disputes && disputes.length > 0 ? (
              disputes.map((d) => (
                <tr key={d._id} className="hover:bg-[#111] cursor-pointer" onClick={() => navigate(`/disputes/${d._id}`)}>
                  <td className="px-4 py-4 font-bold text-white">{d.orderId?._id ? `#${d.orderId._id.slice(-6)}` : d.orderId || 'N/A'}</td>
                  <td className="px-4 py-4 text-gray-300">{d.orderId?.agreedPrice ? `₹${d.orderId.agreedPrice}` : '-'}</td>
                  <td className="px-4 py-4 text-gray-300">{d.orderId?.paymentStatus || '-'}</td>
                  <td className="px-4 py-4 text-gray-300">{d.orderId?.orderStatus || '-'}</td>
                  <td className="px-4 py-4 text-gray-300">{d.raisedBy?.ownerName || d.raisedBy?.companyName || 'User'}</td>
                  <td className="px-4 py-4 text-gray-300">{d.raisedAgainst?.ownerName || d.raisedAgainst?.companyName || 'User'}</td>
                  <td className="px-4 py-4 text-sm text-gray-300">{d.reason}</td>
                  <td className="px-4 py-4 text-sm text-gray-400">{d.status || (d.financeNotified ? 'Finance Notified' : 'Open')}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={8} className="px-4 py-6 text-gray-500">No disputes found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisputesPage;
