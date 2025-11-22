/**
 * Kavian Mining Development - Backend Server
 * Node.js + Express + MongoDB
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const blogRoutes = require('./routes/blog.routes');
const notificationRoutes = require('./routes/notification.routes');
const contactRoutes = require('./routes/contact.routes');
const fileRoutes = require('./routes/file.routes');

// Import Middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Initialize Express App
const app = express();

// ===== MIDDLEWARE =====

// Security Headers
app.use(helmet());

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data Sanitization against NoSQL Injection
app.use(mongoSanitize());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً بعداً تلاش کنید.',
});
app.use('/api/', limiter);

// ===== ROUTES =====

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
const API_VERSION = '/api/v1';

app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/user`, userRoutes);
app.use(`${API_VERSION}/projects`, projectRoutes);
app.use(`${API_VERSION}/blog`, blogRoutes);
app.use(`${API_VERSION}/notifications`, notificationRoutes);
app.use(`${API_VERSION}/contact`, contactRoutes);
app.use(`${API_VERSION}/files`, fileRoutes);

// Static Files
app.use('/uploads', express.static('uploads'));

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

// ===== DATABASE CONNECTION =====

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// ===== START SERVER =====

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════╗
║   🚀 Kavian Mining Backend Server    ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   Port: ${PORT}                          ║
║   API Version: v1                      ║
╚════════════════════════════════════════╝
        `);
    });
};

startServer();

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    process.exit(1);
});

module.exports = app;