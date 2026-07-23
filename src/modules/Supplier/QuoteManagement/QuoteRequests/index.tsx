import React, { useState } from 'react';
import { Eye, Send, Lock } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { mockQuoteRequests, QuoteRequest } from '../data/quoteRequestsData';
import { SubscriptionLockModal } from '@/components/modals';

export default function QuoteRequests() {
    const navigate = useNavigate();
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [lockedFeatureName, setLockedFeatureName] = useState('Premium RFQ Bidding');

    const handleQuoteAction = (row: QuoteRequest) => {
        if (row.priority === 'Urgent' || row.budget === '€4,500') {
            setLockedFeatureName(`Priority RFQ Match: ${row.id}`);
            setIsLockModalOpen(true);
        } else {
            navigate(`/supplier/quotes/requests/${row.slug}`);
        }
    };

    const columns: Column<QuoteRequest>[] = [
        { 
            id: 'id', 
            label: 'Request ID', 
            render: (row) => (
                <button 
                    onClick={() => navigate(`/supplier/quotes/requests/${row.slug}`)}
                    className="font-bold text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer"
                >
                    {row.id}
                </button>
            )
        },
        { 
            id: 'requestDate', 
            label: 'Request Date',
            render: (row) => <span className="whitespace-nowrap text-xs text-slate-500">{row.requestDate}</span>
        },
        { 
            id: 'customer', 
            label: 'Customer',
            render: (row) => <span className="font-semibold text-slate-900 whitespace-nowrap">{row.customer}</span>
        },
        { 
            id: 'pickup', 
            label: 'Pickup Location',
            render: (row) => <span className="whitespace-nowrap font-medium text-slate-800">{row.pickup}</span>
        },
        { 
            id: 'delivery', 
            label: 'Delivery Location',
            render: (row) => <span className="whitespace-nowrap font-medium text-slate-800">{row.delivery}</span>
        },
        { 
            id: 'distance', 
            label: 'Distance',
            render: (row) => <span className="whitespace-nowrap text-xs font-medium text-slate-600">{row.distance}</span>
        },
        { 
            id: 'vehicleType', 
            label: 'Vehicle Type',
            render: (row) => <span className="whitespace-nowrap text-xs font-semibold text-slate-700">{row.vehicleType}</span>
        },
        { 
            id: 'loadType', 
            label: 'Load Type',
            render: (row) => <span className="whitespace-nowrap text-xs font-medium text-slate-600">{row.loadType}</span>
        },
        { 
            id: 'weight', 
            label: 'Weight',
            render: (row) => <span className="whitespace-nowrap text-xs text-slate-600">{row.weight}</span>
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
            id: 'timeRemaining', 
            label: 'Time Left', 
            render: (row) => (
                <span className={`font-semibold text-xs whitespace-nowrap ${row.status === 'Expired' ? 'text-slate-400' : 'text-amber-600'}`}>
                    {row.timeRemaining}
                </span>
            )
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
                <Eye size={13} className="mr-1" /> View
            </Button>
            {row.status !== 'Expired' && (
                <Button 
                    variant="primary" 
                    size="sm" 
                    className="h-8 px-2.5 text-xs font-semibold"
                    onClick={() => handleQuoteAction(row)}
                >
                    <Send size={13} className="mr-1" /> Quote
                </Button>
            )}
        </div>
    );

    const filterContent = (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Sort By</label>
                <Select value="newest" showSearch={false}>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_high">Highest Price (Budget)</option>
                    <option value="price_low">Lowest Price (Budget)</option>
                </Select>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Status</label>
                <Select value="all" showSearch={false}>
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
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
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Quote Requests</h1>
                    <p className="text-xs text-slate-500 font-medium">Manage and respond to customer transportation requests.</p>
                </div>
                <Button 
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 text-xs font-semibold border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer"
                    onClick={() => {
                        setLockedFeatureName("Unlimited RFQ Bidding Quota");
                        setIsLockModalOpen(true);
                    }}
                >
                    <Lock size={13} className="text-amber-600" />
                    <span>Quota: 142 / 250 Sent</span>
                </Button>
            </div>

            <DataTable 
                data={mockQuoteRequests} 
                columns={columns} 
                actions={renderActions}
                filterContent={filterContent}
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search by ID, customer, pickup/delivery..."
                compact={true}
                hideViewToggle={true}
            />

            {/* Subscription Lock / Upgrade Gate Modal */}
            <SubscriptionLockModal 
                isOpen={isLockModalOpen}
                onClose={() => setIsLockModalOpen(false)}
                featureName={lockedFeatureName}
                userType="supplier"
                title="Carrier Subscription Required"
                description="Upgrade your carrier account to unlock priority freight RFQs, unlimited quote submissions, and instant auto-bidding."
                requiredPlan="Professional Fleet (€49/mo)"
                benefits={[
                    "250 Monthly RFQ Quote Submissions",
                    "Priority Placement for Shippers",
                    "Stripe Express Instant Payout Clearance",
                    "ADR Hazardous Cargo Bidding Access"
                ]}
            />
        </div>
    );
}
