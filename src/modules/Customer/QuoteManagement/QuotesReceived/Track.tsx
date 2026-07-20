import React, { useState } from 'react';
import { Eye, CheckCircle, Star, ArrowLeft, Truck, Clock, ShieldCheck, TrendingDown, MessageCircle, CreditCard, Hourglass, Info, Calendar } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

const suppliers = ['Prime Movers', 'Express Logistics BD', 'Fast Track BD', 'Global Transport', 'Speedy Cargo', 'Bengal Logistics', 'Trust Transport', 'Quick Move', 'SafeLine Freight', 'Apex Logistics'];
const vehicles = ['Open Truck (16ft)', 'Covered Van (14ft)', 'Covered Van (16ft)', 'Container (20ft)', 'Pickup (7ft)', 'Open Truck (18ft)'];
const terms = ['100% On Delivery', '50% Advance', '30% Advance', 'Corporate Credit', 'Cash on Pickup'];
const statuses = ['Pending', 'Negotiating', 'Pending', 'Pending', 'Accepted'];
const remarksList = ['Labor not included in price. Tolls extra.', 'All inclusive (tolls + driver allowance).', 'Night driving restricted.', 'Premium seal and GPS tracking provided.', '', '', 'Requires advance notice for loading.', 'Subject to weather conditions.'];

// Generate 50 static mock quotes
const mockData = Array.from({ length: 50 }).map((_, i) => {
    const amountBase = 35000 + (Math.random() * 25000);
    return {
        id: `QT-88${20 + i}`,
        supplier: suppliers[i % suppliers.length],
        rating: Number((4.0 + Math.random()).toFixed(1)),
        reviews: Math.floor(Math.random() * 300) + 20,
        vehicle: vehicles[i % vehicles.length],
        transitTime: `${Math.floor(Math.random() * 3) + 1} Days`,
        amount: Math.floor(amountBase / 500) * 500,
        validUntil: `2026-07-${20 + (i % 10)}`,
        status: statuses[i % statuses.length],
        paymentTerms: terms[i % terms.length],
        loadingHours: `${Math.floor(Math.random() * 4) + 1} Hrs Free`,
        remarks: remarksList[i % remarksList.length],
        badges: i === 0 ? ['Cheapest'] : i === 1 ? ['Fastest'] : i === 2 ? ['Best Value'] : [],
        verified: Math.random() > 0.3
    };
});

