const BatteryStation = require('../models/BatteryStation');

// @desc    Get all battery swap stations
// @route   GET /api/battery-stations
// @access  Public
const getBatteryStations = async (req, res) => {
  try {
    const stations = await BatteryStation.find({}).sort('-createdAt');
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a battery swap station
// @route   POST /api/battery-stations
// @access  Private/Admin
const createBatteryStation = async (req, res) => {
  const { name, address, batteryType, contact, workingHours, image } = req.body;

  try {
    const station = await BatteryStation.create({
      name,
      address,
      batteryType,
      contact,
      workingHours,
      image,
    });

    res.status(201).json(station);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a battery swap station
// @route   PUT /api/battery-stations/:id
// @access  Private/Admin
const updateBatteryStation = async (req, res) => {
  try {
    const station = await BatteryStation.findById(req.params.id);

    if (station) {
      station.name = req.body.name || station.name;
      station.address = req.body.address || station.address;
      station.batteryType = req.body.batteryType || station.batteryType;
      station.contact = req.body.contact || station.contact;
      station.workingHours = req.body.workingHours || station.workingHours;
      station.image = req.body.image || station.image;

      const updatedStation = await station.save();
      res.json(updatedStation);
    } else {
      res.status(404).json({ message: 'Battery swap station not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a battery swap station
// @route   DELETE /api/battery-stations/:id
// @access  Private/Admin
const deleteBatteryStation = async (req, res) => {
  try {
    const station = await BatteryStation.findById(req.params.id);

    if (station) {
      await station.deleteOne();
      res.json({ message: 'Battery swap station removed' });
    } else {
      res.status(404).json({ message: 'Battery swap station not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBatteryStations,
  createBatteryStation,
  updateBatteryStation,
  deleteBatteryStation,
};
