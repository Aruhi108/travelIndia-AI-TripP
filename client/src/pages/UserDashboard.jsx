import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripsAPI, authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const UserDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('trips');
  const { user, logout } = useAuth();

  useEffect(() => {
    if (activeTab === 'trips') {
      fetchUserTrips();
    }
  }, [activeTab]);

  const fetchUserTrips = async () => {
    try {
      const response = await tripsAPI.getMyTrips();
      if (response.success) {
        setTrips(response.trips);
      }
    } catch (error) {
      console.error('Fetch trips error:', error);
      setError('Failed to load your trips');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripsAPI.deleteTrip(tripId);
        setTrips(trips.filter(trip => trip.id !== tripId));
      } catch (error) {
        console.error('Delete trip error:', error);
        alert('Failed to delete trip');
      }
    }
  };

  const ProfileTab = () => {
    const [profileData, setProfileData] = useState({
      username: user?.username || '',
      profilePhoto: user?.profilePhoto || ''
    });
    const [updating, setUpdating] = useState(false);

    const handleUpdateProfile = async (e) => {
      e.preventDefault();
      setUpdating(true);
      
      try {
        const response = await authAPI.updateProfile(profileData);
        if (response.success) {
          alert('Profile updated successfully!');
          window.location.reload(); // Refresh to show updated data
        }
      } catch (error) {
        console.error('Update profile error:', error);
        alert('Failed to update profile');
      } finally {
        setUpdating(false);
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
              {profileData.profilePhoto ? (
                <img 
                  src={profileData.profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user?.username?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <input
              type="text"
              placeholder="Profile photo URL"
              value={profileData.profilePhoto}
              onChange={(e) => setProfileData({...profileData, profilePhoto: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Paste image URL for profile photo</p>
          </div>

          {/* Profile Form */}
          <div className="flex-grow">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading && activeTab === 'trips') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading your trips..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            My Travel Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Welcome back, {user?.username}! Manage your travel adventures.
          </p>
          <Link
            to="/ai-assistant"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
          >
             Create New Trip
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'trips'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Trips ({trips.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'profile'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Profile
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'trips' ? (
          trips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌄</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Trips Yet</h2>
              <p className="text-gray-600 mb-6">Start planning your first adventure with our AI Trip Assistant!</p>
              <Link
                to="/ai-assistant"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Plan Your First Trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{trip.destination}</h3>
                      <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                        {trip.state}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {trip.itinerary.overview.substring(0, 100)}...
                    </p>

                    <div className="text-sm text-gray-500 mb-4">
                      <div>From: {trip.homeLocation}</div>
                      <div>Created: {new Date(trip.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/itinerary/${trip.id}`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <ProfileTab />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;