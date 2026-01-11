const mongoose = require('mongoose');
const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');

// @desc    Get all orders
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('items.productId', 'name image')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error in getAllOrders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('items.productId', 'name image price');

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Error in getOrderById:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid order ID format' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// ملاحظة: تم إزالة transactions لأنها تتطلب MongoDB Replica Set
exports.createOrder = async (req, res) => {
    console.log('📦 ==================== CREATE ORDER REQUEST ====================');
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
    console.log('📦 User ID from auth:', req.userId);

    try {
        const { items, totalAmount, shippingAddress, notes, userId } = req.body;
        
        // استخدام userId من body أو من authMiddleware
        const orderUserId = userId || req.userId;
        console.log('📦 Final User ID for order:', orderUserId);

        // التحقق من البيانات المطلوبة
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Items are required' });
        }

        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({ success: false, error: 'Valid total amount is required' });
        }

        if (!shippingAddress) {
            return res.status(400).json({ success: false, error: 'Shipping address is required' });
        }

        if (!orderUserId) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }

        // التحقق من المخزون وتحديثه لكل منتج
        const validatedItems = [];
        for (const item of items) {
            if (!item.productId || !item.quantity || !item.price) {
                return res.status(400).json({
                    success: false,
                    error: 'Each item must have productId, quantity, and price'
                });
            }

            const product = await Product.findById(item.productId);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: `Product with ID ${item.productId} not found`
                });
            }

            if (!product.isActive) {
                return res.status(400).json({
                    success: false,
                    error: `Product ${product.name} is not available`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
                });
            }

            // تحديث المخزون
            product.stock -= item.quantity;
            await product.save();

            validatedItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            });
        }

        // إنشاء الطلب
        console.log('📦 Creating order with validated items:', validatedItems.length);
        const order = await Order.create({
            userId: orderUserId,
            items: validatedItems,
            totalAmount,
            shippingAddress,
            notes: notes || '',
            status: 'pending',
        });
        console.log('📦 Order created successfully:', order._id);

        const populatedOrder = await Order.findById(order._id)
            .populate('userId', 'name email')
            .populate('items.productId', 'name image');

        res.status(201).json({ success: true, data: populatedOrder });
    } catch (error) {
        console.error('Error in createOrder:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid product ID format' });
        }
        
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
exports.updateOrder = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        if (status && !['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // إذا تم إلغاء الطلب، استرجع المخزون
        if (status === 'cancelled' && order.status !== 'cancelled') {
            for (const item of order.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }

        // تحديث الطلب
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        )
            .populate('userId', 'name email')
            .populate('items.productId', 'name image');

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error('Error in updateOrder:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid order ID format' });
        }
        
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/user
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        const orders = await Order.find({ userId })
            .populate('items.productId', 'name image price')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // استرجع المخزون عند حذف الطلب
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Error in deleteOrder:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid order ID format' });
        }
        
        res.status(500).json({ success: false, error: error.message });
    }
};
