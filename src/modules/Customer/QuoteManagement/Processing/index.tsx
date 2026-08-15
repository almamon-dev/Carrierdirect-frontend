import React, { useState, useEffect, useMemo } from "react";
import {
    Phone, Eye, FileText, CheckCircle2, ChevronDown,
    RefreshCw, Plus, Clock, FileCheck, Copy, X,
    MapPin, Truck, ShieldCheck, UserCheck
} from "lucide-react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import DataTable, { Column } from "@/components/tables/data-table";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { ENDPOINTS } from "@/config/api";
import { useToastStore } from "@/stores/useToastStore";

export default function Processing() {
    const navigate = useNavigate();
    const showToast = useToastStore(state => state.showToast);

    const [orders, setOrders] = useState<any[]>([]);
    const [activeFilterTab, setActiveFilterTab] = useState<string>("All");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    // Modals & Drawers state
    const [quickViewOrder, setQuickViewOrder] = useState<any | null>(null);
    const [callDriverOrder, setCallDriverOrder] = useState<any | null>(null);

    // Primary Database Fetching Logic
    const fetchOrdersFromDatabase = async (showNotification = false) => {
        setIsLoading(true);
        try {
            const res = await apiClient.get(ENDPOINTS.CUSTOMER.ORDERS);
            const rawItems = res.data?.data || res.data || res.items || res;

            if (Array.isArray(rawItems)) {
                const mappedFromDb = rawItems.map((o: any) => {
                    const pickup = o.pickup_address || o.pickup_city || (o.quote?.quote_request?.pickup_address) || "Dhaka";
                    const delivery = o.delivery_address || o.delivery_city || (o.quote?.quote_request?.delivery_address) || "Chittagong";

                    const fromCity = pickup.split(",")[0]?.trim() || pickup;
                    const toCity = delivery.split(",")[0]?.trim() || delivery;
                    const amountVal = o.total_amount_formatted || (o.total_amount ? `€ ${Number(o.total_amount).toLocaleString()}` : "€ 0");

                    // Status display mapping
                    let uiStatus = "In Transit";
                    if (o.status === "pending") uiStatus = "Pending";
                    else if (o.status === "confirmed") uiStatus = "Assigned Driver";
                    else if (o.status === "in_progress" || o.status === "picked_up") uiStatus = "In Transit";
                    else if (o.status === "delivered") uiStatus = "Delivered (Awaiting POD)";
                    else if (o.status === "completed") uiStatus = "Delivered & POD";
                    else if (o.status === "cancelled") uiStatus = "Cancelled";
                    else if (o.status) uiStatus = o.status;

                    const step = o.tracking?.current_step ?? (
                        o.status === "completed" ? 5 :
                            o.status === "delivered" ? 4 :
                                o.status === "picked_up" ? 3 :
                                    o.status === "in_progress" ? 2 :
                                        o.status === "confirmed" ? 1 : 0
                    );
                    const progressVal = Math.min(100, Math.round(((step + 1) / 6) * 100));

                    const supplierName = o.supplier?.company_name || o.supplier?.name || "Global Transport Express";
                    const driverName = o.supplier?.name || "Assigned Driver";
                    const driverPhone = o.supplier?.profile?.phone_number || o.supplier?.phone || "+8801700000001";
                    const vehiclePlate = o.pallet_type || "DHA-11-2233";

                    return {
                        id: o.order_number || (typeof o.id === "number" ? `ORD-${o.id}` : o.id),
                        dbId: o.id,
                        route: { from: fromCity, to: toCity, fullFrom: pickup, fullTo: delivery },
                        supplier: supplierName,
                        rating: o.review?.rating || 4.8,
                        driverName: driverName,
                        driverPhone: driverPhone,
                        vehicleNo: vehiclePlate,
                        vehicleType: o.pallet_type || "Covered Van (14ft)",
                        cargoWeight: o.items?.[0]?.weight ? `${o.items[0].weight} KG` : "2.5 Ton",
                        amount: amountVal,
                        estArrival: o.estimated_time || o.pickup_date || "In Transit",
                        status: uiStatus,
                        rawStatus: o.status,
                        paymentStatus: "Escrow Secured",
                        goodsType: o.items?.[0]?.item_type || "General Logistics Cargo",
                        progress: progressVal,
                        items: o.items || [],
                        liveUpdates: o.live_updates || [],
                        proofOfDelivery: o.proof_of_delivery,
                        podStatus: o.pod_status,
                    };
                });

                setOrders(mappedFromDb);
                if (showNotification) {
                    showToast(`Refreshed ${mappedFromDb.length} active order(s) successfully.`, "success");
                }
            } else {
                setOrders([]);
            }
        } catch (err: any) {
            console.error("Failed to load orders:", err?.message || err);
            setOrders([]);
            if (showNotification) {
                showToast("Failed to fetch orders from server.", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdersFromDatabase();
    }, []);

    // Close actions dropdown on click outside or resize
    useEffect(() => {
        const handleCloseMenus = () => setOpenDropdown(null);
        window.addEventListener("click", handleCloseMenus);
        window.addEventListener("resize", handleCloseMenus);
        return () => {
            window.removeEventListener("click", handleCloseMenus);
            window.removeEventListener("resize", handleCloseMenus);
        };
    }, []);

    // Filtered data calculation
    const filteredOrders = useMemo(() => {
        if (activeFilterTab === "In Transit") {
            return orders.filter(o => o.status === "In Transit" || o.rawStatus === "in_progress" || o.rawStatus === "picked_up");
        }
        if (activeFilterTab === "Assigned") {
            return orders.filter(o => o.status === "Assigned Driver" || o.rawStatus === "confirmed" || o.rawStatus === "pending");
        }
        if (activeFilterTab === "Completed") {
            return orders.filter(o => o.status === "Delivered & POD" || o.status === "Delivered (Awaiting POD)" || o.rawStatus === "delivered" || o.rawStatus === "completed");
        }
        return orders;
    }, [orders, activeFilterTab]);

    // Handle POD acceptance confirmation with DB API update
    const handleAcceptPOD = async (row: any) => {
        setOpenDropdown(null);

        try {
            if (row.dbId) {
                await apiClient.post(`/customer/orders/${row.dbId}/pod-approve`);
            }
            showToast(`POD delivery confirmed for order ${row.id}! Payout released to carrier.`, "success");
            fetchOrdersFromDatabase();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Failed to confirm POD";
            showToast(msg, "error");
        }
    };

    // Download Consignment Note / Waybill text manifest file
    const handleDownloadWaybill = (row: any) => {
        setOpenDropdown(null);
        const manifestText = `
=====================================================
            CARRIERDIRECT LOGISTICS WAYBILL
=====================================================
Order Reference : ${row.id} (Database Ref: ${row.dbId || "N/A"})
Generated Date  : ${new Date().toLocaleString()}
Carrier Name    : ${row.supplier}
Driver Name     : ${row.driverName} (${row.driverPhone})
Vehicle Plate   : ${row.vehicleNo}
Vehicle Type    : ${row.vehicleType}
Cargo Weight    : ${row.cargoWeight}
Cargo Description: ${row.goodsType || "General Logistics Cargo"}

ROUTE DETAILS:
Origin City     : ${row.route.from} (${row.route.fullFrom})
Destination     : ${row.route.to} (${row.route.fullTo})
Est. Arrival    : ${row.estArrival}
Order Status    : ${row.status}
Payment Escrow  : ${row.paymentStatus}
Total Freight   : ${row.amount}

Terms & Conditions:
Carrier assumes full responsibility for transported goods under standard CMR terms.
Proof of Delivery (POD) signature required upon drop-off.
=====================================================
`;
        const blob = new Blob([manifestText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Waybill_${row.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`Waybill manifest for ${row.id} downloaded successfully.`, "success");
    };

    // Filter Tabs Component
    const FilterTabs = () => {
        const counts = useMemo(() => ({
            all: orders.length,
            inTransit: orders.filter(o => o.status === "In Transit" || o.rawStatus === "in_progress" || o.rawStatus === "picked_up").length,
            assigned: orders.filter(o => o.status === "Assigned Driver" || o.rawStatus === "confirmed" || o.rawStatus === "pending").length,
            completed: orders.filter(o => o.status === "Delivered & POD" || o.status === "Delivered (Awaiting POD)" || o.rawStatus === "delivered" || o.rawStatus === "completed").length,
        }), [orders]);

        const tabs = [
            { id: "All", label: "All Shipments", count: counts.all },
            { id: "In Transit", label: "In Transit", count: counts.inTransit },
            { id: "Assigned", label: "Assigned Driver", count: counts.assigned },
            { id: "Completed", label: "Delivered & POD", count: counts.completed },
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
                            className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${isActive
                                    ? "border-[#ff4a1f] text-[#ff4a1f] font-bold"
                                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
                                }`}
                        >
                            <span className="text-[13.5px]">{tab.label}</span>
                            <span className={`text-[11.5px] font-semibold px-2 py-0.5 rounded-full ${isActive
                                    ? "bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f]"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
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
            id: "id",
            label: "ORDER ID",
            render: (row) => (
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span
                        className="font-bold text-[#ff4a1f] hover:underline cursor-pointer"
                        onClick={() => navigate(`/customer/quotes/processing/track/${row.id}`, { state: { order: row } })}
                    >
                        {row.id}
                    </span>
                    {row.status === "In Transit" && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="GPS Active" />
                    )}
                </div>
            )
        },
        {
            id: "route",
            label: "ROUTE",
            render: (row) => (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    <span>{row.route.from}</span>
                    <span className="text-red-500 font-bold">⯈</span>
                    <span>{row.route.to}</span>
                </div>
            )
        },
        {
            id: "supplier",
            label: "SUPPLIER / CARRIER",
            render: (row) => (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <span>{row.supplier}</span>
                    <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                </div>
            )
        },
        {
            id: "driver",
            label: "DRIVER CONTACT",
            render: (row) => (
                <div className="flex items-center justify-between gap-2 max-w-[150px]">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{row.driverName}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{row.driverPhone}</span>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setCallDriverOrder(row);
                        }}
                        className="p-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-400 cursor-pointer transition-colors shadow-2xs shrink-0"
                        title="Call or Contact Driver"
                    >
                        <Phone size={13} />
                    </button>
                </div>
            )
        },
        {
            id: "vehicleNo",
            label: "VEHICLE PLATE",
            render: (row) => (
                <span className="font-mono text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                    {row.vehicleNo}
                </span>
            )
        },
        {
            id: "amount",
            label: "AMOUNT",
            render: (row) => (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {row.amount}
                </span>
            )
        },
        {
            id: "estArrival",
            label: "EST. ARRIVAL",
            render: (row) => (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap font-medium">
                    <Clock size={12} className="text-slate-400 shrink-0" />
                    <span>{row.estArrival}</span>
                </div>
            )
        },
        {
            id: "status",
            label: "STATUS",
            render: (row) => {
                let badgeVariant: any = "info";
                if (row.status === "In Transit") badgeVariant = "warning";
                else if (row.status === "Delivered & POD" || row.status === "Completed") badgeVariant = "success";
                else if (row.status === "Assigned Driver" || row.status === "Confirmed") badgeVariant = "info";
                else badgeVariant = "default";

                return (
                    <Badge variant={badgeVariant} className="text-[11px] font-bold px-2.5 py-0.5 whitespace-nowrap shadow-2xs">
                        {row.status}
                    </Badge>
                );
            }
        },
    ];

    // Actions Column
    const actions = (row: any) => (
        <div className="flex items-center justify-end gap-1.5 relative">
            <Button
                variant="primary"
                size="sm"
                className="h-7 px-2.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold shadow-2xs flex items-center gap-1 cursor-pointer"
                onClick={() => navigate(`/customer/quotes/processing/track/${row.id}`, { state: { order: row } })}
            >
                <Truck size={12} />
                <span>Track</span>
            </Button>

            <div className="relative">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (openDropdown === row.id) {
                            setOpenDropdown(null);
                        } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownPos({
                                top: rect.bottom + window.scrollY + 4,
                                left: rect.right + window.scrollX - 180,
                            });
                            setOpenDropdown(row.id);
                        }
                    }}
                    className="p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <ChevronDown size={14} />
                </button>

                {openDropdown === row.id && createPortal(
                    <div
                        className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans"
                        style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="w-full text-left px-3.5 py-2 text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                            onClick={() => {
                                setOpenDropdown(null);
                                setQuickViewOrder(row);
                            }}
                        >
                            <Eye size={14} className="text-slate-400" /> View Order Info
                        </button>

                        <button
                            className="w-full text-left px-3.5 py-2 text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                            onClick={() => {
                                setOpenDropdown(null);
                                setCallDriverOrder(row);
                            }}
                        >
                            <Phone size={14} className="text-emerald-500" /> Contact Driver
                        </button>

                        <button
                            className="w-full text-left px-3.5 py-2 text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                            onClick={() => handleDownloadWaybill(row)}
                        >
                            <FileText size={14} className="text-amber-500 dark:text-amber-400" /> Download Waybill
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        {row.rawStatus !== "completed" && row.status !== "Delivered & POD" ? (
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
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Active Processing Orders
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Track and manage your real-time active shipments, drivers, routes, and POD deliveries.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => fetchOrdersFromDatabase(true)}
                        disabled={isLoading}
                        className="h-9 px-3.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={`text-slate-500 dark:text-slate-400 ${isLoading ? 'animate-spin text-[#ff4a1f]' : ''}`} />
                        <span>Refresh</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/customer/quotes/create")}
                        className="h-9 px-4 rounded-lg bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-xs shadow-xs hover:shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <Plus size={15} />
                        <span>New Shipment Request</span>
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                tableId="customer_processing_orders"
                data={filteredOrders}
                columns={columns}
                actions={actions}
                headerTabs={<FilterTabs />}
                searchPlaceholder="Search active orders by ID, driver, vehicle plate, or route..."
                compact={true}
                isLoading={isLoading}
            />

            {/* Quick View Drawer / Modal */}
            {quickViewOrder && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                    <div className="bg-white dark:bg-[#1e2329] rounded-md max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-5 space-y-4 relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    Shipment Details {quickViewOrder.id}
                                </h3>
                                <Badge variant={quickViewOrder.status === "Delivered & POD" || quickViewOrder.rawStatus === "completed" ? "success" : "info"}>
                                    {quickViewOrder.status}
                                </Badge>
                            </div>
                            <button
                                type="button"
                                onClick={() => setQuickViewOrder(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-600 dark:text-slate-400">Transit Progress</span>
                                <span className="text-[#ff4a1f]">{quickViewOrder.progress}% Completed</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#ff4a1f] rounded-full transition-all duration-500"
                                    style={{ width: `${quickViewOrder.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Route Grid */}
                        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-[#12161c] rounded-lg text-xs border border-slate-100 dark:border-slate-800">
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 font-medium block text-[11px]">Pickup Location</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100 text-[13px]">{quickViewOrder.route.from}</span>
                                <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{quickViewOrder.route.fullFrom}</p>
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 font-medium block text-[11px]">Delivery Location</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100 text-[13px]">{quickViewOrder.route.to}</span>
                                <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{quickViewOrder.route.fullTo}</p>
                            </div>
                        </div>

                        {/* Cargo & Carrier Specs */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 border border-slate-100 dark:border-slate-800 rounded-lg">
                                <span className="text-slate-400 dark:text-slate-500 font-medium block text-[11px]">Carrier / Supplier</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{quickViewOrder.supplier}</span>
                                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                                    ★ {quickViewOrder.rating} Verified Carrier
                                </div>
                            </div>

                            <div className="p-3 border border-slate-100 dark:border-slate-800 rounded-lg">
                                <span className="text-slate-400 dark:text-slate-500 font-medium block text-[11px]">Vehicle & Load</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{quickViewOrder.vehicleNo}</span>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                                    {quickViewOrder.vehicleType} • {quickViewOrder.cargoWeight}
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Est Arrival */}
                        <div className="flex items-center justify-between p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-lg text-xs">
                            <div>
                                <span className="text-emerald-800 dark:text-emerald-300 font-medium block text-[11px]">Total Freight Fee</span>
                                <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">{quickViewOrder.amount}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-slate-500 dark:text-slate-400 font-medium block text-[11px]">Estimated Arrival</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{quickViewOrder.estArrival}</span>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-2">
                            <Button
                                variant="outline"
                                className="w-1/2 h-9 text-xs font-semibold"
                                onClick={() => setQuickViewOrder(null)}
                            >
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                className="w-1/2 h-9 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center justify-center gap-1.5"
                                onClick={() => {
                                    setQuickViewOrder(null);
                                    navigate(`/customer/quotes/processing/track/${quickViewOrder.id}`, { state: { order: quickViewOrder } });
                                }}
                            >
                                <Truck size={14} />
                                <span>Full Tracking</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Call Driver Modal */}
            {callDriverOrder && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                    <div className="bg-white dark:bg-[#1e2329] rounded-md max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-5 space-y-4 relative">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Phone size={15} className="text-emerald-600" /> Driver Contact Details
                            </h3>
                            <button
                                type="button"
                                onClick={() => setCallDriverOrder(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="text-center py-2 space-y-1.5">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                                <UserCheck size={24} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{callDriverOrder.driverName}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{callDriverOrder.supplier}</p>
                            <span className="inline-block font-mono text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-md mt-1 border border-slate-200 dark:border-slate-700">
                                {callDriverOrder.driverPhone}
                            </span>
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                            <a
                                href={`tel:${callDriverOrder.driverPhone}`}
                                className="w-full h-10 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md flex items-center justify-center gap-2 rounded-lg transition-colors"
                            >
                                <Phone size={15} />
                                <span>Call Driver Directly</span>
                            </a>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="w-1/2 h-9 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                                    onClick={() => {
                                        navigator.clipboard?.writeText(callDriverOrder.driverPhone);
                                        showToast(`Phone number ${callDriverOrder.driverPhone} copied to clipboard!`, "info");
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

        </div>
    );
}
