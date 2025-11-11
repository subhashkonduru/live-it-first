import React, { useState, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { apiPost } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import HostSignInModal from '@/components/HostSignInModal';

const Host = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState({ baseRate: '', cleaning: '', refundableDeposit: '', platformFeePct: '' });
  const [priceByDuration, setPriceByDuration] = useState<Array<{ minDays: number|null; maxDays: number|null; rate: string }>>([]);
  const [amenitiesText, setAmenitiesText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

  // show a prominent modal for unauthenticated visitors
  const [showHostModal, setShowHostModal] = useState<boolean>(() => !token);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<Array<{ file: File; preview: string }>>([]);

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const arr = Array.from(files).map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setSelected(prev => [...prev, ...arr]);
  }

  function moveSelected(index:number, dir:number) {
    setSelected(prev => {
      const copy = [...prev];
      const to = index + dir;
      if (to < 0 || to >= copy.length) return copy;
      const [item] = copy.splice(index, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  }

  function removeSelected(index:number) {
    setSelected(prev => {
      const copy = [...prev];
      // revoke object url
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index,1);
      return copy;
    });
  }

  async function handleCreate(e:any) {
    e.preventDefault();
    if (!token) {
      // require sign in
      alert('You must be signed in as a host to create a listing. Please sign in or register.');
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      // price as JSON string
      form.append('price', JSON.stringify({
        baseRate: Number(price.baseRate || 0),
        cleaning: Number(price.cleaning || 0),
        refundableDeposit: Number(price.refundableDeposit || 0),
        platformFeePct: Number(price.platformFeePct || 0)
      }));
      if (priceByDuration.length) form.append('priceByDuration', JSON.stringify(priceByDuration.map(p => ({ minDays: p.minDays || 0, maxDays: p.maxDays || 0, rate: Number(p.rate || 0) }))));
      // amenities as an array parsed from comma-separated input
      const amenitiesArr = amenitiesText.split(',').map(s=>s.trim()).filter(Boolean);
      if (amenitiesArr.length) form.append('amenities', JSON.stringify(amenitiesArr));
      // append selected files in order
      for (let i = 0; i < selected.length; i++) {
        form.append('media', selected[i].file);
      }
      const res = await apiPost('/api/properties', form, { isForm: true });
      // redirect to listing
      navigate(`/listing/${res._id}`);
    } catch (err) {
      console.error(err);
    } finally { setSubmitting(false); }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <HostSignInModal open={showHostModal} onClose={() => setShowHostModal(false)} />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-4">Become a Host</h1>
        {!token ? (
          <div className="bg-card p-4 rounded mb-6">
            <p className="mb-2">You must be signed in to create a listing. Use the button below to open the host sign-in flow.</p>
            <div className="flex gap-2">
              <button onClick={()=>setShowHostModal(true)} className="btn btn-primary">Sign in as host</button>
              <button onClick={()=>navigate('/register')} className="btn">Create account</button>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleCreate} className="space-y-4 max-w-xl">
          <div>
            <label className="block mb-1">Title</label>
            <input className="input w-full" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea className="input w-full" value={description} onChange={e=>setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1">Base price (per night)</label>
            <div className="flex gap-2">
              <input className="input" placeholder="Base rate" value={price.baseRate} onChange={e=>setPrice(p=>({...p, baseRate:e.target.value}))} />
              <input className="input" placeholder="Cleaning" value={price.cleaning} onChange={e=>setPrice(p=>({...p, cleaning:e.target.value}))} />
              <input className="input" placeholder="Refundable deposit" value={price.refundableDeposit} onChange={e=>setPrice(p=>({...p, refundableDeposit:e.target.value}))} />
              <input className="input" placeholder="Platform % (0.1)" value={price.platformFeePct} onChange={e=>setPrice(p=>({...p, platformFeePct:e.target.value}))} />
            </div>
          </div>

          <div>
            <label className="block mb-1">Price by duration (optional)</label>
            <div className="space-y-2">
              {priceByDuration.map((p, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className="input w-24" type="number" placeholder="min days" value={p.minDays ?? ''} onChange={e=>{
                    const v = e.target.value ? Number(e.target.value) : null; setPriceByDuration(arr=>{ const c=[...arr]; c[idx].minDays=v; return c; });
                  }} />
                  <input className="input w-24" type="number" placeholder="max days" value={p.maxDays ?? ''} onChange={e=>{ const v=e.target.value?Number(e.target.value):null; setPriceByDuration(arr=>{ const c=[...arr]; c[idx].maxDays=v; return c; }); }} />
                  <input className="input" placeholder="rate" value={p.rate} onChange={e=>setPriceByDuration(arr=>{ const c=[...arr]; c[idx].rate=e.target.value; return c; })} />
                  <button type="button" className="btn btn-ghost" onClick={()=>setPriceByDuration(arr=>arr.filter((_,i)=>i!==idx))}>Remove</button>
                </div>
              ))}
              <button type="button" className="btn" onClick={()=>setPriceByDuration(arr=>[...arr,{ minDays:null, maxDays:null, rate: '' }])}>Add tier</button>
            </div>
          </div>

          <div>
            <label className="block mb-1">Facilities / Amenities (comma separated)</label>
            <input className="input w-full" value={amenitiesText} onChange={e=>setAmenitiesText(e.target.value)} placeholder="WiFi,TV,Air conditioning" />
          </div>
          <div>
            <label className="block mb-1">Media (optional)</label>
            <input ref={fileRef} onChange={handleFilesChange} type="file" name="media" multiple className="mb-3" />

            {selected.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {selected.map((s, i) => (
                  <div key={i} className="relative bg-muted rounded overflow-hidden">
                    <img src={s.preview} alt={`preview-${i}`} className="w-full h-28 object-cover" />
                    <div className="absolute top-1 right-1 flex gap-1">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => moveSelected(i, -1)} aria-label="move left">◀</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => moveSelected(i, 1)} aria-label="move right">▶</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeSelected(i)} aria-label="remove">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create Listing'}</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Host;
