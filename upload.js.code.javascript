/**
 * File Upload Middleware using Multer
 */

const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// Set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, process.env.UPLOAD_PATH || './uploads');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|zip|rar/;
    
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new ErrorResponse('فرمت فایل مجاز نیست', 400));
    }
}

// Initialize upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;