import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle, DollarSign, Eye } from 'lucide-react';
import { useOrderQueries } from '../hooks/useOrderQueries';
import { useEscrowQueries } from '../hooks/useEscrowQueries';
import { useQueryClient } from '@tanstack/react-query';

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

  const { useGetAllOrders, useUpdatePaymentStatus } = useOrderQueries();
  const { useVerifyDeposit, useReleaseFunds } = useEscrowQueries();
  const queryClient = useQueryClient();

  const { data: ordersData } = useGetAllOrders();

  const verifyDepositMutation = useVerifyDeposit();
  const releaseFundsMutation = useReleaseFunds();
  const updatePaymentMutation = useUpdatePaymentStatus();

  const orders = ordersData?.data || [];

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.buyerId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.sellerId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerifyDeposit = async (orderId: string) => {
    try {
      await updatePaymentMutation.mutateAsync({
        id: orderId,
        paymentData: { status: 'escrow_deposited' }
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Failed to verify deposit:', error);
    }
  };

  const handleReleaseFunds = async (orderId: string) => {
    try {
      await releaseFundsMutation.mutateAsync(orderId);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['diamonds'] });
    } catch (error) {
      console.error('Failed to release funds:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_payment: { color: 'bg-yellow-500', text: 'Pending Payment' },
      escrow_deposited: { color: 'bg-blue-500', text: 'Deposit Verified' },
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
                <option value="pending_payment">Pending Payment</option>
                <option value="escrow_deposited">Deposit Verified</option>
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Buyer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Diamond</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
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
                      <div>
                        <div className="font-medium">{order.buyerId?.companyName}</div>
                        <div className="text-gray-500">{order.buyerId?.ownerName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div className="font-medium">{order.sellerId?.companyName}</div>
                        <div className="text-gray-500">{order.sellerId?.ownerName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div className="font-medium">{order.diamondId?.shape} {order.diamondId?.carat}ct</div>
                        <div className="text-gray-500">${order.diamondId?.price?.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#d4af37] font-medium">
                      ${order.agreedPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {order.paymentStatus === 'pending_payment' && (
                          <button
                            onClick={() => handleVerifyDeposit(order._id)}
                            disabled={verifyDepositMutation.isPending}
                            className="flex items-center gap-1 px-3 py-1 bg-[#d4af37] text-black rounded-lg hover:bg-[#b8942a] transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Verify Deposit
                          </button>
                        )}
                        {order.paymentStatus === 'escrow_deposited' && (
                          <button
                            onClick={() => handleReleaseFunds(order._id)}
                            disabled={releaseFundsMutation.isPending}
                            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <DollarSign className="w-4 h-4" />
                            Release Funds
                          </button>
                        )}
                        <button className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
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