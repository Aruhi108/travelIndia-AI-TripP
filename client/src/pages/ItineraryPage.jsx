import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

import html2pdf from 'html2pdf.js';

// Icons
import {
  ArrowLeft,
  Save,
  FileText,
  MapPin,
  Calendar,
  Home,
  Utensils,
  Car,
  Shield,
  Backpack
} from 'lucide-react';

const ItineraryPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const printRef = useRef();

  useEffect(() => {
    fetchItinerary();
  }, [tripId]);

  const fetchItinerary = async () => {
    try {
      const response = await tripsAPI.getTrip(tripId);
      if (response.success) setTrip(response.trip);
      else setError('Itinerary not found');
    } catch (err) {
      setError('Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItinerary = () => {
    alert('Itinerary saved!');
  };

  // ✅ REAL PDF DOWNLOAD
  const handleDownloadPDF = () => {
    const element = printRef.current;

    html2pdf()
      .set({
        margin: 0.5,
        filename: `${trip?.destination || 'itinerary'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading itinerary..." />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Not Found</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/ai-assistant')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl"
          >
            Create New Trip
          </button>
        </div>
      </div>
    );
  }

  const { destination, state, homeLocation, itinerary } = trip;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">

      {/* BACK BUTTON */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* CONTENT WRAPPER (PDF AREA) */}
      <div ref={printRef} className="max-w-6xl mx-auto px-4 space-y-6">

        {/* HEADER CARD */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {destination} Itinerary
          </h1>

          <p className="text-gray-600 mt-2">
            {homeLocation} → {destination}, {state}
          </p>

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSaveItinerary}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl"
            >
              <Save size={16} /> Save
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl"
            >
              <FileText size={16} /> PDF
            </button>
          </div>
        </div>

        {/* SECTIONS */}
        <Card title="Overview" icon={<MapPin />} text={itinerary.overview} />
        <Card title="Best Time to Visit" icon={<Calendar />} text={itinerary.bestTime} />

        <ListCard title="Places to Visit" items={itinerary.places} icon={<MapPin />} />

        {/* HOTELS */}
        <div className="bg-white rounded-3xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Hotels</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {itinerary.hotels.map((h, i) => (
              <div key={i} className="p-4 border rounded-xl bg-gray-50">
                <h3 className="font-semibold">{h.name}</h3>
                <p className="text-gray-600">{h.priceRange}</p>
                <p className="text-yellow-600">⭐ {h.rating}</p>
              </div>
            ))}
          </div>
        </div>

        <ListCard title="Food to Try" items={itinerary.food} icon={<Utensils />} />
        <ListCard title="What to Carry" items={itinerary.carry} icon={<Backpack />} />
        <ListCard title="Documents Required" items={itinerary.documents} icon={<FileText />} />

        <Card title="Transport" icon={<Car />} text={itinerary.reach} />
        <Card title="Safety Tips" icon={<Shield />} text={itinerary.safety} />

      </div>

      {/* FLOAT ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <button
          onClick={handleSaveItinerary}
          className="p-4 rounded-full bg-green-600 text-white shadow-lg"
        >
          <Save size={18} />
        </button>

        <button
          onClick={handleDownloadPDF}
          className="p-4 rounded-full bg-blue-600 text-white shadow-lg"
        >
          <FileText size={18} />
        </button>
      </div>

    </div>
  );
};

/* ---------- CARD ---------- */
const Card = ({ title, text, icon }) => (
  <div className="bg-white rounded-3xl shadow p-6">
    <div className="flex items-center gap-2 mb-3 text-gray-700 font-semibold">
      {icon}
      {title}
    </div>
    <p className="text-gray-600 leading-relaxed">{text}</p>
  </div>
);

/* ---------- LIST CARD ---------- */
const ListCard = ({ title, items, icon }) => (
  <div className="bg-white rounded-3xl shadow p-6">
    <div className="flex items-center gap-2 mb-3 font-semibold">
      {icon}
      {title}
    </div>

    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-gray-700 flex gap-2">
          • {item}
        </li>
      ))}
    </ul>
  </div>
);

export default ItineraryPage;