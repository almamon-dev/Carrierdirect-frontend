import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';

import MapSection from './TrackComponents/MapSection';
import VehicleDetails from './TrackComponents/VehicleDetails';
import AmountBreakdown from './TrackComponents/AmountBreakdown';
import SupplierProfile from './TrackComponents/SupplierProfile';
import PODAction from './TrackComponents/PODAction';
import TimelineSection from './TrackComponents/TimelineSection';
import { buildOrderDetails, buildOrderTimeline } from './utils/ProcessingTrackUtils';

export default function ProcessingTrack() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [dbOrder, setDbOrder] = useState<any | null>(null);
    const foundOrder = dbOrder || location.state?.order;

    const [isPodAccepted, setIsPodAccepted] = useState(() => {
        return foundOrder?.status === 'POD Accepted' || foundOrder?.status === 'Completed' || foundOrder?.status === 'completed';
    });

    useEffect(() => {
        if (!id) return;
        const cleanId = String(id).replace('ORD-', '');
        async function fetchSingleOrder() {
            try {
                const res = await apiClient.get(`${ENDPOINTS.CUSTOMER.ORDERS}/${cleanId}`);
                const data = res.data?.data || res.data;
                if (data) {
                    setDbOrder(data);
                    if (data.status === 'POD Accepted' || data.status === 'completed' || data.status === 'Completed') {
                        setIsPodAccepted(true);
                    }
                }
            } catch {}
        }
        fetchSingleOrder();
    }, [id]);

    const order = buildOrderDetails(id, foundOrder, isPodAccepted);
    const timeline = buildOrderTimeline(isPodAccepted, order);

    return (
        <div className="p-3.5 md:p-5 w-full mx-auto flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-16 space-y-4">
            {/* Minimal Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                            Track Shipment {order.id}
                        </h1>
                        <Badge className={`px-1.5 py-0.5 text-[10px] font-bold rounded-[3px] ${
                            isPodAccepted
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                        }`}>
                            {order.status}
                        </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-none">
                        Route: <span className="text-slate-700 dark:text-slate-300 font-semibold">{order.from}</span> ➔ <span className="text-slate-700 dark:text-slate-300 font-semibold">{order.to}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        ETA: <strong className="text-slate-900 dark:text-slate-100 font-semibold">{order.estArrival}</strong>
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPodAccepted(!isPodAccepted)}
                        className="h-7 px-2.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[4px] cursor-pointer"
                    >
                        <span>{isPodAccepted ? 'Reset POD' : 'Simulate POD Accept'}</span>
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <MapSection order={order} timeline={timeline} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <VehicleDetails vehicle={order.vehicle} supplier={order.supplier} />
                        <AmountBreakdown pricing={order.pricing} />
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                    <SupplierProfile supplier={order.supplier} />
                    <PODAction isPodAccepted={isPodAccepted} setIsPodAccepted={setIsPodAccepted} order={order} />
                    <TimelineSection timeline={timeline} />
                </div>
            </div>
        </div>
    );
}

