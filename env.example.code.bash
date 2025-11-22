# ===== SERVER CONFIGURATION =====
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8000

# ===== DATABASE =====
MONGODB_URI=mongodb://localhost:27017/kavian_mining
# یا برای MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kavian_mining?retryWrites=true&w=majority

# ===== JWT CONFIGURATION =====
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key
JWT_REFRESH_EXPIRE=30d

# ===== EMAIL CONFIGURATION =====
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@kavian-mining.com

# ===== FILE UPLOAD =====
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# ===== CLOUDINARY (Optional for image hosting) =====
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ===== SOCIAL AUTH =====
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# ===== REDIS (Optional for caching) =====
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ===== SENTRY (Optional for error tracking) =====
SENTRY_DSN=your_sentry_dsn

# ===== RATE LIMITING =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100