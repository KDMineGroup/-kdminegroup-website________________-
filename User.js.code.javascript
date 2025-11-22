/**
 * User Model
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'نام الزامی است'],
        trim: true,
        maxlength: [100, 'نام نمی‌تواند بیشتر از 100 کاراکتر باشد'],
    },
    email: {
        type: String,
        required: [true, 'ایمیل الزامی است'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'لطفاً یک ایمیل معتبر وارد کنید',
        ],
    },
    phone: {
        type: String,
        required: [true, 'شماره تلفن الزامی است'],
        match: [/^09[0-9]{9}$/, 'لطفاً یک شماره تلفن معتبر وارد کنید'],
    },
    password: {
        type: String,
        required: [true, 'رمز عبور الزامی است'],
        minlength: [8, 'رمز عبور باید حداقل 8 کاراکتر باشد'],
        select: false,
    },
    userType: {
        type: String,
        enum: ['company', 'consultant', 'supplier', 'individual'],
        default: 'individual',
    },
    avatar: {
        type: String,
        default: 'default-avatar.png',
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: String,
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: Date,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });

// Virtual for projects
UserSchema.virtual('projects', {
    ref: 'Project',
    localField: '_id',
    foreignField: 'user',
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Generate Refresh Token
UserSchema.methods.getRefreshToken = function() {
    const refreshToken = jwt.sign(
        { id: this._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );

    this.refreshToken = refreshToken;
    return refreshToken;
};

// Generate Email Verification Token
UserSchema.methods.getEmailVerificationToken = function() {
    const verificationToken = jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    this.emailVerificationToken = verificationToken;
    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

    return verificationToken;
};

// Generate Password Reset Token
UserSchema.methods.getResetPasswordToken = function() {
    const resetToken = jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    this.resetPasswordToken = resetToken;
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

    return resetToken;
};

// Check if account is locked
UserSchema.methods.isLocked = function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
UserSchema.methods.incLoginAttempts = function() {
    // Reset attempts if lock has expired
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 },
        });
    }

    const updates = { $inc: { loginAttempts: 1 } };
    const maxAttempts = 5;
    const lockTime = 2 * 60 * 60 * 1000; // 2 hours

    // Lock account after max attempts
    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
        updates.$set = { lockUntil: Date.now() + lockTime };
    }

    return this.updateOne(updates);
};

// Reset login attempts
UserSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 },
    });
};

module.exports = mongoose.model('User', UserSchema);