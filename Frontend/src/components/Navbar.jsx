import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice.js';
import { Utensils, User, LogOut, CalendarRange, BookOpen, HomeIcon } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => 
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
      isActive(path)
        ? 'text-emerald-600 bg-emerald-500/5'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/25">
          <Utensils className="h-6 w-6 text-emerald-650" />
        </div>
        <span className="text-xl font-black text-slate-900 tracking-tight bg-gradient-to-r from-slate-900 to-emerald-650 bg-clip-text text-transparent">
          BistroReserve
        </span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-2">
        <Link to="/" className={linkClass('/')}>
          <HomeIcon className="h-4 w-4" />
          Home
        </Link>
        <Link to="/menu" className={linkClass('/menu')}>
          <BookOpen className="h-4 w-4" />
          Menu
        </Link>
        <Link to="/dashboard" className={linkClass('/dashboard')}>
          <CalendarRange className="h-4 w-4" />
          Reservations
        </Link>
      </div>

      {/* User / Guest Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-6">
            {/* User Profile Info */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="bg-slate-100 border border-slate-200 p-2 rounded-full text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-800 leading-tight">
                  {user.name}
                </span>
                <span className="flex items-center gap-1.5 mt-0.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${user.role === 'admin' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                    {user.role}
                  </span>
                </span>
              </div>
            </div>

            {/* Mobile links fallback */}
            <div className="flex md:hidden items-center gap-2">
              <Link to="/menu" className="p-2 text-slate-655 hover:text-slate-900" title="Menu">
                <BookOpen className="h-5 w-5" />
              </Link>
              <Link to="/dashboard" className="p-2 text-slate-655 hover:text-slate-900" title="Reservations">
                <CalendarRange className="h-5 w-5" />
              </Link>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 px-4 py-2 rounded-xl border border-slate-200 hover:border-rose-200 transition-all duration-300 font-bold text-sm cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* Guest navigation for mobile */}
            <div className="flex md:hidden items-center gap-2 mr-1">
              <Link to="/" className="p-2 text-slate-600 hover:text-slate-900" title="Home">
                <HomeIcon className="h-5 w-5" />
              </Link>
              <Link to="/menu" className="p-2 text-slate-600 hover:text-slate-900" title="Menu">
                <BookOpen className="h-5 w-5" />
              </Link>
              <Link to="/dashboard" className="p-2 text-slate-600 hover:text-slate-900" title="Reservations">
                <CalendarRange className="h-5 w-5" />
              </Link>
            </div>

            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm shadow-md hover:shadow-emerald-600/10 cursor-pointer"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
