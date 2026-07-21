import React from 'react';
import { Eye, MessageSquare, CheckCircle, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const mockData = [
  { id: 'NEG-102', quoteId: 'QT-8822', customer: 'ABC Logistics', originalOffer: 42500, customerCounter: 40000, lastUpdated: '2 hours ago', status: 'Customer Countered' },
  { id: 'NEG-101', quoteId: 'QT-8815', customer: 'Global Freight', originalOffer: 35000, customerCounter: 32000, lastUpdated: '10 mins ago', status: 'Awaiting Customer' },
];

export default function Negotiation() {
  const navigate = useNavigate();

  const columns: Column<any>[] = [
    { id: 'id', label: 'Negotiation ID', render: (row) => <span className="text-brand whitespace-nowrap">{row.id}</span> },
    { id: 'quoteId', label: 'Quote ID', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.quoteId}</span> },
    { id: 'customer', label: 'Customer', render: (row) => <span className="whitespace-nowrap text-slate-800 font-medium">{row.customer}</span> },
    { 
      id: 'originalOffer', 
      label: 'Original Offer', 
      render: (row) => <span className="whitespace-nowrap text-slate-400 line-through">€ {row.originalOffer.toLocaleString()}</span> 
    },
    { 
      id: 'customerCounter', 
      label: 'Customer Counter', 
      render: (row) => <span className="whitespace-nowrap text-amber-600 font-bold">€ {row.customerCounter.toLocaleString()}</span>
    },
    { 
      id: 'variance', 
      label: 'Variance', 
      render: (row) => {
        const diff = row.originalOffer - row.customerCounter;
        const diffPercent = ((diff / row.originalOffer) * 100).toFixed(1);
        return (
          <div className="flex items-center text-amber-600 whitespace-nowrap font-medium">
            <ArrowDownRight size={14} className="mr-1" /> {diffPercent}% (-€{diff.toLocaleString()})
          </div>
        );
      }
    },
    { id: 'lastUpdated', label: 'Last Activity', render: (row) => <span className="whitespace-nowrap text-slate-500">{row.lastUpdated}</span> },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        let variant: any = 'default';
        if (row.status === 'Awaiting Customer') variant = 'warning';
        if (row.status === 'Customer Countered') variant = 'info';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => navigate(`/supplier/quotes/negotiation/view/${row.id}`)}>
        <Eye size={14} className="mr-1" /> View
      </Button>
      <Button variant="primary" size="sm" className="h-7 px-2" onClick={() => navigate(`/supplier/quotes/negotiation/view/${row.id}`)}>
        <MessageSquare size={14} className="mr-1" /> Reply
      </Button>
      {row.status === 'Customer Countered' && (
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
          <h1 className="text-[18px] font-bold text-slate-900 mb-1">Negotiation</h1>
          <p className="text-sm text-slate-500 font-medium">Manage active price negotiations and respond to customer counter-offers.</p>
        </div>
      </div>
      
      <DataTable 
        tableId="supplier_negotiation_list_v1"
        data={mockData} 
        columns={columns} 
        actions={actions}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search negotiations..."
        compact={true}
      />
    </div>
  );
}
