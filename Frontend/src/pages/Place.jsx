import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader, ChevronLeft, Globe, Utensils, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

export default function Place() {
  const { area } = useParams();
  const navigate = useNavigate();
  const mealApi = import.meta.env.VITE_MEAL_API_URL || "https://www.themealdb.com/api/json/v1/1";

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMealsByArea() {
      setLoading(true);
      try {
        const queryArea = area === 'Indian' ? 'India' : area;
        const res = await axios.get(`${mealApi}/filter.php?a=${queryArea}`);
        setMeals(res.data.meals || []);
      } catch (error) {
        console.error(`Error loading meals for ${area}:`, error);
      } finally {
        setLoading(false);
      }
    }
    if (area) {
      fetchMealsByArea();
    }
  }, [area, mealApi]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Navigation Panel */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/menu')}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 p-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
              title="Back to Menu"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-left">
              <span className="text-emerald-700 font-bold uppercase tracking-widest text-[10px] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-flex items-center gap-1">
                <Globe className="h-3 w-3" /> Region Specialty
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                {area} Cuisine Selection
              </h1>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500">
            Total Options: <span className="text-emerald-600 font-black">{meals.length}</span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <Loader className="animate-spin h-10 w-10 text-emerald-600 mb-4" />
            <span className="text-sm font-semibold text-slate-500">Loading {area} delicacies...</span>
          </div>
        ) : meals.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
            <Utensils className="h-12 w-12 text-slate-250 mx-auto mb-3 animate-pulse" />
            <span className="font-bold text-sm text-slate-650">No specialties found for this area.</span>
            <p className="text-xs text-slate-500 mt-1">Please explore other global cuisine areas from the nav menu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
            {meals.map((meal) => (
              <Link to={`/recipe/${meal.idMeal}`} key={meal.idMeal} className="group block">
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
                  
                  {/* Thumbnail Image Container */}
                  <div className="h-48 overflow-hidden relative border-b border-slate-100">
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent" />
                  </div>

                  {/* Body details */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <h4 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors text-sm line-clamp-2">
                      {meal.strMeal}
                    </h4>
                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-emerald-650">
                      <span>Recipe & Directions</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
