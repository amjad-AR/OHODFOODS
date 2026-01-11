const Product = require('../models/ProductModel');

// ملاحظة: في تطبيق mobile عادة نخزن العربة في Redux/Context على الجانب client
// لكن هنا نضيف endpoints للـ backend للمرونة

// @desc    Get cart summary (mock - يمكن تحسينها)
// @route   GET /api/cart
exports.getCart = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Cart management is primarily handled on the client-side',
            data: {
                items: [],
                total: 0,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Validate cart items and get prices
// @route   POST /api/cart/validate
// تم التعديل: تحسين error handling والتحقق من البيانات
exports.validateCart = async (req, res) => {
    try {
        const { items } = req.body; // items: [{productId, qty}, ...]

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Items array is required and must not be empty' });
        }

        let validatedItems = [];
        let total = 0;
        const errors = [];

        for (const item of items) {
            // التحقق من البيانات المطلوبة
            if (!item.productId || item.qty === undefined) {
                errors.push(`Item missing productId or quantity`);
                continue;
            }

            if (item.qty <= 0) {
                errors.push(`Invalid quantity for product ${item.productId}`);
                continue;
            }

            const product = await Product.findById(item.productId);

            if (!product) {
                errors.push(`Product with ID ${item.productId} not found`);
                continue;
            }

            if (!product.isActive) {
                errors.push(`Product ${product.name} is not available`);
                continue;
            }

            if (product.stock < item.qty) {
                return res.status(400).json({
                    success: false,
                    error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.qty}`,
                });
            }

            const itemTotal = product.price * item.qty;
            validatedItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.qty,
                subtotal: itemTotal,
            });
            total += itemTotal;
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation errors',
                errors: errors,
            });
        }

        res.status(200).json({
            success: true,
            data: {
                items: validatedItems,
                total,
            },
        });
    } catch (error) {
        console.error('Error in validateCart:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid product ID format' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};
