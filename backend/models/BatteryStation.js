const mongoose = require('mongoose');

const BatteryStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a battery swap station name'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    batteryType: {
      type: String,
      required: [true, 'Please add battery types (e.g., Lithium-ion 72V, LiFePO4)'],
    },
    contact: {
      type: String,
      required: [true, 'Please add a contact number'],
    },
    workingHours: {
      type: String,
      default: '24/7',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=800',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BatteryStation', BatteryStationSchema);
