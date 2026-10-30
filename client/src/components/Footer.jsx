import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Heart } from "lucide-react";

const Footer = () => {
  const [tooltip, setTooltip] = useState(null);

  const handleSocialClick = (e, name) => {
    e.preventDefault();
    setTooltip(`${name} link coming soon!`);
    setTimeout(() => setTooltip(null), 2500);
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        {/* Main 2-Side Row: Left is TravelIndia details, Right is Company & Help */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 pb-12 border-b border-slate-800/80">
          
          {/* Left Column: TravelIndia Details */}
          <div className="max-w-md space-y-4">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/homepage/logo.png"
                alt="TravelIndia Logo"
                className="h-10 w-auto object-contain brightness-0 invert opacity-95 group-hover:opacity-100 transition"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Travel<span className="text-emerald-400">India</span>
              </span>
            </Link>

            {/* Tagline Blurb */}
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Trips planned in seconds, not hours. Powered by TravelIndia AI. Complete personalized itineraries with accurate ₹ costs, verified stays, and direct Google Maps links across India.
            </p>

            {/* Disabled Social Icons (Hover shows "Link coming soon") */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Connect With Us
              </p>
              
              <div className="relative flex items-center gap-3">
                {/* Twitter / X */}
                <button
                  type="button"
                  title="Link coming soon"
                  onClick={(e) => handleSocialClick(e, "Twitter")}
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 cursor-pointer transition relative group"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-800 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-md">
                    Link coming soon
                  </span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  title="Link coming soon"
                  onClick={(e) => handleSocialClick(e, "Facebook")}
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 cursor-pointer transition relative group"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.82 0-1.667.417-1.667 1.774v2.206h4.633l-.624 3.667h-4.009v7.98z"/>
                  </svg>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-800 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-md">
                    Link coming soon
                  </span>
                </button>

                {/* Instagram */}
                <button
                  type="button"
                  title="Link coming soon"
                  onClick={(e) => handleSocialClick(e, "Instagram")}
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 cursor-pointer transition relative group"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-800 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-md">
                    Link coming soon
                  </span>
                </button>

                {/* LinkedIn */}
                <button
                  type="button"
                  title="Link coming soon"
                  onClick={(e) => handleSocialClick(e, "LinkedIn")}
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 cursor-pointer transition relative group"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-800 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-md">
                    Link coming soon
                  </span>
                </button>
              </div>

              {/* Toast when clicked */}
              {tooltip && (
                <p className="text-xs text-emerald-400 mt-2 font-medium animate-pulse">
                  ℹ️ {tooltip}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Company & Help */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase">
              Company & Help
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-emerald-400 transition">
                  AI Trip Planner
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition">
                  My Saved Trips
                </Link>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-emerald-400 transition">
                  FAQs & Answers
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition">
                  User Account
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} TravelIndia AI Technologies Private Limited · Made with <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500" /> in India
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              Verified Local Recommendations
            </span>
            <span>·</span>
            <span>256-bit Secure Encryption</span>
            <span>·</span>
            <span>100% Free AI Planning</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
