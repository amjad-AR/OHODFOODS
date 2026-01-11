const Product = require('../models/ProductModel');

// @desc    Get all products with filters
// @route   GET /api/products
exports.getAllProducts = async (req, res) => {
    try {
        const { category, tag, search, page = 1, limit = 10, includeInactive } = req.query;

        // Build filter array for $and conditions
        const filterConditions = [];
        
        // Only filter inactive products if not explicitly including them
        if (includeInactive !== 'true') {
            filterConditions.push({
                $or: [
                    { isActive: true },
                    { isActive: { $exists: false } } // Include products without isActive field
                ]
            });
        }

        if (category) {
            filterConditions.push({ category: category });
        }

        if (tag) {
            filterConditions.push({ tags: { $in: [tag] } });
        }

        if (search) {
            filterConditions.push({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ]
            });
        }

        // Build final filter
        const filter = filterConditions.length > 0 ? { $and: filterConditions } : {};

        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// تم التعديل: تحسين error handling والتحقق من صحة ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error('Error in getProductById:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid product ID format' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create product (admin only)
// @route   POST /api/products
// تم التعديل: تحسين error handling والتحقق من البيانات
exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, stock } = req.body;

        // التحقق من البيانات المطلوبة
        if (!name || !category || price === undefined || stock === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Name, category, price, and stock are required'
            });
        }

        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error('Error in createProduct:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update product (admin only)
// @route   PUT /api/products/:id
// تم التعديل: تحسين error handling والتحقق من صحة ID
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error('Error in updateProduct:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid product ID format' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete product (admin only)
// @route   DELETE /api/products/:id
// تم التعديل: تحسين error handling والتحقق من صحة ID
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid product ID format' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// تم التعديل: تحسين error handling
exports.getProductsByCategory = async (req, res) => {
    try {
        const validCategories = ['raw_ingredients', 'ready_products', 'beverages'];
        const category = req.params.category;

        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
            });
        }

        const products = await Product.find({
            category: category,
            $or: [
                { isActive: true },
                { isActive: { $exists: false } } // Include products without isActive field
            ]
        });

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error('Error in getProductsByCategory:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
