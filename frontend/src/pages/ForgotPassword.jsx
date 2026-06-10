import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaChargingStation, FaCheckCircle } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/auth/forgot-password', { email, password });
      setSuccess(res.data.message || 'Password reset successfully!');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Check email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4 py-12">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl space-y-6 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 mb-2">
            <FaChargingStation className="text-emerald-400 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-400">Enter your email and define a new secure password</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs flex items-start gap-2.5">
            <FaCheckCircle className="shrink-0 mt-0.5" size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-500" size={14} />
              <input
                type="email"
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">New Password</label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3.5 text-slate-500" size={14} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Confirm New Password</label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3.5 text-slate-500" size={14} />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Remember your password?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
