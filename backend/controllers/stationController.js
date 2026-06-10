const ChargingStation = require('../models/ChargingStation');
const Review = require('../models/Review');

// @desc    Get all charging stations with filters, search, and sort
// @route   GET /api/stations
// @access  Public
const getStations = async (req, res) => {
  try {
    const { city, name, chargerType, available, sortBy } = req.query;
    let query = {};

    // Search by city, state, or address
    if (city) {
      query.$or = [
        { city: { $regex: city, $options: 'i' } },
        { state: { $regex: city, $options: 'i' } },
        { address: { $regex: city, $options: 'i' } }
      ];
    }

    // Search by name
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    // Filter by charger type
    if (chargerType) {
      query.chargerType = chargerType;
    }

    // Filter by availability (slots > 0)
    if (available === 'true') {
      query.availableSlots = { $gt: 0 };
    }

    let apiQuery = ChargingStation.find(query);

    // Sort by cost (default: asc, can be desc)
    if (sortBy === 'cost-desc') {
      apiQuery = apiQuery.sort('-chargingCost');
    } else if (sortBy === 'cost-asc') {
      apiQuery = apiQuery.sort('chargingCost');
    } else {
      apiQuery = apiQuery.sort('-createdAt'); // default sort by newest
    }

    const stations = await apiQuery;

    // Dynamically calculate average rating and review counts for each station
    const stationsWithReviews = await Promise.all(
      stations.map(async (station) => {
        const reviews = await Review.find({ station: station._id });
        const avgRating =
          reviews.length > 0
            ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
            : 0;
        return {
          ...station.toObject(),
          avgRating,
          numReviews: reviews.length,
        };
      })
    );

    res.json(stationsWithReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get charging station by ID (with populated reviews)
// @route   GET /api/stations/:id
// @access  Public
const getStationById = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);

    if (station) {
      const reviews = await Review.find({ station: station._id }).populate('user', 'name profileImage');
      const avgRating =
        reviews.length > 0
          ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
          : 0;

      res.json({
        ...station.toObject(),
        avgRating,
        reviews,
      });
    } else {
      res.status(404).json({ message: 'Charging station not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a charging station
// @route   POST /api/stations
// @access  Private/Admin
const createStation = async (req, res) => {
  const { name, address, city, state, contact, chargerType, chargingCost, availableSlots, description, images, openingHours, latitude, longitude } = req.body;

  try {
    const station = await ChargingStation.create({
      name,
      address,
      city,
      state,
      contact,
      chargerType,
      chargingCost,
      availableSlots,
      description,
      images,
      openingHours,
      latitude,
      longitude,
    });

    res.status(201).json(station);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a charging station
// @route   PUT /api/stations/:id
// @access  Private/Admin
const updateStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);

    if (station) {
      station.name = req.body.name || station.name;
      station.address = req.body.address || station.address;
      station.city = req.body.city || station.city;
      station.state = req.body.state || station.state;
      station.contact = req.body.contact || station.contact;
      station.chargerType = req.body.chargerType || station.chargerType;
      station.chargingCost = req.body.chargingCost !== undefined ? req.body.chargingCost : station.chargingCost;
      station.availableSlots = req.body.availableSlots !== undefined ? req.body.availableSlots : station.availableSlots;
      station.description = req.body.description || station.description;
      station.images = req.body.images || station.images;
      station.openingHours = req.body.openingHours || station.openingHours;
      station.latitude = req.body.latitude !== undefined ? req.body.latitude : station.latitude;
      station.longitude = req.body.longitude !== undefined ? req.body.longitude : station.longitude;

      const updatedStation = await station.save();
      res.json(updatedStation);
    } else {
      res.status(404).json({ message: 'Charging station not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a charging station
// @route   DELETE /api/stations/:id
// @access  Private/Admin
const deleteStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);

    if (station) {
      await station.deleteOne();
      // Delete associated reviews & bookings as clean up
      await Review.deleteMany({ station: station._id });
      res.json({ message: 'Charging station removed' });
    } else {
      res.status(404).json({ message: 'Charging station not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation,
};
