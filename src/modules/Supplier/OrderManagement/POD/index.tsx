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
        { id: 'jobId', label: 'Job Reference', render: (row: any) => <span className="text-brand font-medium hover:underline cursor-pointer">{row.jobId}</span> },
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
    ];

    const renderActions = (row: any) => (
        <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-brand hover:bg-brand-light" title="View Document">
                <FileText size={16} />
            </Button>
            {row.status === 'Pending Review' && (
                <>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" title="Approve">
                        <CheckCircle size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50" title="Reject">
                        <XCircle size={16} />
                    </Button>
                </>
            )}
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 mb-1">Proof of Delivery (POD)</h1>
                    <p className="text-[12px] text-slate-500 font-medium">Review, approve, and manage POD documents submitted by drivers.</p>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={pods} 
                compact={true}
                searchPlaceholder="Search PODs..."
                hideViewToggle={true}
                actions={renderActions}
            />
        </div>
    );
}
