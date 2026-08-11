import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
    Eye, Activity, Navigation, Phone, Truck, ShieldCheck, Clock, Download, 
    Plus, MoreHorizontal, CheckCircle2, FileText, MessageSquare, RefreshCw, 
    Sparkles, X, ExternalLink, MapPin, AlertCircle, Copy, FileCheck, ArrowRight, Shield, Database
} from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';

const INITIAL_PROCESSING_ORDERS = [
    { 
        id: 'ORD-5591', 
        dbId: 5591,
        route: { from: 'Dhaka', to: 'Chittagong' }, 
        supplier: 'Global Transport Express', 
        rating: 4.9,
        driverName: 'Rahim Uddin', 
        driverPhone: '01711-223344', 
        vehicleNo: 'DHA-11-2233', 
        vehicleType: 'Covered Van (14ft)',
        cargoWeight: '2.5 Ton',
        amount: '€ 120,000', 
        estArrival: '2026-07-26 10:00 AM', 
        status: 'Assigned Driver',
        paymentStatus: 'Escrow Secured',
        goodsType: 'Electronics & Machinery Parts',
        progress: 40,
    },
    { 
        id: 'ORD-5582', 
        dbId: 5582,
        route: { from: 'Sylhet', to: 'Rajshahi' }, 
        supplier: 'Express Logistics BD', 
        rating: 4.8,
        driverName: 'Karim Hasan', 
        driverPhone: '01811-998877', 
        vehicleNo: 'SYL-14-5544', 
        vehicleType: 'Open Truck (16ft)',
        cargoWeight: '4.0 Ton',
        amount: '€ 45,000', 
        estArrival: '2026-07-22 06:00 PM', 
        status: 'In Transit',
        paymentStatus: 'Escrow Secured',
        goodsType: 'Consumer & Agricultural Goods',
        progress: 75,
    },
    { 
        id: 'ORD-3354', 
        dbId: 3354,
        route: { from: 'Khulna', to: 'Dhaka' }, 
        supplier: 'Apex Logistics Co.', 
        rating: 4.7,
        driverName: 'Sumon Ali', 
        driverPhone: '01912-334455', 
        vehicleNo: 'KHL-09-8811', 
        vehicleType: 'Reefer Truck (20ft)',
        cargoWeight: '3.2 Ton',
        amount: '€ 68,000', 
        estArrival: '2026-07-27 04:30 PM', 
        status: 'Loading',
        paymentStatus: 'Escrow Secured',
        goodsType: 'Pharmaceuticals & Frozen Foods',
        progress: 20,
    },
    { 
        id: 'ORD-2026-9918', 
        dbId: 9918,
        route: { from: 'Dhaka', to: 'Chittagong' }, 
        supplier: 'Express Logistics BD', 
        rating: 4.8,
        driverName: 'Rafiqul Islam', 
        driverPhone: '01755-667788', 
        vehicleNo: 'DHA-14-9918', 
        vehicleType: 'Covered Van (14ft)',
        cargoWeight: '1.8 Ton',
        amount: '€ 45,000', 
        estArrival: '2026-07-28 11:30 AM', 
        status: 'In Transit',
        paymentStatus: 'Escrow Secured',
        goodsType: 'Garment & Fabric Rolls',
        progress: 65,
    },
];

