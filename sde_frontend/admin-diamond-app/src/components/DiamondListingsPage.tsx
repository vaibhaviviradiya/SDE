import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useDiamondQueries } from '../hooks/useDiamondQueries';
import type { Diamond as DiamondType } from '../hooks/useDiamondQueries';

type Diamond = DiamondType;

const DiamondListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { useGetAllDiamonds } = useDiamondQueries();
  const { data: diamonds = [] } = useGetAllDiamonds();

  const [diamondsList, setDiamondsList] = useState<Diamond[]>([]);

  React.useEffect(() => {
    if (Array.isArray(diamonds)) {
      setDiamondsList(diamonds);
      console.log('Loaded diamonds:', diamonds);
    } else {
      setDiamondsList([]);
    }
  }, [diamonds]);

  const handleRemoveDiamond = (diamondId: string | undefined) => {
    if (!diamondId) return;
    setDiamondsList(diamondsList.filter(d => d._id !== diamondId));
    console.log('Removed diamond:', diamondId);
    // TODO: Add API call to delete diamond from backend
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available':
        return 'text-green-400 bg-green-900/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'sold':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
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
          <h1 className="text-3xl font-bold text-white">Diamonds Management</h1>
        </div>

        {/* Stats */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 mb-8">
          <p className="text-gray-400">
            Total Diamonds: <span className="text-[#d4af37] font-bold">{diamondsList.length}</span>
          </p>
        </div>

        {/* Diamonds Table */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="font-bold text-white text-lg">Diamonds List</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase text-gray-500 border-b border-gray-800">
                  <th className="px-6 py-4 font-black tracking-widest">Certificate</th>
                  <th className="px-6 py-4 font-black tracking-widest">Seller</th>
                  <th className="px-6 py-4 font-black tracking-widest">Shape</th>
                  <th className="px-6 py-4 font-black tracking-widest">Carat</th>
                  <th className="px-6 py-4 font-black tracking-widest">Color/Clarity</th>
                  <th className="px-6 py-4 font-black tracking-widest">Price</th>
                  <th className="px-6 py-4 font-black tracking-widest">Status</th>
                  <th className="px-6 py-4 font-black tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {diamondsList.length > 0 ? (
                  diamondsList.map((diamond: Diamond, index: number) => (
                    <tr key={diamond._id || index} className="hover:bg-[#222222] transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-white">
                        {diamond.labCertificate?.certificateNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 font-bold">
                        {diamond.sellerId?.companyName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {diamond.shape || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {diamond.carat ? `${diamond.carat}ct` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {diamond.color && diamond.clarity ? `${diamond.color} / ${diamond.clarity}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#d4af37]">
                        ₹{diamond.price?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(diamond.status)}`}>
                          {diamond.status || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleRemoveDiamond(diamond._id)}
                          className="flex items-center gap-2 bg-red-600/20 border border-red-600 text-red-400 px-3 py-1.5 rounded hover:bg-red-600/40 transition-all font-bold text-xs"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No diamonds found
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

export default DiamondListingsPage;