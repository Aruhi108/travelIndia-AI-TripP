import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  Brain,
  Wallet,
  Smartphone,
  Compass,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Minus,
  Calendar,
  Heart,
  Navigation
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0); // first open by default like the reference

  // Authentic User Destination Cards with Bento-Grid Design (No external brand copies)
  const vibeTrips = [
    {
      id: "kerala",
      destination: "Kerala",
      state: "Kerala",
      tag: "God's Own Country",
      category: "BACKWATERS & AYURVEDA",
      title: "Kerala",
      description: "Backwaters and lush green landscapes.",
      image: "/destination/kerala.png",
      fallbackImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      isLarge: true
    },
    {
      id: "manali",
      destination: "Manali",
      state: "Himachal Pradesh",
      tag: "Himalayan Escape",
      category: "SNOW & ADVENTURE",
      title: "Manali",
      description: "Scenic hill station in the Himalayas with adventure sports.",
      image: "/destination/manali.png",
      fallbackImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",
      isLarge: false
    },
    {
      id: "jaipur",
      destination: "Jaipur",
      state: "Rajasthan",
      tag: "Royal Heritage",
      category: "THE PINK CITY",
      title: "Jaipur",
      description: "The Pink City with magnificent forts and palaces.",
      image: "/destination/jaipur.png",
      fallbackImage: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=900&q=80",
      isLarge: false
    },
    {
      id: "goa",
      destination: "Goa",
      state: "Goa",
      tag: "Beach Escape",
      category: "COASTAL ESCAPES",
      title: "Goa",
      description: "Beautiful beaches, Portuguese heritage, and vibrant nightlife.",
      image: "/destination/goa.png",
      fallbackImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
      isLarge: false
    },
    {
      id: "ladakh",
      destination: "Ladakh",
      state: "Ladakh",
      tag: "High Altitude",
      category: "LAKES & PASSES",
      title: "Ladakh",
      description: "Breathtaking landscapes, serene monasteries, and crystal blue lakes.",
      image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=900&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=900&q=80",
      isLarge: false
    }
  ];

  const handleCardClick = (dest, state) => {
    navigate('/ai-assistant', {
      state: { destination: dest, state: state }
    });
  };

  // Authentic TravelIndia AI FAQs matching the requested question structure & honest answers
  const faqs = [
    {
      q: "What exactly is TravelIndia AI?",
      a: "TravelIndia AI combines intelligent algorithmic planning with rich local insights across all 28 states and union territories. You describe your dream trip in simple plain language, and TravelIndia generates a complete, realistic day-by-day itinerary with exact cost breakdowns, verified hotels, and direct Google Maps navigation in seconds."
    },
    {
      q: "How is TravelIndia different from ChatGPT for travel?",
      a: "ChatGPT gives generic paragraphs and unverified place names. TravelIndia AI builds a fully structured, actionable itinerary tailored specifically for India: real train/cab travel times, estimated costs in ₹ (INR), direct Google Maps search links for hotels and monuments, and days that are paced so you don't burn out."
    },
    {
      q: "Is TravelIndia 100% free to plan with?",
      a: "Yes! There are no upfront fees, hidden markups, or subscription locks. You can generate unlimited custom itineraries, modify your plans, and export a clean PDF completely free of charge."
    },
    {
      q: "Can I customize the itinerary after it's generated?",
      a: "Absolutely. Everything is flexible. You can adjust your budget tier (Budget, Moderate, Luxury), change trip duration, add specific interests (e.g. food walks, photography, adventure), or re-prompt the AI anytime until the plan feels just right for you."
    },
    {
      q: "Does TravelIndia support trips in Hindi or Hinglish?",
      a: "Yes! You can describe your trip in English, Hindi, or conversational Hinglish (for example: '3 din ka Manali trip with friends under 15000 budget') and the AI understands your context and crafts the plan accordingly."
    },
    {
      q: "Can I download or save my itinerary offline?",
      a: "Yes. Every generated itinerary comes with a 1-click 'Download PDF' option formatted cleanly for your phone, plus a shareable link that you can send directly to friends or family on WhatsApp."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
      
      {/* ============================================================ */}
      {/* SECTION 1: HERO SECTION - Clean, Minimal Emerald */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-20 pb-24 md:pt-32 md:pb-36 border-b border-emerald-950/40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Intelligent Indian Travel Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]"
          >
            Explore India with{' '}
            <span className="text-emerald-400">Thoughtful AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Personalized itineraries with realistic expenses in ₹, verified accommodations, cultural highlights, and transit advice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/ai-assistant"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-sm transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              <span>Plan Trip with AI</span>
              <ArrowRight size={17} />
            </Link>

            <a
              href="#vibe-section"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-semibold text-sm sm:text-base transition text-center"
            >
              Browse By Vibe
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-400 font-medium"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              100% Free
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              Direct Google Maps Links
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              Accurate ₹ Cost Breakdown
            </span>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: "TRAVEL TO MATCH YOUR VIBE" - Bento Grid Design */}
      {/* ============================================================ */}
      <section id="vibe-section" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full sm:max-w-7xl sm:mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Travel to Match Your Vibe
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Find a plan that feels just right — whether you're planning a romantic honeymoon, a road trip, or your next solo escape.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Top Row - Card 1: Large Span 2 on Desktop (Kerala) */}
            <div className="lg:col-span-2">
              <div
                onClick={() => handleCardClick(vibeTrips[0].destination, vibeTrips[0].state)}
                className="relative group cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden transform transition-all duration-300 sm:hover:-translate-y-1.5 sm:hover:shadow-2xl w-full h-[360px] sm:h-[400px]"
              >
                <img
                  src={vibeTrips[0].image}
                  alt={vibeTrips[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = vibeTrips[0].fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"></div>
                
                {/* Top Badge Pill */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs sm:text-sm font-semibold rounded-full text-slate-900 shadow-sm">
                    {vibeTrips[0].tag}
                  </span>
                </div>

                {/* Top Right Circular Arrow Icon */}
                <div className="absolute top-4 right-4">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:bg-emerald-500 group-hover:scale-110 shadow-md">
                    <ArrowUpRight className="w-4 sm:w-5 h-4 sm:h-5 text-slate-900 group-hover:text-white transition-colors" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <p className="text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
                    {vibeTrips[0].category}
                  </p>
                  <h3 className="text-white font-extrabold text-xl sm:text-2xl md:text-3xl mb-1.5">
                    {vibeTrips[0].title}
                  </h3>
                  <p className="text-slate-200 text-xs sm:text-sm max-w-xl line-clamp-2 opacity-90">
                    {vibeTrips[0].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Row - Card 2: Span 1 on Desktop (Manali) */}
            <div className="lg:col-span-1">
              <div
                onClick={() => handleCardClick(vibeTrips[1].destination, vibeTrips[1].state)}
                className="relative group cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden transform transition-all duration-300 sm:hover:-translate-y-1.5 sm:hover:shadow-2xl w-full h-[360px] sm:h-[400px]"
              >
                <img
                  src={vibeTrips[1].image}
                  alt={vibeTrips[1].title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = vibeTrips[1].fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"></div>
                
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs sm:text-sm font-semibold rounded-full text-slate-900 shadow-sm">
                    {vibeTrips[1].tag}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:bg-emerald-500 group-hover:scale-110 shadow-md">
                    <ArrowUpRight className="w-4 sm:w-5 h-4 sm:h-5 text-slate-900 group-hover:text-white transition-colors" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <p className="text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
                    {vibeTrips[1].category}
                  </p>
                  <h3 className="text-white font-extrabold text-xl sm:text-2xl mb-1.5">
                    {vibeTrips[1].title}
                  </h3>
                  <p className="text-slate-200 text-xs sm:text-sm line-clamp-2 opacity-90">
                    {vibeTrips[1].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row - 3 Cards (Jaipur, Goa, Ladakh) */}
            {vibeTrips.slice(2).map((item) => (
              <div key={item.id} className="lg:col-span-1">
                <div
                  onClick={() => handleCardClick(item.destination, item.state)}
                  className="relative group cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden transform transition-all duration-300 sm:hover:-translate-y-1.5 sm:hover:shadow-2xl w-full h-[340px] sm:h-[380px]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = item.fallbackImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"></div>
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs sm:text-sm font-semibold rounded-full text-slate-900 shadow-sm">
                      {item.tag}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <div className="w-9 sm:w-10 h-9 sm:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:bg-emerald-500 group-hover:scale-110 shadow-md">
                      <ArrowUpRight className="w-4 sm:w-5 h-4 sm:h-5 text-slate-900 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <p className="text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
                      {item.category}
                    </p>
                    <h3 className="text-white font-extrabold text-lg sm:text-xl mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-slate-200 text-xs sm:text-sm line-clamp-2 opacity-90">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: "WHAT MAKES US WANDER-FUL" - With Auto-Floating Icons */}
      {/* ============================================================ */}
      <section className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200/70 overflow-hidden">
        <div className="max-w-[1320px] mx-auto">
          {/* Title */}
          <div className="text-center mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-md">
              The TravelIndia Difference
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-2.5">
              What Makes Us Wander-ful
            </h2>
          </div>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center">
            
            {/* Left Column (3 Value Features) */}
            <div className="flex flex-col justify-center space-y-10 lg:pr-8">
              <div>
                <h3 className="font-bold text-base md:text-lg text-slate-900 mb-2 flex items-center gap-2">
                  <Brain size={18} className="text-emerald-600" />
                  Smarter Than Any Search Engine
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  AI pulls together flights, express trains, boutique stays, and authentic food spots so you don't waste 4 hours comparing browser tabs.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-base md:text-lg text-slate-900 mb-2 flex items-center gap-2">
                  <Wallet size={18} className="text-emerald-600" />
                  Real INR (₹) Expense Forecasts
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Budget calculations tailored to your travel tier: transparent hotel ranges, transport costs, and local dining expenses.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-base md:text-lg text-slate-900 mb-2 flex items-center gap-2">
                  <Calendar size={18} className="text-emerald-600" />
                  Plans That Actually Flow
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  No awkward gaps or exhausted travel days. Every hour is balanced between sightseeing, culinary breaks, and relaxation.
                </p>
              </div>
            </div>

            {/* Middle Column: Portrait Capsule with 6 Continuously Floating Badge Icons */}
            <div className="relative flex justify-center py-6 select-none">
              {/* Rounded capsule portrait */}
              <div className="relative rounded-full overflow-hidden w-[280px] sm:w-[340px] md:w-[380px] h-[460px] sm:h-[540px] shadow-2xl border-4 border-white bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
                  alt="Traveler exploring scenic Indian landscape"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
              </div>

              {/* 1. Heart (Top Left) - Auto floating */}
              <motion.div
                animate={{
                  y: [0, -14, 0],
                  x: [0, 4, 0],
                  rotate: [0, 6, 0]
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.25, rotate: 14 }}
                className="cursor-pointer w-13 h-13 rounded-full shadow-xl flex items-center justify-center border-4 border-white absolute top-6 -left-2 sm:left-2 bg-[#faebea] text-rose-500 z-20"
                title="Loved by Travelers"
              >
                <Heart size={22} className="fill-rose-500" />
              </motion.div>

              {/* 2. Shield (Top Right) - Auto floating */}
              <motion.div
                animate={{
                  y: [0, 12, 0],
                  x: [0, -5, 0],
                  rotate: [0, -6, 0]
                }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
                whileHover={{ scale: 1.25, rotate: -14 }}
                className="cursor-pointer w-13 h-13 rounded-full shadow-xl flex items-center justify-center border-4 border-white absolute top-12 -right-2 sm:right-2 bg-[#f8f4fe] text-purple-600 z-20"
                title="Safe & Verified Guides"
              >
                <ShieldCheck size={22} />
              </motion.div>

              {/* 3. MapPin (Middle Left) - Auto floating */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  x: [0, 6, 0]
                }}
                transition={{
                  duration: 2.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6
                }}
                whileHover={{ scale: 1.25, rotate: 10 }}
                className="cursor-pointer w-13 h-13 rounded-full shadow-xl flex items-center justify-center border-4 border-white absolute top-1/2 -left-4 sm:-left-6 -translate-y-1/2 bg-[#fff4f0] text-amber-600 z-20"
                title="Google Maps Routes"
              >
                <MapPin size={22} />
              </motion.div>

              {/* 4. Compass (Middle Right) - Auto floating */}
              <motion.div
                animate={{
                  y: [0, 14, 0],
                  x: [0, -4, 0],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
                whileHover={{ scale: 1.25, rotate: 25 }}
                className="cursor-pointer w-13 h-13 rounded-full shadow-xl flex items-center justify-center border-4 border-white absolute top-1/2 -right-4 sm:-right-6 -translate-y-1/2 bg-[#e3f2fd] text-sky-600 z-20"
                title="Smart Route Navigation"
              >
                <Compass size={22} />
              </motion.div>

              {/* 5. Sparkles (Bottom Left) - Auto floating */}
              <motion.div
                animate={{
                  y: [0, 12, 0],
                  x: [0, 5, 0],
                  scale: [1, 1.08, 1]
                }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8
                }}
                whileHover={{ scale: 1.25, rotate: -15 }}
                className="cursor-pointer w-13 h-13 rounded-full shadow-xl flex items-center justify-center border-4 border-white absolute bottom-12 -left-2 sm:left-2 bg-[#fff9dc] text-amber-500 z-20"
                title="AI Recommendation Engine"
              >
                <Sparkles size={22} />
              </motion.div>

              {/* 6. Check (Bottom Right) - Auto floating */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  x: [0, -4, 0]
                }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                whileHover={{ scale: 1.25, rotate: 15 }}
                className="cursor-pointer w-13 h-13 rounded-full shadow-xl flex items-center justify-center border-4 border-white absolute bottom-6 -right-2 sm:right-2 bg-[#ebffed] text-emerald-600 z-20"
                title="Verified Accommodations"
              >
                <CheckCircle2 size={22} />
              </motion.div>
            </div>

            {/* Right Column (3 Value Features) */}
            <div className="flex flex-col justify-center space-y-10 lg:pl-8">
              <div>
                <h3 className="font-bold text-base md:text-lg text-slate-900 mb-2 flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" />
                  Direct Google Maps Links
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every hotel and attraction recommendation includes a 1-click Google Maps link for instant directions and reviews.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-base md:text-lg text-slate-900 mb-2 flex items-center gap-2">
                  <Smartphone size={18} className="text-emerald-600" />
                  High-Res PDF Export
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Download a print-ready, clean PDF of your entire trip itinerary with cost estimates for offline viewing during flights or remote trails.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-base md:text-lg text-slate-900 mb-2 flex items-center gap-2">
                  <Navigation size={18} className="text-emerald-600" />
                  Covering Every Corner of India
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  From iconic landmarks in Agra and Jaipur to offbeat mountain homestays in Sikkim and Spiti, TravelIndia plans it all seamlessly.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: FAQ SECTION (Matching Design Layout with Honest Answers) */}
      {/* ============================================================ */}
      <section id="faq-section" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
              Questions, <span className="font-serif italic text-emerald-700 font-normal">answered</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg">
              The honest answers, <span className="font-serif italic text-slate-800">no marketing fluff.</span>
            </p>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen ? 'border-emerald-600/40 bg-emerald-50/20 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full py-5 px-6 sm:px-8 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base sm:text-lg hover:text-emerald-800 transition"
                  >
                    <span>{faq.q}</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? 'bg-emerald-600 text-white border-emerald-600 rotate-180'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}>
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 sm:px-8 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-200/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: MINIMAL BOTTOM CTA */}
      {/* ============================================================ */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="rounded-3xl bg-emerald-950 text-white p-8 sm:p-14 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
              Ready for Your Next Indian Journey?
            </h2>
            <p className="text-emerald-200 text-xs sm:text-sm mb-6 leading-relaxed">
              Create and export a complete, customized itinerary with accurate ₹ pricing in seconds.
            </p>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-emerald-950 font-bold text-sm shadow-sm hover:bg-emerald-50 transition active:scale-[0.98]"
            >
              <Sparkles size={16} />
              <span>Start Planning with AI</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
