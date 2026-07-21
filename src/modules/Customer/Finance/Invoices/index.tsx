import React, { useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import InvoiceView from './View';

const mockData = [
  { id: 'INV-2026-001', date: '2026-07-01', dueDate: '2026-07-15', amount: '€ 45,000', status: 'Paid' },
  { id: 'INV-2026-002', date: '2026-07-05', dueDate: '2026-07-20', amount: '€ 32,500', status: 'Paid' },
  { id: 'INV-2026-003', date: '2026-07-18', dueDate: '2026-07-30', amount: '€ 25,500', status: 'Due' },
  { id: 'INV-2026-004', date: '2026-06-25', dueDate: '2026-07-10', amount: '€ 15,000', status: 'Overdue' },
];

export default function Invoices() {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  if (selectedInvoice) {
      return (
          <div>
              {/* Back button is implemented inside InvoiceView for now, but to make it work, we can pass a prop or wrap it. For simplicity, we just render it. */}
              {/* Since we cannot easily pass a prop without modifying View.tsx, we will just add a wrapper back button here. */}
              <div className="bg-slate-50 p-4">
                  <Button variant="ghost" className="mb-[-40px] relative z-10" onClick={() => setSelectedInvoice(null)}>
                      ← Back to List
                  </Button>
              </div>
              <InvoiceView />
          </div>
      );
  }

  const columns: Column<any>[] = [
    { id: 'id', label: 'Invoice No.', render: (row) => <span className="font-bold text-brand">{row.id}</span> },
    { id: 'date', label: 'Issue Date', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.date}</span> },
    { id: 'dueDate', label: 'Due Date', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.dueDate}</span> },
    { id: 'amount', label: 'Amount', render: (row) => <span className="font-bold text-slate-900 whitespace-nowrap">{row.amount}</span> },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        if (row.status === 'Paid') return <Badge variant="success">Paid</Badge>;
        if (row.status === 'Due') return <Badge variant="warning">Due</Badge>;
        if (row.status === 'Overdue') return <Badge variant="destructive">Overdue</Badge>;
        return <Badge variant="default">{row.status}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" className="h-7 px-2 text-brand border-indigo-200 hover:bg-brand-light" onClick={() => setSelectedInvoice(row.id)}>
        <ExternalLink size={14} className="mr-1" /> View
      </Button>
      <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-slate-600 border-slate-200 hover:bg-slate-50" title="Download PDF">
        <Download size={14} />
      </Button>
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-bold text-slate-900 mb-1">Invoices</h1>
          <p className="text-sm text-slate-500">View and download all your past and pending invoices.</p>
        </div>
      </div>
      
      <DataTable 
        data={mockData} 
        columns={columns} 
        actions={actions}
        searchPlaceholder="Search invoices by ID..."
        compact={true}
      />
    </div>
  );
}
