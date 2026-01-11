const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

/**
 * Middleware للتحقق من JWT token وحماية الـ routes
 * يضيف req.userId و req.user للـ request object
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // التحقق من وجود التوكن في الـ Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, no token provided'
            });
        }

        try {
            // التحقق من صحة التوكن وفك تشفيره
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_change_me');
            
            // جلب المستخدم من قاعدة البيانات (بدون كلمة المرور)
            const user = await User.findById(decoded.id).select('-passwordHash');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    error: 'User account is inactive'
                });
            }

            // إضافة معلومات المستخدم للـ request object
            req.userId = user._id;
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, token failed'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error in authentication'
        });
    }
};

/**
 * Middleware للتحقق من أن المستخدم هو Admin
 * يجب استخدامه بعد protect middleware
 */
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            error: 'Not authorized as admin'
        });
    }
};

module.exports = { protect, admin };

