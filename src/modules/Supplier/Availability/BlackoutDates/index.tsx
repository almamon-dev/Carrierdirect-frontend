import React, { useState } from 'react';
import { Plus, Calendar, AlertTriangle, Trash2 } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import FormLabel from '@/components/ui/label';
import DataTable, { Column } from '@/components/tables/data-table';

type BlackoutPeriod = {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    reason: string;
    affectedScope: string;
    status: 'Upcoming' | 'Active' | 'Past';
};

export default function BlackoutDates() {
    const [blackouts, setBlackouts] = useState<BlackoutPeriod[]>([
        { id: '1', title: 'Eid-ul-Adha Fleet Maintenance', startDate: '2026-06-15', endDate: '2026-06-18', reason: 'National Holiday & Annual Fleet Servicing', affectedScope: 'All Vehicles & Routes', status: 'Past' },
        { id: '2', title: 'Monsoon Heavy Highway Maintenance', startDate: '2026-08-01', endDate: '2026-08-03', reason: 'Dhaka-Chittagong Highway Lane Repair', affectedScope: 'Route RT-DHK-CTG', status: 'Upcoming' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const handleAddBlackout = (e: React.FormEvent) => {
        e.preventDefault();
        const created: BlackoutPeriod = {
            id: String(Date.now()),
            title,
            startDate,
            endDate,
            reason,
            affectedScope: 'All Fleet Routes',
            status: 'Upcoming',
        };
        setBlackouts([created, ...blackouts]);
        setShowModal(false);
        setTitle(''); setStartDate(''); setEndDate(''); setReason('');
    };

    const columns: Column<BlackoutPeriod>[] = [
        { 
            id: 'title', 
            label: 'Event / Reason', 
            render: (r) => (
                <div className="flex items-center gap-2">
                    <AlertTriangle size={15} className="text-amber-500" />
                    <div>
                        <p className="font-bold text-slate-900">{r.title}</p>
                        <p className="text-[11px] text-slate-500">{r.reason}</p>
                    </div>
                </div>
            )
        },
        { 
            id: 'dates', 
            label: 'Duration / Dates', 
            render: (r) => (
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    <span>{r.startDate} → {r.endDate}</span>
                </div>
            )
        },
        { 
            id: 'affectedScope', 
            label: 'Affected Scope', 
            render: (r) => <span className="text-xs font-medium text-slate-700">{r.affectedScope}</span> 
        },
        { 
            id: 'status', 
            label: 'Status', 
            render: (r) => (
                <Badge variant="secondary" className={
                    r.status === 'Upcoming' ? 'bg-amber-50 text-amber-700 font-semibold' :
                    r.status === 'Active' ? 'bg-red-50 text-red-700 font-semibold' :
                    'bg-slate-100 text-slate-600 font-semibold'
                }>
                    {r.status}
                </Badge>
            )
        },
    ];

    const renderActions = (row: BlackoutPeriod) => (
        <div className="flex items-center justify-end">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-slate-400 hover:text-red-600"
                onClick={() => setBlackouts(blackouts.filter(b => b.id !== row.id))}
            >
                <Trash2 size={13} />
            </Button>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Blackout Dates & Holidays</h1>
                    <p className="text-xs text-slate-500 font-medium">Set unavailable dates for fleet booking due to maintenance, holidays, or weather.</p>
                </div>
                <Button variant="primary" size="sm" className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white" onClick={() => setShowModal(true)}>
                    <Plus size={13} className="mr-1.5" /> Add Blackout Period
                </Button>
            </div>

            <DataTable 
                columns={columns} 
                data={blackouts} 
                compact={true}
                searchPlaceholder="Search blackout dates..."
                hideViewToggle={true}
                actions={renderActions}
            />

            {/* Add Blackout Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleAddBlackout} className="bg-white rounded-lg max-w-md w-full p-6 border border-slate-200 shadow-md space-y-4">
                        <h3 className="text-sm font-bold text-slate-900">Add Blackout Period</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <FormLabel className="text-xs">Title / Event Name</FormLabel>
                                <Input required placeholder="e.g. Annual Fleet Servicing" className="text-xs h-8" value={title} onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <FormLabel className="text-xs">Start Date</FormLabel>
                                    <Input required type="date" className="text-xs h-8" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                </div>
                                <div>
                                    <FormLabel className="text-xs">End Date</FormLabel>
                                    <Input required type="date" className="text-xs h-8" value={endDate} onChange={e => setEndDate(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <FormLabel className="text-xs">Reason / Description</FormLabel>
                                <Input required placeholder="e.g. Highway closures or driver holidays" className="text-xs h-8" value={reason} onChange={e => setReason(e.target.value)} />
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
                            <Button variant="outline" size="sm" type="button" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" type="submit" className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white">
                                Save Blackout Period
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
