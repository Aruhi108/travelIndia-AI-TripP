import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { tripsAPI, authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Sparkles,
  Trash2,
  ArrowRight,
  User,
  Search,
  Plus,
  Compass,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Settings
} from 'lucide-react';

const UserDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchUserTrips();
  }, []);

  const fetchUserTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await tripsAPI.getMyTrips();
      if (response && response.success) {
        setTrips(response.trips || []);
      } else {
        setTrips([]);
      }
    } catch (err) {
      console.error('Fetch trips error:', err);
      setError(err?.error || 'Failed to load your trips.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip itinerary?')) {
      return;
    }
    setDeletingId(tripId);
    try {
      const res = await tripsAPI.deleteTrip(tripId);
      if (res && res.success) {
        setTrips((prev) => prev.filter((trip) => (trip.id || trip._id) !== tripId));
        setSuccessMsg('Trip removed successfully.');
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Could not delete trip.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchSearch =
        (trip.destination || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.state || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.homeLocation || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchState = selectedState === 'All' || trip.state === selectedState;
      return matchSearch && matchState;
    });
  }, [trips, searchQuery, selectedState]);

  const uniqueStates = useMemo(() => {
    const set = new Set();
    trips.forEach((t) => t.state && set.add(t.state));
    return ['All', ...Array.from(set)];
  }, [trips]);

  // Profile Modal Component
  const ProfileModal = () => {
    const [profileData, setProfileData] = useState({
      username: user?.username || '',
      profilePhoto: user?.profilePhoto || ''
    });
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async (e) => {
      e.preventDefault();
      setUpdating(true);
      try {
        const response = await authAPI.updateProfile(profileData);
        if (response && response.success) {
          setShowProfileModal(false);
          window.location.reload();
        }
      } catch (err) {
        alert('Failed to update profile.');
      } finally {
        setUpdating(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <h3 className="text-base font-bold text-slate-900">Account Settings</h3>
            <button
              onClick={() => setShowProfileModal(false)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Profile Photo URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={profileData.profilePhoto}
                onChange={(e) => setProfileData({ ...profileData, profilePhoto: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-3 flex gap-2">
              <button
                type="submit"
                disabled={updating}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
              >
                {updating ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition"
              >
                Logout
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                My Trips
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {trips.length} Saved
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage and review your saved itineraries
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowProfileModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-sm transition"
            >
              <Settings size={15} />
              <span>Profile</span>
            </button>

            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Plus size={15} />
              <span>Plan New Trip</span>
            </Link>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Search & State Filter */}
        {trips.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-8">
            <div className="relative flex-1 max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search by destination or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {uniqueStates.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {uniqueStates.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedState(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      selectedState === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Trips Grid or Empty State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <LoadingSpinner text="Fetching your trips..." />
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Compass size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Trips Planned Yet</h3>
            <p className="text-slate-500 text-xs mb-5">
              Start planning your next Indian adventure with our AI planner.
            </p>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
            >
              <Sparkles size={14} />
              <span>Create Your First Trip</span>
            </Link>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-xs text-slate-500">
            No trips match "{searchQuery}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTrips.map((trip) => {
              const tripId = trip.id || trip._id;
              const itinerary = trip.itinerary || {};
              const overview = itinerary.overview || `Custom travel plan for ${trip.destination}.`;
              const createdDate = trip.createdAt
                ? new Date(trip.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })
                : 'Recently';

              return (
                <div
                  key={tripId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {trip.state}
                      </span>
                      <span className="text-[11px] text-slate-400">{createdDate}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <MapPin size={16} className="text-emerald-600" />
                      <span>{trip.destination}</span>
                    </h3>

                    <p className="text-xs text-slate-500 mb-3">
                      From: <strong className="text-slate-700">{trip.homeLocation}</strong>
                    </p>

                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
                      {overview}
                    </p>

                    {itinerary.estimatedCost && (
                      <div className="mb-4 text-xs font-semibold text-slate-700 flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                        <DollarSign size={13} className="text-emerald-600" />
                        <span className="truncate">{itinerary.estimatedCost}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      to={`/itinerary/${tripId}`}
                      className="flex-1 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white text-xs font-bold text-center transition"
                    >
                      View Itinerary
                    </Link>

                    <button
                      onClick={() => handleDeleteTrip(tripId)}
                      disabled={deletingId === tripId}
                      title="Delete Trip"
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Profile Modal */}
        <AnimatePresence>
          {showProfileModal && <ProfileModal />}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default UserDashboard;
