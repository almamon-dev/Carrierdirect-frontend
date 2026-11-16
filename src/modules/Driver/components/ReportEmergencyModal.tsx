import React, { useState, useEffect } from 'react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import {
    AlertCircle,
    HeartPulse,
    Wrench,
    ShieldAlert,
    HelpCircle,
    MapPin,
    Check,
} from 'lucide-react';
import { ShipmentItem } from '../types/shipmentTypes';
import { toast } from '@/hooks/use-toast';
import apiClient from '@/lib/axios';

interface ReportEmergencyModalProps {
    isOpen: boolean;
    shipment: ShipmentItem | null;
    onClose: () => void;
    onSuccess?: (updatedShipment?: any) => void;
}

export const ReportEmergencyModal: React.FC<ReportEmergencyModalProps> = ({
    isOpen,
    shipment,
    onClose,
    onSuccess,
}) => {
    const [reason, setReason] = useState<'sick_leave' | 'breakdown' | 'accident' | 'emergency'>('sick_leave');
    const [notes, setNotes] = useState('');
    const [cargoStatus, setCargoStatus] = useState<'safe' | 'needs_assistance'>('safe');
    const [locationCoords, setLocationCoords] = useState<{ lat?: number; lng?: number }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Try to obtain GPS coordinates when modal opens
    useEffect(() => {
        if (isOpen && typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocationCoords({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    });
                },
                () => {
                    // Coordinates optional; silent fail is acceptable
                },
                { timeout: 5000, enableHighAccuracy: true }
            );
        }
    }, [isOpen]);

    if (!shipment) return null;

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);

        try {
            const cleanId = String(shipment.id).replace(/^ORD-0*/i, '');
            const payload = {
                reason,
                notes: notes.trim() || 'Driver reported emergency / sudden illness.',
                cargo_status: cargoStatus === 'safe' ? 'Cargo safely secured' : 'Cargo needs roadside assistance',
                latitude: locationCoords.lat,
                longitude: locationCoords.lng,
            };

            const response = await apiClient.post(`/driver/shipments/${cleanId}/report-emergency`, payload);

            toast({
                title: 'Emergency Reported',
                description: 'Shift placed on Sick Leave and dispatcher notified.',
            });

            if (onSuccess) {
                onSuccess(response.data?.data);
            }
            onClose();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to submit emergency report. Please call dispatch.';
            toast({
                variant: 'destructive',
                title: 'Report Failed',
                description: message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const reasons = [
        {
            id: 'sick_leave',
            label: 'Sudden Sickness / Medical Unfit',
            desc: 'Fever, acute pain, dizziness, or medical emergency',
            icon: HeartPulse,
        },
        {
            id: 'breakdown',
            label: 'Vehicle Breakdown',
            desc: 'Engine, tire, brake or mechanical defect',
            icon: Wrench,
        },
        {
            id: 'accident',
            label: 'Traffic Collision / Road Hazard',
            desc: 'Accident involvement or route blockage',
            icon: ShieldAlert,
        },
        {
            id: 'emergency',
            label: 'Family / Urgent Emergency',
            desc: 'Critical domestic or personal emergency',
            icon: HelpCircle,
        },
    ];

    const modalFooter = (
        <div className="flex items-center justify-end gap-2.5">
            <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-8.5 px-3.5 text-xs font-medium cursor-pointer"
            >
                Cancel
            </Button>
            <Button
                size="sm"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="h-8.5 px-4 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            title="Report Trip Emergency / Sick Leave"
            description={`Order #${shipment.orderNumber || shipment.id} • Active Trip Incident`}
            footer={modalFooter}
            className="rounded-[6px]"
        >
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Clean Neutral Notice */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-[4px] flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                    <AlertCircle size={15} className="text-slate-500 mt-0.5 shrink-0" />
                    <p className="text-[11.5px] leading-relaxed">
                        Submitting will change your duty to <strong>Sick Leave (Offline)</strong> and alert operations dispatch to reassign this journey leg.
                    </p>
                </div>

                {/* Reason Selection */}
                <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Reason *
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                        {reasons.map((r) => {
                            const Icon = r.icon;
                            const isSelected = reason === r.id;
                            return (
                                <div
                                    key={r.id}
                                    onClick={() => setReason(r.id as any)}
                                    className={`p-2.5 rounded-[4px] border transition-all cursor-pointer flex items-center gap-3 ${
                                        isSelected
                                            ? 'border-slate-800 dark:border-slate-200 bg-slate-50 dark:bg-slate-800/80 shadow-2xs'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-transparent'
                                    }`}
                                >
                                    <div className="w-7 h-7 rounded-[4px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                                        <Icon size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                                            <span>{r.label}</span>
                                            {isSelected && (
                                                <div className="w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shrink-0">
                                                    <Check size={10} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                            {r.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Cargo Condition */}
                <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Cargo Status
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                            type="button"
                            onClick={() => setCargoStatus('safe')}
                            className={`p-2.5 rounded-[4px] border text-left transition-all cursor-pointer ${
                                cargoStatus === 'safe'
                                    ? 'border-slate-800 dark:border-slate-200 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-semibold'
                                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                        >
                            <div>Cargo is Secured</div>
                            <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Safely parked at location</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setCargoStatus('needs_assistance')}
                            className={`p-2.5 rounded-[4px] border text-left transition-all cursor-pointer ${
                                cargoStatus === 'needs_assistance'
                                    ? 'border-slate-800 dark:border-slate-200 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-semibold'
                                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                        >
                            <div>Needs Assistance</div>
                            <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Roadside / towing required</div>
                        </button>
                    </div>
                </div>

                {/* Notes Input */}
                <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Notes / Current Location Details
                    </label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Provide any symptoms, parking location or specific details for dispatch..."
                        className="w-full text-xs p-2.5 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 dark:focus:border-slate-500"
                    />
                </div>

                {/* Coordinates indicator (clean & subtle) */}
                {locationCoords.lat && locationCoords.lng && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                        <MapPin size={11} className="text-slate-400 shrink-0" />
                        <span>GPS Coordinates: {locationCoords.lat.toFixed(4)}, {locationCoords.lng.toFixed(4)}</span>
                    </div>
                )}
            </form>
        </Modal>
    );
};

export default ReportEmergencyModal;
