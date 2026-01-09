const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your_secret_key_change_me', {
        expiresIn: '7d',
    });
};

// @desc    Register user
// @route   POST /api/users/register
// تم التعديل: تحسين error handling والتحقق من البيانات
exports.register = async (req, res) => {
    try {
        const { name, email, password, dietaryConstraints } = req.body;

        // التحقق من البيانات المطلوبة
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide name, email, and password'
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Create user (passwordHash سيتم hash تلقائياً في pre-save hook)
        user = await User.create({
            name,
            email,
            passwordHash: password, // سيتم hash في UserModel pre-save hook
            dietaryConstraints: dietaryConstraints || [],
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address || '',
                phone: user.phone || '',
                dietaryConstraints: user.dietaryConstraints,
            },
            token,
        });
    } catch (error) {
        console.error('Error in register:', error);
        // معالجة أخطاء Mongoose validation
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// تم التعديل: تحسين error handling
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        // تحويل email لـ lowercase للتطابق مع الـ schema
        const normalizedEmail = email.toLowerCase().trim();

        // Check for user (select password field explicitly)
        const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
        
        // Debug logging (يمكن إزالته في الإنتاج)
        console.log('Login attempt for:', normalizedEmail, '- User found:', !!user);
        
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ success: false, error: 'User account is inactive' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address || '',
                phone: user.phone || '',
                dietaryConstraints: user.dietaryConstraints,
            },
            token,
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ success: false, error: 'Server error during login' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// تم التعديل: استخدام req.userId من authMiddleware بدلاً من req.userId المباشر
exports.getProfile = async (req, res) => {
    try {
        // req.userId يأتي من authMiddleware
        const user = await User.findById(req.userId).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// تم التعديل: منع تحديث passwordHash مباشرة، يجب استخدام route منفصل لتغيير كلمة المرور
exports.updateProfile = async (req, res) => {
    try {
        // منع تحديث passwordHash و role و isActive من خلال هذا الـ route
        const { passwordHash, role, isActive, ...updateData } = req.body;

        if (passwordHash) {
            return res.status(400).json({
                success: false,
                error: 'Cannot update password through this route. Use change password endpoint.'
            });
        }

        // req.userId يأتي من authMiddleware
        const user = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// تم التعديل: تحسين error handling
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get user by ID (admin)
// @route   GET /api/users/:id
// تم الإضافة: إضافة route للحصول على مستخدم محدد
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error in getUserById:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid user ID format' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update user by ID (admin)
// @route   PUT /api/users/:id
// تم التعديل: تحسين error handling وإضافة تعليقات
exports.updateUser = async (req, res) => {
    try {
        // Don't allow password updates through this route
        const { passwordHash, ...updateData } = req.body;

        if (passwordHash) {
            return res.status(400).json({
                success: false,
                error: 'Cannot update password through this route'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error in updateUser:', error);
        // التحقق من نوع الخطأ
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid user ID format' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete user by ID (admin)
// @route   DELETE /api/users/:id
// تم التعديل: تحسين error handling والتحقق من صحة ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid user ID format' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};
