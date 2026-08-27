import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, Star, ArrowLeft, Truck, Clock, ShieldCheck, TrendingDown, MessageCircle, CreditCard, Hourglass, Info, Calendar, Loader2 } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '@/lib/axios';

export default function TrackBids() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [quoteRequestDetails, setQuoteRequestDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [filterMode, setFilterMode] = useState('lowest_price');

    const fetchBids = async () => {
        setIsLoading(true);
        const cleanId = id ? String(id).replace('REQ-', '') : '';
        try {
            if (cleanId) {
                try {
                    const res = await apiClient.get(`/customer/quote-requests/${cleanId}/quotes`);
                    const quotesList = res.data?.quotes_request || res.data?.quotes || res.data?.data?.quotes || res.data?.data || [];
                    if (Array.isArray(quotesList) && quotesList.length > 0) {
                        setQuotes(quotesList);
                        setQuoteRequestDetails(res.data?.quote_details || null);
                        return;
                    }
                } catch {
                    // Fallback to all received quotes and filter by request ID
                }

                // Fallback attempt
                const resAll = await apiClient.get('/customer/quotes/received');
                const allList = resAll.data?.data?.quotes || resAll.data?.quotes_request || resAll.data?.quotes || resAll.data?.data || resAll.data || [];
                const filtered = Array.isArray(allList)
                    ? allList.filter((item: any) => String(item.quote_request_id || item.request_id || item.quote_request?.id) === String(cleanId))
                    : [];
                setQuotes(filtered);
            } else {
                const res = await apiClient.get('/customer/quotes/received');
                const quotesList = res.data?.data?.quotes || res.data?.quotes_request || res.data?.quotes || res.data?.data || res.data || [];
                setQuotes(Array.isArray(quotesList) ? quotesList : []);
            }
        } catch (error) {
            console.error('Failed to fetch bids:', error);
            setQuotes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBids();
    }, [id]);

    // Dynamic sorting based on filterMode
    const sortedQuotes = [...quotes].sort((a, b) => {
        const amtA = a.amount_raw || parseFloat(String(a.amount).replace(/[^0-9.]/g, '')) || 0;
        const amtB = b.amount_raw || parseFloat(String(b.amount).replace(/[^0-9.]/g, '')) || 0;

        if (filterMode === 'lowest_price') return amtA - amtB;
        if (filterMode === 'top_rated') return (b.rating || 0) - (a.rating || 0);
        if (filterMode === 'fastest') {
            const daysA = parseInt(a.estimated_delivery || a.transit_time || '0') || 0;
            const daysB = parseInt(b.estimated_delivery || b.transit_time || '0') || 0;
            return daysA - daysB;
        }
        return 0;
    });

    const columns: Column<any>[] = [
        {
            id: 'id',
            label: 'Quote ID',
            render: (row) => <span className="text-brand font-semibold whitespace-nowrap">{row.quote_id || `QT-${row.id}`}</span>
        },
        {
            id: 'supplier',
            label: 'Supplier',
            render: (row) => (
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-bold text-slate-800">{row.supplier_name || row.supplier?.company_name || row.supplier?.name || 'Supplier'}</span>
                    {(row.supplier?.is_verified || row.supplier_is_verified) && <ShieldCheck size={14} className="text-brand" />}
                </div>
            )
        },
        {
            id: 'rating',
            label: 'Rating',
            render: (row) => (
                <div className="flex items-center gap-1 whitespace-nowrap">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[13px] font-semibold text-slate-700">{row.rating || 0}</span>
                    {row.reviews_count ? <span className="text-[12px] text-slate-400">({row.reviews_count})</span> : null}
                </div>
            )
        },
        { id: 'vehicle', label: 'Vehicle Type', render: (row) => <span className="whitespace-nowrap text-[13px]">{row.vehicle || row.vehicle_type || 'N/A'}</span> },
        { id: 'transitTime', label: 'Transit Time', render: (row) => <span className="whitespace-nowrap text-[13px]">{row.estimated_delivery || row.transit_time || 'N/A'}</span> },
        { id: 'amount', label: 'Quote Amount', render: (row) => <span className="whitespace-nowrap text-[14px] font-bold text-emerald-600">{row.amount || (row.currency ? `${row.currency} ${row.amount_raw}` : `€ ${row.amount_raw}`)}</span> },
        { id: 'validUntil', label: 'Valid Until', render: (row) => <span className="whitespace-nowrap text-[13px]">{row.valid_until || 'N/A'}</span> },
        {
            id: 'status',
            label: 'Status',
            render: (row) => {
                const st = (row.status_raw || row.status || 'pending').toLowerCase();
                let variant: any = 'default';
                if (st === 'pending') variant = 'secondary';
                if (st === 'negotiating') variant = 'warning';
                if (st === 'accepted') variant = 'success';
                if (st === 'rejected') variant = 'critical';
                return <Badge variant={variant}>{row.status || 'Pending'}</Badge>;
            }
        }
    ];

    const tableActions = (row: any) => (
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => navigate(`/customer/quotes/received/view/${row.id}`)}>
                <Eye size={14} className="mr-1" /> Details
            </Button>
            <Button
                variant="primary"
                size="sm"
                className="h-7 px-2 bg-brand hover:bg-brand-hover"
                onClick={() => navigate(`/customer/quotes/negotiation/view/${row.id}`)}
            >
                <MessageCircle size={14} className="mr-1" /> Chat
            </Button>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} /> Back
                    </Button>
                    <div>
                        <h1 className="text-[20px] font-bold text-slate-900">
                            {id ? `Bids for Request #${id}` : 'Track Bids & Offers'}
                        </h1>
                        <p className="text-sm text-slate-500">
                            Compare supplier quotes and choose the best offer for your shipment.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        className="h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand"
                        value={filterMode}
                        onChange={(e) => setFilterMode(e.target.value)}
                    >
                        <option value="lowest_price">Lowest Price</option>
                        <option value="top_rated">Top Rated Supplier</option>
                        <option value="fastest">Fastest Transit</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="p-12 flex items-center justify-center text-slate-500 gap-2">
                    <Loader2 size={20} className="animate-spin text-brand" />
                    <span>Fetching live bids...</span>
                </div>
            ) : sortedQuotes.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-md border border-slate-200 text-slate-500">
                    <Truck size={36} className="mx-auto mb-2 text-slate-300" />
                    <h3 className="font-bold text-slate-700 text-base mb-1">No Bids Received Yet</h3>
                    <p className="text-xs text-slate-400">Verified suppliers will submit their bids here soon.</p>
                </div>
            ) : (
                <DataTable
                    data={sortedQuotes}
                    columns={columns}
                    actions={tableActions}
                    searchPlaceholder="Filter quotes by supplier or vehicle..."
                    compact={true}
                />
            )}
        </div>
    );
}
