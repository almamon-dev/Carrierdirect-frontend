import React, { useState, useEffect } from 'react';
import { Eye, Send, Lock } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { mockQuoteRequests, QuoteRequest } from '../data/quoteRequestsData';
import { SubscriptionLockModal } from '@/components/modals';
import QuotaReminderBanner from '@/components/common/QuotaReminderBanner';
import { apiClient } from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';

export default function QuoteRequests() {
    const navigate = useNavigate();
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [lockedFeatureName, setLockedFeatureName] = useState('Premium RFQ Bidding');
    const [requests, setRequests] = useState<QuoteRequest[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchRequests() {
            try {
                const res = await apiClient.get(ENDPOINTS.SUPPLIER.AVAILABLE_REQUESTS);
                const raw = res.data?.data?.requests || res.data?.data || res.data || res;
                const resArray = Array.isArray(raw) ? raw : (Array.isArray(raw?.requests) ? raw.requests : []);
                const mapped: QuoteRequest[] = resArray.map((q: any) => ({
                    id: `REQ-${q.id}`,
                    rawId: q.id,
                    slug: String(q.id),
                    requestDate: q.pickup_date ? new Date(q.pickup_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
                    customer: q.user?.name || q.client_name || q.pickup_company || 'Verified Shipper',
                    pickup: [q.pickup_city, q.pickup_country].filter(Boolean).join(', ') || q.pickup_address || 'Dhaka',
                    delivery: [q.delivery_city, q.delivery_country].filter(Boolean).join(', ') || q.delivery_address || 'Chittagong',
                    distance: q.est_distance || q.distance_miles ? `${q.est_distance || q.distance_miles} km` : '245 km',
                    budget: q.budget ? `${q.currency || '€'}${q.budget}` : 'Negotiable',
                    priority: q.priority || 'Normal',
                    status: q.status === 'active' ? 'New' : (q.status || 'New'),
                    vehicleType: q.vehicle_type || 'Covered Van',
                    loadType: q.load_type || 'Pallets',
                    weight: q.weight ? `${q.weight} kg` : '2500 kg',
                    volume: q.volume ? `${q.volume} m³` : '15 m³',
                    notes: q.customer_notes || q.additional_notes || '',
                }));
                if (isMounted) setRequests(mapped);
            } catch (err) {
                console.error('Failed to fetch available requests', err);
                if (isMounted) setRequests(mockQuoteRequests);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        fetchRequests();
        return () => { isMounted = false; };
    }, []);

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
            render: (row) => <span className="whitespace-nowrap text-slate-600 text-xs font-semibold">{row.distance}</span>
        },
        { 
            id: 'budget', 
            label: 'Est. Budget',
            render: (row) => <span className="whitespace-nowrap font-bold text-slate-900">{row.budget}</span>
        },
        { 
            id: 'priority', 
            label: 'Priority',
            render: (row) => (
                <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${
                    row.priority === 'Urgent' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    row.priority === 'High' ? 'bg-orange-50 text-orange-800 border-orange-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                    {row.priority}
                </Badge>
            )
        },
        { 
            id: 'status', 
            label: 'Status',
            render: (row) => (
                <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${
                    row.status === 'New' || row.status === 'Negotiation' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                    {row.status}
                </Badge>
            )
        },
    ];

    const renderActions = (row: QuoteRequest) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/supplier/quotes/requests/${row.slug}`)}
                className="h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            >
                <Eye size={14} className="mr-1" />
                <span>View</span>
            </Button>
            
            {row.priority === 'Urgent' ? (
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleQuoteAction(row)}
                    className="h-8 px-2.5 text-xs text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100 flex items-center gap-1 cursor-pointer"
                >
                    <Lock size={13} className="text-amber-600" />
                    <span>Locked</span>
                </Button>
            ) : (
                <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleQuoteAction(row)}
                    className="h-8 px-3 text-xs bg-[#ff4a1f] hover:bg-[#e63d15] text-white flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                    <Send size={13} />
                    <span>Quote</span>
                </Button>
            )}
        </div>
    );

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80 mb-3">
            <div>
                <label className="text-xs font-semibold text-slate-600">Priority Level</label>
                <Select value="all" showSearch={false}>
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                </Select>
            </div>
            <div>
                <label className="text-xs font-semibold text-slate-600">Status</label>
                <Select value="all" showSearch={false}>
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </Select>
            </div>
            <div>
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
            </div>

            {/* Carrier Quota Reminder Banner */}
            <QuotaReminderBanner 
                quotaUsed={142} 
                maxQuota={250} 
                unitLabel="monthly quote responses"
                title="Carrier Plan Quota Reminder"
                targetUrl="/supplier/subscription"
                buttonText="Upgrade Carrier Plan"
            />

            <DataTable 
                data={requests} 
                columns={columns} 
                actions={renderActions}
                filterContent={filterContent}
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search by ID, customer, pickup/delivery..."
                compact={true}
                hideViewToggle={true}
                isLoading={isLoading}
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
