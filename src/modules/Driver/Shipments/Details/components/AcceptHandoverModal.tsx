import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ShieldCheck, User, Phone, Check, ArrowRight, Eye, AlertTriangle } from 'lucide-react';
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
    const hubLocation = shipment.hubLocation || handover?.hub_location || 'Transit Hub';

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
            setErrorMessage('Please enter the verification OTP code provided by Driver 1.');
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

    return (
        <div className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#15191e]/60">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-900/60 font-bold">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Accept Cargo Handover – Leg 2
                                </h3>
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                    Ready at Hub
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Shipment #{shipment.orderNumber} • Hub: <strong className="text-slate-700 dark:text-slate-300">{hubLocation}</strong>
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                    {errorMessage && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-[4px] flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Driver 1 Info Card */}
                    <div className="p-3.5 bg-slate-50 dark:bg-[#161a22] border border-slate-200/80 dark:border-slate-800 rounded-[4px] space-y-2">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                            Handing-Over Driver (Leg 1)
                        </span>
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold shrink-0">
                                    <User size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                        {handover?.driver_from_name || partner?.driver_name || 'Driver 1'}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                        <span>{partner?.company || 'Fleet Partner'}</span>
                                        {partner?.vehicle_plate && partner.vehicle_plate !== '—' && (
                                            <>
                                                <span>•</span>
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">{partner.vehicle_plate}</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {(handover?.driver_from_phone || partner?.driver_phone) && (
                                <a
                                    href={`tel:${handover?.driver_from_phone || partner?.driver_phone}`}
                                    className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-2xs"
                                >
                                    <Phone size={12} className="text-[#FF4A1F]" />
                                    <span>{handover?.driver_from_phone || partner?.driver_phone}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Cargo Condition Report from Driver 1 */}
                    <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-[4px] space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                                Cargo Condition Inspection
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 uppercase">
                                {handover?.cargo_condition || 'Good Condition'}
                            </span>
                        </div>
                        {handover?.cargo_condition_notes ? (
                            <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                                "{handover.cargo_condition_notes}"
                            </p>
                        ) : (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                No defects or special condition notes reported by Driver 1.
                            </p>
                        )}

                        {/* Handover Photos Preview */}
                        {handover?.photos && handover.photos.length > 0 && (
                            <div className="pt-2">
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                                    Inspection Photos ({handover.photos.length})
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {handover.photos.map((p, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setPreviewPhoto(p)}
                                            className="relative w-16 h-16 rounded border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer group"
                                        >
                                            <img src={p} alt={`Handover ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                                <Eye size={14} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* REJECTION FORM */}
                    {isRejecting ? (
                        <form onSubmit={handleReject} className="space-y-3 p-3.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-[4px]">
                            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold">
                                <AlertTriangle size={15} />
                                <span>Reject Handover Reason</span>
                            </div>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Explain why you cannot accept this handover (e.g., damaged packaging, missing paperwork, cargo mismatch)..."
                                rows={3}
                                className="w-full p-2.5 text-xs bg-white dark:bg-[#161a22] border border-rose-200 dark:border-rose-800 rounded-[4px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-rose-600 resize-none"
                                required
                            />
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsRejecting(false)}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold cursor-pointer disabled:opacity-50"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* ACCEPTANCE FORM */
                        <form onSubmit={handleAccept} className="space-y-4">
                            {/* OTP Entry */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                                    Enter 6-Digit Handover Code (OTP) <span className="text-[#FF4A1F]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit code from Driver 1"
                                    maxLength={6}
                                    className="w-full h-11 px-4 text-center text-xl font-mono font-bold tracking-widest bg-slate-50 dark:bg-[#161a22] border-2 border-emerald-500/60 focus:border-emerald-600 rounded-[4px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                                    autoFocus
                                    required
                                />
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Ask Driver 1 for their 6-digit handover code generated upon arriving at the hub.
                                </p>
                            </div>

                            {/* Optional Acceptance Notes */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                                    Acceptance Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Confirm cargo received in satisfactory order, vehicle reloaded..."
                                    rows={2}
                                    className="w-full p-2.5 text-xs bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 resize-none"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex items-center justify-between gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setIsRejecting(true)}
                                    className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[4px] text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Reject Handover...
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[4px] text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || otpCode.length < 4}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[4px] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <span>Verifying...</span>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={14} />
                                                <span>Verify OTP & Accept Cargo</span>
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
                    className="fixed inset-0 z-[10010] bg-black/85 flex items-center justify-center p-4"
                    onClick={() => setPreviewPhoto(null)}
                >
                    <img src={previewPhoto} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded" />
                </div>
            )}
        </div>
    );
};

