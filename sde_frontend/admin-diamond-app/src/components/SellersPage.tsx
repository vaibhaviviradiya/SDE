import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useUserQueries } from '../hooks/useUserQueries';

type Seller = {
  _id?: string;
  ownerName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  trustScore?: number;
  role?: string;
};

type User = {
  _id?: string;
  ownerName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  trustScore?: number;
  role?: string;
};

const SellersPage: React.FC = () => {
  const navigate = useNavigate();
  const { useGetAllUsers } = useUserQueries();
  const { data: users } = useGetAllUsers();
  
  const [sellers, setSellers] = useState<Seller[]>([]);

  React.useEffect(() => {
    if (users && Array.isArray(users)) {
      const sellersList = users.filter((u: User) => u.role === 'seller').slice(0, 4);
      setSellers(sellersList);
      console.log('Filtered sellers:', sellersList);
    }
  }, [users]);

  const handleRemoveSeller = (sellerId: string | undefined) => {
    if (!sellerId) return;
    setSellers(sellers.filter(s => s._id !== sellerId));
    console.log('Removed seller:', sellerId);
    // TODO: Add API call to delete seller from backend
  };

  return (
    <div className="min-h-screen bg-[#111111] text-gray-300 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded text-sm font-bold text-white hover:bg-gray-800 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">Sellers Management</h1>
        </div>

        {/* Stats */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 mb-8">
          <p className="text-gray-400">
            Total Sellers: <span className="text-[#d4af37] font-bold">{sellers.length}</span>
          </p>
        </div>

        {/* Sellers Table */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="font-bold text-white text-lg">Sellers List</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase text-gray-500 border-b border-gray-800">
                  <th className="px-6 py-4 font-black tracking-widest">Owner Name</th>
                  <th className="px-6 py-4 font-black tracking-widest">Company Name</th>
                  <th className="px-6 py-4 font-black tracking-widest">Email</th>
                  <th className="px-6 py-4 font-black tracking-widest">Phone</th>
                  <th className="px-6 py-4 font-black tracking-widest">Trust Score</th>
                  <th className="px-6 py-4 font-black tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {sellers.length > 0 ? (
                  sellers.map((seller: Seller, index: number) => (
                    <tr
                      key={seller._id || index}
                      className="hover:bg-[#222222] transition-colors cursor-pointer"
                      onClick={() => seller._id && navigate(`/user/${seller._id}`)}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-white">
                        {seller.ownerName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 font-bold">
                        {seller.companyName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {seller.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {seller.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        <span className={`${
                          (seller.trustScore || 0) >= 4 ? 'text-green-400' : 
                          (seller.trustScore || 0) >= 3 ? 'text-yellow-400' : 
                          'text-red-400'
                        }`}>
                          {seller.trustScore ? seller.trustScore.toFixed(1) : '0.0'}/5.0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (seller._id) {
                                navigate(`/user/${seller._id}`);
                              }
                            }}
                            className="flex items-center gap-2 bg-blue-600/20 border border-blue-600 text-blue-400 px-3 py-1.5 rounded hover:bg-blue-600/40 transition-all font-bold text-xs"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSeller(seller._id);
                            }}
                            className="flex items-center gap-2 bg-red-600/20 border border-red-600 text-red-400 px-3 py-1.5 rounded hover:bg-red-600/40 transition-all font-bold text-xs"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No sellers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellersPage;