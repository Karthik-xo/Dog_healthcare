const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @desc    Verify route health
router.get('/verify', (req, res) => {
    res.json({ success: true, message: 'Contact API is healthy and reachable' });
});

// @route   POST api/contact
// @desc    Submit a contact form
// @access  Public
router.post('/', async (req, res) => {
    console.log('Received submission request for:', req.body.email);
    try {
        const { name, mobile, email, message } = req.body;

        if (!name || !email || !message) {
            console.warn('Submission blocked: Missing required fields');
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const newContact = new Contact({
            name,
            mobile,
            email,
            message
        });

        const contact = await newContact.save();
        console.log('✅ Contact persisted successfully to DB');
        res.json({ success: true, contact });
    } catch (err) {
        console.error('CRITICAL DATABASE ERROR:', err.message);
        res.status(500).json({ success: false, message: 'Database Persistence Error', error: err.message });
    }
});

module.exports = router;
