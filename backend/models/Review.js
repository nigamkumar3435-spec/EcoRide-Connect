const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChargingStation',
      required: false,
    },
    serviceCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCenter',
      required: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please add a rating between 1 and 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per station / serviceCenter
ReviewSchema.index({ user: 1, station: 1 }, { unique: true, partialFilterExpression: { station: { $exists: true } } });
ReviewSchema.index({ user: 1, serviceCenter: 1 }, { unique: true, partialFilterExpression: { serviceCenter: { $exists: true } } });

// Static method to get avg rating
ReviewSchema.statics.getAverageRating = async function (stationId, serviceCenterId) {
  if (stationId) {
    const obj = await this.aggregate([
      { $match: { station: stationId } },
      {
        $group: {
          _id: '$station',
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    // We can update the ChargingStation if needed, or just calculate on the fly.
    // Since we don't store averageRating directly in ChargingStation model field list to keep it simple,
    // we can retrieve it dynamically or save it to a field if we add it. Let's update on the fly in the controllers.
  }
};

module.exports = mongoose.model('Review', ReviewSchema);
