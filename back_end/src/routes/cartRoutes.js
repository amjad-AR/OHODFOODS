const express = require('express');
const { getCart, validateCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// تم التعديل: إضافة protect middleware للـ routes المحمية

router.get('/', protect, getCart);
router.post('/validate', protect, validateCart);

module.exports = router;
