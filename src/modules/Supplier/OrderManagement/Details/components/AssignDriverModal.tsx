import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import Switch from '@/components/ui/switch';
import {
    UserCheck,
    Truck,
    Phone,
    User,
    Mail,
    X,
    Loader2,
    ShieldCheck,
    Building2,
    Route,
    ArrowRight,
    Split,
    Euro,
    CheckCircle2,
    Plus,
    Trash2,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { useAssignDriverModal, AssignDriverData } from '../hooks/useAssignDriverModal';

interface AssignDriverModalProps {
    isOpen: boolean;
    orderId: string;
    currentDriver?: any;
    currentVehiclePlate?: string;
    onSave: (driverData: AssignDriverData) => Promise<void> | void;
    onClose: () => void;
    pickupCity?: string;
    deliveryCity?: string;
    customerRevenue?: number;
}

export const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
    isOpen,
    orderId,
    currentDriver,
    currentVehiclePlate = '',
    onSave,
    onClose,
    pickupCity = '',
    deliveryCity = '',
    customerRevenue = 1000.0,
}) => {
    const {
        isRelay,
        handleToggleRelay,

        // Leg 1 / Main Driver
        driverType,
        setDriverType,
        subcontractorCompany,
        setSubcontractorCompany,
        subcontractorCost,
        setSubcontractorCost,
        journeyLeg,
        setJourneyLeg,
        driverName,
        setDriverName,
        driverPhone,
        setDriverPhone,
        driverEmail,
        setDriverEmail,
        vehiclePlate,
        setVehiclePlate,
        vehicleType,
        setVehicleType,
        teamDrivers,
        selectedTeamMember,
        subcontractorsList,
        selectedSubcontractorId,
        subcontractorDrivers,
        selectedSubDriverId,
        handleSubcontractorChange,
        handleSubcontractorDriverChange,
        handleTeamMemberChange,

        // Leg 2 (Relay)
        leg2DriverType,
        setLeg2DriverType,
        leg2SubcontractorCompany,
        setLeg2SubcontractorCompany,
        leg2JourneyLeg,
        setLeg2JourneyLeg,
        leg2DriverName,
        setLeg2DriverName,
        leg2DriverPhone,
        setLeg2DriverPhone,
        leg2DriverEmail,
        setLeg2DriverEmail,
        leg2VehiclePlate,
        setLeg2VehiclePlate,
        leg2VehicleType,
        setLeg2VehicleType,
        leg2Cost,
        setLeg2Cost,
        leg2SelectedSubcontractorId,
        leg2SelectedSubDriverId,
        leg2SubcontractorDrivers,
        leg2SelectedTeamMember,
        handleLeg2SubcontractorChange,
        handleLeg2SubcontractorDriverChange,
        handleLeg2TeamMemberChange,

        // Additional Legs (Leg 3, 4...)
        additionalLegs,
        handleAddAdditionalLeg,
        handleRemoveAdditionalLeg,
        handleUpdateAdditionalLeg,

        isLoadingTeam,
        isSubmitting,
        handleSubmit,
    } = useAssignDriverModal({ isOpen, currentDriver, currentVehiclePlate, onSave, pickupCity, deliveryCity });

    // Live profit calculation
    const profitStats = useMemo(() => {
        const rev = Number(customerRevenue) || 1000;
        let totalOutsourceCost = 0;

        if (driverType === 'subcontractor') {
            totalOutsourceCost += parseFloat(subcontractorCost) || 0;
        }

        if (isRelay) {
            if (leg2DriverType === 'subcontractor') {
                totalOutsourceCost += parseFloat(leg2Cost) || 0;
            }
            additionalLegs.forEach((l) => {
                if (l.driverType === 'subcontractor') {
                    totalOutsourceCost += parseFloat(l.cost) || 0;
                }
            });
        }

        const netProfit = rev - totalOutsourceCost;
        const marginPercent = rev > 0 ? ((netProfit / rev) * 100).toFixed(1) : '0';

        return {
            customerRevenue: rev,
            totalOutsourceCost,
            netProfit,
            marginPercent,
            isProfitable: netProfit >= 0,
        };
    }, [customerRevenue, driverType, subcontractorCost, isRelay, leg2DriverType, leg2Cost, additionalLegs]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-4 animate-in fade-in duration-150 font-sans">
            <div className={`bg-white dark:bg-[#1e2329] rounded-[8px] w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[94vh] overflow-y-auto ${
                isRelay ? 'max-w-4xl' : 'max-w-xl'
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 pt-4 pb-3 sticky top-0 bg-white dark:bg-[#1e2329] z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#ff4a1f]">
                            <UserCheck size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {isRelay ? `Multi-Driver Relay Dispatch (${2 + additionalLegs.length} Drivers)` : 'Assign Driver & Vehicle'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Order Ref: <strong className="font-mono text-slate-700 dark:text-slate-300">{orderId}</strong>
                                {customerRevenue > 0 && (
                                    <span> • Customer Order Price: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">€{customerRevenue.toFixed(2)}</strong></span>
                                )}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1 cursor-pointer disabled:opacity-50"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4">
                    {/* 1. Main Execution Strategy: Only shown when Relay is OFF; when Relay is ON each leg chooses independently */}
                    <div className="space-y-2">
                        {!isRelay && (
                            <>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400">
                                        Who is delivering this order?
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                        {driverType === 'internal' ? 'In-House Fleet' : 'Outsourced Partner'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2.5">
                                    {/* Card 1: Own Fleet Driver */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDriverType('internal');
                                        }}
                                        className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                                            driverType === 'internal'
                                                ? 'border-[#ff4a1f] bg-orange-50/40 dark:bg-orange-950/20 ring-1 ring-[#ff4a1f]/30'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#14181f]'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5 ${
                                            driverType === 'internal'
                                                ? 'bg-[#ff4a1f] text-white shadow-xs'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                        }`}>
                                            <Truck size={17} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                                    My Own Driver
                                                </span>
                                                {driverType === 'internal' && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f]"></span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                                                Company fleet driver & vehicles
                                            </p>
                                        </div>
                                    </button>

                                    {/* Card 2: Subcontractor Partner */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDriverType('subcontractor');
                                        }}
                                        className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                                            driverType === 'subcontractor'
                                                ? 'border-[#ff4a1f] bg-orange-50/40 dark:bg-orange-950/20 ring-1 ring-[#ff4a1f]/30'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#14181f]'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5 ${
                                            driverType === 'subcontractor'
                                                ? 'bg-[#ff4a1f] text-white shadow-xs'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                        }`}>
                                            <Building2 size={17} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                                    Subcontractor Partner
                                                </span>
                                                {driverType === 'subcontractor' && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f]"></span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                                                Outsource to external carrier
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Optional Multi-Driver Relay Switch */}
                        <div className="pt-1.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <Switch
                                    checked={isRelay}
                                    onCheckedChange={handleToggleRelay}
                                />
                                <span>Multi-Driver Relay Dispatch (Independent Pickup & Delivery Legs)</span>
                            </div>
                            {isRelay && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-100 text-[#ff4a1f] dark:bg-orange-950 dark:text-orange-300 rounded">
                                    {2 + additionalLegs.length} Legs Active
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Relay Visual Flow Header (only when relay is checked) */}
                    {isRelay && (
                        <div className="p-2.5 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/60 rounded-[6px] space-y-1.5 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between text-xs font-bold text-purple-900 dark:text-purple-300">
                                <span className="flex items-center gap-1.5">
                                    <Route size={14} /> Multi-Driver Handover Sequence
                                </span>
                                <span className="text-[11px] font-normal text-purple-700 dark:text-purple-400">
                                    Each leg can be In-House or Subcontractor
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 py-1 overflow-x-auto">
                                <div className="min-w-[120px] flex-1 bg-white dark:bg-[#1e2329] p-1.5 rounded border border-purple-200 dark:border-purple-800/60 text-center">
                                    <span className="text-purple-700 dark:text-purple-400 font-bold block text-[9.5px]">Leg 1 (Pickup)</span>
                                    <span className="truncate block font-semibold text-xs">{driverName || 'Driver 1'}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{vehiclePlate || 'Truck Plate'}</span>
                                </div>
                                <ArrowRight size={14} className="text-purple-500 shrink-0" />
                                <div className="min-w-[120px] flex-1 bg-white dark:bg-[#1e2329] p-1.5 rounded border border-purple-200 dark:border-purple-800/60 text-center">
                                    <span className="text-purple-700 dark:text-purple-400 font-bold block text-[9.5px]">Leg 2</span>
                                    <span className="truncate block font-semibold text-xs">{leg2DriverName || 'Driver 2'}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{leg2VehiclePlate || 'Truck Plate'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= SINGLE DRIVER FORM (NON-RELAY) ================= */}
                    {!isRelay && (
                        <div className="space-y-3.5 pt-1">
                            {/* CASE A: IN-HOUSE FLEET DRIVER */}
                            {driverType === 'internal' && (
                                <div className="p-4 rounded-[6px] border border-orange-200/80 dark:border-orange-950/60 bg-orange-50/20 dark:bg-orange-950/10 space-y-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Select In-House Driver *
                                            </FormLabel>
                                            {isLoadingTeam && (
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <Loader2 size={10} className="animate-spin" /> Loading team...
                                                </span>
                                            )}
                                        </div>
                                        <select
                                            value={selectedTeamMember}
                                            onChange={(e) => handleTeamMemberChange(e.target.value)}
                                            className="w-full h-9 px-2.5 text-xs font-semibold bg-white dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[4px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#ff4a1f]"
                                        >
                                            <option value="custom">-- Select Registered Fleet Driver --</option>
                                            {teamDrivers.map((m: any) => (
                                                <option key={m.id} value={String(m.id)}>
                                                    {m.name} {m.phone ? `(${m.phone})` : ''} — {m.vehicle_plate || 'Fleet Truck'}
                                                </option>
                                            ))}
                                            <option value="custom">+ Enter Driver Manually</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Driver Full Name *
                                            </FormLabel>
                                            <Input
                                                type="text"
                                                value={driverName}
                                                onChange={(e) => setDriverName(e.target.value)}
                                                placeholder="e.g. David Walsh"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Driver Mobile Phone *
                                            </FormLabel>
                                            <Input
                                                type="text"
                                                value={driverPhone}
                                                onChange={(e) => setDriverPhone(e.target.value)}
                                                placeholder="e.g. +353 87 654 3210"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Assigned Truck Reg Plate *
                                            </FormLabel>
                                            <Input
                                                type="text"
                                                value={vehiclePlate}
                                                onChange={(e) => setVehiclePlate(e.target.value)}
                                                placeholder="e.g. 08-D-12345"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Vehicle Spec / Capacity
                                            </FormLabel>
                                            <Input
                                                type="text"
                                                value={vehicleType}
                                                onChange={(e) => setVehicleType(e.target.value)}
                                                placeholder="Curtainsider 40ft Artic"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CASE B: SUBCONTRACTOR PARTNER CARRIER */}
                            {driverType === 'subcontractor' && (
                                <div className="p-4 rounded-[6px] border border-blue-200/80 dark:border-blue-950/60 bg-blue-50/20 dark:bg-blue-950/10 space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    Subcontractor Carrier Company *
                                                </FormLabel>
                                                <a
                                                    href="/supplier/team/subcontractors"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10.5px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    Manage Partners ↗
                                                </a>
                                            </div>
                                            <select
                                                value={selectedSubcontractorId}
                                                onChange={(e) => handleSubcontractorChange(e.target.value)}
                                                className="w-full h-9 px-2.5 text-xs font-semibold bg-white dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[4px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="custom">-- Choose Partner Carrier --</option>
                                                {subcontractorsList.map((sub: any) => (
                                                    <option key={sub.id} value={String(sub.id)}>
                                                        {sub.name} {sub.phone ? `(${sub.phone})` : ''}
                                                    </option>
                                                ))}
                                                <option value="custom">+ Enter Custom Carrier Name</option>
                                            </select>
                                            {selectedSubcontractorId === 'custom' && (
                                                <Input
                                                    type="text"
                                                    value={subcontractorCompany}
                                                    onChange={(e) => setSubcontractorCompany(e.target.value)}
                                                    placeholder="Enter Carrier Company Name"
                                                    className="mt-1"
                                                    required
                                                />
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Route / Journey Leg *
                                            </FormLabel>
                                            <div className="relative">
                                                <Route size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={journeyLeg}
                                                    onChange={(e) => setJourneyLeg(e.target.value)}
                                                    placeholder="e.g. Origin → Destination"
                                                    className="w-full h-9 pl-7 pr-2.5 text-xs font-semibold bg-white dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[4px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Optional: If selected subcontractor has registered drivers, allow quick pick */}
                                    {selectedSubcontractorId !== 'custom' && subcontractorDrivers.length > 0 && (
                                        <div className="space-y-1">
                                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Select Registered Subcontractor Driver
                                            </FormLabel>
                                            <select
                                                value={selectedSubDriverId}
                                                onChange={(e) => handleSubcontractorDriverChange(e.target.value)}
                                                className="w-full h-8.5 px-2.5 text-xs font-semibold bg-white dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[4px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="custom">-- Enter Driver Manually --</option>
                                                {subcontractorDrivers.map((d: any) => (
                                                    <option key={d.id} value={String(d.id)}>
                                                        {d.name} {d.phone ? `(${d.phone})` : ''} {d.vehicle_plate ? `— ${d.vehicle_plate}` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Subcontractor Driver & Truck */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Subcontractor Driver Name & Phone *
                                            </FormLabel>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <Input
                                                    type="text"
                                                    value={driverName}
                                                    onChange={(e) => setDriverName(e.target.value)}
                                                    placeholder="Driver Name"
                                                    required
                                                />
                                                <Input
                                                    type="text"
                                                    value={driverPhone}
                                                    onChange={(e) => setDriverPhone(e.target.value)}
                                                    placeholder="Phone"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Subcontractor Truck Plate *
                                            </FormLabel>
                                            <Input
                                                type="text"
                                                value={vehiclePlate}
                                                onChange={(e) => setVehiclePlate(e.target.value)}
                                                placeholder="e.g. 08-D-99881"
                                                className="font-mono font-bold"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Agreed Buy Cost + Live Profit Margin Box */}
                                    <div className="p-3.5 rounded-[6px] bg-slate-900/90 dark:bg-[#14181f] border border-slate-700 text-xs space-y-2.5 shadow-inner">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <FormLabel className="text-xs font-bold text-white block mb-0.5">
                                                    Agreed Subcontractor Buy-Rate (€) *
                                                </FormLabel>
                                                <p className="text-[11px] text-slate-400">Total expense payable to this carrier partner.</p>
                                            </div>

                                            <div className="relative w-full sm:w-44">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">€</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={subcontractorCost}
                                                    onChange={(e) => setSubcontractorCost(e.target.value)}
                                                    placeholder="750.00"
                                                    className="w-full h-8.5 pl-7 pr-2.5 text-xs font-bold bg-slate-800 border border-slate-600 rounded-[4px] text-orange-400 focus:outline-none focus:border-[#ff4a1f]"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Live Profit Margin Bar */}
                                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                                            <span className="text-slate-400">
                                                Customer Freight: <strong className="text-white">€{profitStats.customerRevenue.toFixed(2)}</strong>
                                                &nbsp;—&nbsp; Subcontract: <strong className="text-orange-300">€{(parseFloat(subcontractorCost) || 0).toFixed(2)}</strong>
                                            </span>

                                            <div className="text-right">
                                                <span className="text-[10px] text-slate-400 block">Your Calculated Net Profit:</span>
                                                <span className={`text-xs font-black ${profitStats.isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {profitStats.isProfitable ? `+ €${profitStats.netProfit.toFixed(2)}` : `- €${Math.abs(profitStats.netProfit).toFixed(2)}`}
                                                    &nbsp;({profitStats.marginPercent}% {profitStats.isProfitable ? 'Margin' : 'Loss'})
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ================= MULTI-DRIVER RELAY FORM ================= */}
                    {isRelay && (
                        <div className="space-y-3 pt-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {/* Leg 1 */}
                                <div className="p-3.5 rounded-[6px] border border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/10 space-y-2.5">
                                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            Leg 1: Pickup / Collection
                                        </span>
                                        <select
                                            value={driverType}
                                            onChange={(e) => setDriverType(e.target.value as any)}
                                            className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#1e2329] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                                        >
                                            <option value="internal">In-House Fleet</option>
                                            <option value="subcontractor">Subcontractor</option>
                                        </select>
                                    </div>

                                    {driverType === 'internal' ? (
                                        <select
                                            value={selectedTeamMember}
                                            onChange={(e) => handleTeamMemberChange(e.target.value)}
                                            className="w-full h-8 px-2 text-xs font-semibold bg-white dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                                        >
                                            <option value="custom">-- Select Team Driver --</option>
                                            {teamDrivers.map((m: any) => (
                                                <option key={m.id} value={String(m.id)}>{m.name} ({m.phone})</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="space-y-1.5">
                                            <select
                                                value={selectedSubcontractorId}
                                                onChange={(e) => handleSubcontractorChange(e.target.value)}
                                                className="w-full h-8 px-2 text-xs font-semibold bg-white dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                                            >
                                                <option value="custom">-- Select Subcontractor Partner --</option>
                                                {subcontractorsList.map((sub: any) => (
                                                    <option key={sub.id} value={String(sub.id)}>{sub.name}</option>
                                                ))}
                                                <option value="custom">+ Custom Carrier Name</option>
                                            </select>
                                            {selectedSubcontractorId === 'custom' && (
                                                <Input
                                                    type="text"
                                                    value={subcontractorCompany}
                                                    onChange={(e) => setSubcontractorCompany(e.target.value)}
                                                    placeholder="Subcontractor Company Name"
                                                    required
                                                />
                                            )}
                                        </div>
                                    )}

                                    <Input
                                        type="text"
                                        value={journeyLeg}
                                        onChange={(e) => setJourneyLeg(e.target.value)}
                                        placeholder="Leg 1 Route (e.g. Origin → Hub)"
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-1.5">
                                        <Input
                                            type="text"
                                            value={driverName}
                                            onChange={(e) => setDriverName(e.target.value)}
                                            placeholder="Driver Name"
                                            required
                                        />
                                        <Input
                                            type="text"
                                            value={driverPhone}
                                            onChange={(e) => setDriverPhone(e.target.value)}
                                            placeholder="Driver Phone"
                                            required
                                        />
                                    </div>
                                    <div className={`grid ${driverType === 'subcontractor' ? 'grid-cols-2' : 'grid-cols-1'} gap-1.5`}>
                                        <Input
                                            type="text"
                                            value={vehiclePlate}
                                            onChange={(e) => setVehiclePlate(e.target.value)}
                                            placeholder="Truck Reg Plate"
                                            className="font-mono font-bold"
                                            required
                                        />
                                        {driverType === 'subcontractor' && (
                                            <Input
                                                type="number"
                                                value={subcontractorCost}
                                                onChange={(e) => setSubcontractorCost(e.target.value)}
                                                placeholder="Leg 1 Cost (€)"
                                                required
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Leg 2 */}
                                <div className="p-3.5 rounded-[6px] border border-purple-200 dark:border-purple-900 bg-purple-50/20 dark:bg-purple-950/10 space-y-2.5">
                                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                                            Leg 2: Delivery / Final Mile
                                        </span>
                                        <select
                                            value={leg2DriverType}
                                            onChange={(e) => setLeg2DriverType(e.target.value as any)}
                                            className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#1e2329] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                                        >
                                            <option value="subcontractor">Subcontractor</option>
                                            <option value="internal">In-House Fleet</option>
                                        </select>
                                    </div>

                                    {leg2DriverType === 'subcontractor' ? (
                                        <div className="space-y-1.5">
                                            <select
                                                value={leg2SelectedSubcontractorId}
                                                onChange={(e) => handleLeg2SubcontractorChange(e.target.value)}
                                                className="w-full h-8 px-2 text-xs font-semibold bg-white dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                                            >
                                                <option value="custom">-- Select Subcontractor Partner --</option>
                                                {subcontractorsList.map((sub: any) => (
                                                    <option key={sub.id} value={String(sub.id)}>{sub.name}</option>
                                                ))}
                                                <option value="custom">+ Custom Carrier Name</option>
                                            </select>
                                            {leg2SelectedSubcontractorId === 'custom' && (
                                                <Input
                                                    type="text"
                                                    value={leg2SubcontractorCompany}
                                                    onChange={(e) => setLeg2SubcontractorCompany(e.target.value)}
                                                    placeholder="Subcontractor Company Name"
                                                    required
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <select
                                            value={leg2SelectedTeamMember}
                                            onChange={(e) => handleLeg2TeamMemberChange(e.target.value)}
                                            className="w-full h-8 px-2 text-xs font-semibold bg-white dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                                        >
                                            <option value="custom">-- Select Team Driver --</option>
                                            {teamDrivers.map((m: any) => (
                                                <option key={m.id} value={String(m.id)}>{m.name} ({m.phone})</option>
                                            ))}
                                        </select>
                                    )}

                                    <Input
                                        type="text"
                                        value={leg2JourneyLeg}
                                        onChange={(e) => setLeg2JourneyLeg(e.target.value)}
                                        placeholder="Leg 2 Route (e.g. Hub → Destination)"
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-1.5">
                                        <Input
                                            type="text"
                                            value={leg2DriverName}
                                            onChange={(e) => setLeg2DriverName(e.target.value)}
                                            placeholder="Leg 2 Driver"
                                            required
                                        />
                                        <Input
                                            type="text"
                                            value={leg2DriverPhone}
                                            onChange={(e) => setLeg2DriverPhone(e.target.value)}
                                            placeholder="Leg 2 Phone"
                                            required
                                        />
                                    </div>

                                    <div className={`grid ${leg2DriverType === 'subcontractor' ? 'grid-cols-2' : 'grid-cols-1'} gap-1.5`}>
                                        <Input
                                            type="text"
                                            value={leg2VehiclePlate}
                                            onChange={(e) => setLeg2VehiclePlate(e.target.value)}
                                            placeholder="Leg 2 Truck Plate"
                                            className="font-mono font-bold"
                                            required
                                        />
                                        {leg2DriverType === 'subcontractor' && (
                                            <Input
                                                type="number"
                                                value={leg2Cost}
                                                onChange={(e) => setLeg2Cost(e.target.value)}
                                                placeholder="Leg 2 Cost (€)"
                                                required
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Live Relay Profit Summary Bar */}
                            {profitStats.totalOutsourceCost > 0 && (
                                <div className="p-3 rounded-[6px] bg-slate-900/90 dark:bg-[#14181f] border border-slate-700 flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Order Revenue: <strong className="text-white">€{profitStats.customerRevenue.toFixed(2)}</strong>
                                        &nbsp;—&nbsp; Total Subcontract Cost: <strong className="text-orange-300">€{profitStats.totalOutsourceCost.toFixed(2)}</strong>
                                    </span>
                                    <span className={`font-black ${profitStats.isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        Net Margin: €{profitStats.netProfit.toFixed(2)} ({profitStats.marginPercent}%)
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="h-8.5 px-3.5 text-xs font-semibold rounded-[4px] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-8.5 px-4 text-xs font-bold rounded-[4px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={13} className="animate-spin" />
                                    <span>Dispatching...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={13} />
                                    <span>{driverType === 'subcontractor' ? 'Confirm Subcontractor Dispatch' : 'Confirm Fleet Dispatch'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AssignDriverModal;
