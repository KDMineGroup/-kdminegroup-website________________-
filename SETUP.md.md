# 🚀 راهنمای راه‌اندازی Backend کاویان توسعه معدن

## 📋 پیش‌نیازها

- Node.js (v16 یا بالاتر)
- MongoDB (v5 یا بالاتر)
- npm یا yarn

## 📦 نصب

### 1. کلون کردن پروژه
```bash
git clone https://github.com/your-repo/kavian-backend.git
cd kavian-backend
```

### 2. نصب Dependencies
```bash
npm install
```

### 3. تنظیم Environment Variables
```bash
cp .env.example .env
```

سپس فایل `.env` را ویرایش کنید و مقادیر مورد نیاز را وارد کنید.

### 4. راه‌اندازی MongoDB

**روش 1: MongoDB Local**
```bash
# نصب MongoDB
# برای Ubuntu/Debian:
sudo apt-get install mongodb

# شروع سرویس
sudo systemctl start mongodb
```

**روش 2: MongoDB Atlas (Cloud)**
1. به [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) بروید
2. یک Cluster رایگان ایجاد کنید
3. Connection String را در `.env` قرار دهید

### 5. راه‌اندازی سرور

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## 🧪 تست API

### با cURL:
```bash
# Health Check
curl http://localhost:3000/health

# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "علی احمدی",
    "email": "ali@example.com",
    "phone": "09123456789",
    "password": "password123",
    "userType": "company"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ali@example.com",
    "password": "password123"
  }'
```

### با Postman:
1. Import کردن Collection از `postman/kavian-api.json`
2. تنظیم Environment Variables
3. اجرای Requests

## 📁 ساختار پروژه

```
kavian-backend/
├── controllers/        # کنترلرها
├── models/            # مدل‌های دیتابیس
├── routes/            # مسیرها
├── middleware/        # میدلورها
├── utils/             # توابع کمکی
├── uploads/           # فایل‌های آپلود شده
├── .env               # متغیرهای محیطی
├── server.js          # فایل اصلی سرور
└── package.json       # وابستگی‌ها
```

## 🔐 امنیت

- همیشه از HTTPS استفاده کنید
- JWT Secret را تغییر دهید
- Rate Limiting فعال است
- Input Validation انجام می‌شود
- MongoDB Injection Prevention

## 📊 Monitoring

برای مانیتورینگ می‌توانید از ابزارهای زیر استفاده کنید:
- PM2 (Process Manager)
- Sentry (Error Tracking)
- New Relic (Performance Monitoring)

## 🚀 Deploy

### Heroku:
```bash
heroku create kavian-backend
heroku config:set NODE_ENV=production
git push heroku main
```

### DigitalOcean/AWS:
1. راه‌اندازی VPS
2. نصب Node.js و MongoDB
3. کلون پروژه
4. استفاده از PM2 برای مدیریت Process

## 📞 پشتیبانی

در صورت بروز مشکل:
- ایمیل: support@kavian-mining.com
- تلگرام: @kavian_support