import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import DataTable from '@/components/tables/data-table';
import { Plus, Download, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AvailabilitySchedule() {
    const navigate = useNavigate();
    const data = [
        {
            id: 'SCH-001',
            name: 'Standard Operations',
            location: 'Main Warehouse',
            type: 'Recurring Weekly',
            timezone: 'EST (UTC-5)',
            days: 'Mon-Fri',
            hours: '08:00 AM - 06:00 PM',
            validity: 'Permanent',
            status: 'Active'
        },
        {
            id: 'SCH-002',
            name: 'Weekend Coverage',
            location: 'Downtown Hub',
            type: 'Recurring Weekly',
            timezone: 'EST (UTC-5)',
            days: 'Sat',
            hours: '09:00 AM - 02:00 PM',
            validity: 'Permanent',
            status: 'Active'
        },
        {
            id: 'SCH-003',
            name: 'Holiday Eve Limited',
            location: 'All Branches',
            type: 'Specific Date',
            timezone: 'EST (UTC-5)',
            days: 'Dec 24, 2026',
            hours: '08:00 AM - 12:00 PM',
            validity: 'Temporary',
            status: 'Inactive'
        }
    ];

    const columns = [
        { id: 'id', label: 'ID', render: (r: any) => <span className='font-semibold text-slate-800'>{r.id}</span> },
        { id: 'name', label: 'Schedule Name', render: (r: any) => <span className='font-medium text-slate-900'>{r.name}</span> },
        { id: 'location', label: 'Location' },
        { id: 'type', label: 'Type' },
        { id: 'timezone', label: 'Timezone' },
        { id: 'days', label: 'Working Days' },
        { id: 'hours', label: 'Hours' },
        { id: 'validity', label: 'Validity', render: (r: any) => <span className='text-[11px] text-slate-600'>{r.validity}</span> },
        {
            id: 'status',
            label: 'Status',
            render: (r: any) => (
                <span className={`text-[10px] px-2 py-1 rounded font-medium ${r.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                    {r.status}
                </span>
            )
        },
        {
            id: 'actions',
            label: 'Actions',
            render: () => (
                <div className="flex items-center gap-1.5">
                    <Button variant="ghost" className="h-7 w-7 p-0 text-slate-600 hover:text-indigo-700 bg-slate-50 hover:bg-brand-light border border-slate-200 rounded-sm">
                        <Edit2 size={13} />
                    </Button>
                    <Button variant="ghost" className="h-7 w-7 p-0 text-slate-600 hover:text-red-700 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-sm">
                        <Trash2 size={13} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 mb-1">Availability Schedule</h1>
                    <p className="text-[12px] text-slate-500 font-medium">Manage your regular and recurring working schedules.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm">
                        <Download size={14} />
                        Export
                    </Button>
                    <Button variant="primary" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm" onClick={() => navigate('/supplier/availability/schedule/create')}>
                        <Plus size={14} />
                        Create New
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={data}
                hideViewToggle={true}
                searchPlaceholder="Search records..."
                compact={true}
            />
        </div>
    );
}
