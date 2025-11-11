import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { apiGet, apiPost } from '@/lib/api';
import InvoiceCard from '@/components/InvoiceCard';

const BookingDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any|null>(null);
  const [invoice, setInvoice] = useState<any|null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    apiGet(`/api/bookings/${id}`).then(data => {
      if (cancelled) return;
      setBooking(data.booking || null);
      setInvoice(data.invoice || null);
    }).catch(()=>{}).finally(()=>{ if(!cancelled) setLoading(false); });
    return ()=>{ cancelled = true };
  }, [id]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-4">Booking details</h1>
        {loading ? <p>Loading…</p> : !booking ? <p>Not found</p> : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-card p-4 rounded">
              <h2 className="font-semibold">{booking.property?.title}</h2>
              <p className="text-sm text-muted-foreground">{new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}</p>
              <div className="mt-4">
                <p><strong>Guest:</strong> {booking.guest || 'Anonymous'} </p>
                <p><strong>Status:</strong> {booking.status}</p>
                <p className="mt-2">Booking ID: {booking._id}</p>
              </div>
            </section>

            <aside>
              <InvoiceCard invoice={invoice} onPay={async ({ simulate }:{ simulate?:boolean }) => {
                try {
                  const resp = await apiPost(`/api/bookings/${booking._id}/pay`, { simulate: !!simulate });
                  setInvoice(resp.invoice || invoice);
                } catch (err) { console.error(err); }
              }} />
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetail;
