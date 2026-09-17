import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, MessageSquare, Package, MapPin, ArrowUpRight } from 'lucide-react';
import apiClient from '@/lib/axios';
import Button from '@/components/ui/button';

export default function SupportDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSupport = async () => {
            try {
                const res = await apiClient.get('/supplier/orders');
                setOrders(res.data?.data || res.data || []);
            } catch (err) {
                console.error('Failed to load support data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSupport();
    }, []);

    const activeOrders = Array.isArray(orders) ? orders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled') : [];

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center font-bold text-xl shrink-0">
                        <Headphones size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">Customer Support Desk</h1>
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 rounded-full">Online</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Assist shippers with real-time freight tracking, status milestones, and messaging.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Link to="/supplier/messages">
                        <Button size="sm" className="bg-[#FF4A1F] hover:bg-[#e03e16] text-white text-xs flex items-center gap-1.5 shadow-xs">
                            <MessageSquare size={15} />
                            <span>Client Messages</span>
                        </Button>
                    </Link>
                    <Link to="/supplier/orders/active-jobs">
                        <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
                            <Package size={14} />
                            <span>Track Orders</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Deliveries Monitored</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeOrders.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                        <Package size={20} />
                    </div>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Live GPS Tracking Map</p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Available
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                        <MapPin size={20} />
                    </div>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Support Response Rate</p>
                        <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-1.5">&lt; 5 Minutes</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center">
                        <Headphones size={20} />
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
    className="bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <MessageSquare size={17} className="text-teal-600" />
                            <span>Client Inquiries & Live Chat</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                            Respond to shipper inquiries regarding pickup schedules, routes, and special cargo care.
                        </p>
                    </div>
                    <Link to="/supplier/messages">
                        <Button size="sm" className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 text-xs">
                            <span>Open Messaging Desk</span>
                        </Button>
                    </Link>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <Package size={17} className="text-blue-600" />
                            <span>Shipment Timeline & Milestone Updates</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                            Inspect order progression, driver notes, and estimated time of arrivals (ETA).
                        </p>
                    </div>
                    <Link to="/supplier/orders/active-jobs">
                        <Button size="sm" variant="outline" className="w-full text-xs">
                            <span>Inspect Active Orders</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
