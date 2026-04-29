import { useState, useRef } from 'react';
import { useProfileStore } from '../../store/profileStore';
import { FileText, Download, Printer, Plus, Trash2 } from 'lucide-react';

export default function InvoiceGenerator() {
  const profile = useProfileStore();
  const printRef = useRef();

  const [invoice, setInvoice] = useState({
    number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientName: '',
    clientAddress: '',
    notes: 'Thank you for your business.',
    items: [
      { id: '1', description: 'Web Development Services', quantity: 1, rate: 500, amount: 500 }
    ],
    taxRate: 0
  });

  const updateInvoice = (field, value) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const updateItem = (id, field, value) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.amount = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.rate) || 0);
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const removeItem = (id) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: profile.currency || 'USD'
    }).format(amount);
  };

  const handlePrint = () => {
    // In a real app we might use react-to-print or jsPDF
    // For this MVP, we'll use native window.print() but hide the rest of the UI via CSS print media query
    window.print();
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-2 shrink-0 print:hidden">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="w-8 h-8 text-indigo-500" /> Invoice Generator
        </h1>
        <p className="text-muted-foreground">
          Create, preview, and print professional invoices.
        </p>
      </div>

      <div className="flex justify-end gap-3 shrink-0 print:hidden">
        <button 
          onClick={handlePrint}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Editor (Hidden on Print) */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 overflow-y-auto print:hidden space-y-6">
          <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">Invoice Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Invoice Number</label>
              <input type="text" value={invoice.number} onChange={(e) => updateInvoice('number', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Tax Rate (%)</label>
              <input type="number" min="0" max="100" value={invoice.taxRate} onChange={(e) => updateInvoice('taxRate', parseFloat(e.target.value) || 0)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Date</label>
              <input type="date" value={invoice.date} onChange={(e) => updateInvoice('date', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Due Date</label>
              <input type="date" value={invoice.dueDate} onChange={(e) => updateInvoice('dueDate', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">Client Information</h3>
            <div className="space-y-1">
              <input type="text" placeholder="Client Name or Company" value={invoice.clientName} onChange={(e) => updateInvoice('clientName', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-1">
              <textarea placeholder="Client Address & Contact Info" value={invoice.clientAddress} onChange={(e) => updateInvoice('clientAddress', e.target.value)} className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">Line Items</h3>
              <button onClick={addItem} className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {invoice.items.map((item, i) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-2 items-start bg-secondary/30 p-3 rounded-lg border border-border">
                  <div className="flex-1 w-full space-y-1">
                    <label className="text-[10px] uppercase text-muted-foreground font-semibold">Description</label>
                    <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full h-8 rounded border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Item description" />
                  </div>
                  <div className="w-full md:w-24 space-y-1">
                    <label className="text-[10px] uppercase text-muted-foreground font-semibold">Qty</label>
                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))} className="w-full h-8 rounded border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                  </div>
                  <div className="w-full md:w-32 space-y-1">
                    <label className="text-[10px] uppercase text-muted-foreground font-semibold">Rate ({profile.currency})</label>
                    <input type="number" min="0" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value))} className="w-full h-8 rounded border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                  </div>
                  <button onClick={() => removeItem(item.id)} className="mt-5 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors self-end md:self-auto">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">Notes</h3>
            <textarea value={invoice.notes} onChange={(e) => updateInvoice('notes', e.target.value)} className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" placeholder="Payment terms, thank you message, etc." />
          </div>
        </div>

        {/* Preview (Printed Area) */}
        <div className="bg-white text-black rounded-xl shadow-lg overflow-y-auto print:absolute print:inset-0 print:block print:w-full print:h-full print:shadow-none print:bg-white print:z-50 print:p-0">
          <div className="p-8 sm:p-12 min-h-[842px] w-full max-w-[794px] mx-auto flex flex-col" ref={printRef}>
            
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">INVOICE</h1>
                <p className="text-slate-500 text-sm font-medium">#{invoice.number}</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
                <p className="text-slate-500 text-sm mt-1">Freelance Developer</p>
                {/* Could add user address here if it was in profileStore */}
              </div>
            </div>

            {/* Billing Info */}
            <div className="flex justify-between items-start mb-10">
              <div className="w-1/2 pr-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</p>
                <h3 className="text-base font-bold text-slate-800">{invoice.clientName || 'Client Name'}</h3>
                <p className="text-slate-600 text-sm mt-1 whitespace-pre-wrap">{invoice.clientAddress || 'Client Address\nCity, Country'}</p>
              </div>
              <div className="w-1/2 text-right">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-slate-500 font-medium">Invoice Date:</div>
                  <div className="text-slate-800 font-semibold">{new Date(invoice.date).toLocaleDateString()}</div>
                  <div className="text-slate-500 font-medium">Due Date:</div>
                  <div className="text-slate-800 font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                  <div className="text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100">Amount Due:</div>
                  <div className="text-slate-800 font-bold text-lg mt-2 pt-2 border-t border-slate-100">{formatCurrency(total)}</div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="mb-10 flex-1">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-800 text-slate-800">
                    <th className="py-3 font-bold uppercase tracking-wider">Description</th>
                    <th className="py-3 font-bold uppercase tracking-wider text-center w-20">Qty</th>
                    <th className="py-3 font-bold uppercase tracking-wider text-right w-32">Rate</th>
                    <th className="py-3 font-bold uppercase tracking-wider text-right w-32">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {invoice.items.map((item, i) => (
                    <tr key={item.id} className="border-b border-slate-200 last:border-0">
                      <td className="py-4 font-medium text-slate-800">{item.description || 'Item Description'}</td>
                      <td className="py-4 text-center">{item.quantity}</td>
                      <td className="py-4 text-right">{formatCurrency(item.rate)}</td>
                      <td className="py-4 text-right font-medium text-slate-800">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-10">
              <div className="w-72 bg-slate-50 p-6 rounded-xl">
                <div className="flex justify-between text-sm mb-3 text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">{formatCurrency(subtotal)}</span>
                </div>
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between text-sm mb-3 text-slate-600">
                    <span>Tax ({invoice.taxRate}%)</span>
                    <span className="font-medium text-slate-800">{formatCurrency(tax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t-2 border-slate-200">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto border-t border-slate-200 pt-8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes & Terms</h4>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
