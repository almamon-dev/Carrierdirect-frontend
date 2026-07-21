import React from 'react';
import { CreditCard, CheckCircle2, Download } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

const mockData = [
  { id: 'TXN-998822', date: '2026-07-15', method: 'Visa ending in 4242', invoice: 'INV-2026-001', amount: '€ 45,000', status: 'Success' },
  { id: 'TXN-998815', date: '2026-07-10', method: 'bKash Mobile Banking', invoice: 'INV-2026-002', amount: '€ 32,500', status: 'Success' },
  { id: 'TXN-998801', date: '2026-07-02', method: 'Visa ending in 4242', invoice: 'INV-2026-003', amount: '€ 25,500', status: 'Failed' },
];

export default function Payments() {
  const columns: Column<any>[] = [
    { id: 'id', label: 'Transaction ID', render: (row) => <span className="font-bold text-slate-800">{row.id}</span> },
    { id: 'date', label: 'Date', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.date}</span> },
    { id: 'method', label: 'Payment Method', render: (row) => <span className="text-slate-600">{row.method}</span> },
    { id: 'invoice', label: 'Invoice No.', render: (row) => <span className="text-indigo-600 font-medium hover:underline cursor-pointer">{row.invoice}</span> },
    { id: 'amount', label: 'Amount', render: (row) => <span className="font-bold text-slate-900 whitespace-nowrap">{row.amount}</span> },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        if (row.status === 'Success') return <Badge variant="success" className="bg-emerald-50 text-emerald-700">Success</Badge>;
        if (row.status === 'Failed') return <Badge variant="destructive">Failed</Badge>;
        return <Badge variant="default">{row.status}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-2">
      {row.status === 'Success' && (
        <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-slate-600 border-slate-200 hover:bg-slate-50" title="Download Receipt">
          <Download size={14} />
        </Button>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl text-slate-900 mb-1">Payment History</h1>
          <p className="text-sm text-slate-500">Track all your transactions and download payment receipts.</p>
        </div>
      </div>
      
      <DataTable 
        data={mockData} 
        columns={columns} 
        actions={actions}
        searchPlaceholder="Search by Transaction ID..."
        compact={true}
      />
    </div>
  );
}
