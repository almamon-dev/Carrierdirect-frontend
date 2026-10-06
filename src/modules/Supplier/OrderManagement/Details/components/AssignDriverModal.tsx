import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import { UserCheck, Truck, Phone, User, Mail, X, Loader2 } from 'lucide-react';
import apiClient from '@/lib/axios';

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
    const [driverName, setDriverName] = useState('');
    const [driverPhone, setDriverPhone] = useState('');
    const [driverEmail, setDriverEmail] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [teamDrivers, setTeamDrivers] = useState<any[]>([]);
    const [selectedTeamMember, setSelectedTeamMember] = useState<string>('custom');
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setDriverName(currentDriver?.name && currentDriver.name !== 'Assigned Driver' && currentDriver.name !== 'Unassigned' ? currentDriver.name : '');
            setDriverPhone(currentDriver?.phone || '');
            setDriverEmail(currentDriver?.email || '');
            setVehiclePlate(currentVehiclePlate && currentVehiclePlate !== 'Assigning Fleet...' ? currentVehiclePlate : 'DE-TR-8821');
            setIsSubmitting(false);

            // Fetch only active team members
            async function fetchTeam() {
                setIsLoadingTeam(true);
                try {
                    const res = await apiClient.get('/supplier/team/members?status=active&per_page=100');
                    const members = res.data?.data || res.data || [];
                    if (Array.isArray(members) && members.length > 0) {
                        const activeOnly = members.filter((m: any) => !m.status || String(m.status).toLowerCase() === 'active');
                        setTeamDrivers(activeOnly);
                    }
                } catch {
                    // Fallback to manual entry
                } finally {
                    setIsLoadingTeam(false);
                }
            }
            fetchTeam();
        }
    }, [isOpen, currentDriver, currentVehiclePlate]);

    if (!isOpen) return null;

    const handleTeamMemberChange = (memberId: string) => {
        setSelectedTeamMember(memberId);
        if (memberId === 'custom') {
            setDriverName('');
            setDriverPhone('');
            setDriverEmail('');
        } else {
            const member = teamDrivers.find((m) => String(m.id) === String(memberId));
            if (member) {
                setDriverName(member.name || member.user?.name || '');
                setDriverPhone(member.phone || member.user?.phone || '');
                setDriverEmail(member.email || member.user?.email || '');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalName = driverName.trim() || 'Assigned Driver';
        const finalPhone = driverPhone.trim();
        const finalEmail = driverEmail.trim();
        const finalPlate = vehiclePlate.trim() || 'DE-TR-8821';
        
        setIsSubmitting(true);
        try {
            await onSave({ name: finalName, phone: finalPhone, email: finalEmail, plate: finalPlate });
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
            <div className="bg-white dark:bg-[#1e2329] rounded-[8px] max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                {/* Header */}
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
                    {/* Select from Team Members if available */}
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
                                    ...teamDrivers.map((m) => {
                                        const roleStr = m.role?.name || m.role || 'Fleet';
                                        const emailStr = m.email || m.user?.email;
                                        return {
                                            id: String(m.id),
                                            name: `${m.name || m.user?.name || 'Driver'} (${roleStr}) ${emailStr ? '• ' + emailStr : ''}`
                                        };
                                    })
                                ]}
                            />
                        </div>
                    )}

                    {/* Driver Name */}
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

                    {/* Driver Email */}
                    <div className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Driver Email Address
                        </FormLabel>
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

                    {/* Driver Phone Number */}
                    <div className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Driver Contact Number
                        </FormLabel>
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

                    {/* Vehicle License Plate */}
                    <div className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Assigned Vehicle License Plate
                        </FormLabel>
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

                    {/* Actions */}
                    <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="rounded-[4px] text-xs cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={isSubmitting}
                            className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer rounded-[4px] text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={13} className="animate-spin" />
                                    <span>Dispatching Driver...</span>
                                </>
                            ) : (
                                <>
                                    <UserCheck size={13} />
                                    <span>Confirm Driver Dispatch</span>
                                </>
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
