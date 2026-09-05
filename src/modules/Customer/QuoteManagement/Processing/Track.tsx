import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
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
    const timeline = buildOrderTimeline(isPodAccepted);

    return (
        <div className="p-4 md:p-6 w-full mx-auto flex flex-col min-h-screen font-sans bg-[#f8f9fa] pb-20">
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="h-8.5 w-8.5 text-slate-600 rounded-lg hover:bg-slate-100 border-slate-200 cursor-pointer shrink-0" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Track Order {order.id}</h1>
                            <Badge className="px-2 py-0.5 text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                            <span>Route: <strong className="text-slate-800">{order.from}</strong> ➔ <strong className="text-slate-800">{order.to}</strong></span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5">
                        <Clock size={13} className="text-[#ff4a1f]" />
                        <span>ETA: <strong className="text-slate-900">{order.estArrival}</strong></span>
                    </Badge>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPodAccepted(!isPodAccepted)}
                        className="h-8 text-xs font-bold text-[#ff4a1f] border-orange-200 bg-orange-50 hover:bg-orange-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <Sparkles size={13} /> {isPodAccepted ? 'Reset Demo POD' : '⚡ Simulate POD Accept'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
                <div className="lg:col-span-8 flex flex-col gap-5">
                    <MapSection order={order} timeline={timeline} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <VehicleDetails vehicle={order.vehicle} supplier={order.supplier} />
                        <AmountBreakdown pricing={order.pricing} />
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-5 h-full">
                    <SupplierProfile supplier={order.supplier} />
                    <PODAction isPodAccepted={isPodAccepted} setIsPodAccepted={setIsPodAccepted} />
                    <TimelineSection timeline={timeline} />
                </div>
            </div>
        </div>
    );
}
