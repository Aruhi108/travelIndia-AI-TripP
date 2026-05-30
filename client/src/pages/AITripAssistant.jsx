import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Icons
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
  Navigation
} from 'lucide-react';

const AITripAssistant = () => {
  const [formData, setFormData] = useState({
    destination: '',
    state: '',
    homeLocation: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [tripId, setTripId] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setInfoMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfoMessage('');
    setGeneratedItinerary(null);

    try {
      setInfoMessage('Preparing your personalized itinerary...');

      const response = await aiAPI.generateItinerary({
        destination: formData.destination,
        state: formData.state,
        homeLocation: formData.homeLocation
      });

      if (response.success) {
        setInfoMessage('Itinerary generated successfully!');
        setGeneratedItinerary(response.itinerary);
        setTripId(response.tripId);

        setTimeout(() => setInfoMessage(''), 2000);
      } else {
        setError(response.error || 'Failed to generate itinerary');
      }
    } catch (err) {
      setError('Network error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const popularDestinations = [
    { name: 'Goa', state: 'Goa' },
    { name: 'Manali', state: 'Himachal Pradesh' },
    { name: 'Jaipur', state: 'Rajasthan' },
    { name: 'Kerala', state: 'Kerala' }
  ];

  const fillExample = (destination, state) => {
    setFormData({
      destination,
      state,
      homeLocation: 'Delhi'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">

      {/* BACK BUTTON */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-black transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4">

        {/* HEADER CARD */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            AI Trip Assistant
          </h1>
          <p className="text-gray-600">
            Get your personalized travel itinerary
          </p>
        </div>

        {/* POPULAR DESTINATIONS */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {popularDestinations.map((dest, i) => (
            <button
              key={i}
              onClick={() => fillExample(dest.name, dest.state)}
              className="px-4 py-2 bg-white border rounded-full text-sm hover:bg-gray-50 transition"
            >
              {dest.name}, {dest.state}
            </button>
          ))}
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border">

          {/* INFO */}
          {infoMessage && (
            <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
              <Sparkles className="text-green-600" />
              <p className="text-green-700">{infoMessage}</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <Input
              icon={<MapPin size={18} />}
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Goa, Manali..."
            />

            <Input
              icon={<Globe size={18} />}
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Rajasthan, Kerala..."
            />

            <Input
              icon={<Home size={18} />}
              label="Home Location"
              name="homeLocation"
              value={formData.homeLocation}
              onChange={handleChange}
              placeholder="Delhi, Mumbai..."
            />
<button
  type="submit"
  disabled={loading || !isAuthenticated}
  className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-60"
>
  {loading ? (
    <>
      <LoadingSpinner size="small" showText={false} />
      <span>Generating...</span>
    </>
  ) : (
    <span>Generate AI Itinerary</span>
  )}
</button>

          </form>
        </div>

        {/* GENERATED ITINERARY CARD */}
        {generatedItinerary && (
          <div className="mt-10 bg-white rounded-3xl shadow-xl p-6 md:p-10 border">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Your Trip Plan
              </h2>

              <Link
                to={`/itinerary/${tripId}`}
                className="flex items-center gap-2 text-blue-600 font-semibold"
              >
                View Full
                <ExternalLink size={16} />
              </Link>
            </div>

            <p className="text-gray-700 mb-6">
              {generatedItinerary.overview}
            </p>

            {/* GRID INFO */}
            <div className="grid md:grid-cols-2 gap-4">

              <InfoCard
                icon={<Navigation />}
                title="Top Places"
                items={generatedItinerary.places}
              />

              <InfoCard
                icon={<DollarSign />}
                title="Cost"
                text={generatedItinerary.estimatedCost}
              />

              <InfoCard
                icon={<Hotel />}
                title="Best Time"
                text={generatedItinerary.bestTime}
              />

            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-8">
              <Link
                to={`/itinerary/${tripId}`}
                className="flex-1 text-center py-3 rounded-xl bg-blue-600 text-white font-semibold"
              >
                Open Full Itinerary
              </Link>

              <button
                onClick={() => {
                  setGeneratedItinerary(null);
                  setTripId(null);
                }}
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                <RefreshCw size={18} />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

/* ---------- INPUT COMPONENT ---------- */
const Input = ({ icon, label, ...props }) => (
  <div>
    <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <input
      {...props}
      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

/* ---------- INFO CARD ---------- */
const InfoCard = ({ icon, title, text, items }) => (
  <div className="p-4 rounded-2xl border bg-gray-50">
    <div className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
      {icon}
      {title}
    </div>

    {items ? (
      <ul className="text-sm text-gray-600 list-disc ml-5">
        {items.slice(0, 4).map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-600 text-sm">{text}</p>
    )}
  </div>
);

export default AITripAssistant;