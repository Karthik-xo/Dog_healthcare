const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'worker', 'supervisor'],
        default: 'user'
    },
    phone: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    profilePic: {
        type: String,
        default: 'https://images.unsplash.com/photo-1612349317150-141366ef5085?q=80&w=300&auto=format&fit=crop'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