export default function TrackBids() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [filterMode, setFilterMode] = useState('lowest_price');
    const [visibleCount, setVisibleCount] = useState(20);

    // Dynamic sorting based on filterMode
    const sortedQuotes = [...mockData].sort((a, b) => {
        if (filterMode === 'lowest_price') return a.amount - b.amount;
        if (filterMode === 'top_rated') return b.rating - a.rating;
        if (filterMode === 'fastest') {
            const daysA = parseInt(a.transitTime) || 0;
            const daysB = parseInt(b.transitTime) || 0;
            return daysA - daysB;
        }
        return 0;
    });

    const columns: Column<any>[] = [
        { id: 'id', label: 'Quote ID', render: (row) => <span className="text-indigo-600 font-semibold whitespace-nowrap">{row.id}</span> },
        { 
            id: 'supplier', 
            label: 'Supplier', 
            render: (row) => (
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-bold text-slate-800">{row.supplier}</span>
                    {row.verified && <ShieldCheck size={14} className="text-blue-500" />}
                </div>
            ) 
        },
        { 
            id: 'rating', 
            label: 'Rating', 
            render: (row) => (
                <div className="flex items-center gap-1 whitespace-nowrap">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[13px] font-semibold text-slate-700">{row.rating}</span>
                    <span className="text-[12px] text-slate-400">({row.reviews})</span>
                </div>
            ) 
        },
        { id: 'vehicle', label: 'Vehicle Type', render: (row) => <span className="whitespace-nowrap text-[13px]">{row.vehicle}</span> },
        { id: 'transitTime', label: 'Transit Time', render: (row) => <span className="whitespace-nowrap text-[13px]">{row.transitTime}</span> },
        { id: 'amount', label: 'Quote Amount', render: (row) => <span className="whitespace-nowrap text-[14px] font-bold text-emerald-600">৳ {row.amount.toLocaleString()}</span> },
        { id: 'validUntil', label: 'Valid Until', render: (row) => <span className="whitespace-nowrap text-[13px]">{row.validUntil}</span> },
        { 
            id: 'status', 
            label: 'Status',
            render: (row) => {
                let variant: any = 'default';
                if (row.status === 'Pending') variant = 'secondary';
                if (row.status === 'Negotiating') variant = 'warning';
                if (row.status === 'Accepted') variant = 'success';
                return <Badge variant={variant}>{row.status}</Badge>;
            }
        }
    ];

    const tableActions = (row: any) => (
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => navigate(`/customer/quotes/received/view/${row.id}`)}>
                <Eye size={14} className="mr-1" /> Details
            </Button>
            {row.status === 'Negotiating' ? (
                <Button variant="primary" size="sm" className="h-7 px-2 bg-indigo-600 hover:bg-indigo-700">
                    <MessageCircle size={14} className="mr-1" /> Reply
                </Button>
            ) : (
                <Button variant="primary" size="sm" className="h-7 px-2 bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle size={14} className="mr-1" /> Accept
                </Button>
            )}
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen bg-[#f9fafb]">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <Badge variant="secondary" className="px-2 py-0.5 text-indigo-700 bg-indigo-50 border-indigo-200">{id || 'REQ-9233'}</Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Track Bids & Quotes</h1>
                    <p className="text-sm text-slate-500">Compare all supplier quotes received for this specific request.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    {viewMode === 'card' && (
                        <div className="flex items-center gap-1.5 hidden md:flex border-r border-slate-200 pr-4">
                            <span className="text-[11.5px] font-semibold text-slate-400 mr-1">Sort:</span>
                            {[
                                { id: 'lowest_price', label: 'Price' },
                                { id: 'fastest', label: 'Fastest' },
                                { id: 'top_rated', label: 'Top Rated' }
                            ].map(f => (
                                <button 
                                    key={f.id} 
                                    onClick={() => setFilterMode(f.id)}
                                    className={`px-2.5 py-1 rounded-sm text-[11px] font-semibold transition-colors border whitespace-nowrap ${filterMode === f.id ? 'bg-slate-800 text-white border-slate-800 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    <div className="bg-white border border-slate-200 rounded-md flex items-center p-0.5 shadow-sm">
                        <button 
                            className={`px-2.5 py-1 rounded-sm text-[11px] font-semibold transition-colors ${viewMode === 'card' ? 'bg-slate-100 text-slate-700' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setViewMode('card')}
                        >
                            Card View
                        </button>
                        <button 
                            className={`px-2.5 py-1 rounded-sm text-[11px] font-semibold transition-colors ${viewMode === 'table' ? 'bg-slate-100 text-slate-700' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setViewMode('table')}
                        >
                            Table View
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Filter view */}
            {viewMode === 'card' && (
                <div className="flex md:hidden items-center gap-1.5 mb-4 pb-3 border-b border-slate-200 overflow-x-auto hide-scrollbar">
                    <span className="text-[11.5px] font-semibold text-slate-400 mr-1 whitespace-nowrap">Sort:</span>
                    {[
                        { id: 'lowest_price', label: 'Price' },
                        { id: 'fastest', label: 'Fastest' },
                        { id: 'top_rated', label: 'Top Rated' }
                    ].map(f => (
                        <button 
                            key={f.id} 
                            onClick={() => setFilterMode(f.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors border whitespace-nowrap ${filterMode === f.id ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            )}


            
            {viewMode === 'card' ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {sortedQuotes.slice(0, visibleCount).map((quote, index) => (
                        <div key={quote.id} className={`relative bg-white p-4 rounded-lg border hover:border-slate-300 hover:bg-slate-50 transition-colors flex flex-col items-start w-full ${index === 0 && filterMode ? 'border-emerald-500 hover:border-emerald-500' : 'border-slate-200'}`}>
                            {index === 0 && (
                                <div className="absolute -top-2.5 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    {filterMode === 'lowest_price' ? 'Best Price' : filterMode === 'fastest' ? 'Fastest Option' : 'Top Rated'}
                                </div>
                            )}
                            
                            {/* Top row: Icon & Price */}
                            <div className="flex justify-between items-start w-full mb-3">
                                <div className="w-9 h-9 rounded-md shrink-0 flex items-center justify-center bg-indigo-50 text-indigo-600">
                                    <Truck size={18} strokeWidth={2} />
                                </div>
                                <span className="text-[20px] font-black text-slate-800">৳{quote.amount.toLocaleString()}</span>
                            </div>
                            
                            {/* Title: Supplier Name */}
                            <div className="flex items-center gap-1.5 w-full mb-0.5">
                                <h3 className="font-bold text-[14px] text-slate-900 leading-tight truncate">
                                    {quote.supplier}
                                </h3>
                                {quote.verified && <ShieldCheck size={14} className="text-blue-500 shrink-0" />}
                            </div>
                            
                            {/* Description: Vehicle & Transit */}
                            <p className="text-[12px] text-slate-500 font-medium leading-snug mb-3">
                                {quote.vehicle} • {quote.transitTime} transit
                            </p>

                            {/* Badges & Rating */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-4 w-full">
                                <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700">
                                    <Star size={11} className="fill-amber-500 text-amber-500" />
                                    <span className="text-[11px] font-bold">{quote.rating}</span>
                                    <span className="text-[11px] opacity-70">({quote.reviews})</span>
                                </div>
                                {quote.badges.map(badge => (
                                    <Badge key={badge} variant="secondary" className={`px-1.5 py-0 text-[10px] font-bold ${
                                        badge === 'Cheapest' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                        badge === 'Fastest' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                                        'bg-slate-100 text-slate-700 border-slate-200'
                                    }`}>
                                        {badge}
                                    </Badge>
                                ))}
                            </div>

                            {/* Details */}
                            <div className="flex flex-col gap-1.5 mt-auto mb-4 border-t border-slate-100 pt-3 w-full">
                                <div className="flex items-start text-[12px]">
                                    <span className="text-slate-500 w-[70px] shrink-0">Payment</span>
                                    <span className="text-slate-400 px-1.5">:</span>
                                    <span className="font-semibold text-slate-700">{quote.paymentTerms}</span>
                                </div>
                                <div className="flex items-start text-[12px]">
                                    <span className="text-slate-500 w-[70px] shrink-0">Free Time</span>
                                    <span className="text-slate-400 px-1.5">:</span>
                                    <span className="font-semibold text-slate-700">{quote.loadingHours}</span>
                                </div>
                                <div className="flex items-start text-[12px]">
                                    <span className="text-slate-500 w-[70px] shrink-0">Valid Until</span>
                                    <span className="text-slate-400 px-1.5">:</span>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-semibold text-slate-700">{quote.validUntil}</span>
                                        {quote.status === 'Negotiating' && <Badge variant="warning" className="px-1.5 py-0 text-[10px] font-medium">Negotiating</Badge>}
                                    </div>
                                </div>
                                
                                {quote.remarks && (
                                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-md text-[11px] text-slate-600 flex items-start gap-1.5 mt-1 w-full">
                                        <Info size={12} className="shrink-0 mt-0.5 text-slate-400" />
                                        <span className="leading-snug">{quote.remarks}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-0 mt-auto w-full">
                                <Button variant="outline" className="flex-1 h-8 text-[12px] font-semibold bg-white px-2 text-slate-600" onClick={() => navigate(`/customer/quotes/received/view/${quote.id}`)}>
                                    <Eye size={14} className="mr-1.5 text-slate-400" /> Details
                                </Button>
                                
                                {quote.status === 'Negotiating' ? (
                                    <Button variant="primary" className="flex-1 h-8 text-[12px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 px-2">
                                        <MessageCircle size={14} className="mr-1.5 opacity-80" /> Reply
                                    </Button>
                                ) : (
                                    <Button variant="primary" className="flex-1 h-8 text-[12px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 px-2">
                                        <CheckCircle size={14} className="mr-1.5 opacity-80" /> Accept
                                    </Button>
                                )}
                            </div>
                        </div>
                ))}
                </div>
                
                {visibleCount < sortedQuotes.length && (
                    <div className="mt-8 flex justify-center">
                        <Button 
                            variant="outline" 
                            className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 px-6 h-8 text-[12px]"
                            onClick={() => setVisibleCount(prev => prev + 20)}
                        >
                            View More Quotes
                        </Button>
                    </div>
                )}
                </>
            ) : (
                <DataTable 
                    data={sortedQuotes} 
                    columns={columns} 
                    actions={tableActions}
                    searchPlaceholder="Search quotes or suppliers..."
                    compact={true}
                    filterContent={
                        <div className="flex items-center gap-3">
                            <span className="text-[12px] font-semibold text-slate-600 whitespace-nowrap">Sort By:</span>
                            <div className="flex flex-wrap items-center gap-1.5">
                                {[
                                    { id: 'lowest_price', label: 'Lowest Price' },
                                    { id: 'fastest', label: 'Fastest Transit' },
                                    { id: 'top_rated', label: 'Top Rated' }
                                ].map(f => (
                                    <button 
                                        key={f.id} 
                                        onClick={() => setFilterMode(f.id)}
                                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors border whitespace-nowrap ${filterMode === f.id ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    }
                />
            )}
        </div>
    );
}
