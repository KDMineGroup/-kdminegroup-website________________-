# 🏗️ کاویان توسعه معدن - وب‌سایت یکپارچه

## 📖 معرفی پروژه

این پروژه یک وب‌سایت کامل و یکپارچه برای شرکت **کاویان توسعه معدن** است که شامل تمامی بخش‌های ضروری یک پلتفرم حرفه‌ای می‌باشد.

---

## ✨ ویژگی‌های اصلی

### 🎨 طراحی و رابط کاربری
- ✅ طراحی مدرن و حرفه‌ای با Gradient های زیبا
- ✅ کاملاً Responsive برای تمام دستگاه‌ها
- ✅ انیمیشن‌های روان و جذاب
- ✅ فونت فارسی Vazirmatn
- ✅ آیکون‌های Font Awesome 6.4.0

### 📄 صفحات موجود

#### 1️⃣ **صفحه اصلی (index.html)**
- Hero Section با انیمیشن
- نمایش خدمات با کارت‌های تعاملی
- آمار و ارقام
- Top Bar با اطلاعات تماس
- منوی Navigation چسبان
- دکمه Scroll to Top
- Footer کامل

#### 2️⃣ **صفحه احراز هویت (auth.html)**
- فرم ورود با اعتبارسنجی
- فرم ثبت‌نام با فیلدهای کامل
- ورود با Google و LinkedIn
- بازیابی رمز عبور
- Remember Me
- ذخیره‌سازی در LocalStorage
- انیمیشن‌های تعاملی

#### 3️⃣ **پنل کاربری (dashboard.html)**
- Sidebar کامل با منوی جانبی
- آمار و نمودارها
- لیست پروژه‌ها
- فعالیت‌های اخیر
- دسترسی سریع
- سیستم Notification
- قابلیت Collapse برای Sidebar

#### 4️⃣ **صفحه وبلاگ (blog.html)**
- سیستم جستجو
- فیلتر بر اساس دسته‌بندی
- مقاله ویژه (Featured Post)
- Grid مقالات
- Pagination
- نمایش نویسنده و تاریخ

#### 5️⃣ **صفحه 404 (404.html)**
- طراحی خلاقانه
- پیشنهاد لینک‌های مفید
- دکمه‌های بازگشت

---

## 🛠️ تکنولوژی‌های استفاده شده

```
- HTML5
- CSS3 (با Flexbox و Grid)
- JavaScript (Vanilla JS)
- Font Awesome 6.4.0
- Google Fonts (Vazirmatn)
- LocalStorage API
```

---

## 📁 ساختار پروژه

```
kavian-mining-website/
│
├── index.html              # صفحه اصلی
├── auth.html               # احراز هویت
├── dashboard.html          # پنل کاربری
├── blog.html               # وبلاگ
├── 404.html                # صفحه خطا
│
├── assets/
│   ├── css/
│   │   └── style.css       # استایل‌های اصلی
│   │
│   ├── js/
│   │   ├── main.js         # اسکریپت اصلی
│   │   ├── auth.js         # مدیریت احراز هویت
│   │   └── dashboard.js    # مدیریت پنل
│   │
│   └── images/
│       └── logo.png
│
└── README.md               # مستندات
```

---

## 🚀 نحوه استفاده

### نصب و راه‌اندازی

1. **دانلود پروژه:**
```bash
git clone https://github.com/your-repo/kavian-mining.git
cd kavian-mining
```

2. **اجرای پروژه:**
- فایل `index.html` را در مرورگر باز کنید
- یا از یک Local Server استفاده کنید:
```bash
# با Python
python -m http.server 8000

# با Node.js
npx http-server
```

3. **دسترسی به وب‌سایت:**
```
http://localhost:8000
```

---

## 🔐 سیستم احراز هویت

### ورود
- ایمیل یا شماره موبایل
- رمز عبور
- Remember Me
- ورود با شبکه‌های اجتماعی

### ثبت‌نام
- نام و نام خانوادگی
- ایمیل
- شماره موبایل
- نوع کاربری
- رمز عبور (حداقل 8 کاراکتر)

