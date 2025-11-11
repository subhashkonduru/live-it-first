const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
  guest: { type: Schema.Types.ObjectId, ref: 'User' },
  lineItems: [{ label: String, amount: Number }],
  taxes: [{ label: String, amount: Number }],
  platformFee: Number,
  total: Number,
  currency: { type: String, default: 'USD' },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date },
  issuedAt: { type: Date, default: Date.now },
  pdfPath: String
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
