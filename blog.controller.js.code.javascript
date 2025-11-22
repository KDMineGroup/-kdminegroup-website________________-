/**
 * Blog Controller
 */

const Blog = require('../models/Blog');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all blog posts
// @route   GET /api/v1/blog
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
    const {
        page = 1,
        limit = 12,
        category,
        search,
        sortBy = 'publishedAt',
        order = 'desc',
    } = req.query;

    // Build query
    const query = { status: 'published' };

    if (category) {
        query.category = category;
    }

    if (search) {
        query.$text = { $search: search };
    }

    // Execute query with pagination
    const posts = await Blog.find(query)
        .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('author', 'name avatar')
        .select('-content');

    // Get total count
    const count = await Blog.countDocuments(query);

    res.status(200).json({
        success: true,
        data: {
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit),
            },
        },
    });
});

// @desc    Get single blog post
// @route   GET /api/v1/blog/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Blog.findById(req.params.id)
        .populate('author', 'name avatar email')
        .populate('comments.user', 'name avatar');

    if (!post) {
        return next(new ErrorResponse('مقاله یافت نشد', 404));
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({
        success: true,
        data: post,
    });
});

// @desc    Create blog post
// @route   POST /api/v1/blog/create
// @access  Private (Admin/Moderator)
exports.createPost = asyncHandler(async (req, res, next) => {
    req.body.author = req.user._id;

    const post = await Blog.create(req.body);

    res.status(201).json({
        success: true,
        message: 'مقاله با موفقیت ایجاد شد',
        data: post,
    });
});

// @desc    Update blog post
// @route   PUT /api/v1/blog/:id
// @access  Private (Admin/Moderator)
exports.updatePost = asyncHandler(async (req, res, next) => {
    let post = await Blog.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse('مقاله یافت نشد', 404));
    }

    // Check ownership or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse('دسترسی غیرمجاز', 403));
    }

    post = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        message: 'مقاله با موفقیت بروزرسانی شد',
        data: post,
    });
});

// @desc    Delete blog post
// @route   DELETE /api/v1/blog/:id
// @access  Private (Admin/Moderator)
exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Blog.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse('مقاله یافت نشد', 404));
    }

    // Check ownership or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse('دسترسی غیرمجاز', 403));
    }

    await post.remove();

    res.status(200).json({
        success: true,
        message: 'مقاله با موفقیت حذف شد',
        data: {},
    });
});

// @desc    Get blog categories
// @route   GET /api/v1/blog/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    const categories = [
        { value: 'exploration', label: 'اکتشاف' },
        { value: 'extraction', label: 'استخراج' },
        { value: 'processing', label: 'فرآوری' },
        { value: 'equipment', label: 'تجهیزات' },
        { value: 'safety', label: 'ایمنی' },
        { value: 'environment', label: 'محیط زیست' },
        { value: 'technology', label: 'فناوری' },
        { value: 'management', label: 'مدیریت' },
        { value: 'news', label: 'اخبار' },
        { value: 'other', label: 'سایر' },
    ];

    res.status(200).json({
        success: true,
        data: categories,
    });
});

// @desc    Search blog posts
// @route   GET /api/v1/blog/search
// @access  Public
exports.searchPosts = asyncHandler(async (req, res, next) => {
    const { q, category, page = 1, limit = 12 } = req.query;

    if (!q) {
        return next(new ErrorResponse('لطفاً کلمه کلیدی را وارد کنید', 400));
    }

    const query = {
        status: 'published',
        $text: { $search: q },
    };

    if (category) {
        query.category = category;
    }

    const posts = await Blog.find(query)
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('author', 'name avatar')
        .select('-content');

    const count = await Blog.countDocuments(query);

    res.status(200).json({
        success: true,
        data: {
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit),
            },
        },
    });
});

// @desc    Like blog post
// @route   POST /api/v1/blog/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
    const post = await Blog.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse('مقاله یافت نشد', 404));
    }

    // Check if already liked
    const alreadyLiked = post.likes.find(
        like => like.user.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
        // Unlike
        post.likes = post.likes.filter(
            like => like.user.toString() !== req.user._id.toString()
        );
    } else {
        // Like
        post.likes.push({ user: req.user._id });
    }

    await post.save();

    res.status(200).json({
        success: true,
        data: {
            liked: !alreadyLiked,
            likesCount: post.likes.length,
        },
    });
});

// @desc    Add comment to blog post
// @route   POST /api/v1/blog/:id/comment
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
    const post = await Blog.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse('مقاله یافت نشد', 404));
    }

    const { content } = req.body;

    if (!content) {
        return next(new ErrorResponse('محتوای نظر الزامی است', 400));
    }

    post.comments.push({
        user: req.user._id,
        content,
    });

    await post.save();

    res.status(200).json({
        success: true,
        message: 'نظر با موفقیت ثبت شد',
        data: post.comments[post.comments.length - 1],
    });
});