import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { Loader, Clock, Search, Globe, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// CommonJS/ESM interop helper for react-slick
const SlickSlider = Slider.default || Slider;

const CUISINES = [
  "Indian", "American", "British", "Canadian", "Italian",
  "Mexican", "Saudi Arabian", "Egyptian", "Turkish", "Russian",
  "Thai", "French", "Chinese", "Algerian", "Argentinian",
  "Australian", "Croatian", "Dutch", "Filipino", "Greek",
  "Irish", "Jamaican", "Japanese", "Kenyan", "Malaysian",
  "Moroccan", "Norwegian", "Polish", "Portuguese", "Slovakian",
  "Spanish", "Syrian", "Tunisian", "Ukrainian", "Uruguayan",
  "Venezuelan", "Vietnamese"
];

export default function Menu() {
  const mealApi = import.meta.env.VITE_MEAL_API_URL || "https://www.themealdb.com/api/json/v1/1";

  // State
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [indianMeals, setIndianMeals] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [indianLoading, setIndianLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch Featured Meals
  useEffect(() => {
    async function getFeatured() {
      try {
        const res = await axios.get(`${mealApi}/search.php?f=a`);
        setFeaturedMeals(res.data.meals || []);
      } catch (error) {
        console.error("Error loading featured meals:", error);
      } finally {
        setFeaturedLoading(false);
      }
    }
    getFeatured();
  }, [mealApi]);

  // Fetch Indian Meals
  useEffect(() => {
    async function getIndian() {
      try {
        const res = await axios.get(`${mealApi}/filter.php?a=India`);
        setIndianMeals(res.data.meals || []);
      } catch (error) {
        console.error("Error loading Indian meals:", error);
      } finally {
        setIndianLoading(false);
      }
    }
    getIndian();
  }, [mealApi]);

  // Handle Meal Search
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setHasSearched(true);
    try {
      const res = await axios.get(`${mealApi}/search.php?s=${searchQuery}`);
      setSearchResults(res.data.meals || []);
    } catch (error) {
      console.error("Error searching meals:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Slider Configurations
  const featuredSettings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  };

  const indianSettings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Cuisine Quick-Navigation Pill Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-6 shadow-sm overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 text-slate-900 font-bold whitespace-nowrap">
          <Globe className="text-emerald-600 w-5 h-5 animate-spin-slow" />
          <span>Cuisines</span>
        </div>
        <div className="h-6 w-[1px] bg-slate-200 flex-shrink-0" />
        <ul className="flex items-center gap-2.5">
          {CUISINES.map((area) => (
            <Link to={`/place/${area}`} key={area} className="flex-shrink-0">
              <li className="bg-slate-50 hover:bg-emerald-50 text-slate-655 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer transition-all duration-300">
                {area}
              </li>
            </Link>
          ))}
        </ul>
      </div>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Banner & Live Search Header */}
        <div className="mb-10 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="text-emerald-650 font-bold uppercase tracking-widest text-[10px] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Fresh Ingredients Daily
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
              Explore Our Signature Menus
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Select a world region or look up specific dishes in our kitchen index.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex items-center w-full md:w-auto max-w-md relative">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value.trim()) {
                    setHasSearched(false);
                    setSearchResults([]);
                  }
                }}
                placeholder="Search recipe index..."
                className="w-full md:w-80 bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all text-sm shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="ml-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl transition-all text-sm cursor-pointer shadow-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Conditional Layout Switching */}
        {hasSearched ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Search Results for <span className="text-emerald-650">"{searchQuery}"</span>
              </h2>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setHasSearched(false);
                  setSearchResults([]);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Clear Search
              </button>
            </div>

            {searchLoading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner size="md" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <span className="font-semibold text-sm text-slate-600">No dishes matched your query.</span>
                <p className="text-xs text-slate-500 mt-1">Try searching for other words like "Chicken", "Cake", or "Beef".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((meal) => (
                  <Link to={`/recipe/${meal.idMeal}`} key={meal.idMeal} className="group">
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
                      <div className="h-44 overflow-hidden relative">
                        <img
                          src={meal.strMealThumb}
                          alt={meal.strMeal}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-sm">
                          {meal.strCategory || "Dish"}
                        </span>
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-sm line-clamp-1">
                          {meal.strMeal}
                        </h4>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Origin: {meal.strArea || "Global"}</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                            View Detail <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Default Slider View */
          <div className="space-y-12">
            
            {/* Slider 1: Featured Recipes */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-l-4 border-emerald-500 pl-3">
                <Clock className="w-5 h-5 mr-2 text-emerald-600" />
                Featured Gourmet Suggestions
              </h2>

              {featuredLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="animate-spin text-slate-400 mr-2 h-5 w-5" />
                  <span className="text-slate-500 text-sm">Loading Menu Recommendations...</span>
                </div>
              ) : (
                <SlickSlider {...featuredSettings} className="recipe-slider">
                  {featuredMeals.map((meal) => (
                    <div key={meal.idMeal} className="px-2">
                      <Link to={`/recipe/${meal.idMeal}`} className="group block">
                        <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center hover:shadow-md transition-all duration-350 hover:-translate-y-1.5 hover:border-emerald-200">
                          <div className="w-full h-48 rounded-xl overflow-hidden mb-4 border border-slate-100">
                            <img
                              src={meal.strMealThumb}
                              alt={meal.strMeal}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors text-sm line-clamp-1">
                            {meal.strMeal}
                          </h3>
                        </div>
                      </Link>
                    </div>
                  ))}
                </SlickSlider>
              )}
            </div>

            {/* Slider 2: Indian Specialty Meals */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-l-4 border-emerald-500 pl-3">
                <Clock className="w-5 h-5 mr-2 text-emerald-600" />
                Traditional Indian Specialties
              </h2>

              {indianLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="animate-spin text-slate-400 mr-2 h-5 w-5" />
                  <span className="text-slate-500 text-sm">Loading Curry Selections...</span>
                </div>
              ) : (
                <SlickSlider {...indianSettings} className="recipe-slider">
                  {indianMeals.map((meal) => (
                    <div key={meal.idMeal} className="px-2">
                      <Link to={`/recipe/${meal.idMeal}`} className="group block">
                        <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center hover:shadow-md transition-all duration-350 hover:-translate-y-1">
                          <div className="w-full h-32 rounded-xl overflow-hidden mb-3 border border-slate-100">
                            <img
                              src={meal.strMealThumb}
                              alt={meal.strMeal}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <p className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors text-xs line-clamp-1">
                            {meal.strMeal}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </SlickSlider>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

// Inline Spinner placeholder in case of component load delays
function Spinner({ size = 'md' }) {
  const sizeClasses = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-6 w-6';
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-2 border-slate-200 border-t-emerald-650 ${sizeClasses}`} />
    </div>
  );
}
