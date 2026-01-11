const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            enum: ['raw_ingredients', 'ready_products', 'beverages'],
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        image: {
            type: String,
            default: 'https://via.placeholder.com/300',
        },
        // وسوم تحديد الخصائص الغذائية
        tags: {
            type: [String],
            default: [],
            // Examples: "gluten-free", "low-fat", "dairy-free", "vegan", "organic", "nut-free"
        },
        ingredients: {
            type: [String],
            default: [],
            // المكونات الموجودة في المنتج
        },
        // معلومات التغذية (اختياري)
        nutrition: {
            calories: Number,
            protein: Number, // grams
            fat: Number, // grams
            carbs: Number, // grams
            fiber: Number, // grams
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        sku: {
            type: String,
            unique: true,
            sparse: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
