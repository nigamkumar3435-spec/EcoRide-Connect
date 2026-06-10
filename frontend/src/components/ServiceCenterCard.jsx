import React from 'react';
import StarRating from './StarRating';
import { FaTools, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const ServiceCenterCard = ({ center, onAddReview }) => {
  const displayImage = center.image || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Service Center Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={displayImage}
          alt={center.name}
          className="w-full h-full object-cover transition duration-500 hover:scale-105"
        />
        {/* Rating Badge */}
        <span className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
          <StarRating rating={center.avgRating} size={10} />
          <span className="text-[11px] text-slate-700 dark:text-slate-350 font-semibold leading-none">
            {center.avgRating > 0 ? `${center.avgRating}` : 'New'}
          </span>
        </span>
        {/* Category Tag */}
        <span className="absolute top-3 right-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-650 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
          <FaTools size={10} /> Service Hub
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white leading-tight">{center.name}</h3>
            <p className="text-xs text-slate-400 flex items-start gap-1.5 pt-1">
              <FaMapMarkerAlt className="text-emerald-400 shrink-0 mt-0.5" size={12} />
              <span>{center.address}</span>
            </p>
          </div>

          {/* Services Tag Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Services Offered</span>
            <div className="flex flex-wrap gap-1.5">
              {center.services.map((service, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-slate-900 border border-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="border-t border-slate-900 my-4"></div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${center.contact}`}
              className="py-2.5 bg-slate-950 border border-slate-900 hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition"
            >
              <FaPhoneAlt size={10} className="text-emerald-400" />
              Call
            </a>
            <button
              onClick={() => onAddReview(center)}
              className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Write Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterCard;
