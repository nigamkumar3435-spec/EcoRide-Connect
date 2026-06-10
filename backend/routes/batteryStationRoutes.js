const express = require('express');
const router = express.Router();
const {
  getBatteryStations,
  createBatteryStation,
  updateBatteryStation,
  deleteBatteryStation,
} = require('../controllers/batteryStationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBatteryStations)
  .post(protect, admin, createBatteryStation);

router.route('/:id')
  .put(protect, admin, updateBatteryStation)
  .delete(protect, admin, deleteBatteryStation);

module.exports = router;
