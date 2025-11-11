const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const User = require('../models/User');
const PDFDocument = require('pdfkit');

// stream invoice PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id).populate('guest').lean();
    if (!inv) return res.status(404).json({ error: 'not_found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${inv._id}.pdf`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text('Invoice', { align: 'left' });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice ID: ${inv._id}`);
    doc.text(`Issued: ${new Date(inv.issuedAt).toLocaleString()}`);
    if (inv.guest) doc.text(`Guest: ${inv.guest.name || inv.guest.email}`);
    doc.moveDown();

    doc.text('Line items', { underline: true });
    doc.moveDown(0.5);
    const tableStartY = doc.y;
    (inv.lineItems || []).forEach(li => {
      doc.text(li.label, { continued: true });
      doc.text(`$${(Number(li.amount) || 0).toFixed(2)}`, { align: 'right' });
    });

    doc.moveDown();
    (inv.taxes || []).forEach(t => {
      doc.text(t.label, { continued: true });
      doc.text(`$${(Number(t.amount) || 0).toFixed(2)}`, { align: 'right' });
    });

    doc.moveDown();
    doc.text('Platform fee', { continued: true });
    doc.text(`$${(Number(inv.platformFee) || 0).toFixed(2)}`, { align: 'right' });

    doc.moveDown();
    doc.fontSize(14).text('Total', { continued: true });
    doc.text(`$${(Number(inv.total) || 0).toFixed(2)}`, { align: 'right' });

    doc.moveDown(2);
    doc.fontSize(10).text('Thank you for booking with us.', { align: 'center' });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
