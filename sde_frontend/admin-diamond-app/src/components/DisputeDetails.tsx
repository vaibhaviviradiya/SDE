import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDisputeQueries } from '../hooks/useDisputeQueries';

const DisputeDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useGetDisputeById, useMarkFinanceNotified } = useDisputeQueries();
  const { data: dispute, isLoading } = useGetDisputeById(id);
  const markMutation = useMarkFinanceNotified();

  if (isLoading) return <div className="p-6 text-gray-400">Loading...</div>;

  if (!dispute) return <div className="p-6 text-gray-400">Dispute not found</div>;

  return (
    <div className="min-h-screen p-6 bg-black">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Dispute Details</h2>
        <button className="text-sm text-gray-400" onClick={() => navigate(-1)}>Back</button>
      </div>

      <div className="bg-black rounded-lg p-6 border border-gray-800 text-gray-300">
        <p className="text-sm mb-2"><strong>Order:</strong> <span className="text-white">{dispute.orderId?._id || dispute.orderId}</span></p>
        <p className="text-sm mb-2"><strong>Agreed Price:</strong> <span className="text-white">{dispute.orderId?.agreedPrice ? `₹${dispute.orderId.agreedPrice}` : '-'}</span></p>
        <p className="text-sm mb-2"><strong>Payment Status:</strong> <span className="text-white">{dispute.orderId?.paymentStatus || '-'}</span></p>
        <p className="text-sm mb-2"><strong>Order Status:</strong> <span className="text-white">{dispute.orderId?.orderStatus || '-'}</span></p>
        <p className="text-sm mb-2"><strong>Raised By:</strong> <span className="text-white">{dispute.raisedBy?.ownerName || dispute.raisedBy?.companyName || dispute.raisedBy?._id}</span></p>
        <p className="text-sm mb-2"><strong>Raised Against:</strong> <span className="text-white">{dispute.raisedAgainst?.ownerName || dispute.raisedAgainst?.companyName || dispute.raisedAgainst?._id}</span></p>
        <p className="text-sm mb-2"><strong>Reason:</strong> <span className="text-white">{dispute.reason}</span></p>
        <p className="text-sm mb-2"><strong>Details:</strong> <span className="text-white">{dispute.details || '-'}</span></p>
        <p className="text-sm mb-2"><strong>Status:</strong> <span className="text-white">{dispute.status || (dispute.financeNotified ? 'Finance Notified' : 'Open')}</span></p>

        {Array.isArray(dispute.attachments) && dispute.attachments.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-bold mb-2 text-gray-300">Attachments</p>
            <ul className="list-disc list-inside text-gray-300">
              {dispute.attachments.map((a, i) => (
                <li key={i}><a href={a} target="_blank" rel="noreferrer" className="text-[#d4af37] underline">Attachment {i + 1}</a></li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              markMutation.mutate(id || '', {
                onSuccess: () => alert('Finance notified for this dispute'),
              });
            }}
            className="px-4 py-2 bg-[#d4af37] text-black font-bold rounded"
          >
            Mark Finance Notified
          </button>
          <button onClick={() => navigate('/disputes')} className="px-4 py-2 border border-gray-700 rounded text-gray-300">Back to list</button>
        </div>
      </div>
    </div>
  );
};

export default DisputeDetails;
