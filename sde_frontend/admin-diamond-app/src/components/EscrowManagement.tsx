import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle, DollarSign, Eye } from 'lucide-react';
import { useGetEscrowStats, useVerifyDeposit, useReleaseFunds } from '../hooks/useEscrowQueries';

type Order = {
  _id: string;
  orderId: string;
  buyerId: {
    _id: string;
    ownerName: string;
    companyName: string;
  };
  sellerId: {
    _id: string;
    ownerName: string;
    companyName: string;
  };
  diamondId: {
    _id: string;
    price: number;
    shape: string;
    carat: number;
  };
  agreedPrice: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
};

const EscrowManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: orders = [] } = useGetEscrowStats();
  const verifyDepositMutation = useVerifyDeposit();
  const releaseFundsMutation = useReleaseFunds();
  const [displayStatusMap, setDisplayStatusMap] = useState<Record<string, 'pending' | 'escrow_deposited' | 'completed'>>({});

  // Helper that derives the UI display status for an order
  const getDisplayStatus = (order: Order) => {
    const fromMap = displayStatusMap[order._id];
    if (fromMap) return fromMap;
    if (order.paymentStatus === 'completed') return 'completed';
    // Treat server-side 'escrow_deposited' as pending verification by default.
    // Admin must click "Verify Deposit" to mark it as 'escrow_deposited' in the UI.
    return 'pending';
  };

  // Calculate stats using display status so counts match the UI
  const totalFundsHeld = orders
    .filter((order: Order) => getDisplayStatus(order) === 'escrow_deposited')
    .reduce((sum: number, order: Order) => sum + order.agreedPrice, 0);

  const pendingVerification = orders.filter((order: Order) => getDisplayStatus(order) === 'pending').length;

  const filteredOrders = orders.filter((order: Order) => {
    // Use optional chaining (?.) to prevent crashing if fields are missing
    const orderId = order.orderId?.toLowerCase() || '';
    const buyerName = order.buyerId?.companyName?.toLowerCase() || '';
    const sellerName = order.sellerId?.companyName?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch = 
      orderId.includes(search) || 
      buyerName.includes(search) || 
      sellerName.includes(search);

    const displayStatus = getDisplayStatus(order);
    const matchesStatus = statusFilter === 'all' || displayStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  const handleVerifyDeposit = (orderId: string) => {
    const prev = displayStatusMap[orderId] ?? 'pending';
    // optimistic UI: show deposited (Release) immediately
    setDisplayStatusMap((s) => ({ ...s, [orderId]: 'escrow_deposited' }));
    verifyDepositMutation.mutate(orderId, {
      onError: () => {
        // revert to previous display status on error
        setDisplayStatusMap((s) => {
          const copy = { ...s };
          if (prev === 'pending') delete copy[orderId]; else copy[orderId] = prev;
          return copy;
        });
      },
    });
  };

  const handleReleaseFunds = (orderId: string) => {
    const prev = displayStatusMap[orderId] ?? (orders.find(o => o._id === orderId)?.paymentStatus === 'completed' ? 'completed' : 'pending');
    // optimistic UI: mark completed immediately
    setDisplayStatusMap((s) => ({ ...s, [orderId]: 'completed' }));
    releaseFundsMutation.mutate(orderId, {
      onError: () => {
        // revert to previous display status on error
        setDisplayStatusMap((s) => {
          const copy = { ...s };
          if (prev === 'pending') delete copy[orderId]; else copy[orderId] = prev;
          return copy;
        });
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', text: 'Pending' },
      escrow_deposited: { color: 'bg-blue-500', text: 'Deposited' },
      completed: { color: 'bg-green-500', text: 'Completed' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-500', text: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#111111] text-gray-300 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-[#d4af37]" />
            <h1 className="text-3xl font-bold text-white">Escrow Management</h1>
          </div>
          <p className="text-gray-400">Secure high-value diamond transactions with verified fund management</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#111111] border border-[#d4af37] rounded-lg p-6">
            <div className="flex items-center">
              {/* <h1>₹</h1> */}
              {/* <DollarSign className="w-8 h-8 text-[#d4af37] mr-4" /> */}
              <div>
                <p className="text-sm font-medium text-gray-400">Total Funds Held</p>
                <p className="text-2xl font-bold text-white">₹{totalFundsHeld.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] border border-[#d4af37] rounded-lg p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-[#d4af37] mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-400">Pending Verification</p>
                <p className="text-2xl font-bold text-white">{pendingVerification}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0a0a0a] rounded-lg p-6 mb-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by order ID, buyer, or seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#111111] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-[#111111] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="escrow_deposited">Deposited</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#0a0a0a] rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#111111] border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Diamond Info</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Buyer/Seller</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredOrders.map((order: Order) => (
                  <tr key={order._id} className="hover:bg-[#111111] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.diamondId?.shape} {order.diamondId?.carat}ct
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#d4af37] font-medium">
                      ${order.agreedPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.buyerId?.companyName} / {order.sellerId?.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(getDisplayStatus(order))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(() => {
                        const displayStatus = getDisplayStatus(order);

                        if (displayStatus === 'pending') {
                          return (
                            <button
                              onClick={() => handleVerifyDeposit(order._id)}
                              disabled={verifyDepositMutation.isLoading}
                              className="flex items-center gap-1 px-3 py-1 bg-[#d4af37] text-black rounded-lg hover:bg-[#b8942a] transition-colors disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Verify Deposit
                            </button>
                          );
                        }

                        if (displayStatus === 'escrow_deposited') {
                          return (
                            <button
                              onClick={() => handleReleaseFunds(order._id)}
                              disabled={releaseFundsMutation.isLoading}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                              <DollarSign className="w-4 h-4" />
                              Release Funds
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="w-4 h-4" />
                            Settled
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShieldCheck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No escrow transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscrowManagement;