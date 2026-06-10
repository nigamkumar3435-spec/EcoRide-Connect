import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ReviewSection from '../components/ReviewSection';
import BookingModal from '../components/BookingModal';
import { FaArrowLeft, FaMapMarkerAlt, FaPhoneAlt, FaChargingStation, FaCoins, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const StationDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const fetchStationDetails = async () => {
    try {
      const res = await axios.get(`/api/stations/${id}`);
      setStation(res.data);
    } catch (err) {
      console.error('Failed to fetch station details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStationDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center gap-4 text-center">
        <FaExclamationTriangle className="text-rose-500 text-5xl" />
        <h2 className="text-xl font-bold text-white">Charging Station Not Found</h2>
        <Link to="/stations" className="text-emerald-400 hover:underline text-xs flex items-center gap-1">
          <FaArrowLeft size={10} /> Back to Explorer
        </Link>
      </div>
    );
  }

  const handleBookingClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setIsBookingOpen(true);
    }
  };

  const handleBookingSuccess = () => {
    // Refresh station slot details
    fetchStationDetails();
  };

  const displayImage =
    station.images && station.images.length > 0
      ? station.images[0]
      : '/images/charging_station_1.png';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 min-h-screen">
      {/* Back Button */}
      <Link to="/stations" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 w-fit">
        <FaArrowLeft size={10} /> Back to Stations Explorer
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left / Center Info columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Station Details Hero */}
          <div className="glass-panel overflow-hidden rounded-3xl">
            <div className="h-96 w-full relative">
              <img src={displayImage} alt={station.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              
              {/* Type and Availability Float */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="space-y-1">
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {station.chargerType}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    {station.name}
                  </h1>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-900 pb-5 transition-colors duration-300">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <StarRating rating={station.avgRating} size={15} />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {station.avgRating > 0 ? `${station.avgRating} / 5` : 'No ratings yet'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <FaMapMarkerAlt size={12} className="text-emerald-500 dark:text-emerald-400" />
                    {station.address}, {station.city}, {station.state}
                  </p>
                </div>
                
                <a
                  href={`tel:${station.contact}`}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-650 dark:text-slate-300 flex items-center gap-2 transition"
                >
                  <FaPhoneAlt size={10} className="text-emerald-500 dark:text-emerald-400" /> {station.contact}
                </a>
              </div>

              {/* Description */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Description</h3>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
                  {station.description || 'No detailed description available for this charging station. Check out amenities and review logs below.'}
                </p>
              </div>

              {/* Grid Params */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-900 transition-colors duration-300">
                <div className="text-center space-y-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Charger Type</span>
                  <span className="font-semibold text-slate-800 dark:text-white text-xs flex justify-center items-center gap-1">
                    <FaChargingStation className="text-emerald-500 dark:text-emerald-400" /> {station.chargerType}
                  </span>
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Charging Cost</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs flex justify-center items-center gap-1">
                    <FaCoins /> ₹{station.chargingCost}/hr
                  </span>
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Opening Hours</span>
                  <span className="font-semibold text-slate-800 dark:text-white text-xs flex justify-center items-center gap-1">
                    <FaClock className="text-emerald-500 dark:text-emerald-400" /> {station.openingHours}
                  </span>
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Free Slots</span>
                  <span className="font-semibold text-slate-800 dark:text-white text-xs flex justify-center items-center gap-1">
                    <FaCheckCircle className="text-emerald-500 dark:text-emerald-400" /> {station.availableSlots} Slots
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Module Section */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl">
            <ReviewSection
              reviews={station.reviews}
              stationId={station._id}
              onReviewChange={fetchStationDetails}
            />
          </div>
        </div>

        {/* Right column Slot Booker Panel */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-3xl space-y-6 sticky top-24">
            <h3 className="text-base font-bold text-white">Reserve Charging Slot</h3>
            
            <div className="border-t border-slate-900 my-2"></div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Availability</span>
                <span className={`font-semibold ${station.availableSlots > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {station.availableSlots > 0 ? 'Slots Available' : 'Fully Occupied'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Rate / Hour</span>
                <span className="font-bold text-white">₹{station.chargingCost}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Refund Policy</span>
                <span className="text-slate-500">Free cancellation</span>
              </div>
            </div>

            <button
              onClick={handleBookingClick}
              disabled={station.availableSlots <= 0}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-800/20 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {station.availableSlots > 0 ? 'Book Charger Slot' : 'No Slots Available'}
            </button>

            {station.availableSlots > 0 && (
              <p className="text-[10px] text-center text-slate-500">
                Select your convenient date & time slot in the booking menu.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal Popup */}
      <BookingModal
        station={station}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default StationDetail;
