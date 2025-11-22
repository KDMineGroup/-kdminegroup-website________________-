/**
 * Contact Controller
 */

const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

// @desc    Send contact form
// @route   POST /api/v1/contact/send
// @access  Public
exports.sendContactForm = asyncHandler(async (req, res, next) => {
    const { name, email, phone, subject, message } = req.body;

    // Validate
    if (!name || !email || !message) {
        return next(new ErrorResponse('لطفاً تمام فیلدهای الزامی را پر کنید', 400));
    }

    // Send email to admin
    const adminMessage = `
        <h2>پیام جدید از فرم تماس</h2>
        <p><strong>نام:</strong> ${name}</p>
        <p><strong>ایمیل:</strong> ${email}</p>
        <p><strong>تلفن:</strong> ${phone || 'ندارد'}</p>
        <p><strong>موضوع:</strong> ${subject || 'ندارد'}</p>
        <p><strong>پیام:</strong></p>
        <p>${message}</p>
    `;

    try {
        await sendEmail({
            email: process.env.ADMIN_EMAIL || 'admin@kavian-mining.com',
            subject: `پیام جدید از ${name}`,
            message: adminMessage,
        });

        // Send confirmation email to user
        const userMessage = `
            <h2>پیام شما دریافت شد</h2>
            <p>سلام ${name} عزیز،</p>
            <p>پیام شما با موفقیت دریافت شد و در اسرع وقت پاسخ داده خواهد شد.</p>
            <p>با تشکر از تماس شما با کاویان توسعه معدن</p>
        `;

        await sendEmail({
            email: email,
            subject: 'دریافت پیام شما - کاویان توسعه معدن',
            message: userMessage,
        });

        res.status(200).json({
            success: true,
            message: 'پیام شما با موفقیت ارسال شد',
        });
    } catch (err) {
        return next(new ErrorResponse('خطا در ارسال پیام', 500));
    }
});

// @desc    Request consultation
// @route   POST /api/v1/contact/consultation
// @access  Public
exports.requestConsultation = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        phone,
        company,
        serviceType,
        projectDetails,
        preferredDate,
        preferredTime,
    } = req.body;

    // Validate
    if (!name || !email || !phone || !serviceType) {
        return next(new ErrorResponse('لطفاً تمام فیلدهای الزامی را پر کنید', 400));
    }

    // Send email to admin
    const adminMessage = `
        <h2>درخواست مشاوره جدید</h2>
        <p><strong>نام:</strong> ${name}</p>
        <p><strong>ایمیل:</strong> ${email}</p>
        <p><strong>تلفن:</strong> ${phone}</p>
        <p><strong>شرکت:</strong> ${company || 'ندارد'}</p>
        <p><strong>نوع خدمات:</strong> ${serviceType}</p>
        <p><strong>جزئیات پروژه:</strong></p>
        <p>${projectDetails || 'ندارد'}</p>
        <p><strong>تاریخ ترجیحی:</strong> ${preferredDate || 'ندارد'}</p>
        <p><strong>ساعت ترجیحی:</strong> ${preferredTime || 'ندارد'}</p>
    `;

    try {
        await sendEmail({
            email: process.env.ADMIN_EMAIL || 'admin@kavian-mining.com',
            subject: `درخواست مشاوره از ${name}`,
            message: adminMessage,
        });

        // Send confirmation email to user
        const userMessage = `
            <h2>درخواست مشاوره شما ثبت شد</h2>
            <p>سلام ${name} عزیز،</p>
            <p>درخواست مشاوره شما با موفقیت ثبت شد.</p>
            <p>کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.</p>
            <p>با تشکر از اعتماد شما به کاویان توسعه معدن</p>
        `;

        await sendEmail({
            email: email,
            subject: 'ثبت درخواست مشاوره - کاویان توسعه معدن',
            message: userMessage,
        });

        res.status(200).json({
            success: true,
            message: 'درخواست مشاوره شما با موفقیت ثبت شد',
        });
    } catch (err) {
        return next(new ErrorResponse('خطا در ثبت درخواست', 500));
    }
});