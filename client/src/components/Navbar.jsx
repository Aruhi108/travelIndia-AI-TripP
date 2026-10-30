import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LogOut, Menu, X, ArrowUpRight, Compass } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        {/* Brand Logo - Original logo.png restored */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-auto flex items-center justify-center">
            <img 
              src="/homepage/logo.png" 
              alt="TravelIndia" 
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // If logo image not found, fallback gracefully
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
              Travel<span className="text-emerald-600">India</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
              AI Travel Planner
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive('/')
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>

          <Link
            to="/ai-assistant"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive('/ai-assistant')
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles size={15} className="text-emerald-500" />
            <span>AI Trip Planner</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/dashboard')
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              My Trips
            </Link>
          )}
        </nav>

        {/* Right Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-emerald-300 transition"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user?.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user?.username?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800">{user?.username}</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:text-emerald-700 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 overflow-hidden"
          >
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${
                isActive('/') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/ai-assistant"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${
                isActive('/ai-assistant') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              AI Trip Planner
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive('/dashboard') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                }`}
              >
                My Trips
              </Link>
            )}

            <div className="pt-3 border-t border-slate-100">
              {isAuthenticated ? (
                <div className="flex items-center justify-between px-2 pt-1">
                  <span className="text-xs font-semibold text-slate-500">
                    Signed in as {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2.5 rounded-lg border border-slate-200 text-center text-sm font-bold text-slate-700"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2.5 rounded-lg bg-emerald-600 text-center text-sm font-bold text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
