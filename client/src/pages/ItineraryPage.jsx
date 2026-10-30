import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tripsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import html2pdf from 'html2pdf.js';

// Icons
import {
  ArrowLeft,
  Download,
  Share2,
  MapPin,
  Calendar,
  Utensils,
  Car,
  Shield,
  Luggage,
  Hotel,
  CloudSun,
  FileCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const ItineraryPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const printRef = useRef();

  useEffect(() => {
    fetchItinerary();
  }, [tripId]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await tripsAPI.getTrip(tripId);
      if (response && response.success) {
        setTrip(response.trip);
      } else {
        setError(response?.error || 'Itinerary not found');
      }
    } catch (err) {
      console.error('Fetch itinerary error:', err);
      setError(err?.error || 'Failed to load itinerary. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = printRef.current;
    if (!element) return;

    setDownloadingPdf(true);

    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `${trip?.destination || 'India'}_Travel_Itinerary.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setDownloadingPdf(false);
      })
      .catch((err) => {
        console.error('PDF error:', err);
        setDownloadingPdf(false);
      });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner text="Loading itinerary..." />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm border border-slate-200">
          <div className="w-14 h-14 mx-auto mb-4 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <Shield size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Itinerary Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">{error || 'This trip plan is not accessible or has been deleted.'}</p>
          <div className="flex flex-col gap-2">
            <Link
              to="/ai-assistant"
              className="w-full py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition"
            >
              Plan New Trip
            </Link>
            <Link
              to="/dashboard"
              className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
            >
              Back to My Trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { destination, state, homeLocation, itinerary = {} } = trip;
  const hotels = itinerary.hotels || [];
  const places = itinerary.places || [];
  const food = itinerary.food || [];
  const carry = itinerary.carry || [];
  const documents = itinerary.documents || [];
  const transport = itinerary.transport || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-6">
      {/* Top Action Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-sm transition cursor-pointer"
          >
            <Share2 size={15} />
            <span>{copiedLink ? 'Link Copied! ✓' : 'Share'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-emerald-700 transition cursor-pointer disabled:opacity-60"
          >
            <Download size={15} />
            <span>{downloadingPdf ? 'Exporting PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE ITINERARY CONTAINER */}
      <div ref={printRef} className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* HERO TITLE CARD */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 p-6 sm:p-10 text-white shadow-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-300 mb-3">
                <Sparkles size={13} />
                <span>AI Travel Plan</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                {destination}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300">
                <span className="font-semibold text-white">{state}, India</span>
                <span>•</span>
                <span>Origin: {homeLocation}</span>
                {itinerary.bestTime && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-300 font-medium">{itinerary.bestTime}</span>
                  </>
                )}
              </div>
            </div>

            {itinerary.estimatedCost && (
              <div className="bg-white/10 rounded-xl p-3.5 text-left md:text-right border border-white/10">
                <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Estimated Budget</p>
                <p className="text-xl font-extrabold text-emerald-300">{itinerary.estimatedCost}</p>
              </div>
            )}
          </div>
        </div>

        {/* OVERVIEW & CLIMATE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1.5">
              <MapPin size={15} /> Overview
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {itinerary.overview}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1.5">
                <CloudSun size={15} /> Weather & Climate
              </h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-3">
                {itinerary.weather || 'Pleasant weather for exploration.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Safety Advice</span>
              <p className="text-xs text-slate-600 leading-normal">{itinerary.safety}</p>
            </div>
          </div>
        </div>

        {/* MUST-VISIT ATTRACTIONS WITH GOOGLE SEARCH LINKS */}
        {places.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="text-emerald-600" size={18} />
                <span>Places to Visit ({places.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {places.map((place, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-semibold text-slate-800 text-sm">{place}</h4>
                  </div>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(place + ' ' + destination + ' tourism')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Details</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDED HOTELS WITH MAPS LINKS */}
        {hotels.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <Hotel className="text-emerald-600" size={18} />
              <span>Recommended Accommodations</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {hotels.map((hotel, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-bold text-amber-600">
                        ⭐ {hotel.rating || 4.5}
                      </span>
                      <span className="text-slate-400 text-[10px]">Tier #{idx + 1}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{hotel.name}</h3>
                    <p className="text-emerald-700 text-xs font-bold mb-3">{hotel.priceRange}</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + destination)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-2 border-t border-slate-100 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center justify-between"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOCAL FOOD & CUISINE */}
        {food.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Utensils className="text-emerald-600" size={18} />
              <span>Authentic Local Food to Try</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {food.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <span className="text-emerald-600">🍲</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOW TO REACH */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Car className="text-emerald-600" size={18} />
              <span>Transit & How to Reach</span>
            </h2>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(homeLocation + ' to ' + destination + ' travel options')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Search Flights & Trains</span>
              <ExternalLink size={11} />
            </a>
          </div>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
            {itinerary.reach}
          </p>

          {transport.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {transport.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.type}</p>
                  <p className="text-sm font-extrabold text-slate-900">{t.cost}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CHECKLISTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Luggage className="text-emerald-600" size={16} />
              <span>What to Pack</span>
            </h3>
            <ul className="space-y-2">
              {carry.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileCheck className="text-emerald-600" size={16} />
              <span>Required Documents</span>
            </h3>
            <ul className="space-y-2">
              {documents.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPage;
