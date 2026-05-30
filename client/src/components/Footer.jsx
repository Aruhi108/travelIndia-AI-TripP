import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-[#0b0f19] text-white overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 py-16">

        {/* TOP GRID */}
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] mb-12">

          {/* LEFT BRAND SECTION */}
          <div className="space-y-6">

            {/* LOGOS (PLACEHOLDER IMAGES) */}
            <div className="flex items-center gap-4">
              
              {/* 🔥 Logo 1 */}
              {/* <div className="h-20 w-20 bg-white rounded-xl shadow-xl flex items-center justify-center"> */}
                {/* 👉 PUT IMAGE HERE */}
                {/* <img
                  src="/images/logo1.png"
                  alt="Logo 1"
                  className="object-contain p-2"
                />
              </div> */}

              {/* 🔥 Logo 2 */}
              <div className="h-20 w-32 bg-white rounded-xl shadow-xl flex items-center justify-center">
                {/* 👉 PUT IMAGE HERE */}
                <img
                  src="/homepage/logo.png"
                  alt="Logo 2"
                  className="object-contain w-200 h-200"
                />
              </div>

            </div>

            {/* ADDRESS / INFO */}
            <div className="text-sm text-white/70 leading-relaxed">
              {/* <p>
                Indian Institute / Your Organization Name <br />
                City, State, India
              </p> */}
            </div>

            <p className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              AI Powered Travel Planner Experience
            </p>
          </div>

          {/* RIGHT LINKS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

            {/* EXPLORE */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-blue-400 uppercase tracking-wide">
                Explore
              </h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/ai-assistant" className="hover:text-white">AI Assistant</Link></li>
                <li><Link to="/dashboard" className="hover:text-white">My Trips</Link></li>
              </ul>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-purple-400 uppercase tracking-wide">
               Features
              </h3>
              <ul className="space-y-2">
                 <li className="text-gray-400">AI Itinerary Planning</li>
                  <li className="text-gray-400">Cost Estimation</li>
                   <li className="text-gray-400">Hotel Recommendations</li> 
                   <li className="text-gray-400">Local Transport Guide</li> 
                   </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-pink-400 uppercase tracking-wide">
                Contact
              </h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li>support@travelindia.com</li>
                <li>+91 98XXXXXXXX</li>
                <li>24/7 Support</li>
              </ul>
            </div>

          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent mb-8"></div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-white/50">

          <p>© 2026 TravelIndia. All rights reserved.</p>

          <p className="flex items-center gap-2">
            Made with <span className="text-pink-400">❤️</span> for travelers
          </p>

        </div>

      </div>

      {/* BACKGROUND GLOW EFFECT */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-pink-900/20 blur-3xl"></div>
    </footer>
  );
};

export default Footer;