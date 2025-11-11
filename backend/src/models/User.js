const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  kyc: {
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    documents: [{ type: String }]
  },
  role: { type: String, enum: ['guest', 'host', 'admin'], default: 'guest' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
