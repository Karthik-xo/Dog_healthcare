const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: String },
    gender: { type: String, enum: ['Male', 'Female'], default: 'Male' },
    weight: { type: String },
    status: { type: String, default: 'Healthy' },
    image: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);
