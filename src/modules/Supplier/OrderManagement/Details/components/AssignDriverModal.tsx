import React from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import { UserCheck, Truck, Phone, User, Mail, X, Loader2, ShieldCheck, Building2, Route } from 'lucide-react';
import { useAssignDriverModal, AssignDriverData } from '../hooks/useAssignDriverModal';

interface AssignDriverModalProps {
    isOpen: boolean;
    orderId: string;
    currentDriver?: any;
    currentVehiclePlate?: string;
    onSave: (driverData: AssignDriverData) => Promise<void> | void;
    onClose: () => void;
}

export const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
    isOpen,
    orderId,
    currentDriver,
    currentVehiclePlate = '',
    onSave,
    onClose,
}) => {
    const {
        driverType,
        setDriverType,
        subcontractorCompany,
        setSubcontractorCompany,
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
        teamDrivers,
        selectedTeamMember,
        isSubmitting,
        subcontractorsList,
        selectedSubcontractorId,
        subcontractorDrivers,
        selectedSubDriverId,
        handleSubcontractorChange,
        handleSubcontractorDriverChange,
        handleTeamMemberChange,
        handleSubmit,
    } = useAssignDriverModal({ isOpen, currentDriver, currentVehiclePlate, onSave });

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
            <div className="bg-white dark:bg-[#1e2329] rounded-[8px] max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#ff4a1f]">
                            <UserCheck size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Assign Driver & Vehicle</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Order Ref: <strong className="font-mono text-slate-700 dark:text-slate-300">{orderId}</strong></p>
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

                <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Driver Affiliation Switcher */}
                    <div className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Driver Affiliation / Ownership
                        </FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setDriverType('internal')}
                                className={`px-3 py-2 rounded-[4px] border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                                    driverType === 'internal'
                                        ? 'border-[#ff4a1f] bg-orange-50 text-[#ff4a1f] dark:bg-orange-950/30'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                <UserCheck size={13} />
                                <span>In-House Fleet</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setDriverType('subcontractor')}
                                className={`px-3 py-2 rounded-[4px] border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                                    driverType === 'subcontractor'
                                        ? 'border-[#ff4a1f] bg-orange-50 text-[#ff4a1f] dark:bg-orange-950/30'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                <Building2 size={13} />
                                <span>Subcontractor Driver</span>
                            </button>
                        </div>
                    </div>

                    {/* Subcontractor Specific Fields */}
                    {driverType === 'subcontractor' ? (
                        <>
                            <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-[4px] text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
                                <ShieldCheck size={14} className="shrink-0 mt-0.5 text-blue-600" />
                                <span>
                                    <strong>Access Control Separation:</strong> Subcontractor driver is tracked on the Driver App only for this shipment leg. They have NO access to your company account, internal rates, or team payroll.
                                </span>
                            </div>

                            {/* Registered Subcontractor Selection */}
                            {subcontractorsList.length > 0 && (
                                <div className="space-y-1">
                                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Choose Registered Subcontractor
                                    </FormLabel>
                                    <Select
                                        size="sm"
                                        value={selectedSubcontractorId}
                                        onChange={(val) => handleSubcontractorChange(typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val))}
                                        showSearch={false}
                                        placeholder="Select Subcontractor Company"
                                        disabled={isSubmitting}
                                        options={[
                                            { id: 'custom', name: 'Enter Custom / Other Subcontractor' },
                                            ...subcontractorsList.map((s) => ({
                                                id: String(s.id),
                                                name: `${s.name} (${s.drivers?.length || s.drivers_count || 0} drivers)`
                                            }))
                                        ]}
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Subcontractor Company Name <span className="text-rose-500">*</span>
                                </FormLabel>
                                <Input
                                    icon={<Building2 size={13} />}
                                    type="text"
                                    required
                                    disabled={isSubmitting}
                                    placeholder="e.g. ABC Logistics"
                                    value={subcontractorCompany}
                                    onChange={(e) => setSubcontractorCompany(e.target.value)}
                                    className="h-8 text-xs rounded-[4px]"
                                />
                            </div>

                            {/* Subcontractor Driver Selection */}
                            {subcontractorDrivers.length > 0 && (
                                <div className="space-y-1">
                                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Choose Driver under {subcontractorCompany || 'Subcontractor'}
                                    </FormLabel>
                                    <Select
                                        size="sm"
                                        value={selectedSubDriverId}
                                        onChange={(val) => handleSubcontractorDriverChange(typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val))}
                                        showSearch={false}
                                        placeholder="Select Driver from this Subcontractor"
                                        disabled={isSubmitting}
                                        options={[
                                            { id: 'custom', name: 'Enter New Driver Details' },
                                            ...subcontractorDrivers.map((d) => ({
                                                id: String(d.id),
                                                name: `${d.name} • ${d.phone} (${d.vehicle_plate || 'No Truck Plate'})`
                                            }))
                                        ]}
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Assigned Journey Leg
                                </FormLabel>
                                <Input
                                    icon={<Route size={13} />}
                                    type="text"
                                    disabled={isSubmitting}
                                    placeholder="e.g. Dublin Port → Final Destination"
                                    value={journeyLeg}
                                    onChange={(e) => setJourneyLeg(e.target.value)}
                                    className="h-8 text-xs rounded-[4px]"
                                />
                            </div>
                        </>
                    ) : (
                        teamDrivers.length > 0 && (
                            <div className="space-y-1">
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Select from Active Team Members
                                </FormLabel>
                                <Select
                                    size="sm"
                                    value={selectedTeamMember}
                                    onChange={(val) => handleTeamMemberChange(typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val))}
                                    showSearch={false}
                                    placeholder="Choose Active Driver"
                                    disabled={isSubmitting}
                                    options={[
                                        { id: 'custom', name: 'Enter Custom Driver Details' },
                                        ...teamDrivers.map((m) => ({
                                            id: String(m.id),
                                            name: `${m.name || m.user?.name || 'Driver'} (${m.role?.name || m.role || 'Fleet'}) ${m.email || m.user?.email ? '• ' + (m.email || m.user?.email) : ''}`
                                        }))
                                    ]}
                                />
                            </div>
                        )
                    )}

                    <div className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Driver Full Name <span className="text-rose-500">*</span>
                        </FormLabel>
                        <Input
                            icon={<User size={13} />}
                            type="text"
                            required
                            disabled={isSubmitting}
                            placeholder="e.g. John Doe"
                            value={driverName}
                            onChange={(e) => setDriverName(e.target.value)}
                            className="h-8 text-xs rounded-[4px]"
                        />
                    </div>

                    <div className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Driver Email Address</FormLabel>
                        <Input
                            icon={<Mail size={13} />}
                            type="email"
                            disabled={isSubmitting}
                            placeholder="e.g. driver@example.com"
                            value={driverEmail}
                            onChange={(e) => setDriverEmail(e.target.value)}
                            className="h-8 text-xs rounded-[4px]"
                        />
                    </div>

                    <div className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Driver Contact Number (App Login) <span className="text-rose-500">*</span>
                        </FormLabel>
                        <Input
                            icon={<Phone size={13} />}
                            type="text"
                            required
                            disabled={isSubmitting}
                            placeholder="e.g. +44 7123 456789"
                            value={driverPhone}
                            onChange={(e) => setDriverPhone(e.target.value)}
                            className="h-8 text-xs rounded-[4px]"
                        />
                    </div>

                    <div className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Assigned Vehicle License Plate</FormLabel>
                        <Input
                            icon={<Truck size={13} />}
                            type="text"
                            disabled={isSubmitting}
                            placeholder="e.g. GB-24-TRK"
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                            className="h-8 text-xs rounded-[4px] font-mono"
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="outline" size="sm" disabled={isSubmitting} onClick={onClose} className="rounded-[4px] text-xs cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer rounded-[4px] text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                            {isSubmitting ? (
                                <><Loader2 size={13} className="animate-spin" /><span>Assigning Driver...</span></>
                            ) : (
                                <><UserCheck size={13} /><span>{driverType === 'subcontractor' ? 'Assign Subcontractor Driver' : 'Confirm Fleet Dispatch'}</span></>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AssignDriverModal;
