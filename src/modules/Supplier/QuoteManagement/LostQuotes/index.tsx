import React from 'react';
import { Eye } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { mockQuoteRequests, QuoteRequest } from '../data/quoteRequestsData';

export default function LostQuotes() {
    const navigate = useNavigate();

    // Filter expired / lost requests
    const lostData = mockQuoteRequests.filter(q => q.status === 'Expired');

    const columns: Column<QuoteRequest>[] = [
        { 
            id: 'id', 
            label: 'Request ID', 
            render: (row) => (
                <button 
                    onClick={() => navigate(`/supplier/quotes/requests/${row.slug}`)}
                    className="font-bold text-slate-700 hover:text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer"
                >
                    {row.id}
                </button>
            )
        },
        { 
            id: 'requestDate', 
            label: 'Expired Date',
            render: (row) => <span className="whitespace-nowrap text-xs text-slate-500">{row.requestDate}</span>
        },
        { 
            id: 'customer', 
            label: 'Customer',
            render: (row) => <span className="font-semibold text-slate-900 whitespace-nowrap">{row.customer}</span>
        },
        { 
            id: 'pickup', 
            label: 'Pickup',
            render: (row) => <span className="whitespace-nowrap font-medium text-slate-800">{row.pickup}</span>
        },
        { 
            id: 'delivery', 
            label: 'Delivery',
            render: (row) => <span className="whitespace-nowrap font-medium text-slate-800">{row.delivery}</span>
        },
        { 
            id: 'vehicleType', 
            label: 'Vehicle Type',
            render: (row) => <span className="whitespace-nowrap text-xs font-semibold text-slate-700">{row.vehicleType}</span>
        },
        { 
            id: 'budget', 
            label: 'Target Budget',
            render: (row) => <span className="whitespace-nowrap font-bold text-slate-500">{row.budget}</span>
        },
        { 
            id: 'status', 
            label: 'Status', 
            render: () => <Badge variant="critical">Expired / Lost</Badge>
        }
    ];

    const renderActions = (row: QuoteRequest) => (
        <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2.5 text-xs font-semibold"
                onClick={() => navigate(`/supplier/quotes/requests/${row.slug}`)}
            >
                <Eye size={13} className="mr-1" /> View Details
            </Button>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Lost Quotes</h1>
                    <p className="text-xs text-slate-500 font-medium">Review past transportation quote requests that were expired or lost.</p>
                </div>
            </div>

            <DataTable 
                data={lostData} 
                columns={columns} 
                actions={renderActions}
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search lost quotes by ID, customer, location..."
                compact={true}
                hideViewToggle={true}
            />
        </div>
    );
}
