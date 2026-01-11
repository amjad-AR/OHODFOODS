const express = require('express');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');

const router = express.Router();

// تم التعديل: إصلاح ترتيب Routes - /category/:category يجب أن يكون قبل /:id
// تم التعديل: إضافة protect و admin middleware للـ admin routes
// تم التعديل: إضافة validateObjectId للتحقق من صحة ID

// Public routes
router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', validateObjectId, getProductById);

// Admin routes (protected - admin only)
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, validateObjectId, updateProduct);
router.delete('/:id', protect, admin, validateObjectId, deleteProduct);

module.exports = router;
