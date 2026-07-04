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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            
            {/* Left Panel: visual presentation & CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm overflow-hidden">
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-md mb-5">
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="w-full h-80 object-cover"
                  />
                </div>

                <div className="space-y-4 text-left">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
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
              <div className="bg-emerald-600 text-white rounded-3xl p-6 shadow-lg shadow-emerald-600/10 text-left space-y-4 relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-white/5 rounded-full pointer-events-none" />

                <div className="bg-white/10 p-3 rounded-2xl w-fit">
                  <CalendarRange className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Reserve a Table</h3>
                  <p className="text-emerald-100 text-xs mt-1 leading-relaxed">
                    Would you love to taste this specialty at our restaurant? Secure your dining table and slot instantly below.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-white hover:bg-emerald-50 text-emerald-705 font-bold py-3 rounded-xl transition-all duration-300 text-sm cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  Book Dinner Session
                </button>
              </div>
            </div>

            {/* Right Panel: Walkthrough directions & ingredients grid */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Ingredients List */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  Ingredients Needed
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {getIngredientsList().map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/60 p-3 rounded-xl">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
                      <div className="text-xs">
                        <p className="font-bold text-slate-800">{item.ingredient}</p>
                        <p className="text-slate-500 mt-0.5">{item.measure}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5 pb-2 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">
                    Preparation Instructions
                  </h3>
                  
                  {meal.strYoutube && (
                    <a
                      href={meal.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-605 border border-rose-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                    >
                      <Video className="h-4 w-4 text-rose-500" />
                      Watch Video Tutorial
                    </a>
                  )}
                </div>

                <div className="space-y-4">
                  {meal.strInstructions
                    .split(/\r?\n/)
                    .filter((step) => step.trim().length > 10)
                    .map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="bg-slate-50 text-slate-455 font-black text-xs h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 border border-slate-200">
                          {idx + 1}
                        </div>
                        <p className="text-slate-650 text-xs sm:text-sm leading-relaxed pt-0.5">
                          {step}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
}
