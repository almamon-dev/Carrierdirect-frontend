import React from 'react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable, { Column } from '@/components/tables/data-table';
import { Plus, Download, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ScheduleItem {
    id: string;
    name: string;
    location: string;
    type: string;
    timezone: string;
    days: string;
    hours: string;
    validity: string;
    status: 'Active' | 'Inactive';
}

export default function AvailabilitySchedule() {
    const navigate = useNavigate();
    const data: ScheduleItem[] = [
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

    const columns: Column<ScheduleItem>[] = [
        { id: 'id', label: 'ID', render: (r) => <span className='font-bold text-slate-900'>{r.id}</span> },
        { id: 'name', label: 'Schedule Name', render: (r) => <span className='font-semibold text-slate-800'>{r.name}</span> },
        { id: 'location', label: 'Location', render: (r) => <span className='text-xs font-medium text-slate-700'>{r.location}</span> },
        { id: 'type', label: 'Type', render: (r) => <span className='text-xs text-slate-600'>{r.type}</span> },
        { id: 'timezone', label: 'Timezone', render: (r) => <span className='text-xs text-slate-500 font-mono'>{r.timezone}</span> },
        { id: 'days', label: 'Working Days', render: (r) => <span className='text-xs font-semibold text-slate-800'>{r.days}</span> },
        { id: 'hours', label: 'Hours', render: (r) => <span className='text-xs font-medium text-slate-700'>{r.hours}</span> },
        { id: 'validity', label: 'Validity', render: (r) => <span className='text-xs text-slate-500'>{r.validity}</span> },
        {
            id: 'status',
            label: 'Status',
            render: (r) => (
                <Badge variant="secondary" className={
                    r.status === 'Active' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'bg-slate-100 text-slate-600 font-semibold'
                }>
                    {r.status}
                </Badge>
            )
        },
    ];

    const renderActions = (row: ScheduleItem) => (
        <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-800 cursor-pointer">
                <Edit2 size={13} />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-600 cursor-pointer">
                <Trash2 size={13} />
            </Button>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Availability Schedule</h1>
                    <p className="text-xs text-slate-500 font-medium">Manage your regular and recurring working schedules.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 text-xs font-semibold" onClick={() => alert('Exporting schedules...')}>
                        <Download size={13} className="mr-1.5" /> Export
                    </Button>
                    <Button variant="primary" size="sm" className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white" onClick={() => navigate('/supplier/availability/schedule/create')}>
                        <Plus size={13} className="mr-1.5" /> Create New
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={data}
                hideViewToggle={true}
                searchPlaceholder="Search schedules by name, location..."
                compact={true}
                actions={renderActions}
            />
        </div>
    );
}
