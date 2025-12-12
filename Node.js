// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// تنظیمات ایمیل
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { fullname, email, phone, company, service, description } = req.body;
        
        // ارسال ایمیل
        await transporter.sendMail({
            from: email,
            to: 'info@kdmine.com',
            subject: `درخواست مشاوره جدید از ${fullname}`,
            html: `
                <h2>درخواست مشاوره جدید</h2>
                <p><strong>نام:</strong> ${fullname}</p>
                <p><strong>شرکت:</strong> ${company}</p>
                <p><strong>تلفن:</strong> ${phone}</p>
                <p><strong>ایمیل:</strong> ${email}</p>
                <p><strong>نوع خدمت:</strong> ${service}</p>
                <p><strong>توضیحات:</strong></p>
                <p>${description}</p>
            `
        });
        
        res.json({ success: true, message: 'ایمیل ارسال شد' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
