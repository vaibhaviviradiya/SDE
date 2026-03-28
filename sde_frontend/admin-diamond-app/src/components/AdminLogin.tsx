import React, { useState } from 'react';
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.');
        return;
      }

      // Store JWT token and login
      if (data.token) {
        login(data.token);
        console.log('Login success:', data);
        navigate('/dashboard');
      } else {
        setError('No token received from server');
      }
    } catch {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] ">
      <div className="w-full max-w-[400px] bg-white shadow-2xl border border-slate-200">

        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-[#d4af37]" /> 

        <div className="p-10">

          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
          
            <div className="h-14 w-14 mb-4 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] text-xs font-bold tracking-widest">
            <img src={logo} alt="SD Exchange" className="h-14 w-auto m-0 object-contain invert" />
              {/* LOGO */}
            </div>

            <div className="h-px w-12 bg-slate-200 mb-4" />
            <h2 className="text-slate-800 text-sm font-bold tracking-[0.2em] uppercase">
              Admin Access
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold tracking-wide text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                User Identification
              </label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-[#d4af37] transition-colors placeholder:text-slate-300"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Security Code
                </label>
                <button
                  type="button"
                  className="text-[10px] font-bold text-[#d4af37] hover:text-yellow-700 transition-colors"
                >
                  RESET?
                </button>
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-[#d4af37] transition-colors placeholder:text-slate-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#d4af37] hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-sm mt-4"
            >
              {loading ? 'Verifying...' : 'Authorize Login'}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
              Surat Diamond Exchange &copy; 2026
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;