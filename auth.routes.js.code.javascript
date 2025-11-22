/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    socialLogin,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// @route   POST /api/v1/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', register);

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logout);

// @route   POST /api/v1/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', refreshToken);

// @route   POST /api/v1/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/v1/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', resetPassword);

// @route   POST /api/v1/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email', verifyEmail);

// @route   POST /api/v1/auth/social
// @desc    Social login (Google, LinkedIn)
// @access  Public
router.post('/social', socialLogin);

module.exports = router;