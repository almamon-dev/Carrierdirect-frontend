import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    Phone,
    MapPin,
    Eye,
    AlertTriangle,
} from 'lucide-react';
import { ShipmentItem } from '../../../types';

interface AcceptHandoverModalProps {
    isOpen: boolean;
    shipment: ShipmentItem;
    onClose: () => void;
    onAcceptHandover: (data: { otp_code: string; notes?: string }) => Promise<void>;
    onRejectHandover: (reason: string) => Promise<void>;
}

export const AcceptHandoverModal: React.FC<AcceptHandoverModalProps> = ({
    isOpen,
    shipment,
    onClose,
    onAcceptHandover,
    onRejectHandover,
}) => {
    const handover = shipment.handover;
    const partner = shipment.partnerDriver;
    const hubLocation = (shipment.hubLocation && !shipment.hubLocation.toLowerCase().includes('transit hub'))
        ? shipment.hubLocation
        : (handover?.hub_location && !handover.hub_location.toLowerCase().includes('transit hub'))
            ? handover.hub_location
            : 'Intermediate Hub';

    const [otpCode, setOtpCode] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleAccept = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode || otpCode.trim().length < 4) {
            setErrorMessage('Please enter the 6-digit OTP code provided by Driver 1.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            await onAcceptHandover({
                otp_code: otpCode.trim(),
                notes: notes.trim() || undefined,
            });
            onClose();
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || err?.message || 'Verification failed. Please check the OTP code.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectReason.trim()) {
            setErrorMessage('Please specify the reason for rejecting the handover.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            await onRejectHandover(rejectReason.trim());
            onClose();
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to reject handover.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[999999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150 font-sans"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#1e2329] rounded-[6px] border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto font-sans"
            >
                {/* Header (Single Line Clean) */}
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#15191e]/60">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-[3px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-900/60 shrink-0">
                            <ShieldCheck size={14} />
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                            Accept Cargo Handover (Leg 2)
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X size={15} />
                    </button>
                </div>

                <div className="p-4 space-y-3 max-h-[85vh] overflow-y-auto font-sans">
                    {errorMessage && (
                        <div className="p-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-[3px] flex items-center gap-1.5 text-rose-700 dark:text-rose-300 text-[11px]">
                            <AlertCircle size={13} className="shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* 1-Line Key : Value Table */}
                    <div className="bg-slate-50/80 dark:bg-[#161a22] rounded-[4px] border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 text-[11.5px]">
                        <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Order Number :</span>
                            <span className="font-bold font-mono text-slate-900 dark:text-white">#{shipment.orderNumber}</span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Transit Hub :</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                <MapPin size={11} className="text-[#FF4A1F]" />
                                <span>{hubLocation}</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Handed Over By :</span>
                            <span className="font-semibold text-slate-900 dark:text-white truncate ml-2">
                                {handover?.driver_from_name || partner?.driver_name || 'Driver 1'}
                                {partner?.company && (
                                    <span className="text-slate-400 font-normal ml-1">({partner.company})</span>
                                )}
                            </span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Driver Phone :</span>
                            {(handover?.driver_from_phone || partner?.driver_phone) ? (
                                <a
                                    href={`tel:${handover?.driver_from_phone || partner?.driver_phone}`}
                                    className="text-[#FF4A1F] font-semibold hover:underline inline-flex items-center gap-1"
                                >
                                    <Phone size={10} />
                                    <span>{handover?.driver_from_phone || partner?.driver_phone}</span>
                                </a>
                            ) : (
                                <span className="text-slate-400">—</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Vehicle Plate :</span>
                            <span className="font-mono text-slate-800 dark:text-slate-200">
                                {partner?.vehicle_plate || '—'}
                                {partner?.vehicle_type && (
                                    <span className="font-sans text-slate-400 ml-1">({partner.vehicle_type})</span>
                                )}
                            </span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Cargo & Load :</span>
                            <span className="text-slate-800 dark:text-slate-200 font-medium">
                                <span className="font-semibold text-slate-900 dark:text-white">{shipment.cargo?.freightType || 'Standard'}</span> • {shipment.cargo?.pallets || 1} Pallets • {shipment.cargo?.weightKg || 0} kg
                            </span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Reported Condition :</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10.5px]">
                                {handover?.cargo_condition?.replace('_', ' ') || 'Good Condition'}
                            </span>
                        </div>
                        {handover?.cargo_condition_notes && (
                            <div className="flex items-center justify-between px-3 py-1.5">
                                <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Notes :</span>
                                <span className="text-slate-700 dark:text-slate-300 italic truncate ml-2 text-right">
                                    "{handover.cargo_condition_notes}"
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Destination :</span>
                            <span className="text-slate-800 dark:text-slate-200 truncate ml-2 font-medium" title={shipment.consignee?.address || shipment.delivery_address}>
                                {shipment.consignee?.city || shipment.delivery_city || shipment.consignee?.address || shipment.delivery_address}
                            </span>
                        </div>
                    </div>

                    {/* Photos Preview (1-Line row if present) */}
                    {handover?.photos && handover.photos.length > 0 && (
                        <div className="flex items-center justify-between px-3 py-1 bg-slate-50/80 dark:bg-[#161a22] rounded border border-slate-200/80 dark:border-slate-800 text-[11.5px]">
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">
                                Inspection Photos ({handover.photos.length}) :
                            </span>
                            <div className="flex items-center gap-1.5 overflow-x-auto">
                                {handover.photos.map((p, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setPreviewPhoto(p)}
                                        className="relative w-7 h-7 rounded border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer group shrink-0"
                                    >
                                        <img src={p} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                                            <Eye size={10} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* REJECTION FORM */}
                    {isRejecting ? (
                        <form onSubmit={handleReject} className="space-y-2 p-2.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-[4px]">
                            <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 text-xs font-bold">
                                <AlertTriangle size={13} />
                                <span>Reject Handover Reason</span>
                            </div>
                            <input
                                type="text"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Damage, missing seals, or paperwork mismatch..."
                                className="w-full h-8 px-2.5 text-xs bg-white dark:bg-[#161a22] border border-rose-200 dark:border-rose-800 rounded text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-rose-600 font-sans"
                                required
                            />
                            <div className="flex items-center justify-end gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setIsRejecting(false)}
                                    className="h-7 px-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded cursor-pointer"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-7 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold cursor-pointer disabled:opacity-50 shadow-2xs"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* ACCEPTANCE FORM (1-LINE ROWS) */
                        <form onSubmit={handleAccept} className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                            {/* Row: OTP input in 1 line */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[11.5px] font-medium text-slate-600 dark:text-slate-300 shrink-0">
                                    Handover OTP : <span className="text-[#FF4A1F]">*</span>
                                </span>
                                <input
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    className="w-44 h-8 px-2 text-center text-sm font-mono font-bold tracking-widest bg-slate-50 dark:bg-[#161a22] border border-emerald-500/60 focus:border-emerald-600 rounded-[3px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none shadow-2xs"
                                    autoFocus
                                    required
                                />
                            </div>

                            {/* Row: Notes in 1 line */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[11.5px] font-medium text-slate-600 dark:text-slate-300 shrink-0">
                                    Accept Notes :
                                </span>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Cargo received in good order..."
                                    className="flex-1 h-7 px-2.5 text-[11.5px] bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 font-sans"
                                />
                            </div>

                            {/* Actions in 1 line */}
                            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsRejecting(true)}
                                    className="text-rose-600 hover:text-rose-700 text-xs font-semibold hover:underline cursor-pointer"
                                >
                                    Reject Handover...
                                </button>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="h-8 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || otpCode.length < 4}
                                        className="h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <span>Verifying...</span>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={13} />
                                                <span>Verify OTP & Accept</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Photo Lightbox */}
            {previewPhoto && (
                <div
                    className="fixed inset-0 z-[1000000] bg-black/85 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setPreviewPhoto(null)}
                >
                    <img src={previewPhoto} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded" />
                </div>
            )}
        </div>,
        document.body
    );
};
