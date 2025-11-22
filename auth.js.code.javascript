/**
 * Authentication Middleware
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for token in headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('دسترسی غیرمجاز - توکن یافت نشد', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorResponse('کاربر یافت نشد', 404));
        }

        // Check if user is active
        if (!req.user.isActive) {
            return next(new ErrorResponse('حساب کاربری غیرفعال است', 403));
        }

        next();
    } catch (err) {
        return next(new ErrorResponse('دسترسی غیرمجاز - توکن نامعتبر', 401));
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `نقش ${req.user.role} مجاز به دسترسی به این بخش نیست`,
                    403
                )
            );
        }
        next();
    };
};

// Optional auth (for routes that work with or without auth)
exports.optionalAuth = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
        } catch (err) {
            // Token invalid, but continue without user
            req.user = null;
        }
    }

    next();
});