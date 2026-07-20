import React from 'react';
import { Eye, Activity, Navigation } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const mockData = [
  { id: 'ORD-5591', route: { from: 'Dhaka', to: 'Chittagong' }, supplier: 'Global Transport', driverName: 'Rahim Uddin', driverPhone: '01711-223344', vehicleNo: 'DHA-11-2233', amount: 'BDT 120,000', estArrival: '2026-07-26 10:00 AM', status: 'Assigned Driver' },
  { id: 'ORD-5582', route: { from: 'Sylhet', to: 'Rajshahi' }, supplier: 'Express Logistics BD', driverName: 'Karim Hasan', driverPhone: '01811-998877', vehicleNo: 'SYL-14-5544', amount: 'BDT 45,000', estArrival: '2026-07-22 06:00 PM', status: 'In Transit' },
];

export default function Processing() {
  const navigate = useNavigate();

  const columns: Column<any>[] = [
    { id: 'id', label: 'Order ID', render: (row) => <span className=" text-indigo-600 whitespace-nowrap">{row.id}</span> },
    { 
      id: 'route', 
      label: 'Route', 
      render: (row) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className=" text-slate-800">{row.route.from}</span>
          <Navigation size={12} className="text-slate-400 rotate-90" />
          <span className=" text-slate-800">{row.route.to}</span>
        </div>
      ) 
    },
    { id: 'supplier', label: 'Supplier', render: (row) => <span className="whitespace-nowrap text-slate-800">{row.supplier}</span> },
    { id: 'driverName', label: 'Driver Name', render: (row) => <span className="whitespace-nowrap">{row.driverName}</span> },
    { id: 'driverPhone', label: 'Driver Phone', render: (row) => <span className="whitespace-nowrap text-slate-600">{row.driverPhone}</span> },
    { id: 'vehicleNo', label: 'Vehicle No', render: (row) => <span className="whitespace-nowrap font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded text-sm ">{row.vehicleNo}</span> },
    { id: 'amount', label: 'Amount', render: (row) => <span className="whitespace-nowrap text-emerald-600">{row.amount}</span> },
    { id: 'estArrival', label: 'Est. Arrival', render: (row) => <span className="whitespace-nowrap text-slate-700 ">{row.estArrival}</span> },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => {
        let variant: any = 'default';
        if (row.status === 'Assigned Driver') variant = 'info';
        if (row.status === 'In Transit') variant = 'warning';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    }
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-end gap-2">
      <Button variant="primary" size="sm" className="h-7 px-3" onClick={() => navigate(`/customer/quotes/processing/track/${row.id}`)}>
        <Activity size={14} className="mr-1" /> Track
      </Button>
    </div>
  );

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl text-slate-900 mb-1">Active Processing</h1>
          <p className="text-sm text-slate-500 ">Track your active shipments, view driver details, and monitor live status.</p>
        </div>
      </div>
      
      <DataTable 
        data={mockData} 
        columns={columns} 
        actions={actions}
        searchPlaceholder="Search active orders or drivers..."
        compact={true}
      />
    </div>
  );
}
