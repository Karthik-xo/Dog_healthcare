const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    time: { type: String, default: 'Just now' },
    iconType: { type: String, default: 'Activity' },
    color: { type: String, default: 'text-red-500' },
    bg: { type: String, default: 'bg-red-50' }
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);
