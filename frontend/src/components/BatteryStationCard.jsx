import React from 'react';
import { FaBatteryFull, FaMapMarkerAlt, FaPhoneAlt, FaClock } from 'react-icons/fa';

const BatteryStationCard = ({ station }) => {
  const displayImage = station.image || 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Battery Station Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={displayImage}
          alt={station.name}
          className="w-full h-full object-cover transition duration-500 hover:scale-105"
        />
        {/* Working Hours Tag */}
        <span className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
          <FaClock size={10} className="text-emerald-400" />
          {station.workingHours || '24/7'}
        </span>
        {/* Category Tag */}
        <span className="absolute top-3 right-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-650 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
          <FaBatteryFull size={12} /> Swap Hub
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white leading-tight">{station.name}</h3>
            <p className="text-xs text-slate-400 flex items-start gap-1.5 pt-1">
              <FaMapMarkerAlt className="text-emerald-400 shrink-0 mt-0.5" size={12} />
              <span>{station.address}</span>
            </p>
          </div>

          {/* Battery Types supported */}
          <div className="bg-slate-950/50 border border-slate-900/50 p-3 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Battery Types Support</span>
            <p className="text-xs text-emerald-400 font-medium">{station.batteryType}</p>
          </div>
        </div>

        <div>
          <div className="border-t border-slate-900 my-4"></div>

          <a
            href={`tel:${station.contact}`}
            className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition"
          >
            <FaPhoneAlt size={10} className="text-emerald-400" />
            {station.contact}
          </a>
        </div>
      </div>
    </div>
  );
};

export default BatteryStationCard;
