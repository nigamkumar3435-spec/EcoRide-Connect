import React from 'react';
import { Link } from 'react-router-dom';
import { FaChargingStation, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-12 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <FaChargingStation className="text-emerald-500 dark:text-emerald-400 text-xl" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
              EcoRide Connect
            </span>
          </Link>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            India's Smart Electric Vehicle Ecosystem Platform. Connecting drivers, swap stations, and chargers across the nation.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link to="/stations" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition">Charging Stations</Link>
            </li>
            <li>
              <Link to="/swaps" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition">Battery Swaps</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition">Service Centers</Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link to="/forum" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition">Community Discussions</Link>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition">EV News & Blogs</Link>
            </li>
          </ul>
        </div>

        {/* Social / Contact */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Connect</h4>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition">
              <FaTwitter />
            </a>
            <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition">
              <FaLinkedin />
            </a>
            <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition">
              <FaGithub />
            </a>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Support: support@ecorideconnect.com
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-900 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} EcoRide Connect. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-700 dark:hover:text-slate-400 transition">Privacy Policy</a>
          <a href="#" className="hover:text-slate-700 dark:hover:text-slate-400 transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
