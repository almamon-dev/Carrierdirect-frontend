import React, { useState, useEffect, useMemo } from 'react';
import { Truck, Loader2, RefreshCw, ArrowUpDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { decryptId } from '@/lib/encryption';
import { getTrackBidsColumns, renderTrackBidsActions } from './components/TrackBidsColumns';
import { QuoteLifecycleTracker } from './components/QuoteLifecycleTracker';

export default function TrackBids() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [quoteRequestDetails, setQuoteRequestDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filterMode, setFilterMode] = useState('lowest_price');

    const rawDecrypted = id ? decryptId(id) : '';
    const cleanId = rawDecrypted.replace(/[^0-9]/g, '') || rawDecrypted;

    const fetchBids = async () => {
        setIsLoading(true);
        try {
            if (cleanId) {
                try {
                    const res = await apiClient.get(ENDPOINTS.CUSTOMER.REQUEST_QUOTES(cleanId));
                    const list = res.data?.data?.quotes_request || res.data?.quotes_request || res.data?.data || [];
                    if (Array.isArray(list) && list.length > 0) {
                        setQuotes(list);
                        setQuoteRequestDetails(res.data?.data?.quote_details || res.data?.quote_details || null);
                        setIsLoading(false);
                        return;
                    }
                } catch {}

                const resAll = await apiClient.get(ENDPOINTS.CUSTOMER.QUOTES || '/customer/quotes');
                const allList = resAll.data?.data?.data || resAll.data?.data || resAll.data?.quotes || [];
                const filtered = Array.isArray(allList)
                    ? allList.filter((item: any) => String(item.quote_request_id || item.request_id || item.quote_request?.id) === String(cleanId))
                    : [];
                setQuotes(filtered);
            } else {
                const res = await apiClient.get(ENDPOINTS.CUSTOMER.QUOTES || '/customer/quotes');
                const quotesList = res.data?.data?.data || res.data?.data || res.data?.quotes || [];
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
    }, [cleanId]);

    const sortedQuotes = useMemo(() => {
        return [...quotes].sort((a, b) => {
            const amtA = a.amount_raw || parseFloat(String(a.amount || a.price || a.total_amount || 0).replace(/[^0-9.]/g, '')) || 0;
            const amtB = b.amount_raw || parseFloat(String(b.amount || b.price || b.total_amount || 0).replace(/[^0-9.]/g, '')) || 0;
            if (filterMode === 'lowest_price') return amtA - amtB;
            if (filterMode === 'highest_price') return amtB - amtA;
            if (filterMode === 'top_rated') {
                const ratA = Number(a.rating || a.supplier_rating || a.supplier?.rating || 0);
                const ratB = Number(b.rating || b.supplier_rating || b.supplier?.rating || 0);
                return ratB - ratA;
            }
            if (filterMode === 'fastest') {
                const getHours = (item: any) => {
                    const str = String(item.estimated_delivery || item.transit_time || item.estimated_time || '').toLowerCase();
                    const num = parseInt(str.replace(/[^0-9]/g, '')) || 0;
                    if (str.includes('d') || str.includes('day')) return num * 24;
                    return num;
                };
                return getHours(a) - getHours(b);
            }
            if (filterMode === 'newest') {
                const dateA = new Date(a.created_at || a.date || a.submitted_at || 0).getTime();
                const dateB = new Date(b.created_at || b.date || b.submitted_at || 0).getTime();
                return dateB - dateA;
            }
            return 0;
        });
    }, [quotes, filterMode]);

    const columns = useMemo(() => getTrackBidsColumns(navigate, quoteRequestDetails), [navigate, quoteRequestDetails]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        {cleanId ? `Bids for Request #${cleanId.startsWith('REQ-') ? cleanId : `REQ-${String(cleanId).padStart(4, '0')}`}` : 'Track Bids & Offers'}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Compare incoming supplier quotes and choose the best offer for your shipment.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchBids}
                        disabled={isLoading}
                        className="h-[30px] px-2.5 text-xs font-semibold bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
                    >
                        <RefreshCw size={12} className={isLoading ? 'animate-spin text-[#ff4a1f] mr-1' : 'text-slate-500 mr-1'} />
                        <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
                    </Button>
                    <div className="w-[185px]">
                        <Select
                            size="sm"
                            value={filterMode}
                            onChange={(val) => {
                                const v = typeof val === 'object' && val?.target ? val.target.value : val;
                                setFilterMode(v);
                            }}
                            showSearch={false}
                            icon={ArrowUpDown}
                            placeholder="Sort bids..."
                        >
                            <option value="lowest_price">Price: Low to High</option>
                            <option value="highest_price">Price: High to Low</option>
                            <option value="top_rated">Top Rated Carrier</option>
                            <option value="fastest">Fastest Transit</option>
                            <option value="newest">Newest First</option>
                        </Select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="p-12 flex items-center justify-center text-slate-500 gap-2">
                    <Loader2 size={20} className="animate-spin text-[#ff4a1f]" />
                    <span className="text-xs font-medium">Fetching live bids...</span>
                </div>
            ) : sortedQuotes.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-[#1e2329] rounded-[5px] border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
                    <Truck size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Bids Received For This Request Yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">Verified freight suppliers have been notified and will submit competitive quotes shortly.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <QuoteLifecycleTracker
                        quote={sortedQuotes.find(q => String(q.status_raw || q.status).toLowerCase().includes('accept') || String(q.status_raw || q.status).toLowerCase().includes('won')) || sortedQuotes[0]}
                        requestDetail={quoteRequestDetails}
                        allBids={sortedQuotes}
                    />

                    <DataTable
                        data={sortedQuotes}
                        columns={columns}
                        actions={(row) => renderTrackBidsActions(row, navigate)}
                        actionsColumnClassName="w-[170px] min-w-[170px] text-right pr-3.5"
                        searchPlaceholder="Filter quotes by supplier or vehicle..."
                        compact={true}
                        tableClassName="min-w-[1050px]"
                    />
                </div>
            )}
        </div>
    );
}