### ذخیره‌سازی
اطلاعات کاربر در LocalStorage ذخیره می‌شود:
```javascript
{
  name: "نام کاربر",
  email: "user@example.com",
  phone: "09123456789",
  userType: "company",
  loginTime: "2024-01-15T10:30:00.000Z"
}
```

---

## 🎨 تم و رنگ‌بندی

```css
:root {
  --primary-color: #1e3c72;
  --secondary-color: #2a5298;
  --accent-color: #667eea;
  --text-dark: #2c3e50;
  --text-light: #666;
  --bg-light: #f5f7fa;
  --gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-2: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}
```

---

## 📱 Responsive Design

### Breakpoints:
- **Desktop:** > 1024px
- **Tablet:** 768px - 1024px
- **Mobile:** < 768px

---

## 🔧 قابلیت‌های JavaScript

### 1. مدیریت منو موبایل
```javascript
menuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});
```

### 2. Smooth Scroll
```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});
```

### 3. احراز هویت
```javascript
function handleLogin(event) {
    event.preventDefault();
    // Validation
    // API Call
    // LocalStorage
    // Redirect
}
```

### 4. فیلتر و جستجو
```javascript
function filterBlogs(category) {
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        }
    });
}
```

---

## 🌟 ویژگی‌های پیشرفته

### 1. Loading Screen
- نمایش هنگام بارگذاری صفحه
- انیمیشن Spinner
- Fade out پس از بارگذاری

### 2. Toast Notifications
- پیام‌های موفقیت/خطا
- Auto-hide پس از 5 ثانیه
- انیمیشن Slide Down

### 3. Scroll to Top
- نمایش پس از اسکرول 300px
- انیمیشن Smooth
- دکمه شناور

### 4. Sidebar Toggle
- Collapse/Expand
- ذخیره حالت در LocalStorage
- انیمیشن روان

---

## 🔒 امنیت

- ✅ اعتبارسنجی سمت کاربر
- ✅ Sanitization ورودی‌ها
- ✅ رمزنگاری رمز عبور (در نسخه Production)
- ✅ HTTPS (توصیه می‌شود)
- ✅ CSRF Protection (در Backend)

---

## 📊 بهینه‌سازی

### Performance
- ✅ Minify CSS/JS
- ✅ Image Optimization
- ✅ Lazy Loading
- ✅ CDN برای کتابخانه‌ها

### SEO
- ✅ Meta Tags
- ✅ Semantic HTML
- ✅ Alt Text برای تصاویر
- ✅ Sitemap.xml

---

## 🐛 رفع مشکلات رایج

### مشکل: منو موبایل کار نمی‌کند
```javascript
// بررسی کنید که ID های المان‌ها صحیح باشند
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
```

### مشکل: LocalStorage خالی است
```javascript
// پاک کردن LocalStorage
localStorage.clear();
// یا حذف یک آیتم خاص
localStorage.removeItem('kavianUser');
```

### مشکل: فونت فارسی نمایش داده نمی‌شود
```html
<!-- اطمینان از لود شدن فونت -->
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

---

## 🚧 توسعه‌های آینده

- [ ] پنل مدیریت
- [ ] سیستم پیام‌رسانی
- [ ] نمودارهای تعاملی
- [ ] آپلود فایل
- [ ] نسخه PWA
- [ ] Dark Mode
- [ ] چند زبانه
- [ ] API Integration

---

## 👥 مشارکت

برای مشارکت در پروژه:

1. Fork کنید
2. Branch جدید بسازید (`git checkout -b feature/AmazingFeature`)
3. تغییرات را Commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. Push کنید (`git push origin feature/AmazingFeature`)
5. Pull Request باز کنید

---

## 📝 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

---

## 📞 تماس با ما

- 🌐 وب‌سایت: www.kavian-mining.com
- 📧 ایمیل: info@kavian-mining.com
- 📱 تلفن: ۰۲۱-۸۸۸۸۸۸۸۸
- 💼 لینکدین: linkedin.com/company/kavian-mining

---

## 🙏 تشکر

از تمامی کسانی که در توسعه این پروژه مشارکت داشتند، صمیمانه تشکر می‌کنیم.

---

**ساخته شده با ❤️ توسط تیم کاویان توسعه معدن**