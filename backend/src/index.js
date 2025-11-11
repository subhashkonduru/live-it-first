require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const bookingRoutes = require('./routes/bookings');
const kycRoutes = require('./routes/kyc');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const meRoutes = require('./routes/me');
const invoicesRoutes = require('./routes/invoices');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// enable CORS for dev (allow frontend on different port to call API)
app.use(cors());

// static uploads (serve files saved to backend/uploads by multer)
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.FILE_UPLOAD_DIR || 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/me', meRoutes);
app.use('/api/invoices', invoicesRoutes);

app.get('/', (req, res) => res.json({ ok: true, name: 'live-it-first-backend' }));

async function start() {
  try {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/live-it-first';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
