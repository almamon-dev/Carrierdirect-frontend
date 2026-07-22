import React from 'react';
import { Eye, Send } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { mockQuoteRequests, QuoteRequest } from '../data/quoteRequestsData';

export default function QuoteRequests() {
    const navigate = useNavigate();

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
            label: 'Request Date',
            render: (row) => <span className="whitespace-nowrap">{row.requestDate}</span>
        },
        { 
            id: 'customer', 
            label: 'Customer',
            render: (row) => <span className="font-medium text-slate-800 whitespace-nowrap">{row.customer}</span>
        },
        { 
            id: 'pickup', 
            label: 'Pickup Location',
            render: (row) => <span className="whitespace-nowrap font-medium text-slate-700">{row.pickup}</span>
        },
        { 
            id: 'delivery', 
            label: 'Delivery Location',
            render: (row) => <span className="whitespace-nowrap font-medium text-slate-700">{row.delivery}</span>
        },
        { 
            id: 'distance', 
            label: 'Distance',
            render: (row) => <span className="whitespace-nowrap">{row.distance}</span>
        },
        { 
            id: 'vehicleType', 
            label: 'Vehicle Type',
            render: (row) => <span className="whitespace-nowrap">{row.vehicleType}</span>
        },
        { 
            id: 'loadType', 
            label: 'Load Type',
            render: (row) => <span className="whitespace-nowrap">{row.loadType}</span>
        },
        { 
            id: 'weight', 
            label: 'Weight',
            render: (row) => <span className="whitespace-nowrap">{row.weight}</span>
        },
        { 
            id: 'pickupDate', 
            label: 'Pickup Date',
            render: (row) => <span className="whitespace-nowrap">{row.pickupDate}</span>,
            defaultHidden: true
        },
        { 
            id: 'deliveryDate', 
            label: 'Delivery Date',
            render: (row) => <span className="whitespace-nowrap">{row.deliveryDate}</span>,
            defaultHidden: true
        },
        { 
            id: 'budget', 
            label: 'Budget (Initial)',
            render: (row) => row.budget && row.budget !== '-' ? <span className="whitespace-nowrap font-bold text-emerald-600">{row.budget}</span> : <span className="text-slate-400 italic text-xs">Not specified</span>
        },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row) => {
                let variant: any = 'default';
                if (row.status === 'New') variant = 'info';
                if (row.status === 'Quoted') variant = 'success';
                if (row.status === 'Negotiation') variant = 'warning';
                if (row.status === 'Expired') variant = 'critical';
                return <Badge variant={variant}>{row.status}</Badge>;
            }
        },
        { 
            id: 'priority', 
            label: 'Priority', 
            render: (row) => {
                let variant: any = 'default';
                if (row.priority === 'Medium') variant = 'info';
                if (row.priority === 'High') variant = 'warning';
                if (row.priority === 'Urgent') variant = 'critical';
                return <Badge variant={variant}>{row.priority}</Badge>;
            },
            defaultHidden: true
        },
        { 
            id: 'timeRemaining', 
            label: 'Time Left', 
            render: (row) => (
                <span className={`font-medium whitespace-nowrap ${row.status === 'Expired' ? 'text-slate-400' : 'text-amber-600'}`}>
                    {row.timeRemaining}
                </span>
            )
        },
        { 
            id: 'assignedTo', 
            label: 'Assigned To',
            render: (row) => <span className={`whitespace-nowrap ${row.assignedTo === 'Unassigned' ? 'text-slate-400 italic' : 'font-medium'}`}>{row.assignedTo}</span>,
            defaultHidden: true
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
                <Eye size={14} className="mr-1" /> View
            </Button>
            {row.status !== 'Expired' && (
                <Button 
                    variant="primary" 
                    size="sm" 
                    className="h-7 px-2"
                    onClick={() => navigate(`/supplier/quotes/requests/${row.slug}`)}
                >
                    <Send size={14} className="mr-1" /> Quote
                </Button>
            )}
        </div>
    );

    const filterContent = (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Sort By</label>
                <Select value="newest" showSearch={false}>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="nearest">Nearest Location</option>
                    <option value="price_high">Highest Price (Budget)</option>
                    <option value="price_low">Lowest Price (Budget)</option>
                </Select>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Status</label>
                <Select value="all" showSearch={false}>
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="viewed">Viewed</option>
                    <option value="quoted">Quoted</option>
                    <option value="negotiation">Negotiation</option>
                </Select>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Vehicle Type</label>
                <Select value="all" showSearch={false}>
                    <option value="all">All Vehicles</option>
                    <option value="covered_van">Covered Van</option>
                    <option value="open_truck">Open Truck</option>
                    <option value="refrigerated">Refrigerated Van</option>
                    <option value="trailer">Trailer</option>
                </Select>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Load Type</label>
                <Select value="all" showSearch={false}>
                    <option value="all">All Types</option>
                    <option value="pallet">Pallet / Box</option>
                    <option value="fragile">Fragile</option>
                    <option value="machinery">Machinery</option>
                    <option value="container">Containers</option>
                </Select>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Pickup Area</label>
                <Select value="all" showSearch={true}>
                    <option value="all">Any Location</option>
                    <option value="dhaka">Dhaka</option>
                    <option value="chittagong">Chittagong</option>
                    <option value="sylhet">Sylhet</option>
                    <option value="khulna">Khulna</option>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 mb-1">Quote Requests</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage and respond to customer transportation requests.</p>
                </div>
            </div>

            <DataTable 
                key="quote_requests_list_v9"
                tableId="quote_requests_list_v9"
                data={mockQuoteRequests} 
                columns={columns} 
                actions={renderActions}
                filterContent={filterContent}
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search by ID, Customer, Location..."
                compact={true}
            />
        </div>
    );
}
