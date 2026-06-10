import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChargingStationCard from '../components/ChargingStationCard';
import StationMap from '../components/StationMap';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaArrowDown, FaArrowUp, FaCoins } from 'react-icons/fa';

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [chargerType, setChargerType] = useState('');
  const [available, setAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedStation, setSelectedStation] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  // Autocomplete suggestions for India-wide locations
  const [allLocations, setAllLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const suggestionRef = React.useRef(null);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.name = search;
      if (city) params.city = city;
      if (chargerType) params.chargerType = chargerType;
      if (available) params.available = 'true';
      if (sortBy) params.sortBy = sortBy;

      const res = await axios.get('/api/stations', { params });
      setStations(res.data);
      // Clear selected station if it is no longer in the list
      if (selectedStation && !res.data.find(s => s._id === selectedStation._id)) {
        setSelectedStation(null);
      }
    } catch (err) {
      console.error('Failed to load stations', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all registered locations (cities and states) across India on mount
  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        const res = await axios.get('/api/stations');
        const uniqueCities = [...new Set(res.data.map(s => s.city).filter(Boolean))];
        const uniqueStates = [...new Set(res.data.map(s => s.state).filter(Boolean))];
        const combined = [...new Set([...uniqueCities, ...uniqueStates])].sort();
        setAllLocations(combined);
      } catch (err) {
        console.error('Failed to fetch all locations', err);
      }
    };
    fetchAllLocations();
  }, []);

  // Filter suggestions based on typed search query
  useEffect(() => {
    if (city.trim() === '') {
      setSuggestions(allLocations);
    } else {
      const filtered = allLocations.filter(loc =>
        loc.toLowerCase().includes(city.toLowerCase())
      );
      setSuggestions(filtered);
    }
  }, [city, allLocations]);

  // Click outside to dismiss suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchStations();
  }, [search, city, chargerType, available, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Charging Stations Explorer</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Discover and book EV charging slots near you</p>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-1 rounded-xl w-full md:w-64 transition-colors duration-300">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
              viewMode === 'list'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
              viewMode === 'map'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Map Explorer
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="glass-panel p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end transition-colors duration-300">
        {/* Search by Name */}
        <div className="space-y-1.5 col-span-1 lg:col-span-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FaSearch size={10} className="text-emerald-500 dark:text-emerald-400" /> Search Station
          </label>
          <input
            type="text"
            placeholder="E.g., GreenDrive"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors duration-300"
          />
        </div>

        {/* Search by City */}
        <div ref={suggestionRef} className="space-y-1.5 relative">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FaMapMarkerAlt size={10} className="text-emerald-500 dark:text-emerald-400" /> Search City / State
          </label>
          <input
            type="text"
            placeholder="E.g., Delhi, Tamil Nadu"
            value={city}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors duration-300"
          />
          {showSuggestions && (
            <ul className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl py-1 shadow-lg backdrop-blur-md transition-all duration-200">
              {suggestions.length > 0 ? (
                suggestions.map((loc, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setCity(loc);
                      setShowSuggestions(false);
                    }}
                    className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-slate-950 dark:hover:bg-emerald-500 dark:hover:text-slate-950 cursor-pointer font-medium transition flex items-center gap-1.5"
                  >
                    <span className="text-emerald-500 dark:text-emerald-400">📍</span>
                    <span>{loc}</span>
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic select-none">
                  No registered stations found
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Charger Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FaFilter size={10} className="text-emerald-500 dark:text-emerald-400" /> Charger Type
          </label>
          <select
            value={chargerType}
            onChange={(e) => setChargerType(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="AC Slow">AC Slow</option>
            <option value="DC Fast">DC Fast</option>
            <option value="Supercharger">Supercharger</option>
          </select>
        </div>

        {/* Sort By Cost */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FaCoins size={10} className="text-emerald-500 dark:text-emerald-400" /> Sort Pricing
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
          >
            <option value="newest">Newest Added</option>
            <option value="cost-asc">Price: Low to High</option>
            <option value="cost-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Availability Toggle */}
        <div className="h-10 flex items-center">
          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="w-4 h-4 bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 rounded text-emerald-500 focus:ring-emerald-500 cursor-pointer"
            />
            Show Available Only
          </label>
        </div>
      </div>

      {/* Split Screen Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* List Side */}
        <div className={`lg:col-span-7 xl:col-span-8 ${viewMode === 'list' ? 'block' : 'hidden lg:block'}`}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-slate-100/40 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : stations.length === 0 ? (
            <div className="glass-panel text-center py-16 rounded-3xl">
              <p className="text-sm text-slate-500 italic">No charging stations match your active filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stations.map((station) => (
                <ChargingStationCard
                  key={station._id}
                  station={station}
                  isSelected={selectedStation && selectedStation._id === station._id}
                  onSelect={() => {
                    setSelectedStation(station);
                    // On mobile, switch to map view when card is clicked
                    if (window.innerWidth < 1024) {
                      setViewMode('map');
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Map Side */}
        <div className={`lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 h-[60vh] lg:h-[calc(100vh-14rem)] ${viewMode === 'map' ? 'block' : 'hidden lg:block'}`}>
          <StationMap
            stations={stations}
            selectedStation={selectedStation}
            onSelectStation={(station) => {
              setSelectedStation(station);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Stations;
