import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import {
  FaChartBar, FaUsers, FaChargingStation, FaTools, FaBatteryFull,
  FaStar, FaComments, FaTrash, FaUserSlash, FaUserCheck, FaPlus, FaTimes, FaNewspaper
} from 'react-icons/fa';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stations, setStations] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  // Modal forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'station', 'swap', 'service', 'blog'
  
  // Forms data
  const [formData, setFormData] = useState({});

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, userRes, stationRes, swapRes, serviceRes, blogRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/users'),
        axios.get('/api/stations'),
        axios.get('/api/battery-stations'),
        axios.get('/api/service-centers'),
        axios.get('/api/blogs'),
      ]);

      setStats(statsRes.data);
      setUsers(userRes.data);
      setStations(stationRes.data);
      setSwaps(swapRes.data);
      setServices(serviceRes.data);
      setBlogs(blogRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard tables', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleBlockUser = async (userId) => {
    try {
      await axios.put(`/api/admin/users/${userId}/block`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle block state');
    }
  };

  // Unified deletion flow using custom React Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, type, name }

  const confirmDelete = (id, type, name) => {
    setDeleteTarget({ id, type, name });
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    try {
      if (type === 'station') {
        await axios.delete(`/api/stations/${id}`);
      } else if (type === 'swap') {
        await axios.delete(`/api/battery-stations/${id}`);
      } else if (type === 'service') {
        await axios.delete(`/api/service-centers/${id}`);
      } else if (type === 'blog') {
        await axios.delete(`/api/blogs/${id}`);
      } else if (type === 'user') {
        await axios.delete(`/api/admin/users/${id}`);
      }
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  const handleOpenAddModal = (type) => {
    setModalType(type);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'station') {
        await axios.post('/api/stations', formData);
      } else if (modalType === 'swap') {
        await axios.post('/api/battery-stations', formData);
      } else if (modalType === 'service') {
        await axios.post('/api/service-centers', formData);
      } else if (modalType === 'blog') {
        await axios.post('/api/blogs', formData);
      }
      setIsModalOpen(false);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed. Review input schema.');
    }
  };

  const adminMenu = [
    { id: 'stats', label: 'Dashboard Stats', icon: FaChartBar },
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'stations', label: 'Charging Hubs', icon: FaChargingStation },
    { id: 'swaps', label: 'Swap Stations', icon: FaBatteryFull },
    { id: 'services', label: 'Service Shops', icon: FaTools },
    { id: 'blogs', label: 'Blog Articles', icon: FaNewspaper },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent w-fit">
          Admin Control Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure EV facilities, review statistics, and moderate users</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar
          menuItems={adminMenu}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          title="Admin Panel"
        />

        <main className="flex-grow">
          {loading ? (
            <div className="glass-panel p-8 rounded-3xl flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-400"></div>
            </div>
          ) : (
            <div className="glass-panel p-6 md:p-8 rounded-3xl min-h-[50vh] space-y-6">
              
              {/* TAB STATS */}
              {activeTab === 'stats' && stats && (
                <div className="space-y-8">
                  <h2 className="text-lg font-bold text-white border-b border-slate-900 pb-3">Metrics Overview</h2>
                  
                  {/* Cards Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-semibold">Total Accounts</span>
                        <span className="text-xl font-bold text-white block mt-1">{stats.counts.totalUsers}</span>
                      </div>
                      <FaUsers className="text-slate-700 text-3xl" />
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-semibold">Charging Hubs</span>
                        <span className="text-xl font-bold text-emerald-400 block mt-1">{stats.counts.totalChargingStations}</span>
                      </div>
                      <FaChargingStation className="text-emerald-500/20 text-3xl" />
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-semibold">Swap Stations</span>
                        <span className="text-xl font-bold text-cyan-400 block mt-1">{stats.counts.totalServiceCenters}</span>
                      </div>
                      <FaBatteryFull className="text-cyan-500/20 text-3xl" />
                    </div>
                  </div>

                  {/* Interactive Recharts Analytics Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Growth Line Chart */}
                    <div className="bg-slate-950/85 p-5 rounded-2xl border border-slate-900 space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">User Growth (Last 6 Months)</h3>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stats.monthlyUserGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                            <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                              labelStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                              itemStyle={{ color: '#10b981', fontSize: '11px' }}
                            />
                            <Area type="monotone" dataKey="users" name="Users" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsers)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Booking Breakdown Bar Chart */}
                    <div className="bg-slate-950/85 p-5 rounded-2xl border border-slate-900 space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Booking Status Breakdown</h3>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.bookingAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                            <XAxis dataKey="status" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                              labelStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                              itemStyle={{ fontSize: '11px' }}
                            />
                            <Bar dataKey="count" name="Bookings" radius={[6, 6, 0, 0]}>
                              {stats.bookingAnalytics.map((entry, index) => {
                                const colors = {
                                  Pending: '#f59e0b',
                                  Approved: '#10b981',
                                  Completed: '#06b6d4',
                                  Cancelled: '#f43f5e',
                                };
                                return <Cell key={`cell-${index}`} fill={colors[entry.status] || '#10b981'} />;
                              })}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB USER MANAGEMENT */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white border-b border-slate-900 pb-3">User Administration</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500">
                          <th className="py-3 px-4 font-semibold">User</th>
                          <th className="py-3 px-4 font-semibold">Email</th>
                          <th className="py-3 px-4 font-semibold">Role</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id} className="border-b border-slate-900/60 hover:bg-slate-950/20">
                            <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                              {u.profileImage ? (
                                <img src={u.profileImage} alt="" className="w-6 h-6 rounded-full object-cover" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-900 flex justify-center items-center font-bold text-[9px] text-emerald-400">{u.name.charAt(0)}</div>
                              )}
                              {u.name}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">{u.email}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-900 text-slate-400'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`font-bold ${u.isBlocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {u.isBlocked ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              {u.role !== 'admin' && (
                                <>
                                  <button
                                    onClick={() => handleBlockUser(u._id)}
                                    className={`px-2 py-1 rounded text-[10px] font-semibold transition border ${
                                      u.isBlocked
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                                    }`}
                                  >
                                    {u.isBlocked ? 'Unblock' : 'Block'}
                                  </button>
                                  <button
                                    onClick={() => confirmDelete(u._id, 'user', u.name)}
                                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg cursor-pointer"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB CHARGING STATIONS */}
              {activeTab === 'stations' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                    <h2 className="text-lg font-bold text-white">Charging Stations</h2>
                    <button
                      onClick={() => handleOpenAddModal('station')}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FaPlus size={10} /> Add Hub
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stations.map((s) => (
                      <div key={s._id} className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="text-xs font-bold text-white">{s.name}</h3>
                          <p className="text-[10px] text-slate-500">{s.city} • ₹{s.chargingCost}/hr • {s.chargerType}</p>
                        </div>
                        <button
                          onClick={() => confirmDelete(s._id, 'station', s.name)}
                          className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB SWAP STATIONS */}
              {activeTab === 'swaps' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                    <h2 className="text-lg font-bold text-white">Battery Swapping Hubs</h2>
                    <button
                      onClick={() => handleOpenAddModal('swap')}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FaPlus size={10} /> Add Station
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {swaps.map((s) => (
                      <div key={s._id} className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="text-xs font-bold text-white">{s.name}</h3>
                          <p className="text-[10px] text-slate-500">{s.batteryType} • {s.workingHours}</p>
                        </div>
                        <button
                          onClick={() => confirmDelete(s._id, 'swap', s.name)}
                          className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB SERVICE SHOPS */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                    <h2 className="text-lg font-bold text-white">EV Service Center Partners</h2>
                    <button
                      onClick={() => handleOpenAddModal('service')}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FaPlus size={10} /> Add Shop
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((s) => (
                      <div key={s._id} className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="text-xs font-bold text-white">{s.name}</h3>
                          <p className="text-[10px] text-slate-500 truncate max-w-xs">{s.services.join(', ')}</p>
                        </div>
                        <button
                          onClick={() => confirmDelete(s._id, 'service', s.name)}
                          className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB BLOGS */}
              {activeTab === 'blogs' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                    <h2 className="text-lg font-bold text-white">Blog Article Publications</h2>
                    <button
                      onClick={() => handleOpenAddModal('blog')}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FaPlus size={10} /> Add Blog
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blogs.map((b) => (
                      <div key={b._id} className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="text-xs font-bold text-white leading-tight truncate max-w-xs">{b.title}</h3>
                          <span className="text-[9px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800">
                            {b.category}
                          </span>
                        </div>
                        <button
                          onClick={() => confirmDelete(b._id, 'blog', b.title)}
                          className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </main>
      </div>

      {/* CRUD Creation Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <FaTimes size={16} />
            </button>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white capitalize mb-4">Add New {modalType}</h2>

              {/* Dynamic inputs based on modalType */}
              {modalType === 'station' && (
                <>
                  <input
                    type="text"
                    placeholder="Station Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Contact Number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      onChange={(e) => setFormData({ ...formData, chargerType: e.target.value })}
                      required
                    >
                      <option value="">Charger Type</option>
                      <option value="AC Slow">AC Slow</option>
                      <option value="DC Fast">DC Fast</option>
                      <option value="Supercharger">Supercharger</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Cost / Hr (₹)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      onChange={(e) => setFormData({ ...formData, chargingCost: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Available Slots count"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, availableSlots: Number(e.target.value) })}
                    required
                  />
                </>
              )}

              {modalType === 'swap' && (
                <>
                  <input
                    type="text"
                    placeholder="Swap Station Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location Address"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Supported Battery Types"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, batteryType: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact Call number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    required
                  />
                </>
              )}

              {modalType === 'service' && (
                <>
                  <input
                    type="text"
                    placeholder="Service Center Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address Location"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact Phone Number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Offered Services (Comma separated e.g. Battery Diagnostic, Brake service)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    required
                  />
                </>
              )}

              {modalType === 'blog' && (
                <>
                  <input
                    type="text"
                    placeholder="Blog Title"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="EV News">EV News</option>
                    <option value="Charging Tips">Charging Tips</option>
                    <option value="Government Policies">Government Policies</option>
                    <option value="Battery Maintenance">Battery Maintenance</option>
                  </select>
                  <textarea
                    placeholder="Blog Article Content Body..."
                    rows={6}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white resize-none"
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  ></textarea>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition cursor-pointer"
              >
                Create Facility Entry
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">Delete {deleteTarget.type}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                id="confirm-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
