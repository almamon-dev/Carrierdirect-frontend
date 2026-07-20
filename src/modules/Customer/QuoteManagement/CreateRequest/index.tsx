import React from 'react';
import { Eye, Edit, Plus, Search } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const mockData = [
    { id: 'REQ-9234', date: '2026-07-20', pickup: 'Dhaka', delivery: 'Chittagong', load: 'Pallets', status: 'Draft' },
    { id: 'REQ-9233', date: '2026-07-19', pickup: 'Sylhet', delivery: 'Rajshahi', load: 'Boxes', status: 'Submitted' },
];

export default function RequestList() {
    const navigate = useNavigate();

    const columns: Column<any>[] = [
        { id: 'id', label: 'Request ID', render: (row) => <span className="font-bold text-indigo-600 whitespace-nowrap">{row.id}</span> },
        { id: 'date', label: 'Request Date', render: (row) => <span className="whitespace-nowrap">{row.date}</span> },
        { id: 'pickup', label: 'Pickup Location', render: (row) => <span className="whitespace-nowrap">{row.pickup}</span> },
        { id: 'delivery', label: 'Delivery Location', render: (row) => <span className="whitespace-nowrap">{row.delivery}</span> },
        { id: 'load', label: 'Load Type', render: (row) => <span className="whitespace-nowrap">{row.load}</span> },
        { 
            id: 'status', 
            label: 'Status',
            render: (row) => {
                let variant: any = 'default';
                if (row.status === 'Draft') variant = 'info';
                if (row.status === 'Submitted') variant = 'success';
                return <Badge variant={variant}>{row.status}</Badge>;
            }
        }
    ];

    const actions = (row: any) => (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => navigate(`/customer/quotes/create/view/${row.id}`)}>
                <Eye size={14} className="mr-1" /> View
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => navigate(`/customer/quotes/create/edit/${row.id}`)}>
                <Edit size={14} className="mr-1" /> Edit
            </Button>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Quote Requests</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage your requests for transportation quotes.</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/customer/quotes/create/new')}>
                    <Plus size={16} className="mr-2" /> Create New Request
                </Button>
            </div>
            
            <DataTable 
                data={mockData} 
                columns={columns} 
                actions={actions}
                searchPlaceholder="Search requests..."
                compact={true}
            />
        </div>
    );
}
