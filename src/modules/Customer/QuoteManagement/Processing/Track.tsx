import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

import MapSection from './TrackComponents/MapSection';
import VehicleDetails from './TrackComponents/VehicleDetails';
import AmountBreakdown from './TrackComponents/AmountBreakdown';
import SupplierProfile from './TrackComponents/SupplierProfile';
import PODAction from './TrackComponents/PODAction';
import TimelineSection from './TrackComponents/TimelineSection';

export default function ProcessingTrack() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isPodAccepted, setIsPodAccepted] = useState(false);

    // Mock order details
    const order = {
        id: id || 'ORD-5591',
        status: isPodAccepted ? 'Payment Pending' : 'Delivered (Pending POD)',
        estArrival: '2026-07-26 10:00 AM',
        from: 'Dhaka',
        to: 'Chittagong',
        vehicle: {
            type: 'Covered Van (14ft)',
            number: 'DHA-11-2233',
            capacity: '1.5 Ton',
            goodsType: 'Electronics & Fragile'
        },
        supplier: {
            name: 'Global Transport',
            verified: true,
            rating: 4.8,
            reviews: 320,
            active: 'Active 20m ago',
            memberSince: '2023',
            completedOrders: 1540
        },
        pricing: {
            base: 40000,
            loading: 3500,
            insurance: 1500,
            total: 45000,
            advancePaid: 13500,
            due: 31500
        }
    };

    const timeline = [
        { status: 'Order Confirmed', time: 'Jul 24, 09:00 AM', completed: true, active: false },
        { status: 'Driver Assigned', time: 'Jul 24, 11:30 AM', completed: true, active: false },
        { status: 'Goods Picked Up', time: 'Jul 25, 08:15 AM', completed: true, active: false },
        { status: 'In Transit', time: 'Jul 26, 09:30 AM', completed: true, active: false, location: 'Highway N1, Comilla' },
        { status: 'Delivered', time: 'Jul 26, 11:45 AM', completed: true, active: false },
        { 
            status: isPodAccepted ? 'POD Accepted' : 'Waiting for POD', 
            time: isPodAccepted ? 'Just now' : 'Action Required', 
            completed: isPodAccepted, 
            active: !isPodAccepted 
        },
        { 
            status: 'Order Completed', 
            time: isPodAccepted ? 'Finished' : 'Locked', 
            completed: isPodAccepted, 
            active: false 
        },
    ];

    return (
        <div className="p-3 md:p-4 w-full mx-auto flex flex-col min-h-screen">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 -ml-1.5" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                    </Button>
                    <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">Order {order.id}</h1>
                    <Badge variant="warning" className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">{order.status}</Badge>
                </div>
                <div className="text-[13px] text-slate-500 flex items-center gap-1.5">
                    <Clock size={14} /> ETA: <span className="font-semibold text-slate-700">{order.estArrival}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1">
                {/* Left Column: Map & Info Cards */}
                <div className="lg:col-span-8 flex flex-col gap-3">
                    <MapSection order={order} timeline={timeline} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <VehicleDetails vehicle={order.vehicle} supplier={order.supplier} />
                        <AmountBreakdown pricing={order.pricing} />
                    </div>
                </div>

                {/* Right Column: Supplier Info & Tracking Timeline */}
                <div className="lg:col-span-4 flex flex-col gap-3 h-full">
                    <SupplierProfile supplier={order.supplier} />
                    <PODAction isPodAccepted={isPodAccepted} setIsPodAccepted={setIsPodAccepted} />
                    <TimelineSection timeline={timeline} />
                </div>
            </div>
        </div>
    );
}
