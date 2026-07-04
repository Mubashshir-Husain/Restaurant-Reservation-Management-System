import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadMe } from '../store/slices/authSlice.js';
import Navbar from '../components/Navbar.jsx';
import Spinner from '../components/Spinner.jsx';
import CustomerPanel from './CustomerPanel.jsx';
import AdminPanel from './AdminPanel.jsx';
import { ShieldCheck, UserCheck } from 'lucide-react';

export default function Dashboard({ showToast }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (!user) {
      dispatch(loadMe());
    }
  }, [token, user, navigate, dispatch]);

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Banner Header */}
        <div className="mb-10 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          {/* Abstract Glow */}
          <div className="absolute top-0 right-0 w-[30%] h-[100%] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Session Active
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
              Hello, {user.name}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {user.role === 'admin' 
                ? 'System administration desk. Manage table lists and client booking requests.' 
                : 'Plan your next culinary experience. Find open tables and secure your booking.'
              }
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
            {user.role === 'admin' ? (
              <>
                <ShieldCheck className="h-5 w-5 text-amber-500" />
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-slate-400 leading-tight">Privilege Level</p>
                  <p className="text-xs font-bold text-amber-600">System Admin</p>
                </div>
              </>
            ) : (
              <>
                <UserCheck className="h-5 w-5 text-emerald-600" />
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-slate-400 leading-tight">Account Type</p>
                  <p className="text-xs font-bold text-emerald-600">Valued Guest</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Role-Specific Portal Panels */}
        {user.role === 'admin' ? (
          <AdminPanel showToast={showToast} />
        ) : (
          <CustomerPanel showToast={showToast} />
        )}
      </main>
    </div>
  );
}
