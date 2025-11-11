const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  // guest may be optional for anonymous or trial bookings
  guest: { type: Schema.Types.ObjectId, ref: 'User' },
  checkIn: Date,
  checkOut: Date,
  durationDays: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled'], default: 'pending' },
  signedAgreementId: { type: String },
  paymentRecord: { type: Schema.Types.Mixed },
  depositStatus: { type: String, enum: ['held', 'released', 'disputed'], default: 'held' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
