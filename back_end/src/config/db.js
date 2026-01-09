const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';
        console.log('🔌 Connecting to MongoDB:', mongoURI);

        // تم إزالة useNewUrlParser و useUnifiedTopology لأنها deprecated في Mongoose 6+
        // Mongoose الآن يستخدم هذه الإعدادات افتراضياً
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ MongoDB connected successfully');
        return mongoose.connection;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
