/**
 * Contact Routes
 */

const express = require('express');
const router = express.Router();
const {
    sendContactForm,
    requestConsultation,
} = require('../controllers/contact.controller');

// @route   POST /api/v1/contact/send
router.post('/send', sendContactForm);

// @route   POST /api/v1/contact/consultation
router.post('/consultation', requestConsultation);

module.exports = router;