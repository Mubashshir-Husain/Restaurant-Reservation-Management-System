import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Clock, ShieldCheck, Award, Star, MapPin, PhoneCall, ArrowRight, ChefHat, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ChefHat className="h-6 w-6 text-emerald-600" />,
      title: "Master Chefs",
      desc: "Our kitchens are led by award-winning culinary artists who craft dishes using premium ingredients."
    },
    {
      icon: <Utensils className="h-6 w-6 text-emerald-600" />,
      title: "Global Cuisines",
      desc: "From authentic Indian spices to Italian classics, explore culinary traditions from around the globe."
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-600" />,
      title: "Seamless Reservations",
      desc: "Lock in your preferred table and slot in seconds through our state-of-the-art booking desk."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      title: "Hygiene Certified",
      desc: "We adhere to five-star sanitation guidelines to ensure a safe, immaculate dining environment."
    }
  ];

  const testimonials = [
    {
      name: "Sophia Martinez",
      role: "Gastronomy Blogger",
      comment: "BistroReserve has elevated casual fine dining. The booking process was instantaneous, and the signature Tandoori Chicken was out of this world!",
      stars: 5
    },
    {
      name: "Marcus Vance",
      role: "Local Foodie",
      comment: "A stellar ambiance paired with impeccable service. The ability to select specific tables during booking is a game-changer.",
      stars: 5
    },
    {
      name: "Elena Rostova",
      role: "Travel Journalist",
      comment: "A delightful culinary experience. The ingredients are incredibly fresh, and the master chef's passion shines in every plate.",
      stars: 5
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-[45%] h-[100%] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-8 text-left">
            <span className="text-emerald-700 font-bold uppercase tracking-widest text-xs bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-flex items-center gap-1.5 animate-pulse">
              <Sparkles className="h-3.5 w-3.5" /> Est. 2024 • Fine Gastronomy
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
              Where Taste Meets <br />
              <span className="text-emerald-600">Culinary Perfection</span>
            </h1>
            <p className="text-slate-550 text-base sm:text-lg max-w-xl leading-relaxed">
              Step into BistroReserve. Enjoy curated global menus prepared by culinary masters in an elegant, modern atmosphere. Reserve your perfect table instantly.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-emerald-600/15 flex items-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                Book a Table
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/menu')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-8 py-4 rounded-2xl border border-slate-200 transition-all duration-300 flex items-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                Explore Menu
              </button>
            </div>
          </div>

          {/* Visual Showcase Box */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600"
                alt="Bistro Interior"
                className="w-full object-cover h-[350px] sm:h-[400px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
                <div>
                  <p className="text-amber-400 font-black tracking-wider text-[10px] uppercase">Ambiance Room</p>
                  <h3 className="text-white font-black text-lg">Sophisticated Warm Light Settings</h3>
                </div>
              </div>
            </div>

            {/* Float Badge */}
            <div className="absolute bottom-[-15px] left-[-15px] bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xl flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600">
                <Award className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase">Top Rated</p>
                <p className="text-sm font-bold text-slate-800">#1 Dining Destination</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-slate-100 border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <p className="text-3xl font-black text-emerald-600">15+</p>
              <p className="text-xs font-bold text-slate-500 uppercase mt-1">Master Chefs</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <p className="text-3xl font-black text-emerald-600">50+</p>
              <p className="text-xs font-bold text-slate-500 uppercase mt-1">Premium Tables</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <p className="text-3xl font-black text-emerald-600">25+</p>
              <p className="text-xs font-bold text-slate-500 uppercase mt-1">Global Cuisines</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <p className="text-3xl font-black text-emerald-600">12k+</p>
              <p className="text-xs font-bold text-slate-500 uppercase mt-1">Happy Diners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-emerald-700 font-bold uppercase tracking-widest text-[10px] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Our Offerings
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-4">
            A Five-Star Dining Experience
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto mt-2 leading-relaxed">
            We focus on food quality, dining hygiene, and prompt customer reservations to provide the best service possible.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 text-left">
            {features.map((f, i) => (
              <div key={i} className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-56">
                <div>
                  <div className="p-3 bg-emerald-500/10 w-fit rounded-xl mb-4 border border-emerald-500/10">
                    {f.icon}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guest Reviews Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-emerald-700 font-bold uppercase tracking-widest text-[10px] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Reviews
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-4">
            Loved By Our Guests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-64">
                <p className="text-slate-600 text-sm italic leading-relaxed">"{t.comment}"</p>
                <div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(t.stars)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <h5 className="font-bold text-slate-800 text-sm">{t.name}</h5>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details & Location Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-left">
            <h3 className="text-2xl font-bold text-slate-900">Visit Us Today</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We are located at the heart of the city's culinary avenue. Stop by for an unforgettable dinner, or call us for custom catering and reservation requests.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-700 text-sm"> Sector 5, New Delhi</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-700 text-sm">+91 98765 ****</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-700 text-sm">Open Daily: 12:00 PM - 11:30 PM</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-md text-sm cursor-pointer mt-4"
            >
              Book Dinner Session
            </button>
          </div>

          {/* Graphic Placeholder Map Card */}
          <div className="bg-slate-100 border border-slate-200 rounded-3xl p-6 h-72 flex flex-col justify-between relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 text-left">
              <p className="text-[10px] font-black uppercase text-slate-400 leading-tight">Interactive Map Grid</p>
              <h4 className="text-lg font-black text-slate-800 tracking-tight mt-1">Sector 5 Dining Hub</h4>
            </div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="bg-white border border-slate-200 shadow-md p-3 rounded-full flex items-center gap-2 animate-bounce">
                <MapPin className="h-5 w-5 text-rose-500 fill-rose-50" />
                <span className="text-xs font-bold text-slate-800">BistroReserve</span>
              </div>
            </div>
            <p className="relative z-10 text-[10px] text-slate-400 text-right">Latitude: 28.6139° N | Longitude: 77.2090° E</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-slate-400">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-600">BistroReserve Dining Desk</p>
        <p className="text-xs text-slate-500 mt-2">© 2026 BistroReserve. All rights reserved.</p>
      </footer>
    </div>
  );
}
