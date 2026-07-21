import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import DataTable from '@/components/tables/data-table';
import { Plus, Download } from 'lucide-react';

export default function BlackoutDates() {
    const data = [{ date: 'Dec 24 - Dec 26', type: 'Public Holiday', reason: 'Christmas Break', impact: 'Full Closure' }, { date: 'Aug 15', type: 'Company Event', reason: 'Annual Retreat', impact: 'Partial Closure' }];
    const columns = [{ id: 'date', label: 'Date Range', render: (r: any) => <span className='font-semibold text-slate-800'>{r.date}</span> }, { id: 'type', label: 'Type' }, { id: 'reason', label: 'Reason' }, { id: 'impact', label: 'Impact', render: (r: any) => <span className='text-[10px] bg-red-50 text-red-700 px-2 py-1 rounded'>{r.impact}</span> }];

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 mb-1">Blackout Dates</h1>
                    <p className="text-[12px] text-slate-500 font-medium">Set specific dates where operations are paused.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm">
                        <Download size={14} />
                        Export
                    </Button>
                    <Button variant="primary" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm">
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
