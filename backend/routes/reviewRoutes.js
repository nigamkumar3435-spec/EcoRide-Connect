const express = require('express');
const router = express.Router();
const {
  addReview,
  editReview,
  deleteReview,
  getUserReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/user')
  .get(protect, getUserReviews);

router.route('/')
  .post(protect, addReview);

router.route('/:id')
  .put(protect, editReview)
  .delete(protect, deleteReview);

module.exports = router;
