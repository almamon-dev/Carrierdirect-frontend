import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import {
    Plus,
    Trash2,
    ShieldCheck,
    Receipt,
    Ship,
    ChevronDown,
    ChevronUp,
    Layers,
    Truck,
    BarChart3,
    TrendingUp,
    Building2,
    Phone,
    Navigation,
    CheckCircle2,
    UploadCloud,
    Split,
    Sparkles,
    ArrowRight,
    Clock,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { ExtraCostItem } from '../types/subcontractor.types';

interface SubcontractorCostsSectionProps {
    orderId: string;
    routeFrom: string;
    routeTo: string;
    distance?: string;
    customerRevenue?: number;
    platformFee?: number;
    hasDriver?: boolean;
    isRelay?: boolean;
    isSubcontractor?: boolean;
    effectiveDriver?: any;
    effectiveVehiclePlate?: string;
    dynamicLegs?: any[];
    subcontractorCost?: number;
    onQuickDispatch?: (driverData: any) => Promise<void> | void;
    onOpenAssignModal?: () => void;
    onOpenInvoiceModal?: () => void;
    uploadedInvoice?: {
        invoice_number: string;
        invoice_amount: number;
        status: 'planned' | 'invoice_submitted' | 'accrued';
    } | null;
    onApproveInvoice?: () => void;
}

const DEFAULT_FLEET_DRIVERS = [
    { id: 'drv-1', name: 'Aidan Moroney', phone: '+353 87 234 5678', vehicle_plate: '241-D-8821', vehicle_type: 'Curtainsider 40ft', rating: '4.9', trips: 142 },
    { id: 'drv-2', name: 'David Walsh', phone: '+353 86 912 3344', vehicle_plate: '232-C-4410', vehicle_type: 'Box Van 18T', rating: '4.8', trips: 98 },
    { id: 'drv-3', name: 'Liam O’Connor', phone: '+353 85 771 2090', vehicle_plate: '221-L-9012', vehicle_type: 'Refrigerated Artic', rating: '5.0', trips: 215 },
];

const DEFAULT_PARTNER_CARRIERS = [
    { id: 'sub-1', name: 'Cork Haulage & Distribution Ltd', contact_name: 'Sean Murphy', phone: '+353 21 450 9900', vehicle_plate: '231-C-9910', suggested_rate: 450, rating: '4.9' },
    { id: 'sub-2', name: 'ABC Logistics Europe', contact_name: 'Marcus Braun', phone: '+49 40 8821 330', vehicle_plate: 'HH-AB-4021', suggested_rate: 400, rating: '4.8' },
    { id: 'sub-3', name: 'Swift Line Freight', contact_name: 'Eoin Kelly', phone: '+353 1 660 2211', vehicle_plate: '241-D-3319', suggested_rate: 520, rating: '4.9' },
];

const QUICK_SURCHARGE_PRESETS = [
    { label: 'Ferry / RoRo', category: 'Ferry / RoRo Transit', title: 'Ferry Crossing & Maritime Transit', amount: 100 },
    { label: 'Highway Toll', category: 'Highway & Bridge Toll', title: 'Highway & Bridge Toll Fee', amount: 35 },
    { label: 'Customs Fee', category: 'Customs & Border Processing', title: 'Customs & Border Clearance', amount: 75 },
    { label: 'Port Demurrage', category: 'Port Demurrage / Parking', title: 'Port Waiting & Demurrage', amount: 120 },
];

export const SubcontractorCostsSection: React.FC<SubcontractorCostsSectionProps> = ({
    orderId,
    routeFrom,
    routeTo,
    distance = '248 km',
    customerRevenue = 12500.0,
    platformFee = 625.0,
    hasDriver = false,
    isRelay = false,
    isSubcontractor = false,
    effectiveDriver,
    effectiveVehiclePlate = '241-D-8821',
    dynamicLegs = [],
    subcontractorCost = 0,
    onQuickDispatch,
    onOpenAssignModal,
    onOpenInvoiceModal,
    uploadedInvoice,
    onApproveInvoice,
}) => {
    const cleanOrderId = String(orderId).replace(/^ORD-0*/i, '') || orderId;
    const originName = routeFrom && routeFrom !== '-' ? routeFrom : 'Savar';
    const destName = routeTo && routeTo !== '-' ? routeTo : 'Comilla';

    // Dispatch Mode Switcher ('internal' | 'subcontractor') when choosing/changing dispatch
    const [dispatchMode, setDispatchMode] = useState<'internal' | 'subcontractor'>(
        isSubcontractor ? 'subcontractor' : 'internal'
    );
    const [showInstantSwitcher, setShowInstantSwitcher] = useState<boolean>(!hasDriver);

    useEffect(() => {
        setShowInstantSwitcher(!hasDriver);
        if (isSubcontractor) setDispatchMode('subcontractor');
    }, [hasDriver, isSubcontractor]);

    // Live directory of team drivers & subcontractor partners
    const [fleetDrivers, setFleetDrivers] = useState<any[]>(DEFAULT_FLEET_DRIVERS);
    const [partnerCarriers, setPartnerCarriers] = useState<any[]>(DEFAULT_PARTNER_CARRIERS);
    const [selectedPartnerId, setSelectedPartnerId] = useState<string>(DEFAULT_PARTNER_CARRIERS[0].id);
    const [buyRateInput, setBuyRateInput] = useState<string>(
        subcontractorCost > 0 ? String(subcontractorCost) : '450'
    );
    const [isDispatching, setIsDispatching] = useState<boolean>(false);

    useEffect(() => {
        if (subcontractorCost > 0) {
            setBuyRateInput(String(subcontractorCost));
        }
    }, [subcontractorCost]);

    useEffect(() => {
        Promise.allSettled([
            apiClient.get('/supplier/team/members?status=active&per_page=50'),
            apiClient.get('/supplier/subcontractors'),
        ]).then(([teamRes, subsRes]) => {
            if (teamRes.status === 'fulfilled') {
                const list = teamRes.value.data?.data || teamRes.value.data || [];
                if (Array.isArray(list) && list.length > 0) {
                    setFleetDrivers(
                        list.slice(0, 6).map((m: any, i: number) => ({
                            id: String(m.id || i),
                            name: m.name || m.user?.name || `Driver ${i + 1}`,
                            phone: m.phone || m.user?.phone || '+353 87 234 5678',
                            vehicle_plate: m.vehicle_plate || `241-D-${1000 + i}`,
                            vehicle_type: m.vehicle_type || 'Standard Fleet',
                            rating: '4.9',
                            trips: 85 + i * 20,
                        }))
                    );
                }
            }
            if (subsRes.status === 'fulfilled') {
                const subs = subsRes.value.data?.data || subsRes.value.data || [];
                if (Array.isArray(subs) && subs.length > 0) {
                    const mapped = subs.slice(0, 6).map((s: any, i: number) => ({
                        id: String(s.id || i),
                        name: s.name || `Partner Carrier ${i + 1}`,
                        contact_name: s.contact_name || s.drivers?.[0]?.name || 'Dispatch Manager',
                        phone: s.phone || s.drivers?.[0]?.phone || '+353 1 450 9900',
                        vehicle_plate: s.drivers?.[0]?.vehicle_plate || `231-C-${4000 + i}`,
                        suggested_rate: 450,
                        rating: '4.9',
                    }));
                    setPartnerCarriers(mapped);
                    setSelectedPartnerId(mapped[0].id);
                }
            }
        });
    }, []);

    // Extra Operational Expenses & Surcharges (Ferry, Tolls, Customs)
    const [extraCosts, setExtraCosts] = useState<ExtraCostItem[]>(() => {
        try {
            const saved = localStorage.getItem(`cd_order_extra_costs_${cleanOrderId}`);
            if (saved) return JSON.parse(saved);
        } catch {
            // ignore
        }
        return [
            {
                id: 'ec-1',
                category: 'Ferry / RoRo Transit',
                title: 'Ferry Crossing & Maritime Transit',
                amount: 100.0,
                notes: 'Maritime Transit',
                date: new Date().toISOString().slice(0, 10),
            },
        ];
    });

    const [showCustomExpenseForm, setShowCustomExpenseForm] = useState<boolean>(false);
    const [customTitle, setCustomTitle] = useState<string>('');
    const [customAmount, setCustomAmount] = useState<string>('');
    const [showExtraCostDetails, setShowExtraCostDetails] = useState<boolean>(true);

    useEffect(() => {
        try {
            localStorage.setItem(`cd_order_extra_costs_${cleanOrderId}`, JSON.stringify(extraCosts));
        } catch {
            // ignore
        }
    }, [extraCosts, cleanOrderId]);

    const handleQuickAddPreset = (preset: typeof QUICK_SURCHARGE_PRESETS[0]) => {
        const newItem: ExtraCostItem = {
            id: `ec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            order_id: cleanOrderId,
            category: preset.category,
            title: preset.title,
            amount: preset.amount,
            date: new Date().toISOString().slice(0, 10),
        };
        setExtraCosts((prev) => [...prev, newItem]);
    };

    const handleAddCustomExpense = (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(customAmount);
        if (isNaN(amt) || amt <= 0) return;
        const newItem: ExtraCostItem = {
            id: `ec-${Date.now()}`,
            order_id: cleanOrderId,
            category: 'Operational Surcharge',
            title: customTitle.trim() || 'Additional Transit Surcharge',
            amount: amt,
            date: new Date().toISOString().slice(0, 10),
        };
        setExtraCosts((prev) => [...prev, newItem]);
        setCustomTitle('');
        setCustomAmount('');
        setShowCustomExpenseForm(false);
    };

    const handleDeleteExtraCost = (id: string) => {
        setExtraCosts((prev) => prev.filter((item) => item.id !== id));
    };

    // 1-Click Uber Dispatch Handlers
    const handleInstantFleetDispatch = async (driver: any) => {
        if (!onQuickDispatch) return;
        setIsDispatching(true);
        try {
            await onQuickDispatch({
                name: driver.name,
                phone: driver.phone,
                plate: driver.vehicle_plate,
                vehicle_type: driver.vehicle_type,
                driverType: 'internal',
                journeyLeg: `${originName} → ${destName}`,
                isRelay: false,
            });
            setShowInstantSwitcher(false);
        } finally {
            setIsDispatching(false);
        }
    };

    const handleInstantPartnerDispatch = async () => {
        if (!onQuickDispatch) return;
        const partner = partnerCarriers.find((p) => p.id === selectedPartnerId) || partnerCarriers[0];
        const parsedRate = parseFloat(buyRateInput) || 450;
        setIsDispatching(true);
        try {
            await onQuickDispatch({
                name: partner.contact_name || 'Partner Driver',
                phone: partner.phone,
                plate: partner.vehicle_plate || '231-C-9910',
                vehicle_type: 'Subcontractor Fleet',
                driverType: 'subcontractor',
                subcontractorCompany: partner.name,
                subcontractorId: partner.id,
                subcontractorCost: parsedRate,
                journeyLeg: `${originName} → ${destName}`,
                isRelay: false,
            });
            setShowInstantSwitcher(false);
        } finally {
            setIsDispatching(false);
        }
    };

    // Live Financial Calculations
    const totalExtraCosts = extraCosts.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

    // If user is previewing Subcontractor mode in the switcher before saving, show live preview
    const activeSubcontractorCost = showInstantSwitcher
        ? dispatchMode === 'subcontractor'
            ? parseFloat(buyRateInput) || 0
            : 0
        : isSubcontractor || isRelay
            ? Number(subcontractorCost) || 0
            : 0;

    const estimatedNetProfit = customerRevenue - activeSubcontractorCost - totalExtraCosts - platformFee;
    const netMarginPercent = customerRevenue > 0
        ? ((estimatedNetProfit / customerRevenue) * 100).toFixed(1)
        : '0.0';

    const selectedPartner = partnerCarriers.find((p) => p.id === selectedPartnerId) || partnerCarriers[0];
    const invoiceStatus = uploadedInvoice?.status || 'planned';

    return (
        <div className="space-y-3.5 font-sans antialiased text-slate-800 dark:text-slate-200">
            {/* 1. UBER FREIGHT LIVE CORRIDOR & EARNINGS BAR */}
            <div className="bg-slate-900 dark:bg-[#161b22] text-white rounded-[8px] p-4 shadow-sm border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Route Corridor Timeline */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-[6px] bg-[#ff4a1f] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Navigation size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                            <span>Live Dispatch Corridor</span>
                            <span>•</span>
                            <span className="text-orange-400">{distance}</span>
                        </div>
                        <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-white">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                                {originName}
                            </span>
                            <div className="flex items-center gap-1 text-slate-500">
                                <span className="w-6 sm:w-12 h-[1.5px] bg-slate-700" />
                                <Truck size={14} className="text-[#ff4a1f]" />
                                <span className="w-6 sm:w-12 h-[1.5px] bg-slate-700" />
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-white">
                                <span className="w-2 h-2 rounded-full bg-[#ff4a1f] ring-4 ring-[#ff4a1f]/20" />
                                {destName}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Live Payout & Margin Pills */}
                <div className="flex items-center gap-3 sm:gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 shrink-0 flex-wrap">
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            Customer Fare
                        </span>
                        <span className="text-sm sm:text-base font-bold text-white">
                            €{customerRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="h-7 w-px bg-slate-800 hidden sm:block" />

                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            {activeSubcontractorCost > 0 ? 'Partner Buy-Rate' : 'Fleet Execution'}
                        </span>
                        <span className={`text-sm sm:text-base font-bold ${activeSubcontractorCost > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                            {activeSubcontractorCost > 0
                                ? `- €${activeSubcontractorCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                : '€0.00 (Own Fleet)'}
                        </span>
                    </div>

                    <div className="h-7 w-px bg-slate-800 hidden sm:block" />

                    <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-[6px] px-3 py-1.5 flex items-center gap-2.5">
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
                                Your Net Earnings
                            </span>
                            <span className="text-base sm:text-lg font-black text-emerald-400">
                                €{estimatedNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-500 text-slate-950">
                            {netMarginPercent}%
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. MAIN 12-COLUMN UBER DISPATCH WORKSPACE (8 cols Dispatch & Surcharges : 4 cols Earnings Receipt) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
                {/* LEFT 8 COLUMNS */}
                <div className="lg:col-span-8 flex flex-col gap-3.5">
                    {/* CARD A: UBER-STYLE DISPATCH & SUBCONTRACTOR HUB */}
                    <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[8px] shadow-2xs overflow-hidden">
                        {/* Card Top Header */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 ${
                                    hasDriver
                                        ? isSubcontractor
                                            ? 'bg-blue-600 text-white'
                                            : isRelay
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-emerald-600 text-white'
                                        : 'bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f]'
                                }`}>
                                    {isSubcontractor ? <Building2 size={16} /> : <Truck size={16} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                                            {hasDriver && !showInstantSwitcher
                                                ? isRelay
                                                    ? `Active Multi-Driver Relay (${dynamicLegs.length || 2} Legs)`
                                                    : isSubcontractor
                                                        ? `Outsourced to Partner Carrier`
                                                        : `Dispatched to In-House Fleet`
                                                : 'Choose How to Fulfill This Order'}
                                        </h3>
                                        {hasDriver && !showInstantSwitcher && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Live Dispatch
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {hasDriver && !showInstantSwitcher
                                            ? 'Real-time carrier assignment and profit tracking synced automatically'
                                            : 'Assign your own fleet driver in 1 click or outsource to a subcontractor partner'}
                                    </p>
                                </div>
                            </div>

                            {/* Header Action Buttons */}
                            <div className="flex items-center gap-2">
                                {hasDriver && !showInstantSwitcher ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setShowInstantSwitcher(true)}
                                            className="h-8 px-3 rounded-[6px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                                        >
                                            <SlidersHorizontal size={12} />
                                            <span>Switch Driver / Partner</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onOpenAssignModal}
                                            className="h-8 px-3 rounded-[6px] bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                                        >
                                            <Split size={12} />
                                            <span>Relay / Full Edit</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {hasDriver && (
                                            <button
                                                type="button"
                                                onClick={() => setShowInstantSwitcher(false)}
                                                className="h-8 px-2.5 rounded-[6px] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer flex items-center gap-1"
                                            >
                                                <X size={13} />
                                                <span>Cancel</span>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={onOpenAssignModal}
                                            className="h-8 px-3 rounded-[6px] border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                                        >
                                            <Split size={12} />
                                            <span>Multi-Driver Relay / Custom</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* BODY: EITHER UBER 1-CLICK SELECTOR OR ACTIVE DISPATCH CARD */}
                        {showInstantSwitcher ? (
                            <div className="p-4 space-y-4 bg-slate-50/50 dark:bg-[#181c22]">
                                {/* Segmented Pill Toggle: Own Fleet vs Subcontractor Partner */}
                                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 dark:bg-slate-900 rounded-[8px]">
                                    <button
                                        type="button"
                                        onClick={() => setDispatchMode('internal')}
                                        className={`py-2 px-3 rounded-[6px] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                            dispatchMode === 'internal'
                                                ? 'bg-white dark:bg-[#1e2329] text-slate-900 dark:text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                        }`}
                                    >
                                        <Truck size={14} className={dispatchMode === 'internal' ? 'text-[#ff4a1f]' : ''} />
                                        <span>My Own Fleet Driver</span>
                                        <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                            0% Outsource Cost
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setDispatchMode('subcontractor')}
                                        className={`py-2 px-3 rounded-[6px] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                            dispatchMode === 'subcontractor'
                                                ? 'bg-white dark:bg-[#1e2329] text-blue-600 dark:text-blue-400 shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                        }`}
                                    >
                                        <Building2 size={14} className={dispatchMode === 'subcontractor' ? 'text-blue-600' : ''} />
                                        <span>Subcontractor Partner</span>
                                        <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                            Outsource Load
                                        </span>
                                    </button>
                                </div>

                                {/* MODE 1: 1-CLICK OWN FLEET DRIVERS */}
                                {dispatchMode === 'internal' && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                Available Company Drivers ({fleetDrivers.length})
                                            </span>
                                            <button
                                                type="button"
                                                onClick={onOpenAssignModal}
                                                className="text-[11px] font-bold text-[#ff4a1f] hover:underline cursor-pointer"
                                            >
                                                + Enter Custom Driver Manually
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                            {fleetDrivers.map((drv) => (
                                                <div
                                                    key={drv.id}
                                                    className="p-3 rounded-[6px] bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 hover:border-[#ff4a1f] dark:hover:border-[#ff4a1f] transition-all flex flex-col justify-between gap-3 group shadow-2xs"
                                                >
                                                    <div className="space-y-2">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/50 text-[#ff4a1f] font-bold text-xs flex items-center justify-center shrink-0 border border-orange-200/60">
                                                                    {drv.name.slice(0, 2).toUpperCase()}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                                                        {drv.name}
                                                                    </h4>
                                                                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                                                        ★ {drv.rating} • {drv.trips} trips
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                                                            <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                                                {drv.vehicle_plate}
                                                            </span>
                                                            <span className="text-slate-500 truncate ml-1">
                                                                {drv.vehicle_type}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        disabled={isDispatching}
                                                        onClick={() => handleInstantFleetDispatch(drv)}
                                                        className="w-full h-8 rounded-[5px] bg-slate-900 group-hover:bg-[#ff4a1f] dark:bg-slate-800 dark:group-hover:bg-[#ff4a1f] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                                    >
                                                        <span>Dispatch Driver</span>
                                                        <ArrowRight size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* MODE 2: UBER FREIGHT SUBCONTRACTOR PARTNER SELECTOR + BUY-RATE SLIDER */}
                                {dispatchMode === 'subcontractor' && (
                                    <div className="space-y-3.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                1. Select Partner Carrier
                                            </span>
                                            <button
                                                type="button"
                                                onClick={onOpenAssignModal}
                                                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                            >
                                                + Custom Carrier or Multi-Leg Relay
                                            </button>
                                        </div>

                                        {/* Partner Carrier Cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                            {partnerCarriers.map((partner) => {
                                                const isSelected = partner.id === selectedPartner.id;
                                                return (
                                                    <button
                                                        key={partner.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedPartnerId(partner.id);
                                                            if (partner.suggested_rate && !subcontractorCost) {
                                                                setBuyRateInput(String(partner.suggested_rate));
                                                            }
                                                        }}
                                                        className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                                                            isSelected
                                                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-600/30'
                                                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e2329] hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                                                    {partner.name}
                                                                </h4>
                                                                <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                                                                    Driver: {partner.contact_name}
                                                                </p>
                                                            </div>
                                                            <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                                                isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 dark:border-slate-700'
                                                            }`}>
                                                                {isSelected && <CheckCircle2 size={11} />}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between text-[10.5px] pt-1.5 border-t border-slate-100 dark:border-slate-800">
                                                            <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">
                                                                {partner.vehicle_plate}
                                                            </span>
                                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                                ★ {partner.rating}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Uber Buy-Rate Bar & 1-Click Dispatch Button */}
                                        <div className="p-3.5 rounded-[8px] bg-white dark:bg-[#1e2329] border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                            <div className="space-y-1.5 flex-1">
                                                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                                    <Sparkles size={13} className="text-blue-600" />
                                                    <span>2. Agreed Partner Buy-Rate (€)</span>
                                                </label>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {[300, 450, 600, 800].map((presetAmt) => (
                                                        <button
                                                            key={presetAmt}
                                                            type="button"
                                                            onClick={() => setBuyRateInput(String(presetAmt))}
                                                            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                                                                Number(buyRateInput) === presetAmt
                                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            €{presetAmt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2.5">
                                                <div className="relative w-32">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">€</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={buyRateInput}
                                                        onChange={(e) => setBuyRateInput(e.target.value)}
                                                        className="w-full h-9 pl-7 pr-2.5 text-sm font-black bg-slate-50 dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[6px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={isDispatching}
                                                    onClick={handleInstantPartnerDispatch}
                                                    className="h-9 px-4 rounded-[6px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors shrink-0"
                                                >
                                                    <span>Assign Partner</span>
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : isRelay ? (
                            /* ACTIVE MULTI-DRIVER RELAY VIEW */
                            <div className="p-4 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    {dynamicLegs.map((leg: any, idx: number) => {
                                        const legNumber = leg.leg_number || idx + 1;
                                        const isSub = leg.driver_type === 'subcontractor';
                                        const legCost = leg.cost || leg.agreed_cost;

                                        return (
                                            <div
                                                key={leg.id || `leg_${idx}`}
                                                className="p-3.5 rounded-[6px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100">
                                                        Leg {legNumber}: {leg.journey_leg || 'Route Segment'}
                                                    </span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        isSub
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                    }`}>
                                                        {isSub ? (leg.subcontractor_company || 'Subcontractor') : 'In-House Fleet'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between text-[11.5px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-slate-200">
                                                            {leg.driver_name || `Driver ${legNumber}`}
                                                        </p>
                                                        <p className="text-slate-500">{leg.driver_phone || '—'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                                                            {leg.vehicle_plate || 'GB-24-TRK'}
                                                        </span>
                                                        {isSub && legCost && (
                                                            <p className="text-blue-600 dark:text-blue-400 font-bold mt-1">
                                                                Buy-Rate: €{Number(legCost).toFixed(2)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            /* ACTIVE SINGLE DRIVER OR SUBCONTRACTOR UBER CARD */
                            <div className="p-4 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[8px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-full font-bold text-sm flex items-center justify-center text-white shrink-0 shadow-xs ${
                                            isSubcontractor ? 'bg-blue-600' : 'bg-[#ff4a1f]'
                                        }`}>
                                            {(effectiveDriver?.name || 'DR').slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    {isSubcontractor
                                                        ? effectiveDriver?.subcontractorCompany || 'Partner Carrier'
                                                        : effectiveDriver?.name || 'Assigned Driver'}
                                                </h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    isSubcontractor
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                }`}>
                                                    {isSubcontractor ? 'External Subcontractor' : 'Company Fleet Driver'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                                                {isSubcontractor && (
                                                    <span>
                                                        Driver: <strong className="text-slate-700 dark:text-slate-200">{effectiveDriver?.name}</strong>
                                                    </span>
                                                )}
                                                {effectiveDriver?.phone && (
                                                    <a
                                                        href={`tel:${effectiveDriver.phone}`}
                                                        className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 font-semibold hover:text-[#ff4a1f]"
                                                    >
                                                        <Phone size={11} />
                                                        <span>{effectiveDriver.phone}</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* European Style License Plate Badge + Rate */}
                                    <div className="flex items-center gap-3 self-start sm:self-center">
                                        <div className="inline-flex items-center rounded-[5px] border-2 border-slate-800 dark:border-slate-600 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                                            <span className="bg-blue-700 text-white text-[9px] font-extrabold px-1.5 py-1 leading-none">
                                                IRL
                                            </span>
                                            <span className="px-2.5 py-1 font-mono text-xs font-black tracking-wider text-slate-900 dark:text-white">
                                                {effectiveVehiclePlate}
                                            </span>
                                        </div>

                                        {isSubcontractor && (
                                            <div className="text-right pl-2 border-l border-slate-200 dark:border-slate-700">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                                    Agreed Buy-Rate
                                                </span>
                                                <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                                                    €{activeSubcontractorCost.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Subcontractor Invoice Action Bar (Only when outsourced to Subcontractor) */}
                                {isSubcontractor && (
                                    <div className="p-3 rounded-[6px] bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                                        <div className="flex items-center gap-2">
                                            {invoiceStatus === 'accrued' ? (
                                                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                                            ) : (
                                                <Clock size={15} className="text-blue-600 shrink-0" />
                                            )}
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                                    {invoiceStatus === 'accrued'
                                                        ? 'Subcontractor Invoice Verified & Accrued'
                                                        : invoiceStatus === 'invoice_submitted'
                                                            ? `Invoice #${uploadedInvoice?.invoice_number} Uploaded — Pending Verification`
                                                            : 'Subcontractor Carrier Invoice'}
                                                </span>
                                                <p className="text-[11px] text-slate-500">
                                                    {invoiceStatus === 'planned'
                                                        ? 'Upload the subcontractor’s bill once delivery is completed to finalize accrual.'
                                                        : `Recorded Invoice Amount: €${Number(uploadedInvoice?.invoice_amount || activeSubcontractorCost).toFixed(2)}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {invoiceStatus === 'planned' && onOpenInvoiceModal && (
                                                <button
                                                    type="button"
                                                    onClick={onOpenInvoiceModal}
                                                    className="h-8 px-3 rounded-[5px] bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 hover:bg-blue-50 text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                                >
                                                    <UploadCloud size={13} />
                                                    <span>Upload Partner Invoice</span>
                                                </button>
                                            )}

                                            {invoiceStatus === 'invoice_submitted' && onApproveInvoice && (
                                                <button
                                                    type="button"
                                                    onClick={onApproveInvoice}
                                                    className="h-8 px-3 rounded-[5px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                                >
                                                    <CheckCircle2 size={13} />
                                                    <span>Verify & Approve Invoice</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CARD B: UBER 1-CLICK TRIP SURCHARGES & TOLLS */}
                    <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[8px] p-4 shadow-2xs space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-[5px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                                    <Layers size={15} />
                                </div>
                                <div>
                                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                                        Trip Tolls & Operational Surcharges
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        1-click add common transit expenses or custom surcharges
                                    </p>
                                </div>
                            </div>

                            {/* 1-Click Quick Add Chips */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {QUICK_SURCHARGE_PRESETS.map((preset) => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => handleQuickAddPreset(preset)}
                                        className="h-7 px-2.5 rounded-full text-[11px] font-bold bg-slate-100 hover:bg-orange-50 hover:text-[#ff4a1f] hover:border-orange-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                        <Plus size={11} />
                                        <span>{preset.label} (€{preset.amount})</span>
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setShowCustomExpenseForm(!showCustomExpenseForm)}
                                    className="h-7 px-2.5 rounded-full text-[11px] font-bold bg-orange-50 text-[#ff4a1f] border border-orange-200 dark:bg-orange-950/40 dark:border-orange-800 flex items-center gap-1 cursor-pointer"
                                >
                                    <Plus size={11} />
                                    <span>Custom</span>
                                </button>
                            </div>
                        </div>

                        {/* Compact Custom Surcharge Input Bar */}
                        {showCustomExpenseForm && (
                            <form
                                onSubmit={handleAddCustomExpense}
                                className="flex flex-col sm:flex-row items-center gap-2 p-2.5 rounded-[6px] bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
                            >
                                <input
                                    type="text"
                                    value={customTitle}
                                    onChange={(e) => setCustomTitle(e.target.value)}
                                    placeholder="Expense description (e.g. Escort Vehicle / Tunnel Toll)"
                                    className="flex-1 w-full h-8 px-2.5 text-xs bg-white dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[4px]"
                                    required
                                />
                                <div className="relative w-full sm:w-32">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">€</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        placeholder="50.00"
                                        className="w-full h-8 pl-6 pr-2 text-xs font-bold bg-white dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[4px]"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="h-8 px-3 rounded-[4px] bg-[#ff4a1f] text-white text-xs font-bold cursor-pointer shrink-0"
                                >
                                    Add
                                </button>
                            </form>
                        )}

                        {/* Compact List of Active Surcharges */}
                        {extraCosts.length > 0 && (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800 pt-1">
                                {extraCosts.map((item) => (
                                    <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 min-w-0">
                                            {item.category.includes('Ferry') ? (
                                                <Ship size={13} className="text-blue-500 shrink-0" />
                                            ) : (
                                                <Receipt size={13} className="text-amber-500 shrink-0" />
                                            )}
                                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                {item.title}
                                            </span>
                                            <span className="text-[10.5px] text-slate-400 hidden sm:inline">
                                                • {item.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2.5 shrink-0">
                                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                                €{Number(item.amount).toFixed(2)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteExtraCost(item.id)}
                                                className="text-slate-400 hover:text-red-600 cursor-pointer p-0.5"
                                                title="Remove surcharge"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT 4 COLUMNS: UBER TRIP EARNINGS & PAYOUT RECEIPT */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                    <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[8px] p-4 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-[5px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                                    <BarChart3 size={15} />
                                </div>
                                <div>
                                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                                        Trip Earnings Receipt
                                    </h4>
                                    <p className="text-[10.5px] text-slate-400">Live settlement breakdown</p>
                                </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                In Escrow
                            </span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div className="flex items-center justify-between py-1">
                                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                                    Customer Trip Fare
                                </span>
                                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                    €{customerRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            <div className="h-px bg-slate-100 dark:bg-slate-800" />

                            <div className="space-y-2 text-slate-500 dark:text-slate-400">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <Building2 size={12} className={activeSubcontractorCost > 0 ? 'text-blue-500' : 'text-slate-400'} />
                                        <span>
                                            {activeSubcontractorCost > 0 ? 'Subcontractor Buy-Rate' : 'In-House Fleet Cost'}
                                        </span>
                                    </span>
                                    <span className={`font-bold ${activeSubcontractorCost > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600'}`}>
                                        {activeSubcontractorCost > 0
                                            ? `- €${activeSubcontractorCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                            : '€0.00'}
                                    </span>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setShowExtraCostDetails(!showExtraCostDetails)}
                                            className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                                        >
                                            <Layers size={12} className="text-amber-500" />
                                            <span>Tolls & Surcharges ({extraCosts.length})</span>
                                            {showExtraCostDetails ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                        </button>
                                        <span className="font-bold text-red-600 dark:text-red-400">
                                            - €{totalExtraCosts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    {showExtraCostDetails && extraCosts.length > 0 && (
                                        <div className="pl-4 py-1.5 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 text-[11px]">
                                            {extraCosts.map((ec) => (
                                                <div key={ec.id} className="flex items-center justify-between">
                                                    <span className="truncate pr-2 text-slate-500">
                                                        {ec.title}
                                                    </span>
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                                                        - €{Number(ec.amount).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <ShieldCheck size={12} className="text-slate-400" />
                                        <span>Platform Fee (5%)</span>
                                    </span>
                                    <span className="font-bold text-red-600 dark:text-red-400">
                                        - €{platformFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Net Earnings Highlight Box */}
                        <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-[6px] p-3.5 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Your Net Take-Home
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                                        <TrendingUp size={10} /> {netMarginPercent}% Margin
                                    </span>
                                </div>
                                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                    €{estimatedNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                                <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                                    Automatically released from Escrow upon POD confirmation
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubcontractorCostsSection;
