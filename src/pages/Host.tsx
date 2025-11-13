import React, { useState, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { apiPost } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import HostSignInModal from '@/components/HostSignInModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Host = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState({ baseRate: '', cleaning: '', refundableDeposit: '', platformFeePct: '' });
  const [priceByDuration, setPriceByDuration] = useState<Array<{ minDays: number|null; maxDays: number|null; rate: string }>>([]);
  const [amenitiesText, setAmenitiesText] = useState('');
  // facilities as clickable chips
  const defaultFacilities = ['WiFi','TV','Air conditioning','Pool','Gym','Parking','Breakfast','Pet friendly','Elevator','Wheelchair access'];
  const [facilities, setFacilities] = useState<string[]>(defaultFacilities);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [newFacility, setNewFacility] = useState('');
  // availability ranges for bookings
  const [availability, setAvailability] = useState<Array<{ id: string; startDate: string; endDate: string; startTime?: string; endTime?: string; priceOverride?: string }>>([]);
  const [availDraft, setAvailDraft] = useState({ startDate: '', endDate: '', startTime: '', endTime: '', priceOverride: '' });
  const [editingAvailId, setEditingAvailId] = useState<string | null>(null);
  // billing model: per_night (default) or per_day
  const [billingModel, setBillingModel] = useState<'per_night' | 'per_day'>('per_night');
  const [minNights, setMinNights] = useState<number | ''>('');
  const [maxNights, setMaxNights] = useState<number | ''>('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

  // show a prominent modal for unauthenticated visitors
  const [showHostModal, setShowHostModal] = useState<boolean>(() => !token);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<Array<{ file: File; preview: string }>>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

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
  // amenities/facilities: prefer selectedFacilities, fallback to amenitiesText
  const amenitiesArr = (selectedFacilities && selectedFacilities.length) ? selectedFacilities : amenitiesText.split(',').map(s=>s.trim()).filter(Boolean);
  if (amenitiesArr.length) form.append('amenities', JSON.stringify(amenitiesArr));
  // availability JSON
  if (availability.length) form.append('availability', JSON.stringify(availability));
  // billing model and booking rules
  form.append('billingModel', billingModel);
  if (minNights !== '') form.append('minNights', String(minNights));
  if (maxNights !== '') form.append('maxNights', String(maxNights));
  if (capacity !== '') form.append('capacity', String(capacity));
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

  function toggleFacility(f:string) {
    setSelectedFacilities(prev => prev.includes(f) ? prev.filter(p=>p!==f) : [...prev, f]);
  }

  function addFacility() {
    const v = newFacility.trim();
    if (!v) return;
    setFacilities(prev => prev.includes(v) ? prev : [v, ...prev]);
    setSelectedFacilities(prev => prev.includes(v) ? prev : [v, ...prev]);
    setNewFacility('');
  }

  function addAvailability() {
    if (!availDraft.startDate || !availDraft.endDate) return;
    // validate date order
    if (new Date(availDraft.startDate) > new Date(availDraft.endDate)) return alert('Start date must be before end date');
    // if editing, replace
    if (editingAvailId) {
      setAvailability(prev => prev.map(a => a.id === editingAvailId ? ({ id: editingAvailId, ...availDraft }) : a));
      setEditingAvailId(null);
    } else {
      const id = String(Date.now()) + Math.random().toString(36).slice(2,6);
      setAvailability(prev => [...prev, { id, ...availDraft }]);
    }
    setAvailDraft({ startDate: '', endDate: '', startTime: '', endTime: '', priceOverride: '' });
  }

  function removeAvailability(id:string) {
    setAvailability(prev => prev.filter(a=>a.id!==id));
  }

  function editAvailability(id:string) {
    const a = availability.find(x=>x.id===id);
    if (!a) return;
    setAvailDraft({ startDate: a.startDate, endDate: a.endDate, startTime: a.startTime || '', endTime: a.endTime || '', priceOverride: a.priceOverride ? String(a.priceOverride) : '' });
    setEditingAvailId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
    
  return (
    <div className="min-h-screen host-background">
      <Navigation />
      <HostSignInModal open={showHostModal} onClose={() => setShowHostModal(false)} />

      <main className="container mx-auto px-6 py-16">
  <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Create a listing</h1>

        {!token ? (
          <div className="bg-card p-4 rounded mb-6">
            <p className="mb-2">You must be signed in to create a listing. Use the button below to open the host sign-in flow.</p>
            <div className="flex gap-2">
              <Button onClick={()=>setShowHostModal(true)} variant="premium">Sign in as host</Button>
              <Button onClick={()=>navigate('/register')} variant="outline">Create account</Button>
            </div>
          </div>
        ) : null}

    <div className="space-y-6">
              <Label className="mb-2">Media</Label>
              <div className="flex items-center gap-4">
                <input ref={fileRef} onChange={handleFilesChange} type="file" name="media" accept="image/*,video/*" multiple className="hidden" id="mediaInput" />
                {/* Make the whole drop area clickable and keyboard accessible */}
                <div
                  role="button"
                  tabIndex={0}
                  className="photo-drop"
                  onClick={() => fileRef.current?.click()}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileRef.current?.click(); } }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fs = Array.from(e.dataTransfer.files || []);
                    if (fs.length) {
                      const arr = fs.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
                      setSelected(prev => [...prev, ...arr]);
                    }
                  }}
                >
                  <label htmlFor="mediaInput" className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>Add photos & videos</Button>
                  </label>
                  <span className="text-sm text-muted-foreground">Up to 12 files.</span>
                </div>
              </div>

              {selected.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4" onDragOver={e=>e.preventDefault()} onDrop={(e)=>{
                  e.preventDefault();
                  // handle external files drop
                  const fs = Array.from(e.dataTransfer.files || []);
                  if (fs.length) {
                    const arr = fs.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
                    setSelected(prev => [...prev, ...arr]);
                  }
                }}>
                  {selected.map((s, i) => (
                    <div key={i}
                      draggable
                      onDragStart={(e)=>{ setDragIndex(i); e.dataTransfer.effectAllowed='move'; }}
                      onDragOver={(e)=>{ e.preventDefault(); }}
                      onDrop={(e)=>{
                        e.preventDefault();
                        if (dragIndex === null) return;
                        const to = i;
                        const copy = [...selected];
                        const [item] = copy.splice(dragIndex, 1);
                        copy.splice(to, 0, item);
                        setSelected(copy);
                        setDragIndex(null);
                      }}
                      className="relative rounded-xl overflow-hidden bg-muted">
                      <img src={s.preview} alt={`preview-${i}`} className="w-full h-36 object-cover" />
                      <div className="absolute inset-2 flex justify-between items-start">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => moveSelected(i, -1)}>◀</Button>
                          <Button size="sm" variant="ghost" onClick={() => moveSelected(i, 1)}>▶</Button>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => removeSelected(i)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          {/* Facilities (clickable chips) */}
          <div className="mt-6">
            <Label className="mb-3">Facilities</Label>
              <div className="flex flex-wrap gap-2">
              {facilities.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFacility(f)}
                  aria-pressed={selectedFacilities.includes(f)}
                  className={`chip ${selectedFacilities.includes(f) ? 'selected' : ''}`}
                >
                  {f}
                </button>
              ))}
              <div className="flex items-center gap-2 ml-2">
                <Input placeholder="Add facility" value={newFacility} onChange={e => setNewFacility(e.target.value)} className="w-48" />
                <Button size="sm" type="button" onClick={addFacility} variant="outline">Add</Button>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleCreate} className="grid gap-8 lg:grid-cols-3 lg:items-start">
          <section className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl frosted panel-surface card-appear host-form-surface">

            <div>
              <Label className="mb-2" style={{ color: 'hsl(var(--panel-foreground))' }}>Availability (set date windows when property is open)</Label>
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <Label>Start date</Label>
                  <Input type="date" value={availDraft.startDate} onChange={e=>setAvailDraft(d=>({...d, startDate: e.target.value}))} />
                </div>
                <div>
                  <Label>End date</Label>
                  <Input type="date" value={availDraft.endDate} onChange={e=>setAvailDraft(d=>({...d, endDate: e.target.value}))} />
                </div>
                <div>
                  <Label>Start time (optional)</Label>
                  <Input type="time" value={availDraft.startTime} onChange={e=>setAvailDraft(d=>({...d, startTime: e.target.value}))} />
                </div>
                <div>
                  <Label>End time (optional)</Label>
                  <Input type="time" value={availDraft.endTime} onChange={e=>setAvailDraft(d=>({...d, endTime: e.target.value}))} />
                </div>
                <div className="col-span-2">
                  <Label>Price override (optional)</Label>
                  <Input placeholder="e.g. 120" value={availDraft.priceOverride} onChange={e=>setAvailDraft(d=>({...d, priceOverride: e.target.value}))} />
                </div>
                <div className="col-span-2 flex gap-2">
                  <Button type="button" className="btn-cta" variant="gold" onClick={addAvailability}>Add availability window</Button>
                </div>
              </div>

              {availability.length > 0 && (
                <div className="mt-4 space-y-2">
                  {availability.map(a=> (
                    <div key={a.id} className="flex items-center justify-between gap-2 bg-muted rounded-md p-2">
                      <div>
                        <div className="text-sm font-medium">{a.startDate} → {a.endDate}</div>
                        <div className="text-xs text-muted-foreground">{a.startTime || 'any'} → {a.endTime || 'any'} {a.priceOverride ? `• ${a.priceOverride}` : ''}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={()=>removeAvailability(a.id)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
          </section>

          {/* Right: pricing and publish */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="p-5 rounded-2xl frosted panel-surface">
                <h3 className="text-lg font-semibold mb-3">Pricing</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label>Base rate (per night)</Label>
                    <Input placeholder=" " value={price.baseRate} onChange={e=>setPrice(p=>({...p, baseRate:e.target.value}))} className="mt-2" />
                  </div>
                  <div>
                    <Label>Cleaning</Label>
                    <Input placeholder=" " value={price.cleaning} onChange={e=>setPrice(p=>({...p, cleaning:e.target.value}))} className="mt-2" />
                  </div>
                  <div>
                    <Label>Deposit</Label>
                    <Input placeholder=" " value={price.refundableDeposit} onChange={e=>setPrice(p=>({...p, refundableDeposit:e.target.value}))} className="mt-2" />
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Billing & advanced rules</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <div className="flex gap-2 items-center">
                        <label className={`px-3 py-1 rounded-md cursor-pointer ${billingModel==='per_night' ? 'bg-muted' : 'bg-transparent'}`}>
                          <input type="radio" name="billingModel" className="mr-2" checked={billingModel==='per_night'} onChange={()=>setBillingModel('per_night')} /> Per night
                        </label>
                        <label className={`px-3 py-1 rounded-md cursor-pointer ${billingModel==='per_day' ? 'bg-muted' : 'bg-transparent'}`}>
                          <input type="radio" name="billingModel" className="mr-2" checked={billingModel==='per_day'} onChange={()=>setBillingModel('per_day')} /> Per day
                        </label>
                      </div>
                    </div>
                    <div>
                      <Label>Min nights</Label>
                      <Input type="number" value={minNights} onChange={e=>setMinNights(e.target.value ? Number(e.target.value) : '')} className="mt-2" />
                    </div>
                    <div>
                      <Label>Max nights</Label>
                      <Input type="number" value={maxNights} onChange={e=>setMaxNights(e.target.value ? Number(e.target.value) : '')} className="mt-2" />
                    </div>
                    <div>
                      <Label>Capacity (guests)</Label>
                      <Input type="number" value={capacity} onChange={e=>setCapacity(e.target.value ? Number(e.target.value) : '')} className="mt-2" />
                    </div>
                  </div>

                  <Label className="mt-4">Price by duration (optional)</Label>
                  <div className="space-y-2 mt-2">
                    {priceByDuration.map((p, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input type="number" placeholder="min" value={p.minDays ?? ''} onChange={e=>{ const v=e.target.value?Number(e.target.value):null; setPriceByDuration(arr=>{ const c=[...arr]; c[idx].minDays=v; return c; }); }} className="w-24" />
                        <Input type="number" placeholder="max" value={p.maxDays ?? ''} onChange={e=>{ const v=e.target.value?Number(e.target.value):null; setPriceByDuration(arr=>{ const c=[...arr]; c[idx].maxDays=v; return c; }); }} className="w-24" />
                        <Input placeholder="rate" value={p.rate} onChange={e=>setPriceByDuration(arr=>{ const c=[...arr]; c[idx].rate=e.target.value; return c; })} className="flex-1" />
                        <Button size="sm" variant="ghost" onClick={()=>setPriceByDuration(arr=>arr.filter((_,i)=>i!==idx))}>Remove</Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={()=>setPriceByDuration(arr=>[...arr,{ minDays:null, maxDays:null, rate: '' }])}>Add tier</Button>
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Platform fee %</Label>
                  <Input placeholder="0.1" value={price.platformFeePct} onChange={e=>setPrice(p=>({...p, platformFeePct:e.target.value}))} className="mt-2" />
                </div>
              </div>

              <div className="p-5 rounded-2xl frosted flex flex-col gap-3">
                <div>
                  <h4 className="text-sm text-muted-foreground">Preview & publish</h4>
                  <p className="text-xs text-muted-foreground">Review your listing before publishing. You can always edit it later.</p>
                </div>
                <Button type="submit" variant="gold" disabled={submitting}>{submitting ? 'Creating…' : 'Publish listing'}</Button>
                <Button type="button" variant="ghost" onClick={()=>window.confirm('Discard changes?') && navigate('/')}>Cancel</Button>
              </div>
            </div>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Host;
