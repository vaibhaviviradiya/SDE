import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No real logic requested — just show popup and redirect
    alert('Password is updated');
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-[420px] bg-white shadow-2xl border border-slate-200">
        <div className="h-1.5 w-full bg-[#d4af37]" />
        <div className="p-10">
          <h2 className="text-slate-800 text-lg font-bold mb-6">Reset Password</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-[#d4af37] transition-colors placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-[#d4af37] transition-colors placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-[#d4af37] transition-colors placeholder:text-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#d4af37] hover:bg-black text-white text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-sm mt-4"
            >
              Update Password
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-[10px] text-slate-400 underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
