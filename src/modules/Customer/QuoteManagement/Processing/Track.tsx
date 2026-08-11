import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck, RefreshCw, Sparkles, MapPin, Truck } from 'lucide-react';
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
    const location = useLocation();
    const [isPodAccepted, setIsPodAccepted] = useState(false);
    const [dbOrder, setDbOrder] = useState<any | null>(null);

    // Fetch order directly from Database API
    useEffect(() => {
        if (!id) return;
        const cleanId = String(id).replace('ORD-', '');
        async function fetchSingleOrder() {
            try {
                const res = await apiClient.get(`${ENDPOINTS.CUSTOMER.ORDERS}/${cleanId}`);
                const data = res.data?.data || res.data;
                if (data) {
                    setDbOrder(data);
                }
            } catch {
                // Keep location state or cache fallback
            }
        }
        fetchSingleOrder();
    }, [id]);

    // Dynamic order lookup from DB state, location state, or localStorage cache
    const cachedOrdersStr = typeof window !== 'undefined' ? localStorage.getItem('customer_processing_orders_cache') : null;
    const cachedOrders = cachedOrdersStr ? JSON.parse(cachedOrdersStr) : [];
    const foundOrder = dbOrder || location.state?.order || cachedOrders.find((o: any) => o.id === id);

    const fromCity = foundOrder?.pickup_city || foundOrder?.route?.from || foundOrder?.from || 'Dhaka';
    const toCity = foundOrder?.delivery_city || foundOrder?.route?.to || foundOrder?.to || 'Chittagong';

    // Order details state
    const order = {
        id: id || foundOrder?.id || 'ORD-5591',
        status: isPodAccepted ? 'Payment Released (POD Accepted)' : (foundOrder?.status || 'In Transit (Pending POD)'),
        estArrival: foundOrder?.est_arrival || foundOrder?.estArrival || 'Jul 26, 2026 • 10:00 AM',
        from: fromCity.includes('(') ? fromCity : `${fromCity} (EPZ)`,
        to: toCity.includes('(') ? toCity : `${toCity} (Port)`,
        vehicle: {
            type: foundOrder?.vehicle_type || foundOrder?.vehicleType || foundOrder?.vehicle?.type || 'Covered Van (14ft)',
            number: foundOrder?.vehicle_plate || foundOrder?.vehicleNo || foundOrder?.vehicle?.number || 'DHA-11-2233',
            capacity: foundOrder?.cargoWeight || '1.5 Ton',
            goodsType: foundOrder?.goods_type || foundOrder?.goodsType || 'General Freight & Logistics'
        },
        supplier: {
            name: foundOrder?.supplier_name || foundOrder?.supplier || foundOrder?.supplier?.name || 'Global Transport Express',
            verified: true,
            rating: 4.8,
            reviews: 320,
            active: 'Active 5m ago',
            memberSince: '2023',
            completedOrders: 1540
        },
        pricing: {
            base: 1250,
            loading: 150,
            insurance: 45,
            total: foundOrder?.total_amount || (foundOrder?.amount ? (typeof foundOrder.amount === 'number' ? foundOrder.amount : parseInt(String(foundOrder.amount).replace(/[^0-9]/g, '')) || 1445) : 1445),
            advancePaid: 445,
            due: 1000
        }
    };

    const timeline = [
        { status: 'Order Confirmed', time: 'Jul 24, 09:00 AM', completed: true, active: false },
        { status: 'Driver Assigned', time: 'Jul 24, 11:30 AM', completed: true, active: false },
        { status: 'Goods Picked Up', time: 'Jul 25, 08:15 AM', completed: true, active: false },
        { status: 'In Transit', time: 'Jul 26, 09:30 AM', completed: true, active: true, location: 'Highway N1, Comilla Checkpoint' },
        { status: 'Destination Delivery', time: 'Jul 26, 11:45 AM', completed: isPodAccepted, active: false },
        { 
            status: isPodAccepted ? 'POD Accepted' : 'Waiting for POD', 
            time: isPodAccepted ? 'Just now' : 'Action Required', 
            completed: isPodAccepted, 
            active: false 
        },
        { 
            status: 'Order Completed', 
            time: isPodAccepted ? 'Finished' : 'Pending', 
            completed: isPodAccepted, 
            active: false 
        },
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto flex flex-col min-h-screen font-sans bg-[#f8f9fa] pb-20">
            
            {/* Header Section */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8.5 w-8.5 text-slate-600 rounded-lg hover:bg-slate-100 border-slate-200 cursor-pointer shrink-0" 
                        onClick={() => navigate(-1)}
                    >
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

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
                
                {/* Left Column: Interactive Map & Details */}
                <div className="lg:col-span-8 flex flex-col gap-5">
                    <MapSection order={order} timeline={timeline} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <VehicleDetails vehicle={order.vehicle} supplier={order.supplier} />
                        <AmountBreakdown pricing={order.pricing} />
                    </div>
                </div>

                {/* Right Column: Carrier Profile, POD Action & Timeline */}
                <div className="lg:col-span-4 flex flex-col gap-5 h-full">
                    <SupplierProfile supplier={order.supplier} />
                    <PODAction isPodAccepted={isPodAccepted} setIsPodAccepted={setIsPodAccepted} />
                    <TimelineSection timeline={timeline} />
                </div>

            </div>

        </div>
    );
}
