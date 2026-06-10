import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StarRating from './StarRating';
import { FaTrash, FaPen, FaCommentDots, FaUserCircle } from 'react-icons/fa';

const ReviewSection = ({ reviews = [], stationId, serviceCenterId, onReviewChange }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Check if current user has already reviewed
  const userReview = user
    ? reviews.find((r) => r.user?._id === user._id || r.user === user._id)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return setError('Please write a comment');

    setError('');
    setSubmitting(true);

    try {
      if (editingReviewId) {
        // Edit Review
        await axios.put(`/api/reviews/${editingReviewId}`, {
          rating,
          comment,
        });
        setEditingReviewId(null);
      } else {
        // Add Review
        await axios.post('/api/reviews', {
          rating,
          comment,
          stationId: stationId || undefined,
          serviceCenterId: serviceCenterId || undefined,
        });
      }
      setComment('');
      setRating(5);
      onReviewChange(); // Refresh parent details
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      onReviewChange();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
        <FaCommentDots className="text-emerald-400 text-lg" />
        <h3 className="text-base font-bold text-white">Reviews & Ratings ({reviews.length})</h3>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to share your experience!</p>
        ) : (
          reviews.map((review) => {
            const reviewerName = review.user?.name || 'Anonymous';
            const reviewerImage = review.user?.profileImage || '';
            const isOwner = user && (review.user?._id === user._id || review.user === user._id);
            const isAdmin = user && user.role === 'admin';
            const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={review._id}
                className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {reviewerImage ? (
                      <img
                        src={reviewerImage}
                        alt={reviewerName}
                        className="w-8 h-8 rounded-full object-cover border border-emerald-500/25"
                      />
                    ) : (
                      <FaUserCircle className="text-slate-500" size={32} />
                    )}
                    <div>
                      <span className="text-xs font-semibold text-white block leading-tight">
                        {reviewerName}
                      </span>
                      <span className="text-[10px] text-slate-500 block pt-0.5">{reviewDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StarRating rating={review.rating} size={12} />
                    
                    {/* Actions */}
                    {(isOwner || isAdmin) && (
                      <div className="flex gap-2">
                        {isOwner && (
                          <button
                            onClick={() => handleEditClick(review)}
                            className="text-slate-500 hover:text-emerald-400 p-1"
                            title="Edit Review"
                          >
                            <FaPen size={11} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="Delete Review"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-11">
                  {review.comment}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Review Form */}
      {user ? (
        // Show form if not reviewed yet or if editing
        (!userReview || editingReviewId) ? (
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {editingReviewId ? 'Edit Your Review' : 'Share Your Experience'}
            </h4>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-2.5 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Your Rating:</span>
              <StarRating rating={rating} onRatingChange={setRating} size={18} />
            </div>

            <div className="space-y-1">
              <textarea
                placeholder="Write your review comments here..."
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition resize-none"
                required
              ></textarea>
            </div>

            <div className="flex gap-2 justify-end">
              {editingReviewId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingReviewId(null);
                    setComment('');
                    setRating(5);
                  }}
                  className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : editingReviewId ? 'Save Changes' : 'Submit Review'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl text-center">
            <p className="text-xs text-emerald-400 font-medium">You have already submitted a review for this page.</p>
          </div>
        )
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <p className="text-xs text-slate-400">
            Please{' '}
            <a href="/login" className="text-emerald-400 hover:underline font-semibold">
              sign in
            </a>{' '}
            to write a review and rate this station.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
