const mongoose = require('mongoose');

const ServiceCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a service center name'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    contact: {
      type: String,
      required: [true, 'Please add a contact number'],
    },
    services: {
      type: [String],
      required: [true, 'Please add services offered'],
      default: [],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ServiceCenter', ServiceCenterSchema);
