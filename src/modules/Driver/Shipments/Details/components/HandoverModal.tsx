import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Camera, ShieldCheck, ArrowRight, User, Phone, Truck, Copy, Check, UploadCloud } from 'lucide-react';
import { ShipmentItem } from '../../../types';

interface HandoverModalProps {
    isOpen: boolean;
    shipment: ShipmentItem;
    onClose: () => void;
    onInitiateHandover: (data: {
        hub_location?: string;
        cargo_condition: string;
        cargo_condition_notes?: string;
        photos?: string[];
        notes?: string;
    }) => Promise<void>;
}

export const HandoverModal: React.FC<HandoverModalProps> = ({
    isOpen,
    shipment,
    onClose,
    onInitiateHandover,
}) => {
    const handover = shipment.handover;
    const isAlreadyInitiated = Boolean(handover && (handover.status === 'pending_acceptance' || handover.status === 'accepted'));

    const [cargoCondition, setCargoCondition] = useState<string>(handover?.cargo_condition || 'good');
    const [notes, setNotes] = useState<string>(handover?.cargo_condition_notes || '');
    const [photos, setPhotos] = useState<string[]>(handover?.photos || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const partner = shipment.partnerDriver;
    const hubLocation = shipment.hubLocation || 'Transit Hub';

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setPhotos((prev) => [...prev, String(event.target?.result)]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCopyOtp = () => {
        if (!handover?.otp_code) return;
        navigator.clipboard.writeText(handover.otp_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            await onInitiateHandover({
                hub_location: hubLocation,
                cargo_condition: cargoCondition,
                cargo_condition_notes: notes,
                photos,
                notes,
            });
            onClose();
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to initiate handover.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
                {/* Modal Header */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#15191e]/60">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200 dark:border-violet-900/60 font-bold">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Relay Handover – Leg 1 ➔ Leg 2
                                </h3>
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                                    Hub Transfer
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Shipment #{shipment.orderNumber} • Location: <strong className="text-slate-700 dark:text-slate-300">{hubLocation}</strong>
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

                    {/* Receiving Driver Information Card */}
                    <div className="p-3.5 bg-slate-50 dark:bg-[#161a22] border border-slate-200/80 dark:border-slate-800 rounded-[4px] space-y-2">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                            Designated Receiving Driver (Leg 2)
                        </span>
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold shrink-0">
                                    <User size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                        {partner?.driver_name || 'Assigned Leg 2 Driver'}
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

                            {partner?.driver_phone && partner.driver_phone !== '—' && (
                                <a
                                    href={`tel:${partner.driver_phone}`}
                                    className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-2xs"
                                >
                                    <Phone size={12} className="text-[#FF4A1F]" />
                                    <span>{partner.driver_phone}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Cargo Summary Row */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-orange-50/40 dark:bg-orange-950/10 border border-orange-200/60 dark:border-orange-900/30 rounded-[4px] text-center">
                        <div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Cargo</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block mt-0.5">
                                {shipment.cargo.freightType || 'Standard'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Pallets / Weight</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block mt-0.5">
                                {shipment.cargo.pallets} Pallets • {shipment.cargo.weightKg} kg
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Destination</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block mt-0.5">
                                {shipment.consignee.city || 'Final Delivery'}
                            </span>
                        </div>
                    </div>

                    {/* IF ALREADY INITIATED: SHOW OTP & AWAITING STATUS */}
                    {isAlreadyInitiated && handover ? (
                        <div className="space-y-4 pt-1">
                            <div className="p-4 bg-violet-50/80 dark:bg-violet-950/30 border-2 border-dashed border-violet-300 dark:border-violet-800 rounded-[4px] text-center space-y-2">
                                <span className="text-[11px] font-bold text-violet-800 dark:text-violet-300 uppercase tracking-widest block">
                                    Handover Verification Code (OTP)
                                </span>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-3xl font-mono font-extrabold tracking-widest text-violet-700 dark:text-violet-300">
                                        {handover.otp_code || '------'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleCopyOtp}
                                        className="p-1.5 rounded-[4px] bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 transition-colors cursor-pointer"
                                        title="Copy OTP"
                                    >
                                        {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                                    Share this 6-digit code with <strong className="text-slate-900 dark:text-white">{partner?.driver_name || 'Driver 2'}</strong>. They must enter this code to complete handover and start Leg 2.
                                </p>
                            </div>

                            {handover.status === 'accepted' ? (
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-[4px] flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                                    <span>Handover has been accepted by Driver 2! Your Leg 1 responsibilities are complete.</span>
                                </div>
                            ) : (
                                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-[4px] flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                                    <span>Awaiting Driver 2 to review cargo and enter verification code at the hub.</span>
                                </div>
                            )}

                            {/* Existing Photos Preview */}
                            {handover.photos && handover.photos.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                                        Uploaded Handover Photos ({handover.photos.length})
                                    </span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {handover.photos.map((p, idx) => (
                                            <img
                                                key={idx}
                                                src={p}
                                                alt={`Handover photo ${idx + 1}`}
                                                className="w-full h-20 object-cover rounded border border-slate-200 dark:border-slate-700"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full h-9 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[4px] text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* INITIATION FORM */
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Cargo Condition */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                                    Cargo Condition at Handover <span className="text-[#FF4A1F]">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { key: 'good', label: 'Good / Clean' },
                                        { key: 'sealed', label: 'Intact / Sealed' },
                                        { key: 'minor_blemish', label: 'Minor Scuff' },
                                        { key: 'damaged', label: 'Flagged / Issue' },
                                    ].map((opt) => (
                                        <button
                                            type="button"
                                            key={opt.key}
                                            onClick={() => setCargoCondition(opt.key)}
                                            className={`p-2 rounded-[4px] border text-xs font-bold transition-all cursor-pointer text-center ${
                                                cargoCondition === opt.key
                                                    ? 'bg-violet-50 dark:bg-violet-950/50 border-violet-600 text-violet-700 dark:text-violet-300 shadow-2xs'
                                                    : 'bg-white dark:bg-[#161a22] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Inspection Notes */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                                    Cargo Condition & Handover Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Confirm pallets condition, temperature readings, seal numbers, or handover notes..."
                                    rows={2}
                                    className="w-full p-2.5 text-xs bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 resize-none"
                                />
                            </div>

                            {/* Photos Upload */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                    <span>Cargo Inspection Photos</span>
                                    <span className="text-[10px] text-slate-400 font-normal">Optional but recommended</span>
                                </label>

                                <div className="flex flex-wrap gap-2 items-center">
                                    {photos.map((photo, idx) => (
                                        <div key={idx} className="relative w-16 h-16 rounded border border-slate-200 dark:border-slate-700 overflow-hidden group">
                                            <img src={photo} alt={`Cargo ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePhoto(idx)}
                                                className="absolute top-0.5 right-0.5 bg-black/70 hover:bg-black text-white p-0.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}

                                    <label className="w-16 h-16 rounded border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-400 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-[#161a22]">
                                        <Camera size={18} className="text-slate-400" />
                                        <span className="text-[9px] font-bold text-slate-500 mt-1">Add Photo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[4px] text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-[4px] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span>Generating Code...</span>
                                    ) : (
                                        <>
                                            <ShieldCheck size={14} />
                                            <span>Generate OTP & Complete Leg 1 Handover</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

