import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Star } from "lucide-react";

const DestinationCard = ({ destination }) => {
  const { name, state, image, fallbackImage, description, rating = "4.9", bestTime, tag } = destination;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-slate-900">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            if (fallbackImage && e.target.src !== fallbackImage) {
              e.target.src = fallbackImage;
            }
          }}
        />

        {/* Subtle Dark Gradient Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1 border border-white/10">
            <MapPin size={12} className="text-emerald-400" />
            <span>{state}</span>
          </span>

          <span className="px-2.5 py-1 rounded-full bg-white text-slate-800 text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span>{rating}</span>
          </span>
        </div>

        {/* Bottom Destination Title on Image */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5">
          {tag && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
              {tag}
            </span>
          )}
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">
            {description}
          </p>

          {bestTime && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
              <span className="text-slate-400">Best Time:</span>
              <span className="text-emerald-700 font-semibold">{bestTime}</span>
            </div>
          )}
        </div>

        {/* Direct AI Action Button - Minimal Emerald Style */}
        <Link
          to="/ai-assistant"
          state={{ destination: name, state: state }}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 group-hover:bg-emerald-600 group-hover:text-white"
        >
          <span>Plan {name} Itinerary</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