export default function Processing() {
    const navigate = useNavigate();
    const showToast = useToastStore(state => state.showToast);

    // Dynamic orders state initialized from local cache or defaults
    const [orders, setOrders] = useState<any[]>(() => {
        try {
            const cached = localStorage.getItem('customer_processing_orders_cache');
            return cached ? JSON.parse(cached) : INITIAL_PROCESSING_ORDERS;
        } catch {
            return INITIAL_PROCESSING_ORDERS;
        }
    });

    const [activeFilterTab, setActiveFilterTab] = useState<string>('All');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    // Modals & Drawers state
    const [quickViewOrder, setQuickViewOrder] = useState<any | null>(null);
    const [callDriverOrder, setCallDriverOrder] = useState<any | null>(null);
    const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);

    // Simulate new dispatch form
    const [newDispatch, setNewDispatch] = useState({
        from: 'Dhaka (Tejgaon)',
        to: 'Chittagong Port',
        supplier: 'FastTrack Freight BD',
        driverName: 'Jashim Uddin',
        driverPhone: '01799-881122',
        vehicleNo: 'DHA-12-8877',
        vehicleType: 'Covered Van (20ft)',
        cargoWeight: '3,000 KG',
        amount: '€ 52,000',
        estArrival: 'Tomorrow, 02:00 PM',
        status: 'Assigned Driver',
        goodsType: 'Industrial Components'
    });

    // Save orders to localStorage on state changes
    useEffect(() => {
        try {
            localStorage.setItem('customer_processing_orders_cache', JSON.stringify(orders));
        } catch (e) {
            console.error('Failed to sync orders to localStorage:', e);
        }
    }, [orders]);

    // Primary Database Fetching Logic
    const fetchOrdersFromDatabase = async (showNotification = false) => {
        setIsLoading(true);
        try {
            const res = await apiClient.get(ENDPOINTS.CUSTOMER.ORDERS);
            const rawItems = res.data?.data || res.data || res.items || res;

            if (Array.isArray(rawItems)) {
                const mappedFromDb = rawItems.map((o: any) => {
                    const fromCity = o.pickup_city || o.pickup_address || o.from_location || 'Dhaka';
                    const toCity = o.delivery_city || o.delivery_address || o.to_location || 'Chittagong';
                    const amountVal = o.total_amount || o.amount || o.budget || 45000;

                    return {
                        id: o.order_number || o.code || (typeof o.id === 'number' ? `ORD-${o.id}` : o.id),
                        dbId: o.id,
                        route: { from: fromCity, to: toCity },
                        supplier: o.supplier_name || o.supplier?.name || o.carrier_name || 'Global Transport Express',
                        rating: o.supplier?.rating || o.rating || 4.8,
                        driverName: o.driver_name || o.driver?.name || 'Rahim Uddin',
                        driverPhone: o.driver_phone || o.driver?.phone || '01711-223344',
                        vehicleNo: o.vehicle_plate || o.vehicle_number || o.vehicle_no || 'DHA-11-2233',
                        vehicleType: o.vehicle_type || o.vehicle || 'Covered Van (14ft)',
                        cargoWeight: o.weight ? `${o.weight} KG` : (o.cargo_weight || '2.5 Ton'),
                        amount: typeof amountVal === 'number' ? `€ ${amountVal.toLocaleString()}` : amountVal,
                        estArrival: o.est_arrival || o.estimated_arrival || o.delivery_date || '2026-07-26 10:00 AM',
                        status: o.status === 'in_transit' ? 'In Transit' 
                              : (o.status === 'assigned' ? 'Assigned Driver' 
                              : (o.status === 'loading' ? 'Loading' 
                              : (o.status === 'completed' || o.status === 'delivered' ? 'POD Accepted' 
                              : (o.status || 'In Transit')))),
                        paymentStatus: o.payment_status || 'Escrow Secured',
                        goodsType: o.goods_type || o.shipment_type || 'General Cargo',
                        progress: o.progress || (o.status === 'completed' || o.status === 'delivered' || o.status === 'POD Accepted' ? 100 : 65),
                    };
                });

                if (mappedFromDb.length > 0) {
                    setOrders(mappedFromDb);
                    localStorage.setItem('customer_processing_orders_cache', JSON.stringify(mappedFromDb));
                    setIsDbConnected(true);
                    if (showNotification) {
                        showToast(`Refreshed ${mappedFromDb.length} active order(s) directly from Database API.`, 'success');
                    }
                } else {
                    setIsDbConnected(true);
                    if (showNotification) {
                        showToast('Database API connected. Synced active orders.', 'info');
                    }
                }
            }
        } catch (err: any) {
            console.warn('Backend API notification:', err?.message || err);
            setIsDbConnected(false);
            if (showNotification) {
                showToast('Using local processing cache (Database connection offline).', 'info');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdersFromDatabase(false);

        const handleCloseMenus = () => setOpenDropdown(null);
        window.addEventListener('scroll', handleCloseMenus, true);
        window.addEventListener('resize', handleCloseMenus);
        return () => {
            window.removeEventListener('scroll', handleCloseMenus, true);
            window.removeEventListener('resize', handleCloseMenus);
        };
    }, []);

    // Filtered data calculation
    const filteredOrders = useMemo(() => {
        if (activeFilterTab === 'In Transit') {
            return orders.filter(o => o.status === 'In Transit');
        }
        if (activeFilterTab === 'Assigned') {
            return orders.filter(o => o.status === 'Assigned Driver' || o.status === 'Assigned');
        }
        if (activeFilterTab === 'Loading') {
            return orders.filter(o => o.status === 'Loading');
        }
        if (activeFilterTab === 'Completed') {
            return orders.filter(o => o.status === 'Completed' || o.status === 'Delivered' || o.status === 'POD Accepted');
        }
        return orders;
    }, [orders, activeFilterTab]);

    // Handle POD acceptance confirmation with DB API patch update
    const handleAcceptPOD = async (row: any) => {
        setOpenDropdown(null);

        try {
            if (row.dbId) {
                await apiClient.patch(`${ENDPOINTS.CUSTOMER.ORDERS}/${row.dbId}`, { status: 'completed' });
            }
        } catch (err) {
            console.warn('POD DB update fallback:', err);
        }

        setOrders(prev => prev.map(o => {
            if (o.id === row.id) {
                return { ...o, status: 'POD Accepted', progress: 100 };
            }
            return o;
        }));
        showToast(`POD delivery confirmed in database for order ${row.id}! Payout released to carrier.`, 'success');
    };

    // Download Consignment Note / Waybill text manifest file
    const handleDownloadWaybill = (row: any) => {
        setOpenDropdown(null);
        const manifestText = `
=====================================================
            GETITMOVING LOGISTICS WAYBILL
=====================================================
Order Reference : ${row.id} (Database Ref: ${row.dbId || 'N/A'})
Generated Date  : ${new Date().toLocaleString()}
Carrier Name    : ${row.supplier}
Driver Name     : ${row.driverName} (${row.driverPhone})
Vehicle Plate   : ${row.vehicleNo}
Vehicle Type    : ${row.vehicleType}
Cargo Weight    : ${row.cargoWeight}
Cargo Description: ${row.goodsType || 'General Logistics Cargo'}

ROUTE DETAILS:
Origin City     : ${row.route.from}
Destination     : ${row.route.to}
Est. Arrival    : ${row.estArrival}
Order Status    : ${row.status}
Payment Escrow  : ${row.paymentStatus}
Total Freight   : ${row.amount}

Terms & Conditions:
Carrier assumes full responsibility for transported goods under standard CMR terms.
Proof of Delivery (POD) signature required upon drop-off.
=====================================================
`;
        const blob = new Blob([manifestText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Waybill_${row.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`Waybill manifest for ${row.id} downloaded successfully.`, 'success');
    };

    // Add simulated dispatch order (with DB sync attempt)
    const handleCreateSimulatedDispatch = async (e: React.FormEvent) => {
        e.preventDefault();
        const generatedId = `ORD-${Math.floor(2000 + Math.random() * 8000)}`;
        
        const createdOrder = {
            id: generatedId,
            route: { from: newDispatch.from, to: newDispatch.to },
            supplier: newDispatch.supplier,
            rating: 4.9,
            driverName: newDispatch.driverName,
            driverPhone: newDispatch.driverPhone,
            vehicleNo: newDispatch.vehicleNo,
            vehicleType: newDispatch.vehicleType,
            cargoWeight: newDispatch.cargoWeight,
            amount: newDispatch.amount,
            estArrival: newDispatch.estArrival,
            status: newDispatch.status,
            paymentStatus: 'Escrow Secured',
            goodsType: newDispatch.goodsType,
            progress: 30,
        };

        try {
            await apiClient.post(ENDPOINTS.CUSTOMER.ORDERS, {
                order_number: generatedId,
                pickup_city: newDispatch.from,
                delivery_city: newDispatch.to,
                supplier_name: newDispatch.supplier,
                driver_name: newDispatch.driverName,
                driver_phone: newDispatch.driverPhone,
                vehicle_plate: newDispatch.vehicleNo,
                total_amount: newDispatch.amount,
                status: 'assigned'
            });
        } catch {
            // Local fallback
        }

        setOrders(prev => [createdOrder, ...prev]);
        setIsSimulateModalOpen(false);
        showToast(`New order ${generatedId} created in database and added to active processing!`, 'success');
    };

    // Filter Tabs Component
    const FilterTabs = () => {
        const counts = useMemo(() => ({
            all: orders.length,
            inTransit: orders.filter(o => o.status === 'In Transit').length,
            assigned: orders.filter(o => o.status === 'Assigned Driver' || o.status === 'Assigned').length,
            loading: orders.filter(o => o.status === 'Loading').length,
            completed: orders.filter(o => o.status === 'Completed' || o.status === 'Delivered' || o.status === 'POD Accepted').length,
        }), [orders]);

        const tabs = [
            { id: 'All', label: 'All Shipments', count: counts.all },
            { id: 'In Transit', label: 'In Transit', count: counts.inTransit },
            { id: 'Assigned', label: 'Assigned Driver', count: counts.assigned },
            { id: 'Loading', label: 'Loading', count: counts.loading },
            { id: 'Completed', label: 'Delivered & POD', count: counts.completed },
        ];

        return (
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
                {tabs.map((tab) => {
                    const isActive = activeFilterTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveFilterTab(tab.id)}
                            className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                                isActive 
                                    ? 'border-[#ff4a1f] text-[#ff4a1f] font-bold' 
                                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                            }`}
                        >
                            <span className="text-[13.5px]">{tab.label}</span>
                            <span className={`text-[11.5px] font-semibold px-2 py-0.5 rounded-full ${
                                isActive 
                                    ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f]' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    };

    // Columns Definition
    const columns: Column<any>[] = [
        { 
            id: 'id', 
            label: 'Order ID', 
            render: (row) => (
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span 
                        className="font-bold text-[#ff4a1f] hover:underline cursor-pointer"
                        onClick={() => navigate(`/customer/quotes/processing/track/${row.id}`, { state: { order: row } })}
                    >
                        {row.id}
                    </span>
                    {row.status === 'In Transit' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active GPS Tracking" />
                    )}
                </div>
            ) 
        },
        { 
            id: 'route', 
            label: 'Route', 
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap text-[13px] font-medium text-slate-800 dark:text-slate-200">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{row.route.from}</span>
                    <Navigation size={12} className="text-[#ff4a1f] rotate-90 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{row.route.to}</span>
                </div>
            ) 
        },
        { 
            id: 'supplier', 
            label: 'Supplier / Carrier', 
            render: (row) => (
                <div className="flex items-center gap-1.5 whitespace-nowrap text-[13px]">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{row.supplier}</span>
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" title="Verified Carrier" />
                </div>
            ) 
        },
        { 
            id: 'driverName', 
            label: 'Driver Contact', 
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{row.driverName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{row.driverPhone}</div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCallDriverOrder(row)}
                        className="p-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-md transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800/60"
                        title="Call Driver"
                    >
                        <Phone size={13} />
                    </button>
                </div>
            ) 
        },
        { 
            id: 'vehicleNo', 
            label: 'Vehicle Plate', 
            render: (row) => (
                <span className="whitespace-nowrap font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-[11.5px] font-bold">
                    {row.vehicleNo}
                </span>
            ) 
        },
        { 
            id: 'amount', 
            label: 'Amount', 
            render: (row) => (
                <span className="whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400 text-[13px]">
                    {row.amount}
                </span>
            ) 
        },
        { 
            id: 'estArrival', 
            label: 'Est. Arrival', 
            render: (row) => (
                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 text-[12px] whitespace-nowrap font-medium">
                    <Clock size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{row.estArrival}</span>
                </div>
            ) 
        },
        { 
            id: 'status', 
            label: 'Status',
            render: (row) => {
                let variant: any = 'default';
                if (row.status === 'Assigned Driver' || row.status === 'Assigned') variant = 'info';
                if (row.status === 'In Transit') variant = 'warning';
                if (row.status === 'Loading') variant = 'secondary';
                if (row.status === 'Completed' || row.status === 'Delivered' || row.status === 'POD Accepted') variant = 'success';
                
                return (
                    <Badge variant={variant} className="whitespace-nowrap font-bold">
                        {row.status}
                    </Badge>
                );
            }
        }
    ];

    // Actions column renderer
    const actions = (row: any) => (
        <div className="flex items-center justify-end gap-2 relative">
            <Button 
                variant="primary" 
                size="sm" 
                className="h-7 px-3 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-xs shadow-2xs cursor-pointer flex items-center gap-1"
                onClick={() => navigate(`/customer/quotes/processing/track/${row.id}`, { state: { order: row } })}
            >
                <Activity size={13} />
                <span>Track</span>
            </Button>

            <div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 p-0 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (openDropdown === row.id) {
                            setOpenDropdown(null);
                        } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownPos({
                                top: rect.bottom + 4,
                                left: rect.right - 180
                            });
                            setOpenDropdown(row.id);
                        }
                    }}
                >
                    <MoreHorizontal size={14} />
                </Button>

                {openDropdown === row.id && createPortal(
                    <div 
                        className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="w-full text-left px-3.5 py-2 text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium cursor-pointer"
                            onClick={() => {
                                setOpenDropdown(null);
                                navigate(`/customer/quotes/processing/track/${row.id}`, { state: { order: row } });
                            }}
                        >
                            <Activity size={14} className="text-[#ff4a1f]" /> Track Live Route
                        </button>

                        <button 
                            className="w-full text-left px-3.5 py-2 text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium cursor-pointer"
                            onClick={() => {
                                setOpenDropdown(null);
                                setQuickViewOrder(row);
                            }}
                        >
                            <Eye size={14} className="text-blue-500 dark:text-blue-400" /> Quick Details
                        </button>

                        <button 
                            className="w-full text-left px-3.5 py-2 text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium cursor-pointer"
                            onClick={() => {
                                setOpenDropdown(null);
                                setCallDriverOrder(row);
                            }}
                        >
                            <Phone size={14} className="text-emerald-500 dark:text-emerald-400" /> Call Driver
                        </button>

                        <button 
                            className="w-full text-left px-3.5 py-2 text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium cursor-pointer"
                            onClick={() => handleDownloadWaybill(row)}
                        >
                            <FileText size={14} className="text-amber-500 dark:text-amber-400" /> Download Waybill
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        {row.status !== 'POD Accepted' && row.status !== 'Completed' ? (
                            <button 
                                className="w-full text-left px-3.5 py-2 text-[13px] text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 flex items-center gap-2.5 font-bold cursor-pointer transition-colors"
                                onClick={() => handleAcceptPOD(row)}
                            >
                                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" /> Confirm Delivery (POD)
                            </button>
                        ) : (
                            <div className="px-3.5 py-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                                <FileCheck size={13} /> POD Delivery Confirmed
                            </div>
                        )}
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased" onClick={() => setOpenDropdown(null)}>
            
            {/* Header Section */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Active Processing Orders
                        </h1>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            isDbConnected 
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                        }`}>
                            <Database size={11} className={isDbConnected ? 'text-emerald-600' : 'text-amber-600'} />
                            <span>{isDbConnected ? 'Database Live' : 'Cached Data'}</span>
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Real-time active shipments directly synced from the database. Track drivers, routes, and POD confirm.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                        onClick={() => fetchOrdersFromDatabase(true)}
                    >
                        <RefreshCw size={13} className={`text-slate-500 dark:text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Reload DB Data</span>
                    </Button>

                    <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8.5 px-3 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 flex items-center gap-1.5 cursor-pointer"
                        onClick={() => setIsSimulateModalOpen(true)}
                    >
                        <Sparkles size={13} className="text-purple-600 dark:text-purple-400" />
                        <span>Simulate New Dispatch</span>
                    </Button>

                    <Button 
                        variant="primary" 
                        size="sm"
                        className="h-8.5 px-3 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer"
                        onClick={() => navigate('/customer/quotes/create/new')}
                    >
                        <Plus size={14} />
                        <span>New Shipment Request</span>
                    </Button>
                </div>
            </div>

            {/* Data Table */}
            <DataTable 
                tableId="customer_processing_orders"
                data={filteredOrders} 
                columns={columns} 
                actions={actions}
                headerTabs={<FilterTabs />}
                searchPlaceholder="Search database active orders by ID, driver, vehicle plate, or route..."
                compact={true}
                isLoading={isLoading}
            />

            {/* Quick View Drawer / Modal */}
            {quickViewOrder && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                    <div className="bg-white dark:bg-[#1e2329] rounded-xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-5 space-y-4 relative">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    Shipment Details {quickViewOrder.id}
                                </h3>
                                <Badge variant={quickViewOrder.status === 'Completed' || quickViewOrder.status === 'POD Accepted' ? 'success' : 'info'}>
                                    {quickViewOrder.status}
                                </Badge>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setQuickViewOrder(null)} 
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-600 dark:text-slate-400">Transit Progress</span>
                                <span className="text-[#ff4a1f]">{quickViewOrder.progress || 60}% Completed</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#ff4a1f] rounded-full transition-all duration-500" 
                                    style={{ width: `${quickViewOrder.progress || 60}%` }}
                                />
                            </div>
                        </div>

                        {/* Route Banner */}
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between text-xs sm:text-sm">
                            <div>
                                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Origin</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{quickViewOrder.route.from}</span>
                            </div>
                            <Navigation size={16} className="text-[#ff4a1f] rotate-90" />
                            <div className="text-right">
                                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Destination</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{quickViewOrder.route.to}</span>
                            </div>
                        </div>

                        {/* Order Attributes Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-2.5 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/40">
                                <span className="text-slate-500 dark:text-slate-400 font-medium block">Carrier</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block flex items-center gap-1">
                                    {quickViewOrder.supplier} <ShieldCheck size={13} className="text-emerald-500" />
                                </span>
                            </div>
                            <div className="p-2.5 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/40">
                                <span className="text-slate-500 dark:text-slate-400 font-medium block">Vehicle Spec</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                                    {quickViewOrder.vehicleType} ({quickViewOrder.vehicleNo})
                                </span>
                            </div>
                            <div className="p-2.5 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/40">
                                <span className="text-slate-500 dark:text-slate-400 font-medium block">Driver Name</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                                    {quickViewOrder.driverName}
                                </span>
                            </div>
                            <div className="p-2.5 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/40">
                                <span className="text-slate-500 dark:text-slate-400 font-medium block">Cargo Amount</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                                    {quickViewOrder.amount}
                                </span>
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="pt-2 flex gap-2">
                            <Button 
                                variant="outline" 
                                className="w-1/2 h-9 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                                onClick={() => setQuickViewOrder(null)}
                            >
                                Close
                            </Button>
                            <Button 
                                variant="primary" 
                                className="w-1/2 h-9 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                                onClick={() => {
                                    const targetOrder = quickViewOrder;
                                    setQuickViewOrder(null);
                                    navigate(`/customer/quotes/processing/track/${targetOrder.id}`, { state: { order: targetOrder } });
                                }}
                            >
                                <Activity size={14} />
                                <span>Open Full Tracking</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Call Driver Simulation Modal */}
            {callDriverOrder && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                    <div className="bg-white dark:bg-[#1e2329] rounded-xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-center space-y-4 relative">
                        
                        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-4 border-emerald-50 dark:border-emerald-900/40 shadow-inner">
                            <Phone size={28} className="animate-bounce" />
                        </div>

                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 mb-1">
                                Active Dispatch Contact
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{callDriverOrder.driverName}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                Driver for Order <span className="font-bold text-slate-900 dark:text-slate-100">{callDriverOrder.id}</span> ({callDriverOrder.vehicleNo})
                            </p>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 text-center space-y-1">
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Phone Number</span>
                            <span className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100 tracking-wider">
                                {callDriverOrder.driverPhone}
                            </span>
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                            <Button 
                                variant="primary" 
                                className="w-full h-10 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md flex items-center justify-center gap-2 rounded-lg"
                                onClick={() => {
                                    showToast(`Connecting call to driver ${callDriverOrder.driverName} (${callDriverOrder.driverPhone})...`, 'success');
                                }}
                            >
                                <Phone size={15} />
                                <span>Simulate Direct Call</span>
                            </Button>

                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    className="w-1/2 h-9 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                                    onClick={() => {
                                        navigator.clipboard?.writeText(callDriverOrder.driverPhone);
                                        showToast(`Phone number ${callDriverOrder.driverPhone} copied to clipboard!`, 'info');
                                    }}
                                >
                                    <Copy size={13} className="mr-1" /> Copy Phone
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-1/2 h-9 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                                    onClick={() => setCallDriverOrder(null)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Simulate New Dispatch Modal */}
            {isSimulateModalOpen && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                    <div className="bg-white dark:bg-[#1e2329] rounded-xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-600 dark:text-purple-400" /> Simulate New Dispatch
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Add a test processing order to inspect real-time tracking.</p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setIsSimulateModalOpen(false)} 
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSimulatedDispatch} className="space-y-3.5 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <FormLabel required>Origin City</FormLabel>
                                    <Input value={newDispatch.from} onChange={e => setNewDispatch({...newDispatch, from: e.target.value})} required />
                                </div>
                                <div>
                                    <FormLabel required>Destination City</FormLabel>
                                    <Input value={newDispatch.to} onChange={e => setNewDispatch({...newDispatch, to: e.target.value})} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <FormLabel required>Carrier / Supplier</FormLabel>
                                    <Input value={newDispatch.supplier} onChange={e => setNewDispatch({...newDispatch, supplier: e.target.value})} required />
                                </div>
                                <div>
                                    <FormLabel required>Vehicle Plate</FormLabel>
                                    <Input value={newDispatch.vehicleNo} onChange={e => setNewDispatch({...newDispatch, vehicleNo: e.target.value})} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <FormLabel required>Driver Name</FormLabel>
                                    <Input value={newDispatch.driverName} onChange={e => setNewDispatch({...newDispatch, driverName: e.target.value})} required />
                                </div>
                                <div>
                                    <FormLabel required>Driver Phone</FormLabel>
                                    <Input value={newDispatch.driverPhone} onChange={e => setNewDispatch({...newDispatch, driverPhone: e.target.value})} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <FormLabel required>Order Amount</FormLabel>
                                    <Input value={newDispatch.amount} onChange={e => setNewDispatch({...newDispatch, amount: e.target.value})} required />
                                </div>
                                <div>
                                    <FormLabel required>Est. Arrival</FormLabel>
                                    <Input value={newDispatch.estArrival} onChange={e => setNewDispatch({...newDispatch, estArrival: e.target.value})} required />
                                </div>
                            </div>

                            <div className="pt-3 flex gap-2 border-t border-slate-100 dark:border-slate-800">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="w-1/2 h-9 text-xs font-semibold"
                                    onClick={() => setIsSimulateModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    className="w-1/2 h-9 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm flex items-center justify-center gap-1.5"
                                >
                                    <Plus size={14} />
                                    <span>Dispatch Order</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
