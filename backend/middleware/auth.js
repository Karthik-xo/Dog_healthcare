const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Mock Token Bypass for Google Login Demo
    if (token === 'mock-google-token') {
        try {
            const demoUser = await User.findOne({ username: 'admin' });
            if (demoUser) {
                req.user = { id: demoUser._id, role: demoUser.role };
                return next();
            }
        } catch (err) {
            console.error('Mock auth error:', err);
        }
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
