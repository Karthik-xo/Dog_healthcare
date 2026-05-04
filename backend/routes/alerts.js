const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// @route   GET api/alerts
// @desc    Get live alerts
router.get('/', async (req, res) => {
    try {
        let alerts = await Alert.find().sort({ createdAt: -1 }).limit(10);
        
        // Seed default alerts if none exist
        if (alerts.length === 0) {
            return res.json([
                { id: 1, title: 'Vaccine Due Tomorrow', desc: 'Brutus needs his Parvovirus booster at 10 AM.', time: '2 hours ago', iconType: 'Activity', color: 'text-red-500', bg: 'bg-red-50' },
                { id: 2, title: 'Security Login Detected', desc: 'New login verified from Bangalore, India.', time: '5 hours ago', iconType: 'ShieldCheck', color: 'text-blue-500', bg: 'bg-blue-50' },
                { id: 3, title: 'New Message from Dr. Jenkins', desc: 'Review Max\'s latest bloodwork results.', time: '1 day ago', iconType: 'Mail', color: 'text-green-500', bg: 'bg-green-50' },
                { id: 4, title: 'Medical Profile Update', desc: 'Charlie\'s dental profile was updated.', time: '2 days ago', iconType: 'Info', color: 'text-orange-500', bg: 'bg-orange-50' },
            ]);
        }
        res.json(alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
