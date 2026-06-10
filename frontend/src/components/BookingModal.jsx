import React, { useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaTimes, FaCoins, FaCheckCircle, FaCreditCard, FaLock } from 'react-icons/fa';

const BookingModal = ({ station, isOpen, onClose, onSuccess }) => {
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Payment states
  const [step, setStep] = useState('details'); // 'details' or 'payment'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  if (!isOpen) return null;

  const timeSlots = [
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM',
    '08:00 PM - 09:00 PM',
    '09:00 PM - 10:00 PM',
  ];

  // Restrict date input to today and future dates
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!bookingDate) return setError('Please select a date');
    if (!bookingTime) return setError('Please select a time slot');
    setError('');
    setStep('payment');
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      return setError('Invalid card number (16 digits required)');
    }
    if (!cardExpiry || !/^\d\d\/\d\d$/.test(cardExpiry)) {
      return setError('Invalid expiry date (format MM/YY)');
    }
    if (!cardCvv || cardCvv.length < 3) {
      return setError('Invalid CVV (3 digits required)');
    }

    setError('');
    setSubmitting(true);

    try {
      const mockTxnId = `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      await axios.post('/api/bookings', {
        stationId: station._id,
        bookingDate,
        bookingTime,
        transactionId: mockTxnId,
        paymentStatus: 'Paid',
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep('details');
        setBookingDate('');
        setBookingTime('');
        setCardNumber('');
        setCardExpiry('');
        setCardCvv('');
        onSuccess();
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
        >
          <FaTimes size={18} />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FaCheckCircle className="text-5xl text-emerald-400 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Slot Booked Successfully!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Payment received and reservation confirmed. Redirecting...</p>
          </div>
        ) : step === 'details' ? (
          <form onSubmit={handleProceedToPayment} className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Confirm Slot Booking</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{station.name}</p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 my-2"></div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Info details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Charger Type</span>
                <span className="font-semibold text-slate-900 dark:text-white">{station.chargerType}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Cost / Hour</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <FaCoins size={10} /> ₹{station.chargingCost}
                </span>
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FaCalendarAlt size={12} className="text-emerald-500 dark:text-emerald-400" />
                Select Date
              </label>
              <input
                type="date"
                min={getTodayString()}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>

            {/* Time Slots Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FaClock size={12} className="text-emerald-500 dark:text-emerald-400" />
                Select Time Slot
              </label>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                required
              >
                <option value="">-- Choose a slot --</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition cursor-pointer"
            >
              Proceed to Payment
            </button>
          </form>
        ) : (
          <form onSubmit={handleBookSubmit} className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <FaCreditCard size={18} className="text-emerald-500" /> Secure Checkout
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pay ₹{station.chargingCost} to reserve your EV slot</p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 my-2"></div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Credit Card Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Card Number</label>
              <input
                type="text"
                maxLength="19"
                value={cardNumber}
                onChange={(e) => {
                  // Format as XXXX XXXX XXXX XXXX
                  const val = e.target.value.replace(/\D/g, '');
                  const matches = val.match(/\d{4,16}/g);
                  const match = (matches && matches[0]) || '';
                  const parts = [];
                  for (let i = 0, len = match.length; i < len; i += 4) {
                    parts.push(match.substring(i, i + 4));
                  }
                  if (parts.length > 0) {
                    setCardNumber(parts.join(' '));
                  } else {
                    setCardNumber(val);
                  }
                }}
                placeholder="4111 2222 3333 4444"
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Expiry */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Expiry (MM/YY)</label>
                <input
                  type="text"
                  maxLength="5"
                  value={cardExpiry}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 2) {
                      setCardExpiry(`${val.substring(0, 2)}/${val.substring(2, 4)}`);
                    } else {
                      setCardExpiry(val);
                    }
                  }}
                  placeholder="12/28"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>

              {/* CVV */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">CVV</label>
                <input
                  type="password"
                  maxLength="3"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="***"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 justify-center">
              <FaLock className="text-emerald-500" />
              <span>Payments are encrypted with 256-bit SSL technology.</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setStep('details');
                }}
                className="w-full py-3 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-sm rounded-xl transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Paying...' : `Pay ₹${station.chargingCost}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;

