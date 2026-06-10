const mongoose = require('mongoose');

const ChargingStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a station name'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Please add a contact number'],
    },
    chargerType: {
      type: String,
      enum: ['AC Slow', 'DC Fast', 'Supercharger'],
      required: [true, 'Please specify charger type'],
    },
    chargingCost: {
      type: Number,
      required: [true, 'Please specify charging cost per hour'],
    },
    availableSlots: {
      type: Number,
      required: [true, 'Please specify available slots'],
      default: 5,
    },
    description: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    openingHours: {
      type: String,
      default: '08:00 AM - 10:00 PM',
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ChargingStation', ChargingStationSchema);
