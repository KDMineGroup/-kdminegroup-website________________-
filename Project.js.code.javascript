/**
 * Project Model
 */

const mongoose = require('mongoose');
const slugify = require('slugify');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'عنوان پروژه الزامی است'],
        trim: true,
        maxlength: [200, 'عنوان نمی‌تواند بیشتر از 200 کاراکتر باشد'],
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'توضیحات پروژه الزامی است'],
        maxlength: [2000, 'توضیحات نمی‌تواند بیشتر از 2000 کاراکتر باشد'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending',
    },
    type: {
        type: String,
        enum: ['exploration', 'extraction', 'processing', 'consultation', 'equipment', 'other'],
        required: [true, 'نوع پروژه الزامی است'],
    },
    location: {
        province: String,
        city: String,
        address: String,
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },
    budget: {
        estimated: Number,
        actual: Number,
        currency: {
            type: String,
            default: 'IRR',
        },
    },
    timeline: {
        startDate: Date,
        endDate: Date,
        estimatedDuration: Number, // in days
    },
    team: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        role: String,
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    files: [{
        name: String,
        url: String,
        type: String,
        size: Number,
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    tags: [String],
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    notes: String,
    isPublic: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Indexes
ProjectSchema.index({ user: 1, status: 1 });
ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ createdAt: -1 });

// Create slug from title
ProjectSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

// Virtual for duration
ProjectSchema.virtual('duration').get(function() {
    if (this.timeline.startDate && this.timeline.endDate) {
        const diff = this.timeline.endDate - this.timeline.startDate;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return null;
});

// Static method to get statistics
ProjectSchema.statics.getStatistics = async function(userId) {
    const stats = await this.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    const result = {
        activeProjects: 0,
        completedProjects: 0,
        pendingProjects: 0,
        cancelledProjects: 0,
        totalProjects: 0,
    };

    stats.forEach(stat => {
        result[`${stat._id}Projects`] = stat.count;
        result.totalProjects += stat.count;
    });

    return result;
};

module.exports = mongoose.model('Project', ProjectSchema);