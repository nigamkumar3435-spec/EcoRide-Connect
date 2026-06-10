const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChargingStation',
      required: true,
    },
    bookingDate: {
      type: String,
      required: [true, 'Please add a booking date (YYYY-MM-DD)'],
    },
    bookingTime: {
      type: String,
      required: [true, 'Please add a booking time slot'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', BookingSchema);
