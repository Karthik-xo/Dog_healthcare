const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get current user's profile
router.get('/', auth, async (req, res) => {
    try {
        console.log('Fetching profile for user ID:', req.user.id);
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update profile details
router.put('/', auth, async (req, res) => {
    const { fullName, username, email, phone, bio, location, profilePic } = req.body;

    // Build profile object — using name for display but keeping username for login
    const profileFields = {};
    if (fullName) profileFields.fullName = fullName;
    if (username) profileFields.username = username;
    if (email) profileFields.email = email;
    if (phone) profileFields.phone = phone;
    if (bio) profileFields.bio = bio;
    if (location) profileFields.location = location;
    if (profilePic) profileFields.profilePic = profilePic;

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
