import React from 'react';
import {
  LayoutDashboard, Gem, ShoppingCart,
  MessageSquare, ShieldCheck, AlertTriangle,
  ExternalLink, Circle, LogOut
} from 'lucide-react';
import { useUserQueries } from '../hooks/useUserQueries';
import { useOrderQueries } from '../hooks/useOrderQueries';
import { useDiamondQueries } from '../hooks/useDiamondQueries';
import { useInquiriesQueries } from '../hooks/useInquiriesQueries';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
};

type StatCardProps = {
  title: string;
  value: string;
  trend: string;
  color: string;
  isAlert?: boolean;
};

type OrderRowProps = {
  id: string;
  buyer: string;
  seller: string;
  diamondPrice: string;
  agreedPrice: string;
  buyerId?: string;
  sellerId?: string;
  onBuyerClick?: (buyerId: string) => void;
  onSellerClick?: (sellerId: string) => void;
};

type ActivityItemProps = {
  color: string;
  text: string;
  time: string;
};

type Order = {
  _id?: string;
  orderId?: string;
  buyerId?: string | {
    _id?: string;
    ownerName?: string;
  };
  sellerId?: string | {
    _id?: string;
    ownerName?: string;
  };
  diamondId?: {
    price?: number;
  };
  price?: number;
  agreedPrice?: number;
};

type User = {
  _id?: string;
  role?: string;
  // Add other user properties as needed
};

