const express = require('express');
const { register, login, getProfile, updateProfile, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');

const router = express.Router();

// تم التعديل: إضافة protect middleware للـ routes المحمية
// تم التعديل: إضافة admin middleware للـ admin routes
// تم التعديل: إضافة validateObjectId للتحقق من صحة ID

// Auth routes (public)
router.post('/register', register);
router.post('/login', login);

// Protected routes (user must be authenticated)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin routes (admin only)
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, validateObjectId, getUserById);
router.put('/:id', protect, admin, validateObjectId, updateUser);
router.delete('/:id', protect, admin, validateObjectId, deleteUser);

module.exports = router;
