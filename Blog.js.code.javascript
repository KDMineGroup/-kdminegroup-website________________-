/**
 * Blog Model
 */

const mongoose = require('mongoose');
const slugify = require('slugify');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'عنوان مقاله الزامی است'],
        trim: true,
        maxlength: [200, 'عنوان نمی‌تواند بیشتر از 200 کاراکتر باشد'],
    },
    slug: {
        type: String,
        unique: true,
    },
    excerpt: {
        type: String,
        required: [true, 'خلاصه مقاله الزامی است'],
        maxlength: [500, 'خلاصه نمی‌تواند بیشتر از 500 کاراکتر باشد'],
    },
    content: {
        type: String,
        required: [true, 'محتوای مقاله الزامی است'],
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: [true, 'دسته‌بندی الزامی است'],
        enum: [
            'exploration',
            'extraction',
            'processing',
            'equipment',
            'safety',
            'environment',
            'technology',
            'management',
            'news',
            'other',
        ],
    },
    tags: [String],
    featuredImage: {
        type: String,
        default: 'default-blog.jpg',
    },
    images: [String],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    comments: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            maxlength: [1000, 'نظر نمی‌تواند بیشتر از 1000 کاراکتر باشد'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    publishedAt: Date,
    featured: {
        type: Boolean,
        default: false,
    },
    readTime: Number, // in minutes
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Indexes
BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1, status: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ publishedAt: -1 });
BlogSchema.index({ title: 'text', content: 'text' });

// Create slug from title
BlogSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

// Calculate read time
BlogSchema.pre('save', function(next) {
    if (this.isModified('content')) {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / wordsPerMinute);
    }
    next();
});

// Set publishedAt when status changes to published
BlogSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = Date.now();
    }
    next();
});

// Virtual for likes count
BlogSchema.virtual('likesCount').get(function() {
    return this.likes.length;
});

// Virtual for comments count
BlogSchema.virtual('commentsCount').get(function() {
    return this.comments.length;
});

module.exports = mongoose.model('Blog', BlogSchema);