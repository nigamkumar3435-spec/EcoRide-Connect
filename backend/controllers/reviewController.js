const Review = require('../models/Review');
const ChargingStation = require('../models/ChargingStation');
const ServiceCenter = require('../models/ServiceCenter');

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
  const { rating, comment, stationId, serviceCenterId } = req.body;

  try {
    // Validate target
    if (!stationId && !serviceCenterId) {
      return res.status(400).json({ message: 'Please specify either a charging station or service center' });
    }

    if (stationId) {
      const station = await ChargingStation.findById(stationId);
      if (!station) {
        return res.status(404).json({ message: 'Charging station not found' });
      }
      // Check existing review
      const alreadyReviewed = await Review.findOne({ user: req.user._id, station: stationId });
      if (alreadyReviewed) {
        return res.status(400).json({ message: 'You have already reviewed this station' });
      }
    }

    if (serviceCenterId) {
      const center = await ServiceCenter.findById(serviceCenterId);
      if (!center) {
        return res.status(404).json({ message: 'Service center not found' });
      }
      // Check existing review
      const alreadyReviewed = await Review.findOne({ user: req.user._id, serviceCenter: serviceCenterId });
      if (alreadyReviewed) {
        return res.status(400).json({ message: 'You have already reviewed this service center' });
      }
    }

    const review = await Review.create({
      user: req.user._id,
      station: stationId || undefined,
      serviceCenter: serviceCenterId || undefined,
      rating: Number(rating),
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const editReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    review.rating = rating !== undefined ? Number(rating) : review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's reviews
// @route   GET /api/reviews/user
// @access  Private
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('station', 'name city')
      .populate('serviceCenter', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  editReview,
  deleteReview,
  getUserReviews,
};
