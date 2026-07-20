import os

folder = 'src/modules/Customer/QuoteManagement/CreateRequest'
os.makedirs(folder, exist_ok=True)

# index.tsx (List)
index_content = """import React from 'react';
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
"""

# Create.tsx
create_content = """import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CreateRequestForm() {
    const navigate = useNavigate();

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Create New Request</h1>
                        <p className="text-sm text-slate-500 font-medium">Fill out the form below to request a new quote.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button variant="primary">
                        <Save size={16} className="mr-2" /> Save & Submit
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                    <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
                        <h2 className="text-[14px] font-bold text-slate-800">General Details</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1">Pickup Location</label>
                                <input type="text" className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Enter pickup address" />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1">Delivery Location</label>
                                <input type="text" className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Enter delivery address" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1">Pickup Date</label>
                                <input type="date" className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1">Target Delivery Date</label>
                                <input type="date" className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                    <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
                        <h2 className="text-[14px] font-bold text-slate-800">Load Information</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1">Load Type</label>
                                <select className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                                    <option>Select type...</option>
                                    <option>Pallets</option>
                                    <option>Boxes</option>
                                    <option>Machinery</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1">Total Weight (KG)</label>
                                <input type="number" className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="0" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1">Special Instructions</label>
                            <textarea className="w-full p-3 rounded-md border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none min-h-[80px]" placeholder="Enter any special instructions for the carrier..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
"""

# Edit.tsx
edit_content = create_content.replace('Create New Request', 'Edit Request').replace('Fill out the form below to request a new quote.', 'Update the details for your request.')

# View.tsx
view_content = """import React from 'react';
import { ArrowLeft, Edit } from 'lucide-react';
import Button from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

export default function ViewRequest() {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Request {id || 'REQ-9234'}</h1>
                        <p className="text-sm text-slate-500 font-medium">Viewing request details.</p>
                    </div>
                </div>
                <Button variant="primary" onClick={() => navigate(`/customer/quotes/create/edit/${id || 'REQ-9234'}`)}>
                    <Edit size={16} className="mr-2" /> Edit Request
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                    <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
                        <h2 className="text-[14px] font-bold text-slate-800">General Details</h2>
                    </div>
                    <div className="p-5">
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                            <div>
                                <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pickup Location</dt>
                                <dd className="text-sm font-medium text-slate-900">Dhaka</dd>
                            </div>
                            <div>
                                <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Delivery Location</dt>
                                <dd className="text-sm font-medium text-slate-900">Chittagong</dd>
                            </div>
                            <div>
                                <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pickup Date</dt>
                                <dd className="text-sm font-medium text-slate-900">2026-07-20</dd>
                            </div>
                            <div>
                                <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Delivery Date</dt>
                                <dd className="text-sm font-medium text-slate-900">2026-07-22</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                    <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
                        <h2 className="text-[14px] font-bold text-slate-800">Load Information</h2>
                    </div>
                    <div className="p-5">
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                            <div>
                                <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Load Type</dt>
                                <dd className="text-sm font-medium text-slate-900">Pallets</dd>
                            </div>
                            <div>
                                <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Weight (KG)</dt>
                                <dd className="text-sm font-medium text-slate-900">2,500</dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Special Instructions</dt>
                                <dd className="text-sm font-medium text-slate-900">Handle with care. Fragile items included.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
"""

with open(os.path.join(folder, 'index.tsx'), 'w', encoding='utf-8') as f: f.write(index_content)
with open(os.path.join(folder, 'Create.tsx'), 'w', encoding='utf-8') as f: f.write(create_content)
with open(os.path.join(folder, 'Edit.tsx'), 'w', encoding='utf-8') as f: f.write(edit_content)
with open(os.path.join(folder, 'View.tsx'), 'w', encoding='utf-8') as f: f.write(view_content)

print("CRUD files generated successfully!")
