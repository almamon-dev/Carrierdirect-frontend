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
                    row.status === 'In Transit' ? 'bg-blue-50 text-blue-700' :
                    row.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-700' :
                    'bg-red-50 text-red-700'
                }>
                    {row.status}
                </Badge>
            )
        },
        { 
            id: 'actions', 
            label: 'Actions', 
            render: (row: any) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600">
                        <Eye size={16} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-6 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Active Jobs</h1>
                    <p className="text-sm text-slate-500 mt-1">Monitor and manage all currently active shipments and deliveries.</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <DataTable columns={columns} data={jobs} />
            </div>
        </div>
    );
}
