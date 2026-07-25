import React from 'react';
import { Eye, Map, Download, FileText, RotateCcw } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const mockData = [
  { id: 'ORD-5591', date: '2026-07-18', deliveryDate: '2026-07-20', route: 'Dhaka → Chittagong', supplier: 'Global Transport', vehicle: 'Covered Van (14ft)', amount: '€ 45,000', status: 'Completed', paymentStatus: 'Paid' },
  { id: 'ORD-5582', date: '2026-07-15', deliveryDate: '2026-07-16', route: 'Sylhet → Rajshahi', supplier: 'Express Logistics BD', vehicle: 'Open Truck (7ft)', amount: '€ 32,500', status: 'Completed', paymentStatus: 'Paid' },
  { id: 'ORD-5570', date: '2026-07-10', deliveryDate: '-', route: 'Khulna → Dhaka', supplier: 'Prime Movers', vehicle: 'Covered Van (20ft)', amount: '€ 28,000', status: 'Cancelled', paymentStatus: 'Refunded' },
  { id: 'ORD-5595', date: '2026-07-20', deliveryDate: 'Est: 2026-07-22', route: 'Barisal → Sylhet', supplier: 'Fast Track BD', vehicle: 'Trailer (40ft)', amount: '€ 55,000', status: 'In Transit', paymentStatus: 'Partial Due' },
];

export default function Orders() {
  const navigate = useNavigate();

  const columns: Column<any>[] = [
    { id: 'id', label: 'Order ID', render: (row) => <span className="font-bold text-brand">{row.id}</span> },
    { id: 'date', label: 'Order Date', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.date}</span> },
    { id: 'route', label: 'Route', render: (row) => <span className="font-medium text-slate-800 whitespace-nowrap">{row.route}</span> },
    { id: 'supplier', label: 'Supplier', render: (row) => <span className="text-slate-700 whitespace-nowrap">{row.supplier}</span> },
    { id: 'vehicle', label: 'Vehicle', render: (row) => <span className="text-slate-500 text-[13px]">{row.vehicle}</span> },
    { id: 'deliveryDate', label: 'Delivery', render: (row) => <span className="text-slate-600 whitespace-nowrap">{row.deliveryDate}</span> },
    { id: 'amount', label: 'Total Amount', render: (row) => <span className="font-bold text-slate-900 whitespace-nowrap">{row.amount}</span> },
    { 
      id: 'paymentStatus', 
      label: 'Payment',
      render: (row) => {
        if (row.paymentStatus === 'Paid') return <span className="text-emerald-600 font-semibold text-[13px]">Paid</span>;
        if (row.paymentStatus === 'Refunded') return <span className="text-slate-400 font-semibold text-[13px]">Refunded</span>;
        return <span className="text-amber-600 font-semibold text-[13px]">{row.paymentStatus}</span>;
      }
    },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        if (row.status === 'Completed') return <Badge variant="success">Completed</Badge>;
        if (row.status === 'Cancelled') return <Badge variant="destructive">Cancelled</Badge>;
        return <Badge variant="warning">{row.status}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 w-7 p-0 text-slate-600 border-slate-200 hover:bg-slate-50" 
        onClick={() => navigate(`/customer/orders/${row.id}`, { state: { orderData: row } })}
        title="View Details"
      >
        <Eye size={14} />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 px-2 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center gap-1 font-semibold" 
        onClick={() => navigate('/customer/quotes/create/new', { state: { repeatData: row } })}
        title="Repeat Order"
      >
        <RotateCcw size={13} />
        <span>Repeat</span>
      </Button>
      <Button 
        variant="primary" 
        size="sm" 
        className="h-7 w-7 p-0" 
        disabled={row.status !== 'Completed'}
        onClick={() => navigate(`/customer/orders/${row.id}`, { state: { orderData: row } })}
        title="Download Invoice"
      >
        <FileText size={14} />
      </Button>
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-bold text-slate-900 mb-1">Order History</h1>
          <p className="text-sm text-slate-500">View all your past and present logistics orders in one place.</p>
        </div>
        <Button variant="outline" className="h-9">
            <Download size={16} className="mr-2" /> Export CSV
        </Button>
      </div>
      
      <DataTable 
        data={mockData} 
        columns={columns} 
        actions={actions}
        searchPlaceholder="Search by Order ID or Supplier..."
        compact={true}
      />
    </div>
  );
}
