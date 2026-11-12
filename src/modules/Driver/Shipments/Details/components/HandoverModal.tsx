import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    CheckCircle2,
    AlertCircle,
    Camera,
    ShieldCheck,
    Phone,
    Copy,
    Check,
    MapPin,
    Loader2,
} from 'lucide-react';
import { ShipmentItem } from '../../../types';
import { driverShipmentService } from '../../../services/driverShipmentService';

interface HandoverModalProps {
    isOpen: boolean;
    shipment: ShipmentItem;
    onClose: () => void;
    onCancelHandover?: () => Promise<void> | void;
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
    onCancelHandover,
}) => {
    const handover = shipment.handover;
    const isAlreadyInitiated = Boolean(handover && (handover.status === 'pending_acceptance' || handover.status === 'accepted'));

    const [cargoCondition, setCargoCondition] = useState<string>(handover?.cargo_condition || 'good');
    const [notes, setNotes] = useState<string>(handover?.cargo_condition_notes || '');
    const [photos, setPhotos] = useState<string[]>(handover?.photos || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleCancelHandover = async () => {
        setIsCancelling(true);
        try {
            if (onCancelHandover) {
                await onCancelHandover();
            } else {
                await driverShipmentService.cancelHandover(shipment.id);
                window.location.reload();
            }
            onClose();
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to cancel handover');
        } finally {
            setIsCancelling(false);
        }
    };

    if (!isOpen) return null;

    const partner = shipment.partnerDriver;
    const hubLocation = (shipment.hubLocation && !shipment.hubLocation.toLowerCase().includes('transit hub'))
        ? shipment.hubLocation
        : (shipment.handover?.hub_location && !shipment.handover.hub_location.toLowerCase().includes('transit hub'))
            ? shipment.handover.hub_location
            : 'Intermediate Hub';

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
                        <div className="w-6 h-6 rounded-[3px] bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200 dark:border-violet-900/60 shrink-0">
                            <ShieldCheck size={14} />
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                            Relay Cargo Handover (Leg 1 ➔ Leg 2)
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
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Receiving Driver :</span>
                            <span className="font-semibold text-slate-900 dark:text-white truncate ml-2">
                                {partner?.driver_name || 'Assigned Driver 2'}
                                {partner?.company && (
                                    <span className="text-slate-400 font-normal ml-1">({partner.company})</span>
                                )}
                            </span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Driver Phone :</span>
                            {partner?.driver_phone && partner.driver_phone !== '—' ? (
                                <a
                                    href={`tel:${partner.driver_phone}`}
                                    className="text-[#FF4A1F] font-semibold hover:underline inline-flex items-center gap-1"
                                >
                                    <Phone size={10} />
                                    <span>{partner.driver_phone}</span>
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
                            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Destination :</span>
                            <span className="text-slate-800 dark:text-slate-200 truncate ml-2 font-medium" title={shipment.consignee?.address || shipment.delivery_address}>
                                {shipment.consignee?.city || shipment.delivery_city || shipment.consignee?.address || shipment.delivery_address}
                            </span>
                        </div>
                    </div>

                    {/* IF ALREADY INITIATED: 1-LINE STATUS & OTP */}
                    {isAlreadyInitiated && handover ? (
                        <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between p-2.5 bg-violet-50/80 dark:bg-violet-950/20 rounded-[4px] border border-violet-200 dark:border-violet-800/60">
                                <span className="text-xs font-bold text-violet-900 dark:text-violet-300">
                                    Handover OTP Code :
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-mono font-black tracking-widest text-violet-700 dark:text-violet-300">
                                        {handover.otp_code || '------'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleCopyOtp}
                                        className="h-6 px-2 rounded bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 text-[11px] font-semibold hover:bg-violet-50 cursor-pointer shadow-2xs inline-flex items-center gap-1"
                                        title="Copy OTP"
                                    >
                                        {copied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                                        <span>{copied ? 'Copied' : 'Copy'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-50/80 dark:bg-[#161a22] rounded-[4px] border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 text-[11.5px]">
                                <div className="flex items-center justify-between px-3 py-1.5">
                                    <span className="text-slate-500 font-medium">Status :</span>
                                    {handover.status === 'accepted' ? (
                                        <span className="font-bold text-emerald-600 text-xs flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Accepted by Driver 2
                                        </span>
                                    ) : (
                                        <span className="font-bold text-amber-600 text-xs flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Awaiting Driver 2 Verification
                                        </span>
                                    )}
                                </div>
                                {handover.cargo_condition && (
                                    <div className="flex items-center justify-between px-3 py-1.5">
                                        <span className="text-slate-500 font-medium">Reported Condition :</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase text-[11px]">
                                            {handover.cargo_condition.replace('_', ' ')}
                                        </span>
                                    </div>
                                )}
                                {handover.cargo_condition_notes && (
                                    <div className="flex items-center justify-between px-3 py-1.5">
                                        <span className="text-slate-500 font-medium shrink-0">Notes :</span>
                                        <span className="text-slate-700 dark:text-slate-300 italic truncate ml-2 text-right">
                                            "{handover.cargo_condition_notes}"
                                        </span>
                                    </div>
                                )}
                                {handover.photos && handover.photos.length > 0 && (
                                    <div className="flex items-center justify-between px-3 py-1.5">
                                        <span className="text-slate-500 font-medium shrink-0">Photos :</span>
                                        <div className="flex items-center gap-1 overflow-x-auto">
                                            {handover.photos.map((p, idx) => (
                                                <img
                                                    key={idx}
                                                    src={p}
                                                    alt={`Photo ${idx + 1}`}
                                                    className="w-7 h-7 object-cover rounded border border-slate-200 dark:border-slate-700 shrink-0"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                {handover.status !== 'accepted' && (
                                    <button
                                        type="button"
                                        onClick={handleCancelHandover}
                                        disabled={isCancelling}
                                        className="flex-1 h-8 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 rounded text-xs font-bold transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                                    >
                                        {isCancelling ? <Loader2 size={12} className="animate-spin" /> : null}
                                        <span>Cancel Handover & Return to Transit</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={`${handover.status === 'accepted' ? 'w-full' : 'px-4'} h-8 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs font-bold transition-colors cursor-pointer`}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* INITIATION FORM (1-LINE ROWS) */
                        <form onSubmit={handleSubmit} className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                            {/* Row: Cargo Condition in 1 line */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[11.5px] font-medium text-slate-600 dark:text-slate-300 shrink-0">
                                    Cargo Condition : <span className="text-[#FF4A1F]">*</span>
                                </span>
                                <div className="flex items-center gap-1">
                                    {[
                                        { key: 'good', label: 'Good' },
                                        { key: 'sealed', label: 'Sealed' },
                                        { key: 'minor_blemish', label: 'Scuff' },
                                        { key: 'damaged', label: 'Flagged' },
                                    ].map((opt) => (
                                        <button
                                            type="button"
                                            key={opt.key}
                                            onClick={() => setCargoCondition(opt.key)}
                                            className={`h-7 px-2.5 rounded-[3px] border text-[11px] font-bold transition-all cursor-pointer ${cargoCondition === opt.key
                                                ? 'bg-violet-600 text-white border-violet-600 shadow-2xs'
                                                : 'bg-white dark:bg-[#161a22] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Row: Notes in 1 line */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[11.5px] font-medium text-slate-600 dark:text-slate-300 shrink-0">
                                    Handover Notes :
                                </span>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Pallet integrity, seal number, readings..."
                                    className="flex-1 h-7 px-2.5 text-[11.5px] bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 font-sans"
                                />
                            </div>

                            {/* Row: Photos in 1 line */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[11.5px] font-medium text-slate-600 dark:text-slate-300 shrink-0">
                                    Cargo Photos :
                                </span>
                                <div className="flex items-center gap-1.5 overflow-x-auto">
                                    {photos.map((photo, idx) => (
                                        <div key={idx} className="relative w-7 h-7 rounded border border-slate-200 dark:border-slate-700 overflow-hidden group shrink-0">
                                            <img src={photo} alt={`Cargo ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePhoto(idx)}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer"
                                            >
                                                <X size={9} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="h-7 px-2 rounded border border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 flex items-center gap-1 text-[10.5px] text-slate-600 dark:text-slate-300 cursor-pointer bg-slate-50 dark:bg-slate-800 transition-colors shrink-0">
                                        <Camera size={11} className="text-slate-400" />
                                        <span>Add Photo</span>
                                        <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            {/* Actions in 1 line */}
                            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="h-8 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-8 px-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span>Generating...</span>
                                    ) : (
                                        <>
                                            <ShieldCheck size={13} />
                                            <span>Generate OTP & Hand Over</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
