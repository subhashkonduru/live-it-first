const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: String,
  size: String,
  amenities: [String]
});

const PropertySchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, index: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  media: [{ type: String }],
  heroVideo: { type: String },
  description: String,
  sensory: {
    lightQuality: String,
    noiseLevel: String,
    commuteTimes: String,
    seasonalNotes: String
  },
  amenities: [String],
  // allow hosts to set pricing tiers depending on number of days
  priceByDuration: [{ minDays: Number, maxDays: Number, rate: Number }],
  // availability windows for bookings
  availability: [{
    startDate: String,
    endDate: String,
    startTime: String,
    endTime: String,
    priceOverride: Number
  }],
  rooms: [RoomSchema],
  price: {
    baseRate: Number,
    cleaning: Number,
    refundableDeposit: Number,
    platformFeePct: Number
  },
  // billing and booking rules
  billingModel: { type: String, enum: ['per_night','per_day'], default: 'per_night' },
  minNights: { type: Number },
  maxNights: { type: Number },
  capacity: { type: Number },
  // per-weekday pricing overrides { monday: Number, tuesday: Number, ... }
  weekdayPricing: { type: Map, of: Number },
  // per-room or per-guest pricing can be added here as nested structures
  available: { type: Boolean, default: true },
  itineraryTemplate: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', PropertySchema);
