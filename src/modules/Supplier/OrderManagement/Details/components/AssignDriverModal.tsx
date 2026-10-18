import React from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import { UserCheck, Truck, Phone, User, Mail, X, Loader2 } from 'lucide-react';
import { useAssignDriverModal } from '../hooks/useAssignDriverModal';

interface AssignDriverModalProps {
    isOpen: boolean;
    orderId: string;
    currentDriver?: any;
    currentVehiclePlate?: string;
    onSave: (driverData: { name: string; phone: string; email?: string; plate: string }) => Promise<void> | void;
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
        handleTeamMemberChange,
        handleSubmit,
    } = useAssignDriverModal({ isOpen, currentDriver, currentVehiclePlate, onSave });

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
            <div className="bg-white dark:bg-[#1e2329] rounded-[8px] max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
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
                    {teamDrivers.length > 0 && (
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
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Driver Contact Number</FormLabel>
                        <Input
                            icon={<Phone size={13} />}
                            type="text"
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
                                <><Loader2 size={13} className="animate-spin" /><span>Dispatching Driver...</span></>
                            ) : (
                                <><UserCheck size={13} /><span>Confirm Driver Dispatch</span></>
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
