import React from 'react';

interface LineItem { label: string; amount: number }

interface InvoiceCardProps {
  invoice: any;
  onPay?: (opts?: { simulate?: boolean }) => Promise<void> | void;
}

export const InvoiceCard = ({ invoice, onPay }: InvoiceCardProps) => {
  if (!invoice) return null;

  const paid = !!invoice.paid;
  const [downloading, setDownloading] = React.useState(false);
  const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: invoice.currency || 'USD' });
  const shortId = String(invoice._id || '').slice(0,8);

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(String(invoice._id || ''));
      alert('Invoice id copied');
    } catch (e) {
      console.error('copy failed', e);
    }
  }

  async function handleDownload() {
    if (!invoice || !invoice._id) return;
    try {
      setDownloading(true);
      const token = localStorage.getItem('token');
      const base = (window as any).__API_BASE__ || (import.meta as any).env.VITE_API_BASE || 'http://localhost:4000';
      const res = await fetch(`${base}/api/invoices/${invoice._id}/pdf`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('download_failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('download error', err);
      alert('Failed to download invoice PDF');
    } finally {
      setDownloading(false);
    }
  }
  return (
    <div className="bg-card p-4 rounded shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Invoice</div>
          <div className="text-lg font-semibold">{shortId}</div>
          <div className="text-xs text-muted-foreground">Issued: {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : '—'}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopyId} title="Copy invoice id" className="text-sm text-muted-foreground underline">Copy id</button>
          <div className={`px-2 py-1 rounded text-sm ${paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {paid ? 'Paid' : (invoice.status || 'Pending')}
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {Array.isArray(invoice.lineItems) && invoice.lineItems.map((l:LineItem, i:number) => (
          <li key={i} className="flex justify-between">
            <span className="text-sm">{l.label}</span>
            <span className="font-medium">{fmt.format(Number(l.amount || 0))}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex justify-between text-sm text-muted-foreground">
        <span>Platform fee</span>
        <span>{fmt.format(Number(invoice.platformFee || 0))}</span>
      </div>

      <div className="mt-2 flex justify-between text-base font-semibold">
        <span>Total</span>
        <span>{fmt.format(Number(invoice.total || 0))}</span>
      </div>

      <div className="mt-4">
        {!paid ? (
          <div className="space-y-2">
            <button
              onClick={() => onPay && onPay({ simulate: true })}
              className="btn btn-primary w-full"
            >
              Pay (simulate)
            </button>
            <button
              onClick={() => onPay && onPay({ simulate: false })}
              className="btn w-full"
            >
              Attempt real payment
            </button>
            <button onClick={handleDownload} disabled={downloading} className="btn w-full">
              {downloading ? 'Downloading…' : 'Download invoice (PDF)'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Paid on: {invoice.paidAt ? new Date(invoice.paidAt).toLocaleString() : '—'}</div>
            <button onClick={handleDownload} disabled={downloading} className="btn w-full">
              {downloading ? 'Downloading…' : 'Download invoice (PDF)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceCard;
