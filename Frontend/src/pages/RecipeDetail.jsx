import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader, ChevronLeft, CalendarRange, Video, Compass, Tag, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

export default function RecipeDetail() {
  const { idMeal } = useParams();
  const navigate = useNavigate();
  const mealApi = import.meta.env.VITE_MEAL_API_URL || "https://www.themealdb.com/api/json/v1/1";

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getMealDetails() {
      setLoading(true);
      try {
        const res = await axios.get(`${mealApi}/lookup.php?i=${idMeal}`);
        if (res.data.meals && res.data.meals.length > 0) {
          setMeal(res.data.meals[0]);
        }
      } catch (error) {
        console.error("Error loading meal details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (idMeal) {
      getMealDetails();
    }
  }, [idMeal, mealApi]);

  // Parse ingredients and measures dynamically
  const getIngredientsList = () => {
    if (!meal) return [];
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        list.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : 'As needed'
        });
      }
    }
    return list;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation header */}
        <div className="mb-8 flex items-center justify-between bg-white border border-slate-205 p-4 rounded-2xl shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 transition-all font-bold text-xs cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Go Back
          </button>
          
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-slate-400">Kitchen Archive</span>
            <p className="text-xs font-bold text-emerald-650">Meal #{idMeal}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <Loader className="animate-spin h-10 w-10 text-emerald-650 mb-4" />
            <span className="text-sm font-semibold text-slate-500">Retrieving culinary guide...</span>
          </div>
        ) : !meal ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
            <p className="font-bold text-sm text-slate-600">Recipe details could not be found.</p>
            <button
              onClick={() => navigate('/menu')}
              className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
            >
              Back to Menu
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            
            {/* Visual presentation & details */}
            <div className="bg-white border border-slate-205 p-5 sm:p-6 rounded-3xl shadow-sm overflow-hidden">
              <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-md mb-6">
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="w-full h-96 object-cover"
                />
              </div>

              <div className="space-y-4 text-left">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {meal.strMeal}
                </h1>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-655 px-3 py-1 rounded-full">
                    <Compass className="h-3.5 w-3.5 text-emerald-600" />
                    {meal.strArea} Origin
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-655 px-3 py-1 rounded-full">
                    <Tag className="h-3.5 w-3.5 text-emerald-650" />
                    {meal.strCategory}
                  </span>
                </div>

                {meal.strTags && (
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    Tags: <span className="italic text-slate-550">{meal.strTags.split(',').join(', ')}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Table Booking Shortcut CTA Card */}
            <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-emerald-600/10 text-left space-y-4 relative overflow-hidden">
              {/* Visual Accent */}
              <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-white/5 rounded-full pointer-events-none" />

              <div className="bg-white/10 p-3 rounded-2xl w-fit">
                <CalendarRange className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Reserve a Table</h3>
                <p className="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
                  Would you love to taste this specialty at our restaurant? Secure your dining table and slot instantly below.
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-white hover:bg-emerald-50 text-emerald-700 font-bold py-3.5 rounded-xl transition-all duration-300 text-sm cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                Book Dinner Session
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
