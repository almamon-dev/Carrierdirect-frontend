import React, { useState } from 'react';
import { Search, Filter, Eye, Truck, MapPin } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';

export default function ActiveJobs() {
    const jobs = [
        { id: 'JOB-2024-001', customer: 'Acme Corp', route: 'New York → Boston', date: 'Jul 22, 2026', driver: 'John Doe', vehicle: 'Truck #45', status: 'In Transit' },
        { id: 'JOB-2024-002', customer: 'Stark Industries', route: 'Chicago → Detroit', date: 'Jul 23, 2026', driver: 'Jane Smith', vehicle: 'Van #12', status: 'Scheduled' },
        { id: 'JOB-2024-003', customer: 'Wayne Ent.', route: 'Miami → Orlando', date: 'Jul 21, 2026', driver: 'Mike Ross', vehicle: 'Truck #08', status: 'Delayed' },
    ];

    const columns = [
        { id: 'id', label: 'Job ID', render: (row: any) => <span className="font-semibold text-slate-800">{row.id}</span> },
        { id: 'customer', label: 'Customer', render: (row: any) => <span className="font-medium text-slate-900">{row.customer}</span> },
        {
            id: 'route',
            label: 'Route',
            render: (row: any) => (
                <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin size={14} className="text-indigo-500" />
                    <span className="text-[13px]">{row.route}</span>
                </div>
            )
        },
        { id: 'date', label: 'Schedule Date', render: (row: any) => <span className="text-slate-600">{row.date}</span> },
        {
            id: 'driver',
            label: 'Driver & Fleet',
            render: (row: any) => (
                <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-slate-800">{row.driver}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1"><Truck size={10} /> {row.vehicle}</span>
                </div>
            )
        },
        {
            id: 'status',
            label: 'Status',
            render: (row: any) => (
                <Badge variant="secondary" className={
                    row.status === 'In Transit' ? 'bg-brand-light text-blue-700' :
                        row.status === 'Scheduled' ? 'bg-brand-light text-indigo-700' :
                            'bg-red-50 text-red-700'
                }>
                    {row.status}
                </Badge>
            )
        },
    ];

    const renderActions = (row: any) => (
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" className="h-7 px-2 border-slate-200 text-slate-600 hover:text-brand hover:border-brand-light hover:bg-brand-light/20">
                <Eye size={14} className="mr-1" /> View Details
            </Button>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 mb-1">Active Jobs</h1>
                    <p className="text-[12px] text-slate-500 font-medium">Monitor and manage all currently active shipments and deliveries.</p>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={jobs} 
                compact={true}
                searchPlaceholder="Search active jobs..."
                hideViewToggle={true}
                actions={renderActions}
            />
        </div>
    );
}
