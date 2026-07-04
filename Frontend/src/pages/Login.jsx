import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../store/slices/authSlice.js';
import { Lock, Mail, Utensils, AlertCircle } from 'lucide-react';
import Spinner from '../components/Spinner.jsx';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (token) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [token, navigate, dispatch]);

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please provide a valid email';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-200/50 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 mb-3 shadow-lg shadow-emerald-500/5">
            <Utensils className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Sign in to reserve your table and manage bookings
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-605 rounded-xl flex items-start gap-3 text-sm animate-shake">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full bg-slate-50 border ${
                    validationErrors.email ? 'border-rose-500' : 'border-slate-200'
                  } rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all duration-300 text-sm`}
                />
              </div>
              {validationErrors.email && (
                <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-rose-500" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border ${
                    validationErrors.password ? 'border-rose-500' : 'border-slate-200'
                  } rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all duration-300 text-sm`}
                />
              </div>
              {validationErrors.password && (
                <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-rose-500" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <Spinner size="sm" className="!border-t-white" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Card Footer Link */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500">
              New to BistroReserve?{' '}
              <Link
                to="/register"
                className="text-emerald-600 font-semibold hover:text-emerald-500 hover:underline transition-all"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
