
This folder contains a minimal Node/Express backend scaffold to boot the Live It First prototype locally.

Features included:

- Express server with route stubs for auth, properties, bookings, KYC, and payments.
- MongoDB models (User, Property, Booking, Invoice) using Mongoose.
- Local file upload handling (multer) with a static `/uploads` directory.
- Placeholder Stripe payment intent endpoint and webhook stub.

Quick start

1. Copy `.env.example` to `.env` and adjust values (Mongo URI, JWT secret, upload dir)

2. Install deps and run

```powershell
cd backend
npm install
npm run dev
```

Notes & next steps

- This is a scaffold and intentionally lightweight. Production needs:
  - Secure JWT handling, password reset flows, email verification.
  - Integration with a real KYC provider (Sumsub, Onfido).
  - Use S3/Cloud storage for media, not local uploads.
  - Stripe Connect implementation for split payouts and platform fee handling.
  - Document signing provider integration (DocuSign/HelloSign) for agreements.
