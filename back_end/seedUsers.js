const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/UserModel');
require('dotenv').config();

// MongoDB connection
const DB_URL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';

mongoose.connect(DB_URL, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log('✅ MongoDB connected for seeding users'))
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
        console.error('Make sure MongoDB is running on', DB_URL);
        process.exit(1);
    });

const seedUsers = async () => {
    try {
        // Clear existing users (optional - comment out if you want to keep them)
        // await User.deleteMany({});
        // console.log('🗑️ Cleared existing users');

        const testUsers = [
            {
                name: 'Admin User',
                email: 'admin@admin.com',
                passwordHash: await bcrypt.hash('admin123', 10),
                phone: '+966500000000',
                address: 'Admin Address',
                dietaryConstraints: [],
                role: 'admin',
                isActive: true
            },
            {
                name: 'Rawan Ibrahem',
                email: 'rawan@test.com',
                passwordHash: await bcrypt.hash('test123', 10),
                phone: '+966501234567',
                address: 'Riyadh, Saudi Arabia',
                dietaryConstraints: ['gluten-free', 'dairy-free'],
                role: 'user',
                isActive: true
            },
            {
                name: 'Amjad Aalaranji',
                email: 'amjad@test.com',
                passwordHash: await bcrypt.hash('test123', 10),
                phone: '+966502234567',
                address: 'Jeddah, Saudi Arabia',
                dietaryConstraints: ['vegan', 'high-fiber'],
                role: 'user',
                isActive: true
            },
            {
                name: 'Mohammad Ahmad',
                email: 'mohammad@test.com',
                passwordHash: await bcrypt.hash('test123', 10),
                phone: '+966503234567',
                address: 'Dammam, Saudi Arabia',
                dietaryConstraints: ['low-fat', 'gluten-free'],
                role: 'user',
                isActive: true
            }
        ];

        // Check which users already exist
        const existingEmails = (await User.find({
            email: { $in: testUsers.map(u => u.email) }
        })).map(u => u.email);

        // Filter out existing users
        const newUsers = testUsers.filter(u => !existingEmails.includes(u.email));

        if (existingEmails.length > 0) {
            console.log(`⚠️ ${existingEmails.length} user(s) already exist:`, existingEmails);
        }

        if (newUsers.length > 0) {
            const insertedUsers = await User.insertMany(newUsers);
            console.log(`✅ Successfully seeded ${insertedUsers.length} new user(s)`);
            console.log('\n📋 New Users Created:');
            insertedUsers.forEach(user => {
                console.log(`   - Name: ${user.name}`);
                console.log(`     Email: ${user.email}`);
                console.log(`     Role: ${user.role}`);
                console.log(`     Password: ${user.role === 'admin' ? 'admin123' : 'test123'} (hashed)`);
                console.log('');
            });
        } else {
            console.log('ℹ️ All users already exist. No new users added.');
        }

        mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedUsers();
