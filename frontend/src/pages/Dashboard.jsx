import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StarRating from '../components/StarRating';
import { FaCalendarAlt, FaStar, FaComments, FaUser, FaLock, FaImage, FaCheckCircle, FaTrash, FaPen, FaClock, FaCoins, FaBan } from 'react-icons/fa';

const Dashboard = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Data states
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [currentPassword, setCurrentPassword] = useState('');
  
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Sync profile form states when context user updates
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setProfileImage(user.profileImage || '');
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingRes, reviewRes, forumRes] = await Promise.all([
        axios.get('/api/bookings/user'),
        axios.get('/api/reviews/user'),
        axios.get('/api/forum'),
      ]);

      setBookings(bookingRes.data);
      setReviews(reviewRes.data);
      
      // Filter forum posts written by this user
      if (user) {
        const userPosts = forumRes.data.filter(
          (p) => p.user?._id === user._id || p.user === user._id
        );
        setMyPosts(userPosts);
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const handleCancelBooking = (bookingId) => {
    setConfirmCancelId(bookingId);
  };

  const executeCancelBooking = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status: 'Cancelled' });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this forum post permanently?')) return;
    try {
      await axios.delete(`/api/forum/${postId}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (!currentPassword) {
      return setSettingsError('Please enter your current password to authorize changes');
    }

    setSettingsLoading(true);
    const result = await updateProfile({
      name,
      email,
      profileImage,
      currentPassword,
    });

    if (result.success) {
      setSettingsSuccess('Profile updated successfully!');
      setCurrentPassword('');
    } else {
      setSettingsError(result.error);
    }
    setSettingsLoading(false);
  };

  const handleResetSettings = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setProfileImage(user?.profileImage || '');
    setCurrentPassword('');
    setSettingsError('');
    setSettingsSuccess('');
  };

  const menuItems = [
    { id: 'bookings', label: 'My Bookings', icon: FaCalendarAlt },
    { id: 'reviews', label: 'My Reviews', icon: FaStar },
    { id: 'posts', label: 'My Posts', icon: FaComments },
    { id: 'settings', label: 'Account Settings', icon: FaUser },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 min-h-screen">
      
      {/* Welcome Board */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-4">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400/30 shadow-lg"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex justify-center items-center text-emerald-400 font-bold text-xl">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Hello, {user?.name}</h1>
            <p className="text-xs text-slate-400">Manage your EV slot bookings, ratings, and profile settings</p>
          </div>
        </div>

        {/* Small Statistics Summary Row */}
        <div className="flex gap-8 items-center bg-slate-950/60 px-6 py-3 rounded-2xl border border-slate-900">
          <div className="text-center">
            <span className="text-sm font-extrabold text-white block">
              {bookings.filter(b => b.status !== 'Cancelled').length}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Bookings</span>
          </div>
          <div className="h-6 w-[1px] bg-slate-900"></div>
          <div className="text-center">
            <span className="text-sm font-extrabold text-emerald-400 block">{reviews.length}</span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Reviews</span>
          </div>
          <div className="h-6 w-[1px] bg-slate-900"></div>
          <div className="text-center">
            <span className="text-sm font-extrabold text-cyan-400 block">{myPosts.length}</span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Posts</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs control */}
        <Sidebar
          menuItems={menuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          title="User Control"
        />

        {/* Dynamic Display Panel */}
        <main className="flex-grow">
          {loading && activeTab !== 'settings' ? (
            <div className="glass-panel p-8 rounded-3xl flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-400"></div>
            </div>
          ) : (
            <div className="glass-panel p-6 md:p-8 rounded-3xl min-h-[40vh] space-y-6">
              
              {/* Active TAB Bookings */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white border-b border-slate-900 pb-3">My Bookings List</h2>
                  
                  {bookings.filter(b => b.status !== 'Cancelled').length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-6">You haven't booked any active charging slots yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bookings.filter(b => b.status !== 'Cancelled').map((booking) => {
                        const stationName = booking.station?.name || 'Deleted Charging Station';
                        const chargerType = booking.station?.chargerType || 'DC Fast';
                        const address = booking.station?.address || 'N/A';
                        const cost = booking.station?.chargingCost || 12;
                        const statusColor =
                          booking.status === 'Approved'
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : booking.status === 'Completed'
                            ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                            : booking.status === 'Cancelled'
                            ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'; // Pending

                        return (
                          <div
                            key={booking._id}
                            className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between gap-4"
                          >
                            <div className="space-y-2.5">
                              {/* Station info */}
                              <div className="flex justify-between items-start">
                                <h3 className="text-xs font-bold text-white">{stationName}</h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                                  {booking.status}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate">{address}</p>
                              
                              <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] border-t border-slate-900/40">
                                <span className="text-slate-400 flex items-center gap-1">
                                  <FaCalendarAlt size={10} className="text-emerald-400" />
                                  {booking.bookingDate}
                                </span>
                                <span className="text-slate-400 flex items-center gap-1">
                                  <FaClock size={10} className="text-emerald-400" />
                                  {booking.bookingTime}
                                </span>
                              </div>

                              {/* Payment status & Transaction Receipt */}
                              <div className="pt-2 border-t border-slate-900/20 flex flex-col gap-1 text-[10px] bg-slate-950/40 rounded-lg p-2 mt-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-500">Payment Status:</span>
                                  <span className={`font-semibold ${
                                    booking.paymentStatus === 'Paid'
                                      ? 'text-emerald-400'
                                      : booking.paymentStatus === 'Refunded'
                                      ? 'text-amber-400'
                                      : 'text-slate-400'
                                  }`}>
                                    {booking.paymentStatus || 'Pending'}
                                  </span>
                                </div>
                                {booking.transactionId && (
                                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                                    <span>{booking.paymentStatus === 'Refunded' ? 'Refund ID:' : 'Txn ID:'}</span>
                                    <span>{booking.transactionId}</span>
                                  </div>
                                )}
                                {booking.paymentStatus === 'Refunded' && (
                                  <p className="text-[9px] text-amber-500/80 italic mt-0.5">
                                    Refund of ₹{cost} credited back to original source.
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Booking Surcharge and Cancel action */}
                            <div className="flex justify-between items-center pt-2 border-t border-slate-900/60">
                              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                                <FaCoins size={10} /> ₹{cost}/hr
                              </span>
                              
                              {(booking.status === 'Pending' || booking.status === 'Approved') && (
                                <button
                                  onClick={() => handleCancelBooking(booking._id)}
                                  className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer border border-rose-500/20 hover:border-rose-400/40 px-2.5 py-1 rounded-lg bg-rose-500/5"
                                >
                                  Cancel Slot
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Active TAB Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white border-b border-slate-900 pb-3">My Submitted Reviews</h2>

                  {reviews.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-6">You haven't submitted any ratings or reviews.</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => {
                        const targetName = review.station?.name || review.serviceCenter?.name || 'EV Partner';
                        const reviewType = review.station ? 'Charging Station' : 'Service Center';

                        return (
                          <div
                            key={review._id}
                            className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex justify-between items-start gap-4"
                          >
                            <div className="space-y-2 flex-grow">
                              <div className="flex items-center gap-2">
                                <h3 className="text-xs font-bold text-white">{targetName}</h3>
                                <span className="text-[9px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800">
                                  {reviewType}
                                </span>
                              </div>
                              <StarRating rating={review.rating} size={11} />
                              <p className="text-xs text-slate-300 italic pt-1">"{review.comment}"</p>
                            </div>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="p-2 text-slate-500 hover:text-rose-400 border border-slate-900 hover:border-slate-800 rounded-lg transition"
                              title="Delete Review"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Active TAB Forum Posts */}
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white border-b border-slate-900 pb-3">My Discussion Threads</h2>

                  {myPosts.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-6">You haven't created any forum posts yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {myPosts.map((post) => (
                        <div
                          key={post._id}
                          className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex justify-between items-center gap-4"
                        >
                          <div className="space-y-1">
                            <h3 className="text-xs font-bold text-white leading-snug">{post.title}</h3>
                            <p className="text-[10px] text-slate-500">
                              Likes: {post.likes?.length || 0} • Comments: {post.comments?.length || 0}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <a
                              href="/forum"
                              className="p-2 text-slate-400 hover:text-emerald-400 border border-slate-900 hover:border-slate-800 rounded-lg transition"
                              title="View in Forum"
                            >
                              <FaPen size={12} />
                            </a>
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="p-2 text-slate-500 hover:text-rose-400 border border-slate-900 hover:border-slate-800 rounded-lg transition"
                              title="Delete Thread"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Active TAB Settings */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white border-b border-slate-900 pb-3">Account Information Settings</h2>

                  {settingsError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs">
                      {settingsError}
                    </div>
                  )}

                  {settingsSuccess && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
                      <FaCheckCircle />
                      <span>{settingsSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5 col-span-2 md:col-span-1">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" size={12} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 col-span-2 md:col-span-1">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" size={12} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                          required
                        />
                      </div>
                    </div>

                    {/* Profile Image URL */}
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Profile Image Avatar URL</label>
                      <div className="relative">
                        <FaImage className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" size={12} />
                        <input
                          type="text"
                          value={profileImage}
                          onChange={(e) => setProfileImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        />
                      </div>
                    </div>

                    {/* Current Password (Required to authorize changes) */}
                    <div className="space-y-1.5 col-span-2 border-t border-slate-200 dark:border-slate-800 pt-4">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Password (Required to authorize changes)</label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" size={12} />
                        <input
                          type="password"
                          placeholder="Confirm your identity with your current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-span-2 pt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleResetSettings}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-semibold text-xs rounded-xl transition cursor-pointer"
                      >
                        Reset Settings
                      </button>
                      <button
                        type="submit"
                        disabled={settingsLoading}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        {settingsLoading ? 'Saving Changes...' : 'Save Profile Settings'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
      {/* Custom Confirmation Modal for Booking Cancellation */}
      {confirmCancelId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Cancel Slot Booking</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to cancel this booking? A refund of the charging cost will be credited back to your original payment method.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmCancelId(null)}
                className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                No, Keep Slot
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = confirmCancelId;
                  setConfirmCancelId(null);
                  executeCancelBooking(id);
                }}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                id="confirm-cancel-btn"
              >
                Yes, Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
