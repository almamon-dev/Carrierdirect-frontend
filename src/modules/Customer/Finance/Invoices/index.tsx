import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, Star, Receipt } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import InvoiceView from './View';
import RatingModal from '@/components/modals/rating-modal';
import apiClient from '@/lib/axios';

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Due' | 'Overdue'>('All');
  const [ratingTarget, setRatingTarget] = useState<{ id: string; supplier: string } | null>(null);

  const fetchInvoices = async () => {
    try {
      const res = await apiClient.get('/customer/invoices');
      const list = res.data?.data || res.data?.invoices?.data || res.data?.invoices || res.data || [];
      setInvoices(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      setInvoices([]);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (selectedInvoice) {
    return <InvoiceView invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} />;
  }

  const filteredInvoices = invoices.filter(invoice => {
    if (statusFilter === 'All') return true;
    const st = (invoice.status || '').toLowerCase();
    if (statusFilter === 'Paid') return st === 'paid';
    if (statusFilter === 'Due') return st === 'due' || st === 'pending';
    if (statusFilter === 'Overdue') return st === 'overdue';
    return true;
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
          {row.invoice_number || row.id}
        </button>
      ) 
    },
    { 
      id: 'date', 
      label: 'Issue Date', 
      render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.date || row.created_at_formatted || 'N/A'}</span> 
    },
    { 
      id: 'dueDate', 
      label: 'Due Date', 
      render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.due_date || row.dueDate || 'N/A'}</span> 
    },
    { 
      id: 'amount', 
      label: 'Amount', 
      render: (row) => <span className="font-bold text-slate-900 whitespace-nowrap">{row.amount || row.total_amount_formatted || `€ ${row.total_amount || 0}`}</span> 
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => {
        const st = (row.status || '').toLowerCase();
        if (st === 'paid') return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</Badge>;
        if (st === 'due' || st === 'pending') return <Badge className="bg-amber-50 text-amber-700 border border-amber-200">Due</Badge>;
        if (st === 'overdue') return <Badge className="bg-red-50 text-red-700 border border-red-200 font-semibold">Overdue</Badge>;
        return <Badge variant="default">{row.status || 'Pending'}</Badge>;
      }
    }
  ];

  const handleDownload = async (row: any) => {
    try {
      const response = await fetch(`${apiClient['baseURL']}/customer/invoices/${row.id}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Accept': 'application/pdf',
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${row.invoice_number || row.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Failed to download invoice PDF.');
    }
  };

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-1.5">
      {row.status === 'paid' && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 font-bold text-[11px] cursor-pointer"
          onClick={() => setRatingTarget({ id: String(row.id), supplier: row.supplier_name || row.order?.supplier?.name || 'Supplier' })}
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
        onClick={() => handleDownload(row)}
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
            const count = tab === 'All' ? invoices.length : invoices.filter(i => {
              const st = (i.status || '').toLowerCase();
              if (tab === 'Paid') return st === 'paid';
              if (tab === 'Due') return st === 'due' || st === 'pending';
              if (tab === 'Overdue') return st === 'overdue';
              return true;
            }).length;
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
        emptyState={
          <EmptyState
            icon={Receipt}
            title="No Invoices Found"
            description="There are no billing invoices matching your selected filter at the moment."
          />
        }
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
          onSubmit={async (data) => {
            try {
              await apiClient.post(`/customer/orders/${ratingTarget.id}/review`, data);
              fetchInvoices();
            } catch (err: any) {
              console.error(err);
            }
          }}
        />
      )}
    </div>
  );
}
