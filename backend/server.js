const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Database Connection
const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;

        // If connecting to the default local port but local MongoDB isn't running, this will provide an instant robust alternative!
        if (!uri || uri.includes('localhost')) {
            console.log('⚡ Booting up another server connection (Instant Memory DB) for fast loading...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        } else {
            console.log('Attempting to connect to MongoDB Atlas...');
        }

        await mongoose.connect(uri, {
            // Fast fail after 5s instead of hanging for 30s
            serverSelectionTimeoutMS: 5000,
            family: 4 // Use IPv4
        });
        console.log('✅ MongoDB Connected Successfully to', uri.includes('localhost') ? 'Memory DB' : 'Atlas');

        // Seed default admin if not exists
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('JimmieAdmin@2026', salt);
            await User.create({
                username: 'admin',
                fullName: 'Medical Administrator',
                email: 'admin@jimmiehealthcare.com',
                password: hashedPassword,
                role: 'admin',
                bio: 'Professional Veterinary Administrator',
                location: 'San Francisco, CA'
            });
            console.log('👤 Default admin user created');
        }
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.error('If you are using MongoDB Atlas, ensure your IP is whitelisted and credentials are correct in backend/.env');
    }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/alerts', require('./routes/alerts'));

// Image Upload Endpoint
app.post('/api/upload', auth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return relative path instead of absolute URL to avoid localhost issues
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// Error Handler for Multer and other errors
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload Error: ${err.message}` });
    }
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ message: 'Internal Server Error', detail: err.message });
});

// Basic Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Dog Healthcare API is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
