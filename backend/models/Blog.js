const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add blog content'],
    },
    category: {
      type: String,
      enum: ['EV News', 'Charging Tips', 'Government Policies', 'Battery Maintenance'],
      required: [true, 'Please specify category'],
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Blog', BlogSchema);
