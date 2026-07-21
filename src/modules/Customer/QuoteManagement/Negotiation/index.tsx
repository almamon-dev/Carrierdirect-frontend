import React from 'react';
import { Eye, MessageSquare, CheckCircle, ArrowDownRight } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const mockData = [
  { id: 'NEG-102', quoteId: 'QT-8822', supplier: 'Prime Movers', originalAmount: 42500, yourOffer: 40000, lastUpdated: '2 hours ago', status: 'Awaiting Supplier' },
  { id: 'NEG-101', quoteId: 'QT-8815', supplier: 'Fast Track BD', originalAmount: 35000, yourOffer: 32000, lastUpdated: '10 mins ago', status: 'Supplier Countered' },
];

export default function Negotiation() {
  const navigate = useNavigate();

  const columns: Column<any>[] = [
    { id: 'id', label: 'Negotiation ID', render: (row) => <span className=" text-indigo-600 whitespace-nowrap">{row.id}</span> },
    { id: 'quoteId', label: 'Quote ID', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.quoteId}</span> },
    { id: 'supplier', label: 'Supplier', render: (row) => <span className="whitespace-nowrap text-slate-800">{row.supplier}</span> },
    { 
      id: 'originalAmount', 
      label: 'Original Quote', 
      render: (row) => <span className="whitespace-nowrap text-slate-400 line-through">€ {row.originalAmount.toLocaleString()}</span> 
    },
    { 
      id: 'yourOffer', 
      label: 'Current Offer', 
      render: (row) => <span className="whitespace-nowrap text-emerald-600">€ {row.yourOffer.toLocaleString()}</span>
    },
    { 
      id: 'savings', 
      label: 'Savings', 
      render: (row) => {
        const diff = row.originalAmount - row.yourOffer;
        const savingsPercent = ((diff / row.originalAmount) * 100).toFixed(1);
        return (
          <div className="flex items-center text-emerald-500 whitespace-nowrap">
            <ArrowDownRight size={14} className="mr-1" /> {savingsPercent}% (৳{diff.toLocaleString()})
          </div>
        );
      }
    },
    { id: 'lastUpdated', label: 'Last Activity', render: (row) => <span className="whitespace-nowrap text-slate-500 ">{row.lastUpdated}</span> },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        let variant: any = 'default';
        if (row.status === 'Awaiting Supplier') variant = 'warning';
        if (row.status === 'Supplier Countered') variant = 'info';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => navigate(`/customer/quotes/negotiation/view/${row.id}`)}>
        <Eye size={14} className="mr-1" /> View
      </Button>
      <Button variant="primary" size="sm" className="h-7 px-2" onClick={() => navigate(`/customer/quotes/negotiation/view/${row.id}`)}>
        <MessageSquare size={14} className="mr-1" /> Reply
      </Button>
      {row.status === 'Supplier Countered' && (
        <Button variant="outline" size="sm" className="h-7 px-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
          <CheckCircle size={14} className="mr-1" /> Accept
        </Button>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl text-slate-900 mb-1">Negotiation</h1>
          <p className="text-sm text-slate-500 ">Manage active price negotiations and track your savings.</p>
        </div>
      </div>
      
      <DataTable 
        data={mockData} 
        columns={columns} 
        actions={actions}
        searchPlaceholder="Search negotiations..."
        compact={true}
      />
    </div>
  );
}
