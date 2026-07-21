import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import DataTable from '@/components/tables/data-table';
import { Plus, Download } from 'lucide-react';

export default function CapacityManagement() {
    const data = [{ metric: 'Daily Trips', limit: '20 Trips', current: '15 Trips', status: 'Healthy' }, { metric: 'Daily Weight Vol.', limit: '10,000 kg', current: '9,500 kg', status: 'Warning' }];
    const columns = [{ id: 'metric', label: 'Metric', render: (r: any) => <span className='font-semibold text-slate-800'>{r.metric}</span> }, { id: 'limit', label: 'Maximum Limit' }, { id: 'current', label: 'Current Usage' }, { id: 'status', label: 'Health', render: (r: any) => <span className='text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded'>{r.status}</span> }];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-4 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900">Capacity Management</h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">Monitor and adjust your operational limits.</p>
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

            <Card className="flex flex-col shadow-sm border-slate-200">
                <CardHeader className="py-3 px-4 border-b border-slate-100">
                    <CardTitle className="text-[13px]">Overview</CardTitle>
                </CardHeader>
                <div className="p-0 flex-1">
                    <DataTable 
                        columns={columns} 
                        data={data} 
                        hideViewToggle={true}
                        searchPlaceholder="Search records..."
                    />
                </div>
            </Card>
        </div>
    );
}
