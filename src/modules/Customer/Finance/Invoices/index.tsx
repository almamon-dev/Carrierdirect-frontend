import React, { useState } from 'react';
import { Download, ExternalLink, Star } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import InvoiceView from './View';
import RatingModal from '@/components/modals/rating-modal';

const mockData = [
  { id: 'INV-2026-001', date: '2026-07-01', dueDate: '2026-07-15', amount: '€ 45,000', status: 'Paid', supplier: 'Express Freight Logistics' },
  { id: 'INV-2026-002', date: '2026-07-05', dueDate: '2026-07-20', amount: '€ 32,500', status: 'Paid', supplier: 'Global Moving BD' },
  { id: 'INV-2026-003', date: '2026-07-18', dueDate: '2026-07-30', amount: '€ 25,500', status: 'Due', supplier: 'Prime Movers Inc.' },
  { id: 'INV-2026-004', date: '2026-06-25', dueDate: '2026-07-10', amount: '€ 15,000', status: 'Overdue', supplier: 'Fast Track Freight' },
];

export default function Invoices() {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Due' | 'Overdue'>('All');
  const [ratingTarget, setRatingTarget] = useState<{ id: string; supplier: string } | null>(null);

  if (selectedInvoice) {
    return <InvoiceView invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} />;
  }

  const filteredInvoices = mockData.filter(invoice => {
    if (statusFilter === 'All') return true;
    return invoice.status === statusFilter;
  });

  const columns: Column<any>[] = [
    { 
      id: 'id', 
      label: 'Invoice No.', 
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedInvoice(row)}
          className="font-bold text-[#ff4a1f] hover:underline cursor-pointer text-left"
        >
          {row.id}
        </button>
      ) 
    },
    { id: 'date', label: 'Issue Date', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.date}</span> },
    { id: 'dueDate', label: 'Due Date', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.dueDate}</span> },
    { id: 'amount', label: 'Amount', render: (row) => <span className="font-bold text-slate-900 whitespace-nowrap">{row.amount}</span> },
    {
      id: 'status',
      label: 'Status',
      render: (row) => {
        if (row.status === 'Paid') return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</Badge>;
        if (row.status === 'Due') return <Badge className="bg-amber-50 text-amber-700 border border-amber-200">Due</Badge>;
        if (row.status === 'Overdue') return <Badge className="bg-red-50 text-red-700 border border-red-200 font-semibold">Overdue</Badge>;
        return <Badge variant="default">{row.status}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-1.5">
      {row.status === 'Paid' && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 font-bold text-[11px] cursor-pointer"
          onClick={() => setRatingTarget({ id: row.id, supplier: row.supplier })}
          title="Rate Supplier"
        >
          <Star size={12} className="mr-1 fill-amber-400 text-amber-400" /> Rate
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2.5 text-[#ff4a1f] border-orange-200 hover:bg-orange-50 font-semibold text-xs cursor-pointer"
        onClick={() => setSelectedInvoice(row)}
      >
        <ExternalLink size={13} className="mr-1" /> View
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-7 w-7 p-0 text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer"
        onClick={() => alert(`Downloading invoice ${row.id}...`)}
        title="Download PDF"
      >
        <Download size={13} />
      </Button>
    </div>
  );

  const filterContent = (
    <div className="flex flex-wrap items-center gap-3 py-1">
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold text-slate-600">Invoice Status</label>
        <div className="flex items-center gap-1.5">
          {(['All', 'Paid', 'Due', 'Overdue'] as const).map((tab) => {
            const count = tab === 'All' ? mockData.length : mockData.filter(i => i.status === tab).length;
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer ${isActive
                    ? 'bg-[#ff4a1f] text-[#ffffff] shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen space-y-4 font-sans antialiased">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Invoices & Receipts</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage, view, rate suppliers for paid invoices, and download receipts.</p>
        </div>
      </div>

      <DataTable
        data={filteredInvoices}
        columns={columns}
        actions={actions}
        filterContent={filterContent}
        searchPlaceholder="Search invoices by ID, date, or amount..."
        compact={true}
      />

      {/* Rating Modal for Invoice List Action */}
      {ratingTarget && (
        <RatingModal
          isOpen={Boolean(ratingTarget)}
          onClose={() => setRatingTarget(null)}
          orderId={ratingTarget.id}
          targetName={ratingTarget.supplier}
          targetRole="Supplier"
          orderTitle="Logistics Cargo Dispatch Service"
          onSubmit={(data) => console.log('Invoice table rating submitted:', data)}
        />
      )}
    </div>
  );
}
