import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-slate-900/90 border-emerald-500/50 text-emerald-400 shadow-emerald-950/20',
      icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    },
    error: {
      bg: 'bg-slate-900/90 border-rose-500/50 text-rose-400 shadow-rose-950/20',
      icon: <AlertCircle className="h-5 w-5 text-rose-400" />,
    },
  };

  const currentStyle = styles[type] || styles.success;

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 animate-slide-in ${currentStyle.bg}`}
      role="alert"
    >
      <div className="flex-shrink-0">{currentStyle.icon}</div>
      <div className="text-sm font-medium pr-6">{message}</div>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
