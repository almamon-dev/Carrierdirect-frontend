import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, FileCheck, MapPin, Navigation, Clock, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import apiClient from '@/lib/axios';
import Button from '@/components/ui/button';

export default function DriverDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await apiClient.get('/supplier/orders');
                const list = res.data?.data || res.data || [];
                setOrders(Array.isArray(list) ? list : []);
            } catch (err) {
                console.error('Failed to load driver orders:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const activeJobs = orders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled');
    const completedJobs = orders.filter((o: any) => o.status === 'delivered');
    const pendingPOD = orders.filter((o: any) => !o.pod_uploaded && o.status !== 'cancelled');

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#12161c] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center font-bold text-xl shrink-0">
                        <Truck size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Driver Workspace</h1>
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-full">Active on Duty</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage your assigned freight trips, update delivery milestones, and upload POD receipts.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Link to="/supplier/orders/pod">
                        <Button size="sm" className="bg-[#FF4A1F] hover:bg-[#e03e16] text-white text-xs flex items-center gap-1.5 shadow-xs">
                            <FileCheck size={15} />
                            <span>Upload POD</span>
                        </Button>
                    </Link>
                    <Link to="/supplier/availability/routes">
                        <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
                            <Navigation size={14} />
                            <span>My Routes</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Assigned Active Jobs</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeJobs.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                        <Package size={20} />
                    </div>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending POD Slips</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingPOD.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                        <FileCheck size={20} />
                    </div>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed Deliveries</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedJobs.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                    </div>
                </div>

                <div
    className="bg-white dark:bg-[#12161c] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">GPS Unit Status</p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Connected & Live
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                        <MapPin size={20} />
                    </div>
                </div>
            </div>

            {/* Active Jobs Table */}
            <div
    className="bg-white dark:bg-[#12161c] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Package size={16} className="text-[#FF4A1F]" />
                        <span>Today's Assigned Freight Shipments</span>
                    </h2>
                    <Link to="/supplier/orders/active-jobs" className="text-xs text-[#FF4A1F] hover:underline font-semibold flex items-center gap-1">
                        <span>View All Jobs</span>
                        <ArrowUpRight size={13} />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-xs text-slate-400">Loading assigned trips...</div>
                ) : activeJobs.length === 0 ? (
                    <div className="p-12 text-center">
                        <Truck size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Active Jobs Assigned</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">You are currently up to date. Once the dispatcher assigns a shipment to your vehicle, it will appear here immediately.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                        {activeJobs.slice(0, 5).map((job: any, idx: number) => (
                            <div key={job.id || idx} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                                            {job.order_number || job.tracking_number || `JOB-${String(job.id || idx + 1).padStart(4, '0')}`}
                                        </span>
                                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                            {job.status || 'In Transit'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                        <span>{job.origin_city || 'Main Depot'}</span>
                                        <span className="text-slate-300">➔</span>
                                        <span>{job.destination_city || 'Delivery Station'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Link to={`/supplier/orders/pod/${job.id || ''}`}>
                                        <Button size="sm" variant="outline" className="text-xs h-7.5 flex items-center gap-1.5">
                                            <FileCheck size={13} />
                                            <span>Upload POD</span>
                                        </Button>
                                    </Link>
                                    <Link to="/supplier/orders/active-jobs">
                                        <Button size="sm" className="text-xs h-7.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600">
                                            <span>Details</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