const AdminDashboard: React.FC = () => {

    const { useGetAllUsers } = useUserQueries();
    const { useGetAllOrders } = useOrderQueries();
    const { useGetAllDiamonds } = useDiamondQueries();
    const { useGetAllInquiries } = useInquiriesQueries();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const { data: users, isLoading } = useGetAllUsers();
    const { data: orders } = useGetAllOrders();
    const { data: diamonds } = useGetAllDiamonds();
    const { data: inquiries } = useGetAllInquiries();

    const userList: User[] = Array.isArray(users)
      ? users
      : users && (users as any).data && Array.isArray((users as any).data)
      ? (users as any).data
      : [];

    const ordersList: Order[] = Array.isArray(orders)
      ? orders
      : orders && (orders as any).data && Array.isArray((orders as any).data)
      ? (orders as any).data
      : [];

    const totalUserCount = userList.length;
    const totalDiamondCount = Array.isArray(diamonds) ? diamonds.length : (diamonds && (diamonds as any).data ? (diamonds as any).data.length : 0);
    const totalInquiryCount = Array.isArray(inquiries) ? inquiries.length : (inquiries && (inquiries as any).data ? (inquiries as any).data.length : 0);
    const totalDiamondCountLabel = totalDiamondCount.toString();

    console.log("all users raw:", users);
    console.log("normalized user list:", userList);
    console.log("role values:", userList.map((u) => u.role));
    console.log("all orders raw:", orders);
    console.log("normalized orders list:", ordersList);
    console.log("total orders ", ordersList.length);
    console.log("orders data structure:", orders);
    console.log("first order:", ordersList[0]);
    console.log("total diamonds ", diamonds?.length);


  return (
    <div className="flex min-h-screen bg-[#111111] text-gray-300 font-sans">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="px-4 py-2 rounded bg-white text-slate-900 font-bold">Loading users...</div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-900">
          <div className="w-8 h-1 bg-[#d4af37] mb-4"></div>
          <h1 className="text-white text-lg font-bold tracking-tight">SD Exchange</h1>
          <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Admin Console</p>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          
          {/* OVERVIEW Group */}
          <div>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-3 px-3">Overview</p>
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          </div>

          {/* USERS Group */}
          <div>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-3 px-3">Users</p>
            <NavItem
              icon={<Circle size={18} />}
              label="Buyers"
              badge={userList.filter((u: User) => (u.role || '').toString().trim().toLowerCase() === 'buyer').length}
              onClick={() => navigate('/buyers')}
            />
            <NavItem
              icon={<Gem size={18} />}
              label="Sellers"
              badge={userList.filter((u: User) => (u.role || '').toString().trim().toLowerCase() === 'seller').length}
              onClick={() => navigate('/sellers')}
            />
            <NavItem
              icon={<Gem size={18} />}
              label="Manufacturer"
              badge={userList.filter((u: User) => (u.role || '').toString().trim().toLowerCase() === 'manufacturer').length}
              onClick={() => navigate('/manufacturers')}
            />
          </div>

          {/* MARKETPLACE Group */}
          <div>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-3 px-3">Marketplace</p>
            <NavItem
              icon={<Gem size={18} />}
              label="Diamonds"
              badge={diamonds?.length}
              onClick={() => navigate('/diamonds')}
            />
            <NavItem icon={<ShoppingCart size={18} />} label="Orders" badge={orders?.data?.length || 0} />
            <NavItem
              icon={<MessageSquare size={18} />}
              label="Inquiries"
              badge={totalInquiryCount}
              onClick={() => navigate('/inquiries')}
            />
          </div>

          {/* FINANCE Group */}
          <div>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-3 px-3">Finance</p>
            <NavItem icon={<AlertTriangle size={18} />} label="Disputes" />
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 bg-[#0d0d0d] border-t border-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center text-black font-bold">A</div>
            <div>
              <p className="text-xs text-white font-bold">Super Admin</p>
              <p className="text-[10px] text-gray-500">Full Access</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors p-2 rounded hover:bg-gray-800"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <div className="text-sm text-gray-400">Users: {totalUserCount}</div>
            <div className="flex items-center gap-1.5 ml-4">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live</span>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-transparent border border-gray-700 px-4 py-2 rounded text-xs font-bold text-white hover:bg-gray-800 transition-all">
            + New Admin <ExternalLink size={14} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Users" value={totalUserCount} trend="+12 this week" color="#d4af37" />
          <StatCard title="Active Orders" value={ ordersList.length} trend="+5 today" color="#22c55e" />
          <StatCard title="Diamonds Listed" value={totalDiamondCountLabel} trend="+28 this week" color="#d4af37" />
          <StatCard title="Open Disputes" value="4" trend="Needs attention" color="#ef4444" isAlert />
        </div>

        {/* Bottom Section: Orders and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-800">
              <h3 className="font-bold text-white">Recent Orders</h3>
              <button className="text-xs border border-gray-700 px-3 py-1.5 rounded hover:bg-gray-800">View all</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase text-gray-500 border-b border-gray-800">
                  <th className="px-6 py-4 font-black tracking-widest">Order</th>
                  <th className="px-6 py-4 font-black tracking-widest">Buyer</th>
                  <th className="px-6 py-4 font-black tracking-widest">Seller</th>
                  <th className="px-6 py-4 font-black tracking-widest">Diamond Price</th>
                  <th className="px-6 py-4 font-black tracking-widest">Agreed Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {Array.isArray(ordersList) && ordersList.length > 0 ? (
                  ordersList.map((order: Order, index: number) => {
                    console.log("Processing order:", order);
                    const buyerId = typeof order.buyerId === 'object' ? order.buyerId?._id : order.buyerId;
                    return (
                      <OrderRow
                        key={order._id || index}
                        id={`#${order.orderId || order._id?.slice(-6) || `ORD-${index + 1}`}`}
                        buyer={
                          typeof order.buyerId === 'object' && order.buyerId?.ownerName
                            ? order.buyerId.ownerName
                            : typeof order.buyerId === 'string'
                            ? order.buyerId
                            : 'Unknown Buyer'
                        }
                        seller={
                          typeof order.sellerId === 'object' && order.sellerId?.ownerName
                            ? order.sellerId.ownerName
                            : typeof order.sellerId === 'string'
                            ? order.sellerId
                            : 'Unknown Seller'
                        }
                        diamondPrice={`₹${order.diamondId?.price || order.price || '0'}`}
                        agreedPrice={`₹${order.agreedPrice || '0'}`}
                        buyerId={buyerId}
                        sellerId={typeof order.sellerId === 'object' ? order.sellerId?._id : order.sellerId}
                        onBuyerClick={(id) => navigate(`/buyer/${id}`)}
                        onSellerClick={(id) => navigate(`/user/${id}`)}
                      />
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {ordersList ? 'No orders found' : 'Loading orders...'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
            <h3 className="font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-8">
              <ActivityItem color="#22c55e" text="New seller Kiran Gems registered" time="2 min ago" />
              <ActivityItem color="#eab308" text="Diamond listing #D-442 pending approval" time="18 min ago" />
              <ActivityItem color="#ef4444" text="Dispute raised on Order #ORD-085" time="1 hr ago" />
              <ActivityItem color="#3b82f6" text="Escrow released for Order #ORD-082" time="3 hr ago" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// HELPER COMPONENTS
const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, badge, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${active ? 'bg-[#1a1a1a] border border-gray-800' : 'hover:bg-[#151515]'}`}
  >
    <div className="flex items-center gap-3">
      <span className={active ? 'text-[#d4af37]' : 'text-gray-500'}>{icon}</span>
      <span className={`text-sm font-bold ${active ? 'text-white' : 'text-gray-400'}`}>{label}</span>
    </div>
    {badge && <span className="bg-[#d4af37] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">{badge}</span>}
  </div>
);

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, color, isAlert = false }) => (
  <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }}></div>
    <p className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-2">{title}</p>
    <h4 className={`text-3xl font-bold mb-2 ${isAlert ? 'text-red-500' : 'text-white'}`}>{value}</h4>
    <p className={`text-[10px] font-bold ${isAlert ? 'text-gray-500' : 'text-green-500'}`}>{trend}</p>
  </div>
);

const OrderRow: React.FC<OrderRowProps> = ({ id, buyer, seller, diamondPrice, agreedPrice, buyerId, sellerId, onBuyerClick, onSellerClick }) => (
  <tr className="hover:bg-[#222222] transition-colors">
    <td className="px-6 py-4 text-sm font-bold text-white">{id}</td>
    <td
      className="px-6 py-4 text-sm text-gray-300 font-bold cursor-pointer hover:text-[#d4af37] transition-colors"
      onClick={() => buyerId && onBuyerClick?.(buyerId)}
    >
      {buyer}
    </td>
    <td className="px-6 py-4 text-sm text-gray-300 font-bold" 
    onClick={()=>sellerId && onSellerClick?.(sellerId)} 
    >
      {seller}
    </td>
    <td className="px-6 py-4 text-sm font-bold text-[#d4af37]">{diamondPrice}</td>
    <td className="px-6 py-4 text-sm font-bold text-green-400">{agreedPrice}</td>
  </tr>
);

const ActivityItem: React.FC<ActivityItemProps> = ({ color, text, time }) => (
  <div className="flex gap-4">
    <div className="mt-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div></div>
    <div>
      <p className="text-sm font-bold text-gray-200 leading-tight mb-1">{text}</p>
      <p className="text-[10px] text-gray-500 font-bold uppercase">{time}</p>
    </div>
  </div>
);

export default AdminDashboard;