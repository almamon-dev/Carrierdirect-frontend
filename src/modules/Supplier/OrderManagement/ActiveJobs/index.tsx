import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Truck, MapPin, CheckCircle2, Clock, Upload } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import DataTable, { Column } from '@/components/tables/data-table';
import { mockSupplierOrders, SupplierOrder } from '../data/ordersData';

export default function ActiveJobs() {
    const navigate = useNavigate();
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

    const filteredJobs = mockSupplierOrders.filter(job => {
        if (selectedStatusFilter === 'all') return true;
        return job.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    });

    const columns: Column<SupplierOrder>[] = [
        { 
            id: 'id', 
            label: 'Job ID', 
            render: (row) => (
                <button 
                    onClick={() => navigate(`/supplier/orders/details/${row.slug}`)}
                    className="font-bold text-slate-900 hover:text-[#ff4a1f] hover:underline text-left"
                >
                    {row.id}
                </button>
            )
        },
        { 
            id: 'customer', 
            label: 'Customer', 
            render: (row) => (
                <div>
                    <p className="font-bold text-slate-900">{row.customer}</p>
                    <p className="text-[11px] text-slate-400">{row.customerPhone}</p>
                </div>
            ) 
        },
        {
            id: 'route',
            label: 'Route',
            render: (row) => (
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                        <MapPin size={13} className="text-slate-500" />
                        <span>{row.pickup} → {row.delivery}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{row.distance} • {row.estimatedDuration}</p>
                </div>
            )
        },
        { 
            id: 'date', 
            label: 'Schedule Date', 
            render: (row) => (
                <div>
                    <p className="text-xs font-semibold text-slate-800">{row.pickupDate}</p>
                    <p className="text-[11px] text-slate-500">{row.pickupTimeWindow}</p>
                </div>
            )
        },
        {
            id: 'driver',
            label: 'Driver & Vehicle',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{row.driver}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Truck size={11} className="text-slate-400" /> {row.vehicle} ({row.vehiclePlate})
                    </span>
                </div>
            )
        },
        {
            id: 'status',
            label: 'Status',
            render: (row) => (
                <Badge variant="secondary" className={
                    row.status === 'In Transit' ? 'bg-blue-50 text-blue-700 font-semibold' :
                    row.status === 'Scheduled' ? 'bg-amber-50 text-amber-700 font-semibold' :
                    row.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                    'bg-red-50 text-red-700 font-semibold'
                }>
                    {row.status}
                </Badge>
            )
        },
        {
            id: 'netPayout',
            label: 'Net Payout',
            render: (row) => (
                <span className="font-extrabold text-emerald-700 text-xs">{row.netPayout}</span>
            )
        }
    ];

    const renderActions = (row: SupplierOrder) => (
        <div className="flex items-center justify-end gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs px-2.5 font-semibold"
                onClick={() => navigate(`/supplier/orders/details/${row.slug}`)}
            >
                <Eye size={13} className="mr-1" /> View Details
            </Button>
        </div>
    );

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Status Filter</label>
                <Select value={selectedStatusFilter} onChange={(e) => setSelectedStatusFilter(e.target.value)} showSearch={false}>
                    <option value="all">All Jobs</option>
                    <option value="in transit">In Transit</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="delivered">Delivered</option>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Active Jobs & Shipments</h1>
                    <p className="text-xs text-slate-500 font-medium">Monitor and manage all active deliveries and assigned drivers.</p>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={filteredJobs} 
                compact={true}
                searchPlaceholder="Search by Job ID, customer, route..."
                hideViewToggle={true}
                actions={renderActions}
                filterContent={filterContent}
            />
        </div>
    );
}
