import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

import {
  MapPin,
  Globe,
  Home,
  Sparkles,
  DollarSign,
  Hotel,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Navigation,
  Calendar,
  Shield,
  Utensils,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';

const AITripAssistant = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    destination: location.state?.destination || '',
    state: location.state?.state || '',
    homeLocation: location.state?.homeLocation || '',
    duration: location.state?.duration || '5 Days',
    travelStyle: 'Comfort'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [tripId, setTripId] = useState(null);

  useEffect(() => {
    if (location.state?.destination) {
      setFormData((prev) => ({
        ...prev,
        destination: location.state.destination,
        state: location.state.state || prev.state,
        homeLocation: location.state.homeLocation || prev.homeLocation
      }));
    }
  }, [location.state]);

  const popularDestinations = [
    { name: 'Goa', state: 'Goa' },
    { name: 'Manali', state: 'Himachal Pradesh' },
    { name: 'Jaipur', state: 'Rajasthan' },
    { name: 'Kerala', state: 'Kerala' },
    { name: 'Varanasi', state: 'Uttar Pradesh' },
    { name: 'Ladakh', state: 'Ladakh' }
  ];

  const travelStyles = ['Budget Backpacker', 'Comfort Explorer', 'Luxury Heritage', 'Family'];
  const durations = ['3 Days', '5 Days', '7 Days', '10 Days'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setInfoMessage('');
  };

  const fillExample = (destination, state) => {
    setFormData((prev) => ({
      ...prev,
      destination,
      state,
      homeLocation: prev.homeLocation || 'Delhi'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('Please sign in or create an account to save your generated itinerary.');
      return;
    }

    if (!formData.destination.trim() || !formData.state.trim() || !formData.homeLocation.trim()) {
      setError('Please fill in Destination, State, and your Starting City.');
      return;
    }

    setLoading(true);
    setError('');
    setInfoMessage('Analyzing travel routes, stays, and attractions...');
    setGeneratedItinerary(null);

    try {
      const response = await aiAPI.generateItinerary({
        destination: formData.destination.trim(),
        state: formData.state.trim(),
        homeLocation: formData.homeLocation.trim()
      });

      if (response && response.success) {
        setInfoMessage('Itinerary crafted successfully! Redirecting...');
        // Immediate redirect to the full itinerary view page
        navigate(`/itinerary/${response.tripId}`);
      } else {
        setError(response?.error || 'Failed to generate itinerary. Please try again.');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err?.error || 'Unable to connect to planner server. Please check backend status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm transition"
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-lg border border-emerald-200 transition"
            >
              <LogIn size={13} />
              <span>Sign In to Save Trips</span>
            </Link>
          )}
        </div>

        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md">
            AI Assistant
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-2">
            Trip Assistant
          </h1>
          <p className="text-slate-600 text-sm">
            Enter your destination and origin city to generate a customized travel itinerary with budget estimates and verified links.
          </p>
        </div>

        {/* Quick Pick Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs text-slate-400 font-medium">Quick Pick:</span>
          {popularDestinations.map((dest, i) => (
            <button
              key={i}
              type="button"
              onClick={() => fillExample(dest.name, dest.state)}
              className="px-3 py-1 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 rounded-full text-xs font-medium text-slate-700 transition"
            >
              {dest.name}
            </button>
          ))}
        </div>

        {/* Main Planner Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 mb-8">
          
          {infoMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Destination */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Destination *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={16} />
                  </div>
                  <input
                    type="text"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g. Goa, Manali, Jaipur"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  State / Region *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Globe size={16} />
                  </div>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Rajasthan, Goa"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Home Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Departure City *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Home size={16} />
                  </div>
                  <input
                    type="text"
                    name="homeLocation"
                    required
                    value={formData.homeLocation}
                    onChange={handleChange}
                    placeholder="e.g. Delhi, Mumbai"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Travel Duration & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {durations.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormData({ ...formData, duration: d })}
                      className={`py-2 rounded-lg text-xs font-semibold transition ${
                        formData.duration === d
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Travel Style
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {travelStyles.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setFormData({ ...formData, travelStyle: style })}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-semibold truncate transition ${
                        formData.travelStyle === style
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {style.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" showText={false} />
                    <span>Formulating Itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    <span>Generate AI Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* GENERATED RESULTS (CLEAN, SPACIOUS, WITH DIRECT EXTERNAL LINKS) */}
        {generatedItinerary && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Itinerary Formulated
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {formData.destination}, {formData.state}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Origin: {formData.homeLocation} • Duration: {formData.duration}
                </p>
              </div>

              {tripId && (
                <Link
                  to={`/itinerary/${tripId}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                >
                  <span>Open Full View / PDF</span>
                  <ExternalLink size={14} />
                </Link>
              )}
            </div>

            {/* Overview */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Overview
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                {generatedItinerary.overview}
              </p>
            </div>

            {/* Key Specs Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 uppercase font-bold block mb-1">
                  Estimated Budget
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  {generatedItinerary.estimatedCost}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 uppercase font-bold block mb-1">
                  Best Time to Visit
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {generatedItinerary.bestTime}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 uppercase font-bold block mb-1">
                  Route Advice
                </span>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(formData.homeLocation + ' to ' + formData.destination + ' travel routes')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 mt-1"
                >
                  <span>Check Trains & Flights</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Top Attractions with Verified Google Search Links */}
            {Array.isArray(generatedItinerary.places) && generatedItinerary.places.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Attractions & Places
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedItinerary.places.map((place, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">
                          {place}
                        </span>
                      </div>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(place + ' ' + formData.destination + ' tourism')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 flex-shrink-0"
                      >
                        <span>Details</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Stays with Google Maps Links */}
            {Array.isArray(generatedItinerary.hotels) && generatedItinerary.hotels.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Recommended Accommodations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {generatedItinerary.hotels.map((hotel, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-amber-600 font-bold mb-1">
                          <span>⭐ {hotel.rating || 4.5}</span>
                          <span className="text-slate-400 text-[10px]">Tier #{idx + 1}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{hotel.name}</h4>
                        <p className="text-xs text-emerald-700 font-semibold mb-3">{hotel.priceRange}</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + formData.destination)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pt-2 border-t border-slate-100 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center justify-between"
                      >
                        <span>View on Maps</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              {tripId && (
                <Link
                  to={`/itinerary/${tripId}`}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm text-center shadow-sm transition"
                >
                  View Full Itinerary & Export PDF
                </Link>
              )}
              <button
                onClick={() => {
                  setGeneratedItinerary(null);
                  setTripId(null);
                }}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={15} />
                <span>Plan Another</span>
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default AITripAssistant;
