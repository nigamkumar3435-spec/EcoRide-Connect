import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { FaMapMarkerAlt, FaChargingStation, FaCoins } from 'react-icons/fa';

const ChargingStationCard = ({ station, isSelected, onSelect }) => {
  const displayImage =
    station.images && station.images.length > 0
      ? station.images[0]
      : '/images/charging_station_1.png';

  return (
    <div
      onClick={onSelect}
      className={`glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'ring-2 ring-emerald-500 border-transparent shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-white dark:bg-slate-900/80 scale-[1.01]'
          : 'hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Station Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={displayImage}
          alt={station.name}
          className="w-full h-full object-cover transition duration-500 hover:scale-105"
        />
        {/* Charger Type Tag */}
        <span className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md transition-colors duration-300">
          <FaChargingStation size={12} />
          {station.chargerType}
        </span>
        {/* Availability Badge */}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-md ${
            station.availableSlots > 0
              ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-650 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30'
              : 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-650 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/30'
          }`}
        >
          {station.availableSlots > 0 ? `${station.availableSlots} Slots Free` : 'No Slots'}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <StarRating rating={station.avgRating} size={14} />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {station.avgRating > 0 ? `${station.avgRating} (${station.numReviews || 0} reviews)` : 'No ratings'}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
            {station.name}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FaMapMarkerAlt className="text-emerald-500 dark:text-emerald-400 shrink-0" size={12} />
            <span className="truncate">{station.address}, {station.city}</span>
          </p>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-900 my-4 transition-colors duration-300"></div>

        <div className="flex justify-between items-center text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-450 dark:text-slate-500 block">Charging Cost</span>
            <span className="font-semibold text-slate-800 dark:text-white flex items-center gap-1">
              <FaCoins className="text-emerald-555 dark:text-emerald-400" size={10} /> ₹{station.chargingCost}/hr
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onSelect) onSelect();
              }}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl border border-slate-200 dark:border-slate-850 transition duration-150 flex items-center gap-1.5 hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer"
              title="Show on map"
            >
              📍 <span className="hidden sm:inline">Map</span>
            </button>
            <Link
              to={`/stations/${station._id}`}
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition duration-150 shadow shadow-emerald-500/10 whitespace-nowrap cursor-pointer"
            >
              Book Slot
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargingStationCard;
