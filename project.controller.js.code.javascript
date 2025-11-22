/**
 * Project Controller
 */

const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res, next) => {
    const {
        page = 1,
        limit = 10,
        status,
        search,
        sortBy = 'createdAt',
        order = 'desc',
    } = req.query;

    // Build query
    const query = { user: req.user._id };

    if (status) {
        query.status = status;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    // Execute query with pagination
    const projects = await Project.find(query)
        .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('user', 'name email avatar');

    // Get total count
    const count = await Project.countDocuments(query);

    res.status(200).json({
        success: true,
        data: {
            projects,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit),
            },
        },
    });
});

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Private
exports.getProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id)
        .populate('user', 'name email avatar phone')
        .populate('team.user', 'name email avatar');

    if (!project) {
        return next(new ErrorResponse('پروژه یافت نشد', 404));
    }

    // Check ownership
    if (project.user._id.toString() !== req.user._id.toString() && !project.isPublic) {
        return next(new ErrorResponse('دسترسی غیرمجاز', 403));
    }

    // Increment views
    project.views += 1;
    await project.save();

    res.status(200).json({
        success: true,
        data: project,
    });
});

// @desc    Create project
// @route   POST /api/v1/projects/create
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user._id;

    const project = await Project.create(req.body);

    res.status(201).json({
        success: true,
        message: 'پروژه با موفقیت ایجاد شد',
        data: project,
    });
});

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
    let project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorResponse('پروژه یافت نشد', 404));
    }

    // Check ownership
    if (project.user.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('دسترسی غیرمجاز', 403));
    }

    project = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        message: 'پروژه با موفقیت بروزرسانی شد',
        data: project,
    });
});

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorResponse('پروژه یافت نشد', 404));
    }

    // Check ownership
    if (project.user.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('دسترسی غیرمجاز', 403));
    }

    await project.remove();

    res.status(200).json({
        success: true,
        message: 'پروژه با موفقیت حذف شد',
        data: {},
    });
});

// @desc    Get project statistics
// @route   GET /api/v1/projects/statistics
// @access  Private
exports.getStatistics = asyncHandler(async (req, res, next) => {
    const stats = await Project.getStatistics(req.user._id);

    res.status(200).json({
        success: true,
        data: stats,
    });
});

// @desc    Add team member
// @route   POST /api/v1/projects/:id/team
// @access  Private
exports.addTeamMember = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorResponse('پروژه یافت نشد', 404));
    }

    // Check ownership
    if (project.user.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('دسترسی غیرمجاز', 403));
    }

    const { userId, role } = req.body;

    // Check if user already in team
    const exists = project.team.find(
        member => member.user.toString() === userId
    );

    if (exists) {
        return next(new ErrorResponse('این کاربر قبلاً به تیم اضافه شده است', 400));
    }

    project.team.push({ user: userId, role });
    await project.save();

    res.status(200).json({
        success: true,
        message: 'عضو با موفقیت به تیم اضافه شد',
        data: project,
    });
});

// @desc    Upload project file
// @route   POST /api/v1/projects/:id/files
// @access  Private
exports.uploadFile = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorResponse('پروژه یافت نشد', 404));
    }

    // Check ownership
    if (project.user.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('دسترسی غیرمجاز', 403));
    }

    if (!req.file) {
        return next(new ErrorResponse('لطفاً فایل را انتخاب کنید', 400));
    }

    const file = {
        name: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        type: req.file.mimetype,
        size: req.file.size,
    };

    project.files.push(file);
    await project.save();

    res.status(200).json({
        success: true,
        message: 'فایل با موفقیت آپلود شد',
        data: file,
    });
});