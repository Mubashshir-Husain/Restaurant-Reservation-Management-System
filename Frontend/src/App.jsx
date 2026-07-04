import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index.js';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import Place from './pages/Place.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Toast from './components/Toast.jsx';

export default function App() {
  // Global Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Landing Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/place/:area" element={<Place />} />
          <Route path="/recipe/:idMeal" element={<RecipeDetail />} />

          {/* Authentication Portals */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Booking Dashboard & Panels */}
          <Route path="/dashboard" element={<Dashboard showToast={showToast} />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Alert Overlay */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        )}
      </Router>
    </Provider>
  );
}
