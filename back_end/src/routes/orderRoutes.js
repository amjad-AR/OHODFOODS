const express = require('express');
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    getUserOrders,
    deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');

const router = express.Router();

// تم التعديل: إصلاح ترتيب Routes - /user يجب أن يكون قبل /:id
// تم التعديل: إضافة protect middleware للـ routes المحمية
// تم التعديل: إضافة validateObjectId للتحقق من صحة ID

// Get all orders (admin only)
router.get('/', protect, admin, getAllOrders);

// Get user orders (protected - user must be authenticated)
router.get('/user', protect, getUserOrders);

// Get order by ID (protected)
router.get('/:id', protect, validateObjectId, getOrderById);

// Create new order (protected - user must be authenticated)
router.post('/', protect, createOrder);

// Update order (protected - admin only)
router.put('/:id', protect, admin, validateObjectId, updateOrder);

// Delete order (protected - admin only)
router.delete('/:id', protect, admin, validateObjectId, deleteOrder);

module.exports = router;

