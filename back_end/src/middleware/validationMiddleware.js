const mongoose = require('mongoose');

/**
 * التحقق من صحة ObjectId قبل استخدامه في queries
 */
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid ID format'
        });
    }
    
    next();
};

/**
 * التحقق من صحة ObjectId في body
 */
const validateObjectIdInBody = (fieldName) => {
    return (req, res, next) => {
        const fieldValue = req.body[fieldName];
        
        if (fieldValue && !mongoose.Types.ObjectId.isValid(fieldValue)) {
            return res.status(400).json({
                success: false,
                error: `Invalid ${fieldName} format`
            });
        }
        
        next();
    };
};

module.exports = { validateObjectId, validateObjectIdInBody };

