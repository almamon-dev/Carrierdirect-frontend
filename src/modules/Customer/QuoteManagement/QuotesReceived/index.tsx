import React from 'react';
import { Eye, CheckCircle, XCircle, Star } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const mockData = [
  { id: 'QT-8821', requestId: 'REQ-9233', supplier: 'Express Logistics BD', rating: 4.8, reviews: 124, vehicle: 'Covered Van (14ft)', transitTime: '2 Days', amount: '€ 45,000', validUntil: '2026-07-25', status: 'Pending' },
  { id: 'QT-8822', requestId: 'REQ-9233', supplier: 'Prime Movers', rating: 4.5, reviews: 89, vehicle: 'Open Truck (16ft)', transitTime: '3 Days', amount: '€ 42,500', validUntil: '2026-07-24', status: 'Negotiating' },
  { id: 'QT-8823', requestId: 'REQ-9230', supplier: 'Global Transport', rating: 4.9, reviews: 312, vehicle: 'Container (20ft)', transitTime: '1 Day', amount: '€ 120,000', validUntil: '2026-07-22', status: 'Accepted' },
];

export default function QuotesReceived() {
  const navigate = useNavigate();

  const columns: Column<any>[] = [
    { id: 'id', label: 'Quote ID', render: (row) => <span className="text-brand whitespace-nowrap">{row.id}</span> },
    { id: 'requestId', label: 'Request ID', render: (row) => <span className="text-slate-500 whitespace-nowrap">{row.requestId}</span> },
    { id: 'supplier', label: 'Supplier', render: (row) => <span className="whitespace-nowrap text-slate-800">{row.supplier}</span> },
    { 
      id: 'rating', 
      label: 'Rating', 
      render: (row) => (
        <div className="flex items-center gap-1 whitespace-nowrap">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          <span className="text-slate-700">{row.rating}</span>
          <span className="text-slate-400">({row.reviews})</span>
        </div>
      ) 
    },
    { id: 'vehicle', label: 'Vehicle Type', render: (row) => <span className="whitespace-nowrap">{row.vehicle}</span> },
    { id: 'transitTime', label: 'Transit Time', render: (row) => <span className="whitespace-nowrap">{row.transitTime}</span> },
    { id: 'amount', label: 'Quote Amount', render: (row) => <span className="whitespace-nowrap text-emerald-600">{row.amount}</span> },
    { id: 'validUntil', label: 'Valid Until', render: (row) => <span className="whitespace-nowrap">{row.validUntil}</span> },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        let variant: any = 'default';
        if (row.status === 'Pending') variant = 'warning';
        if (row.status === 'Negotiating') variant = 'info';
        if (row.status === 'Accepted') variant = 'success';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => navigate(`/customer/quotes/received/view/${row.id}`)}>
        <Eye size={14} className="mr-1" /> View
      </Button>
      {row.status === 'Pending' && (
        <>
          <Button variant="primary" size="sm" className="h-7 px-2 bg-emerald-600 hover:bg-emerald-700 border-emerald-600">
            <CheckCircle size={14} className="mr-1" /> Accept
          </Button>
          <Button variant="outline" size="sm" className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
            <XCircle size={14} className="mr-1" /> Reject
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-bold text-slate-900 mb-1">Quotes Received</h1>
          <p className="text-sm text-slate-500">Review and accept quotes from our verified suppliers.</p>
        </div>
      </div>
      
      <DataTable 
        data={mockData} 
        columns={columns} 
        actions={actions}
        searchPlaceholder="Search quotes by ID or supplier..."
        compact={true}
      />
    </div>
  );
}
