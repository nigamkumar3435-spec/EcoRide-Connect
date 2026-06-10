const Booking = require('../models/Booking');
const ChargingStation = require('../models/ChargingStation');

// @desc    Create new slot booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { stationId, bookingDate, bookingTime, transactionId, paymentStatus } = req.body;

  try {
    const station = await ChargingStation.findById(stationId);

    if (!station) {
      return res.status(404).json({ message: 'Charging station not found' });
    }

    if (station.availableSlots <= 0) {
      return res.status(400).json({ message: 'No slots available at this station' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      station: stationId,
      bookingDate,
      bookingTime,
      status: paymentStatus === 'Paid' ? 'Approved' : 'Pending',
      paymentStatus: paymentStatus || 'Pending',
      transactionId: transactionId || undefined,
    });

    // Optionally decrement slots
    station.availableSlots = station.availableSlots - 1;
    await station.save();

    // Trigger email alert in the background
    const sendEmail = require('../utils/sendEmail');
    const User = require('../models/User');
    const userObj = await User.findById(req.user._id);
    if (userObj && userObj.email) {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 10px;">
          <h2 style="color: #10b981;">EcoRide Connect - Booking Confirmation</h2>
          <p>Hello <strong>${userObj.name}</strong>,</p>
          <p>Your EV slot booking at <strong>${station.name}</strong> has been successfully received!</p>
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;">
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="color: #64748b; padding-bottom: 5px;">Station:</td>
              <td style="font-weight: bold; padding-bottom: 5px;">${station.name}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding-bottom: 5px;">Address:</td>
              <td style="padding-bottom: 5px;">${station.address}, ${station.city}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding-bottom: 5px;">Date:</td>
              <td style="padding-bottom: 5px;">${bookingDate}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding-bottom: 5px;">Time Slot:</td>
              <td style="padding-bottom: 5px;">${bookingTime}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding-bottom: 5px;">Price:</td>
              <td style="color: #10b981; font-weight: bold; padding-bottom: 5px;">₹${station.chargingCost}/hr</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding-bottom: 5px;">Payment:</td>
              <td style="padding-bottom: 5px;">${paymentStatus || 'Pending'} ${transactionId ? `(ID: ${transactionId})` : ''}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;">
          <p style="font-size: 12px; color: #64748b;">Thank you for driving electric! If you need to make changes, please visit your EcoRide Dashboard.</p>
        </div>
      `;
      
      sendEmail({
        email: userObj.email,
        subject: `Booking Confirmed - ${station.name}`,
        html: emailContent,
      }).catch(err => console.error('Failed to send mail:', err));
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('station', 'name address city chargerType contact images chargingCost')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('station', 'name city chargerType')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Role verification: user can only cancel their own booking, admin can update to any status
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this booking' });
    }

    if (req.user.role !== 'admin' && status !== 'Cancelled') {
      return res.status(400).json({ message: 'Users can only cancel bookings' });
    }

    const prevStatus = booking.status;
    booking.status = status;

    // Handle refund if cancelling a paid booking
    if (status === 'Cancelled' && booking.paymentStatus === 'Paid') {
      booking.paymentStatus = 'Refunded';
      const refundId = `REF_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      booking.transactionId = refundId;
    }

    await booking.save();

    // If booking was cancelled and it wasn't cancelled before, restore slot
    if (status === 'Cancelled' && prevStatus !== 'Cancelled') {
      const station = await ChargingStation.findById(booking.station);
      if (station) {
        station.availableSlots = station.availableSlots + 1;
        await station.save();
      }

      // Trigger cancel/refund email alert in the background
      const sendEmail = require('../utils/sendEmail');
      const User = require('../models/User');
      const userObj = await User.findById(booking.user);
      const stationObj = await ChargingStation.findById(booking.station);
      if (userObj && userObj.email && stationObj) {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 10px;">
            <h2 style="color: #f43f5e;">EcoRide Connect - Booking Cancelled & Refunded</h2>
            <p>Hello <strong>${userObj.name}</strong>,</p>
            <p>Your EV slot booking at <strong>${stationObj.name}</strong> has been cancelled.</p>
            <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;">
            <p><strong>Refund Details:</strong></p>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="color: #64748b; padding-bottom: 5px;">Station:</td>
                <td style="font-weight: bold; padding-bottom: 5px;">${stationObj.name}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding-bottom: 5px;">Refund Amount:</td>
                <td style="color: #f43f5e; font-weight: bold; padding-bottom: 5px;">₹${stationObj.chargingCost}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding-bottom: 5px;">Refund Transaction ID:</td>
                <td style="padding-bottom: 5px;">${booking.transactionId}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding-bottom: 5px;">Refund Status:</td>
                <td style="color: #10b981; font-weight: bold; padding-bottom: 5px;">Completed (Credited back to original source)</td>
              </tr>
            </table>
            <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;">
            <p style="font-size: 12px; color: #64748b;">The refund should reflect in your account within 2-3 business days. If you have questions, please reach out to EcoRide support.</p>
          </div>
        `;
        
        sendEmail({
          email: userObj.email,
          subject: `Booking Cancelled & Refunded - ${stationObj.name}`,
          html: emailContent,
        }).catch(err => console.error('Failed to send cancellation mail:', err));
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
};
