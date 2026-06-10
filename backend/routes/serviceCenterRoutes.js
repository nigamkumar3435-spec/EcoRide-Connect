const express = require('express');
const router = express.Router();
const {
  getServiceCenters,
  createServiceCenter,
  updateServiceCenter,
  deleteServiceCenter,
} = require('../controllers/serviceCenterController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getServiceCenters)
  .post(protect, admin, createServiceCenter);

router.route('/:id')
  .put(protect, admin, updateServiceCenter)
  .delete(protect, admin, deleteServiceCenter);

module.exports = router;
