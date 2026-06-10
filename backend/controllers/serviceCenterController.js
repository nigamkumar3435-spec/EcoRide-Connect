const ServiceCenter = require('../models/ServiceCenter');
const Review = require('../models/Review');

// @desc    Get all service centers
// @route   GET /api/service-centers
// @access  Public
const getServiceCenters = async (req, res) => {
  try {
    const centers = await ServiceCenter.find({}).sort('-createdAt');

    // Aggregate review count and ratings dynamically
    const centersWithReviews = await Promise.all(
      centers.map(async (center) => {
        const reviews = await Review.find({ serviceCenter: center._id });
        const avgRating =
          reviews.length > 0
            ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
            : 0;
        return {
          ...center.toObject(),
          avgRating,
          numReviews: reviews.length,
          reviews,
        };
      })
    );

    res.json(centersWithReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service center
// @route   POST /api/service-centers
// @access  Private/Admin
const createServiceCenter = async (req, res) => {
  const { name, address, contact, services, image } = req.body;

  try {
    const center = await ServiceCenter.create({
      name,
      address,
      contact,
      services: Array.isArray(services) ? services : services.split(',').map((s) => s.trim()),
      image,
    });

    res.status(201).json(center);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a service center
// @route   PUT /api/service-centers/:id
// @access  Private/Admin
const updateServiceCenter = async (req, res) => {
  try {
    const center = await ServiceCenter.findById(req.params.id);

    if (center) {
      center.name = req.body.name || center.name;
      center.address = req.body.address || center.address;
      center.contact = req.body.contact || center.contact;
      center.image = req.body.image || center.image;
      if (req.body.services) {
        center.services = Array.isArray(req.body.services)
          ? req.body.services
          : req.body.services.split(',').map((s) => s.trim());
      }

      const updatedCenter = await center.save();
      res.json(updatedCenter);
    } else {
      res.status(404).json({ message: 'Service center not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a service center
// @route   DELETE /api/service-centers/:id
// @access  Private/Admin
const deleteServiceCenter = async (req, res) => {
  try {
    const center = await ServiceCenter.findById(req.params.id);

    if (center) {
      await center.deleteOne();
      // Clean up reviews
      await Review.deleteMany({ serviceCenter: center._id });
      res.json({ message: 'Service center removed' });
    } else {
      res.status(404).json({ message: 'Service center not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServiceCenters,
  createServiceCenter,
  updateServiceCenter,
  deleteServiceCenter,
};
