import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';

export default function POD() {
    const pods = [
        { id: 'POD-10293', jobId: 'JOB-2024-001', customer: 'Acme Corp', uploadDate: 'Jul 21, 2026', driver: 'John Doe', status: 'Pending Review' },
        { id: 'POD-10294', jobId: 'JOB-2024-005', customer: 'Global Tech', uploadDate: 'Jul 20, 2026', driver: 'Sarah Lee', status: 'Approved' },
        { id: 'POD-10295', jobId: 'JOB-2024-008', customer: 'Wayne Ent.', uploadDate: 'Jul 19, 2026', driver: 'Mike Ross', status: 'Rejected' },
    ];

    const columns = [
        { id: 'id', label: 'POD ID', render: (row: any) => <span className="font-semibold text-slate-800">{row.id}</span> },
        { id: 'jobId', label: 'Job Reference', render: (row: any) => <span className="text-indigo-600 font-medium hover:underline cursor-pointer">{row.jobId}</span> },
        { id: 'customer', label: 'Customer', render: (row: any) => <span className="font-medium text-slate-900">{row.customer}</span> },
        { id: 'driver', label: 'Uploaded By (Driver)', render: (row: any) => <span className="text-slate-600">{row.driver}</span> },
        { id: 'uploadDate', label: 'Upload Date', render: (row: any) => <span className="text-slate-600">{row.uploadDate}</span> },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row: any) => (
                <Badge variant="secondary" className={
                    row.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                    row.status === 'Pending Review' ? 'bg-amber-50 text-amber-700' :
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
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600" title="View Document">
                        <FileText size={16} />
                    </Button>
                    {row.status === 'Pending Review' && (
                        <>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-emerald-600" title="Approve">
                                <CheckCircle size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-600" title="Reject">
                                <XCircle size={16} />
                            </Button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-6 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Proof of Delivery (POD)</h1>
                    <p className="text-sm text-slate-500 mt-1">Review, approve, and manage POD documents submitted by drivers.</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <DataTable columns={columns} data={pods} />
            </div>
        </div>
    );
}
