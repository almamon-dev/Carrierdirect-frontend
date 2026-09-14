import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, TrendingUp, CheckCircle, ArrowUpRight } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import Button from '@/components/ui/button';

export default function SalesDashboard() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const res = await apiClient.get(ENDPOINTS.SUPPLIER.AVAILABLE_REQUESTS);
                const list = res.data?.data?.requests || res.data?.data || res.data || [];
                setRequests(Array.isArray(list) ? list : []);
            } catch (err) {
                console.error('Failed to load quote requests:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuotes();
    }, []);

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center font-bold text-xl shrink-0">
                        <FileText size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Sales & Quote Bidding Center</h1>
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 rounded-full">Bidding Active</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Browse open customer lead requests, submit bids, and negotiate pricing.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Link to="/supplier/quotes/requests">
                        <Button size="sm" className="bg-[#FF4A1F] hover:bg-[#e03e16] text-white text-xs flex items-center gap-1.5 shadow-xs">
                            <FileText size={15} />
                            <span>Browse Quote Requests</span>
                        </Button>
                    </Link>
                    <Link to="/supplier/quotes/negotiation">
                        <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
                            <MessageSquare size={14} />
                            <span>Negotiation Chat</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Available Quote Requests</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{requests.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                        <FileText size={20} />
                    </div>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Negotiation Bids</p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">In Progress</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                        <MessageSquare size={20} />
                    </div>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Conversion Rate</p>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1.5">High Win Target</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
    className="bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <FileText size={17} className="text-purple-600" />
                            <span>Submit Freight Quotations</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                            Review client cargo specifications, dimensions, routes, and place competitive bids.
                        </p>
                    </div>
                    <Link to="/supplier/quotes/requests">
                        <Button size="sm" className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 text-xs">
                            <span>View All Requests</span>
                        </Button>
                    </Link>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <CheckCircle size={17} className="text-emerald-600" />
                            <span>Won Contracts & Orders</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                            Inspect accepted bids that have converted into active transportation bookings.
                        </p>
                    </div>
                    <Link to="/supplier/quotes/won">
                        <Button size="sm" variant="outline" className="w-full text-xs">
                            <span>View Won Quotes</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
