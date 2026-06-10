import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BatteryStationCard from '../components/BatteryStationCard';

const BatteryStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStations = async () => {
    try {
      const res = await axios.get('/api/battery-stations');
      setStations(res.data);
    } catch (err) {
      console.error('Failed to load swap hubs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Battery Swap Hubs</h1>
        <p className="text-xs text-slate-400">Replace your empty EV batteries instantly at swap hubs</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : stations.length === 0 ? (
        <div className="glass-panel text-center py-16 rounded-3xl">
          <p className="text-sm text-slate-500 italic">No battery swap hubs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stations.map((station) => (
            <BatteryStationCard key={station._id} station={station} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BatteryStations;
