import React from 'react';
import { Clock, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

const mockData = [
  { id: 'PL-5591', date: '2026-07-01', dueDate: '2026-07-30', amount: 'BDT 45,000', status: 'Pending' },
  { id: 'PL-5582', date: '2026-06-15', dueDate: '2026-07-15', amount: 'BDT 32,500', status: 'Cleared' },
  { id: 'PL-5570', date: '2026-05-10', dueDate: '2026-06-10', amount: 'BDT 28,000', status: 'Overdue' },
];

export default function PayLater() {
  const columns: Column<any>[] = [
    { id: 'id', label: 'Reference No.', render: (row) => <span className="font-bold text-slate-800">{row.id}</span> },
    { id: 'date', label: 'Issued Date', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.date}</span> },
    { id: 'dueDate', label: 'Due Date', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.dueDate}</span> },
    { id: 'amount', label: 'Amount', render: (row) => <span className="font-bold text-slate-900 whitespace-nowrap">{row.amount}</span> },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        if (row.status === 'Cleared') return <Badge variant="success">Cleared</Badge>;
        if (row.status === 'Overdue') return <Badge variant="destructive">Overdue</Badge>;
        return <Badge variant="warning">{row.status}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-2">
      {row.status !== 'Cleared' && (
        <Button variant="outline" size="sm" className="h-7 text-[12px] text-indigo-600 border-indigo-200 hover:bg-indigo-50">
          Pay Now
        </Button>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-5 w-full min-h-screen">
      <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-0.5">Pay Later Management</h1>
          <p className="text-[13px] text-slate-500">Track and manage your credit lines and pay later requests.</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-slate-200 px-3.5 py-2 rounded-lg shadow-sm">
           <div>
               <p className="text-[10px] font-medium text-slate-500 mb-0.5">Credit Limit</p>
               <p className="text-[13.5px] font-bold text-slate-900">BDT 1,00,000</p>
           </div>
           <div className="w-px h-7 bg-slate-200 mx-1"></div>
           <div>
               <p className="text-[10px] font-medium text-slate-500 mb-0.5">Available Balance</p>
               <p className="text-[13.5px] font-bold text-emerald-600">BDT 55,000</p>
           </div>
        </div>
      </div>
      
      <DataTable 
        data={mockData} 
        columns={columns} 
        actions={actions}
        searchPlaceholder="Search by Reference No..."
        compact={true}
      />
    </div>
  );
}
