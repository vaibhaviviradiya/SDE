import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useUserQueries } from '../hooks/useUserQueries';

type Manufacturer = {
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

const ManufacturersPage: React.FC = () => {
  const navigate = useNavigate();
  const { useGetAllUsers } = useUserQueries();
  const { data: users } = useGetAllUsers();
  
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

  React.useEffect(() => {
    if (users && Array.isArray(users)) {
      const manufacturersList = users.filter((u: User) =>
        (u.role || '').toString().trim().toLowerCase() === 'manufacturer'
      );
      setManufacturers(manufacturersList);
      console.log('Filtered manufacturers:', manufacturersList);
    }
  }, [users]);

  const handleRemoveManufacturer = (manufacturerId: string | undefined) => {
    if (!manufacturerId) return;
    setManufacturers(manufacturers.filter(m => m._id !== manufacturerId));
    console.log('Removed manufacturer:', manufacturerId);
    // TODO: Add API call to delete manufacturer from backend
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
          <h1 className="text-3xl font-bold text-white">Manufacturers Management</h1>
        </div>

        {/* Stats */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 mb-8">
          <p className="text-gray-400">
            Total Manufacturers: <span className="text-[#d4af37] font-bold">{manufacturers.length}</span>
          </p>
        </div>

        {/* Manufacturers Table */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="font-bold text-white text-lg">Manufacturers List</h3>
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
                {manufacturers.length > 0 ? (
                  manufacturers.map((manufacturer: Manufacturer, index: number) => (
                    <tr
                      key={manufacturer._id || index}
                      className="hover:bg-[#222222] transition-colors cursor-pointer"
                      onClick={() => manufacturer._id && navigate(`/user/${manufacturer._id}`)}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-white">
                        {manufacturer.ownerName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 font-bold">
                        {manufacturer.companyName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {manufacturer.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {manufacturer.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        <span className={`${
                          (manufacturer.trustScore || 0) >= 4 ? 'text-green-400' : 
                          (manufacturer.trustScore || 0) >= 3 ? 'text-yellow-400' : 
                          'text-red-400'
                        }`}>
                          {manufacturer.trustScore ? manufacturer.trustScore.toFixed(1) : '0.0'}/5.0
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (manufacturer._id) {
                                navigate(`/user/${manufacturer._id}`);
                              }
                            }}
                            className="flex items-center gap-2 bg-blue-600/20 border border-blue-600 text-blue-400 px-3 py-1.5 rounded hover:bg-blue-600/40 transition-all font-bold text-xs"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveManufacturer(manufacturer._id);
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
                      No manufacturers found
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

export default ManufacturersPage;