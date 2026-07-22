import React from 'react';
import { Eye, CheckCircle } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { mockQuoteRequests, QuoteRequest } from '../data/quoteRequestsData';

export default function WonQuotes() {
    const navigate = useNavigate();

    // Filter won/quoted requests for demonstration
    const wonData = mockQuoteRequests.filter(q => q.status === 'Quoted' || q.status === 'New');

    const columns: Column<QuoteRequest>[] = [
        { 
            id: 'id', 
            label: 'Request ID', 
            render: (row) => (
                <button 
                    onClick={() => navigate(`/supplier/quotes/requests/${row.slug}`)}
                    className="font-bold text-brand hover:underline text-left whitespace-nowrap"
                >
                    {row.id}
                </button>
            )
        },
        { 
            id: 'requestDate', 
            label: 'Accepted Date',
            render: (row) => <span className="whitespace-nowrap">{row.requestDate}</span>
        },
        { 
            id: 'customer', 
            label: 'Customer',
            render: (row) => <span className="font-medium text-slate-800 whitespace-nowrap">{row.customer}</span>
        },
        { 
            id: 'pickup', 
            label: 'Pickup',
            render: (row) => <span className="whitespace-nowrap font-medium text-slate-700">{row.pickup}</span>
        },
        { 
            id: 'delivery', 
            label: 'Delivery',
            render: (row) => <span className="whitespace-nowrap font-medium text-slate-700">{row.delivery}</span>
        },
        { 
            id: 'vehicleType', 
            label: 'Vehicle Type',
            render: (row) => <span className="whitespace-nowrap">{row.vehicleType}</span>
        },
        { 
            id: 'budget', 
            label: 'Won Amount',
            render: (row) => <span className="whitespace-nowrap font-bold text-emerald-600">{row.budget}</span>
        },
        { 
            id: 'status', 
            label: 'Status', 
            render: () => <Badge variant="success">Won / Booked</Badge>
        }
    ];

    const renderActions = (row: QuoteRequest) => (
        <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-2"
                onClick={() => navigate(`/supplier/quotes/requests/${row.slug}`)}
            >
                <Eye size={14} className="mr-1" /> Details
            </Button>
            <Button 
                variant="primary" 
                size="sm" 
                className="h-7 px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => navigate('/supplier/orders/active-jobs')}
            >
                <CheckCircle size={14} className="mr-1" /> View Job
            </Button>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 mb-1">Won Quotes</h1>
                    <p className="text-sm text-slate-500 font-medium">View and manage transportation quotes you have successfully won.</p>
                </div>
            </div>

            <DataTable 
                key="wonquotes_list_v2"
                tableId="wonquotes_list_v2"
                data={wonData} 
                columns={columns} 
                actions={renderActions}
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search by ID, Customer, Location..."
                compact={true}
            />
        </div>
    );
}
