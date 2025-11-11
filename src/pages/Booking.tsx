import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useParams } from 'react-router-dom';
import { apiPost, apiGet } from '@/lib/api';
import InvoiceCard from '@/components/InvoiceCard';

// Booking page: improved layout with booking summary, invoice card and Stripe placeholder

const Booking = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<any|null>(null);
  const [guestId, setGuestId] = useState(localStorage.getItem('guestId') || '');
  const [status, setStatus] = useState<string | null>(null);
  const [step, setStep] = useState<'review'|'payment'|'confirmation'>('review');
  const [bookingObj, setBookingObj] = useState<any|null>(null);
  const [invoiceObj, setInvoiceObj] = useState<any|null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiGet(`/api/properties/${id}`).then(setProperty).catch(()=>{});
  }, [id]);

  async function handleBook() {
    try {
      const payload = { property: id, guest: guestId || undefined, checkIn, checkOut, durationDays };
      const res = await apiPost('/api/bookings', payload);
      setBookingObj(res.booking || null);
      setInvoiceObj(res.invoice || null);
      setClientSecret(res.clientSecret || null);
      setPaymentIntentId(res.paymentIntentId || null);
      setStatus('Booking created');
      setStep('payment');
      if (guestId) localStorage.setItem('guestId', guestId);
    } catch (err:any) {
      setStatus('Error: ' + (err.message || String(err)));
    }
  }

  const [checkIn, setCheckIn] = useState<string>(new Date().toISOString().slice(0,10));
  const [checkOut, setCheckOut] = useState<string>(new Date(Date.now()+3*24*3600*1000).toISOString().slice(0,10));
  const [durationDays, setDurationDays] = useState<number>(3);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-4">Booking</h1>
        {!property ? (
          <p>Loading…</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2">
              <p className="text-muted-foreground mb-4">Booking a 3-day sample stay at: <strong>{property.title}</strong></p>

              <div className="bg-card p-4 rounded mb-4">
                <h2 className="font-semibold mb-2">Guest & Dates</h2>
                <label className="block mb-2">Guest ID (leave empty for anonymous)</label>
                <input value={guestId} onChange={e=>setGuestId(e.target.value)} placeholder="guest@example.com or user id" className="input mb-2 w-full" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="text-sm text-muted-foreground">Check-in</label>
                    <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} className="input w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Check-out</label>
                    <input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} className="input w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Duration (days)</label>
                    <input type="number" min={1} max={30} value={durationDays} onChange={e=>setDurationDays(Number(e.target.value))} className="input w-full" />
                  </div>
                  <div className="flex gap-2 items-end">
                    <button onClick={handleBook} className="btn btn-primary w-full">Create booking</button>
                    <button onClick={()=>{ setGuestId(''); localStorage.removeItem('guestId'); }} className="btn w-full">Clear</button>
                  </div>
                </div>

                {status && <p className="mt-3 text-sm">{status}</p>}
              </div>

              {bookingObj && (
                <div className="bg-card p-4 rounded">
                  <h3 className="font-semibold mb-2">Booking Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Check-in</div>
                      <div>{new Date(bookingObj.checkIn).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Check-out</div>
                      <div>{new Date(bookingObj.checkOut).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Duration</div>
                      <div>{bookingObj.durationDays} days</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Status</div>
                      <div className="font-medium"><span className={`px-2 py-1 rounded text-sm ${bookingObj.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>{bookingObj.status}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {step === 'review' && (
                <div className="mt-6 bg-muted p-4 rounded">
                  <h4 className="font-semibold mb-2">Next</h4>
                  <p className="text-sm text-muted-foreground mb-3">Create a booking to preview your invoice and complete payment.</p>
                </div>
              )}

              {step === 'payment' && (
                <div className="mt-6 bg-muted p-4 rounded">
                  <h4 className="font-semibold mb-2">Payment</h4>
                  <p className="text-sm text-muted-foreground mb-3">This area will host Stripe Elements for card entry when a publishable key is configured. Use the invoice pay buttons to simulate payment now.</p>
                  <div className="h-40 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground">Stripe Elements placeholder</div>
                </div>
              )}

              {step === 'confirmation' && bookingObj && (
                <div className="mt-6 bg-emerald-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Booking confirmed</h4>
                  <p className="text-sm">Your booking <strong>{bookingObj._id}</strong> is confirmed. Check your email for details (email sending not yet implemented).</p>
                </div>
              )}
            </section>

            <aside className="lg:col-span-1 lg:sticky lg:top-24">
              <InvoiceCard
                invoice={invoiceObj}
                onPay={async ({ simulate }:{ simulate?:boolean }) => {
                  try {
                    setStatus('Processing payment...');
                    const path = `/api/bookings/${bookingObj._id}/pay`;
                    const resp = await apiPost(path, { simulate: !!simulate });
                    setStatus(simulate ? 'Payment simulated' : 'Payment attempted');
                    setInvoiceObj(resp.invoice || invoiceObj);
                    setBookingObj(resp.booking || bookingObj);
                    if (resp.invoice && resp.invoice.paid) setStep('confirmation');
                  } catch (err:any) {
                    setStatus('Payment error: ' + (err.message||String(err)));
                  }
                }}
              />
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
