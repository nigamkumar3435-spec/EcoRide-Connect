import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ServiceCenterCard from '../components/ServiceCenterCard';
import StarRating from '../components/StarRating';
import { FaTimes, FaTools, FaCheckCircle } from 'react-icons/fa';

const ServiceCenters = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchCenters = async () => {
    try {
      const res = await axios.get('/api/service-centers');
      setCenters(res.data);
    } catch (err) {
      console.error('Failed to load service centers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleReviewTrigger = (center) => {
    if (!user) {
      navigate('/login');
    } else {
      setSelectedCenter(center);
      // Check if user has already reviewed
      const userReview = center.reviews?.find((r) => r.user === user._id || r.user?._id === user._id);
      if (userReview) {
        setRating(userReview.rating);
        setComment(userReview.comment);
      } else {
        setRating(5);
        setComment('');
      }
      setError('');
      setSuccess(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return setError('Please write a comment');

    setError('');
    setSubmitting(true);

    try {
      // Check if user has already reviewed this center
      const userReview = selectedCenter.reviews?.find((r) => r.user === user._id || r.user?._id === user._id);

      if (userReview) {
        // Edit Review
        await axios.put(`/api/reviews/${userReview._id}`, {
          rating,
          comment,
        });
      } else {
        // Add Review
        await axios.post('/api/reviews', {
          rating,
          comment,
          serviceCenterId: selectedCenter._id,
        });
      }

      setSuccess(true);
      fetchCenters();
      setTimeout(() => {
        setSelectedCenter(null);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">EV Service Partners</h1>
        <p className="text-xs text-slate-400">Locate certified mechanics and maintenance hubs for your electric vehicle</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-56 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : centers.length === 0 ? (
        <div className="glass-panel text-center py-16 rounded-3xl">
          <p className="text-sm text-slate-500 italic">No service centers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {centers.map((center) => (
            <ServiceCenterCard
              key={center._id}
              center={center}
              onAddReview={handleReviewTrigger}
            />
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedCenter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 relative overflow-hidden">
            <button
              onClick={() => setSelectedCenter(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
            >
              <FaTimes size={18} />
            </button>

            {success ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FaCheckCircle className="text-5xl text-emerald-400 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Review Submitted!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Thank you for rating our service center.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                    <FaTools className="text-emerald-500 dark:text-emerald-400" /> Write Partner Review
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedCenter.name}</p>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 my-2"></div>

                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 p-2.5 rounded-xl text-xs">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Service Rating:</span>
                  <StarRating rating={rating} onRatingChange={setRating} size={18} />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Comments</label>
                  <textarea
                    placeholder="Describe your maintenance experience..."
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Service Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCenters;
