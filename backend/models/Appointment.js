const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    petName: { type: String, required: true },
    doctor: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String },
    status: { type: String, enum: ['Pending', 'Upcoming', 'Completed', 'Finished'], default: 'Pending' },
    fee: { type: String, default: '₹0.00' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
