import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Truck, MapPin, CheckCircle2, Clock, Upload, Star } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import DataTable, { Column } from '@/components/tables/data-table';
import RatingModal from '@/components/modals/rating-modal';
import { mockSupplierOrders, SupplierOrder } from '../data/ordersData';

export default function ActiveJobs() {
    const navigate = useNavigate();
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
    const [ratingTarget, setRatingTarget] = useState<{ id: string; customer: string; route: string } | null>(null);

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
                    className="font-bold text-slate-900 hover:text-[#ff4a1f] hover:underline text-left cursor-pointer"
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
        <div className="flex items-center justify-end gap-1.5">
            {row.status === 'Delivered' && (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 font-bold text-[11px] cursor-pointer"
                    onClick={() => setRatingTarget({ id: row.id, customer: row.customer, route: `${row.pickup} → ${row.delivery}` })}
                    title="Rate Customer"
                >
                    <Star size={12} className="mr-1 fill-amber-400 text-amber-400" /> Rate Customer
                </Button>
            )}
            <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs px-2.5 font-semibold cursor-pointer"
                onClick={() => navigate(`/supplier/orders/details/${row.slug}`)}
            >
                <Eye size={13} className="mr-1" /> Details
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
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Active Jobs & Deliveries</h1>
                    <p className="text-xs text-slate-500 font-medium">Monitor active deliveries, submit PODs, and rate customer shippers.</p>
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

            {/* Rating Modal for Supplier Rating Customer */}
            {ratingTarget && (
                <RatingModal
                    isOpen={Boolean(ratingTarget)}
                    onClose={() => setRatingTarget(null)}
                    orderId={ratingTarget.id}
                    targetName={ratingTarget.customer}
                    targetRole="Customer"
                    orderTitle={ratingTarget.route}
                    onSubmit={(data) => {
                        console.log('Supplier rated customer:', data);
                    }}
                />
            )}
        </div>
    );
}
