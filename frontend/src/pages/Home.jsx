import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ChargingStationCard from '../components/ChargingStationCard';
import BatteryStationCard from '../components/BatteryStationCard';
import ServiceCenterCard from '../components/ServiceCenterCard';
import ForumPostCard from '../components/ForumPostCard';
import { FaChargingStation, FaBatteryFull, FaTools, FaUsers, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [stations, setStations] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [stationRes, swapRes, serviceRes, postRes] = await Promise.all([
          axios.get('/api/stations'),
          axios.get('/api/battery-stations'),
          axios.get('/api/service-centers'),
          axios.get('/api/forum'),
        ]);

        setStations(stationRes.data.slice(0, 3));
        setSwaps(swapRes.data.slice(0, 3));
        setServices(serviceRes.data.slice(0, 3));
        setPosts(postRes.data.slice(0, 2));
      } catch (err) {
        console.error('Error fetching landing page details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center px-4 md:px-8 overflow-hidden">
        {/* Background glow animations */}
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-emerald-500/[0.04] dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-500/[0.04] dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-ping"></span>
            India's Leading EV Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            India's Smart{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
              EV Ecosystem
            </span>{' '}
            Platform
          </h1>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Locate high-speed charging hubs, swap batteries instantly, access certified service centers, read expert guides, and connect with India's largest EV driver network.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/stations"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 text-center cursor-pointer"
            >
              Find Charging Stations
            </Link>
            <Link
              to="/forum"
              className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-semibold rounded-xl transition text-center cursor-pointer"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl backdrop-blur-md transition-colors duration-300">
          <div className="text-center space-y-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">450+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Charging Hubs</span>
          </div>
          <div className="text-center space-y-1">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">120+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Swap Stations</span>
          </div>
          <div className="text-center space-y-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">85+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Service Center Partners</span>
          </div>
          <div className="text-center space-y-1">
            <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">10k+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Active EV Drivers</span>
          </div>
        </div>
      </section>

      {/* Featured Stations */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FaChargingStation className="text-emerald-500 dark:text-emerald-400" /> Featured Charging Stations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Locate certified fast chargers with live slot availability</p>
          </div>
          <Link to="/stations" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer">
            View All Stations <FaArrowRight size={10} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stations.map((station) => (
              <ChargingStationCard key={station._id} station={station} />
            ))}
          </div>
        )}
      </section>

      {/* Battery Swapping & Service Hubs Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Battery Swapping */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-900 pb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaBatteryFull className="text-emerald-500 dark:text-emerald-400" /> Battery Swap Hubs
            </h2>
            <Link to="/swaps" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="h-32 bg-slate-900/50 rounded-2xl animate-pulse"></div>
            ) : (
              swaps.map((swap) => <BatteryStationCard key={swap._id} station={swap} />)
            )}
          </div>
        </div>

        {/* Service Centers */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-900 pb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaTools className="text-emerald-500 dark:text-emerald-400" /> EV Service Partners
            </h2>
            <Link to="/services" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="h-32 bg-slate-900/50 rounded-2xl animate-pulse"></div>
            ) : (
              services.map((center) => (
                <ServiceCenterCard key={center._id} center={center} onAddReview={() => {}} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Community discussions */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FaUsers className="text-emerald-500 dark:text-emerald-400" /> Community Discussions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions, share real ranges, and talk with EV owners</p>
          </div>
          <Link to="/forum" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer">
            Visit Community Forum <FaArrowRight size={10} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="h-40 bg-slate-900/50 rounded-2xl animate-pulse"></div>
          ) : (
            posts.map((post) => (
              <ForumPostCard key={post._id} post={post} currentUserId={null} onLike={() => {}} />
            ))
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Loved by EV Owners</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Hear from our smart commuters driving electric daily</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              "Finding slot bookings for chargers was always messy. EcoRide Connect solved this. I book my Indiranagar slot in Delhi, plug my car, and go grab my lunch. Seamless!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                RM
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">Rohan Mehta</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Tata Nexon EV Max Driver</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              "My Ather scooter ran out of juice near BKC Mumbai. Swapped my battery at the EcoSwap Hub in under 60 seconds and was back on route. The ecosystem is super friendly."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-600 dark:text-cyan-400 shrink-0">
                PS
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">Priya Sharma</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Ather 450X Commuter</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              "The EV forum helped me convince my apartment's society board to install community chargers. Real-world range updates here are extremely accurate, not just claims."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-650 dark:text-indigo-400 shrink-0">
                VS
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">Vikram Sen</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Mahindra XUV400 Owner</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
