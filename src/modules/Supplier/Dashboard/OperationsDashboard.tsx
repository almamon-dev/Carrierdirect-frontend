import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Activity, Calendar, Map, Users, ArrowUpRight } from 'lucide-react';
import apiClient from '@/lib/axios';
import Button from '@/components/ui/button';

export default function OperationsDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOps = async () => {
            try {
                const res = await apiClient.get('/supplier/orders');
                setOrders(res.data?.data || res.data || []);
            } catch (err) {
                console.error('Failed to load operations data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOps();
    }, []);

    const activeOrders = Array.isArray(orders) ? orders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled') : [];

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0">
                        <Activity size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Operations & Fleet Command</h1>
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 rounded-full">Live Dispatch</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage active fleet allocations, route logistics, and order fulfillment.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Link to="/supplier/orders/active-jobs">
                        <Button size="sm" className="bg-[#FF4A1F] hover:bg-[#e03e16] text-white text-xs flex items-center gap-1.5 shadow-xs">
                            <Package size={15} />
                            <span>Active Jobs</span>
                        </Button>
                    </Link>
                    <Link to="/supplier/availability/dashboard">
                        <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>Fleet Availability</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Shipments in Pipeline</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeOrders.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                        <Package size={20} />
                    </div>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Fleet & Drivers</p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">Ready for Dispatch</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                        <Truck size={20} />
                    </div>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">GPS Route Tracking</p>
                        <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-1.5">Live Telematics Sync</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                        <Map size={20} />
                    </div>
                </div>
            </div>

            {/* Quick Access Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
    className="bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <Package size={17} className="text-[#FF4A1F]" />
                            <span>Order Execution & POD Verification</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                            Track ongoing transport milestones, reallocate drivers, and inspect uploaded delivery proofs.
                        </p>
                    </div>
                    <Link to="/supplier/orders/active-jobs">
                        <Button size="sm" className="w-full bg-[#FF4A1F] hover:bg-[#e03e16] text-white text-xs">
                            <span>Manage Active Shipments</span>
                        </Button>
                    </Link>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <Calendar size={17} className="text-blue-600" />
                            <span>Fleet Capacity & Driver Calendars</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                            Configure vehicle availability schedules, blackout holidays, and operational time slots.
                        </p>
                    </div>
                    <Link to="/supplier/availability/schedule">
                        <Button size="sm" variant="outline" className="w-full text-xs">
                            <span>Open Availability Schedules</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
