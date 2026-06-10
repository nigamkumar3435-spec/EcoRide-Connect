import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaChargingStation, FaBars, FaTimes, FaUserCircle, FaPowerOff, FaTachometerAlt, FaSun, FaMoon } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Charging Stations', path: '/stations' },
    { name: 'Battery Swaps', path: '/swaps' },
    { name: 'Service Centers', path: '/services' },
    { name: 'Community', path: '/forum' },
    { name: 'Blogs', path: '/blogs' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-900 px-4 py-3 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30 group-hover:border-emerald-500/60 transition-all">
            <FaChargingStation className="text-emerald-500 dark:text-emerald-400 text-xl" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
            EcoRide Connect
          </span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-emerald-500 dark:hover:text-emerald-400 ${
                  isActive ? 'text-emerald-500 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4 relative">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-905 transition cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <FaSun size={14} className="text-amber-400" /> : <FaMoon size={14} className="text-cyan-600" />}
          </button>

          {user ? (
            <div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-1.5 px-3 hover:border-slate-350 dark:hover:border-slate-700 transition"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-400/30"
                  />
                ) : (
                  <FaUserCircle className="text-slate-400 text-lg" />
                )}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Profile Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl glow-green/5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {user.role !== 'admin' && (
                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <FaTachometerAlt className="text-slate-400 text-xs" />
                      User Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <FaTachometerAlt className="text-emerald-500 text-xs" />
                      Admin Control Panel
                    </Link>
                  )}
                  <div className="border-t border-slate-200 dark:border-slate-800 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-500 dark:text-rose-400 rounded-lg hover:bg-rose-500/10 transition text-left cursor-pointer"
                  >
                    <FaPowerOff className="text-rose-550 dark:text-rose-400 text-xs" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-lg shadow-emerald-500/10"
              >
                Join Community
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger and Switcher */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
            title="Toggle theme"
          >
            {theme === 'dark' ? <FaSun size={14} className="text-amber-400" /> : <FaMoon size={14} className="text-cyan-600" />}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Links Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-4 animate-in fade-in duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex flex-col gap-3">
            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    Admin Control Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-sm font-medium text-rose-500 dark:text-rose-400 text-left flex items-center gap-2 cursor-pointer"
                >
                  <FaPowerOff size={12} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="bg-emerald-500 text-center text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition"
                >
                  Join Community
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
