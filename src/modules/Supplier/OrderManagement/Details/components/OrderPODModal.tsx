import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { X, Loader2, CheckCircle2, AlertCircle, User, ShieldCheck, Camera, MapPin, UploadCloud } from 'lucide-react';
import SignaturePadCanvas from './SignaturePadCanvas';

interface OrderPODModalProps {
    isOpen: boolean;
    orderId?: string;
    customerName?: string;
    onSubmit: (formData: FormData) => Promise<void> | void;
    onClose: () => void;
}

export const OrderPODModal: React.FC<OrderPODModalProps> = ({
    isOpen,
    customerName,
    onSubmit,
    onClose,
}) => {
    const [receiverName, setReceiverName] = useState<string>(customerName || '');
    const [signatureData, setSignatureData] = useState<string>('');
    const [hasDrawn, setHasDrawn] = useState(false);
    const [note, setNote] = useState<string>('');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [captureSource, setCaptureSource] = useState<'camera' | 'file_upload'>('file_upload');
    const [clientCapturedAt, setClientCapturedAt] = useState<string | undefined>(undefined);
    const [coords, setCoords] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
    const [gpsStatus, setGpsStatus] = useState<'acquiring' | 'captured' | 'unavailable'>('acquiring');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        setReceiverName(customerName || '');
        setSignatureData('');
        setHasDrawn(false);
        setProofFile(null);
        setErrorMsg(null);

        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setGpsStatus('unavailable');
            return;
        }
        setGpsStatus('acquiring');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    accuracy: Math.round(pos.coords.accuracy || 0),
                });
                setGpsStatus('captured');
            },
            () => setGpsStatus('unavailable'),
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
        );
    }, [isOpen, customerName]);

    if (!isOpen) return null;

    const handleSignatureChange = (sigData: string, drawn: boolean) => {
        setSignatureData(sigData);
        setHasDrawn(drawn);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasDrawn || !signatureData) {
            setErrorMsg('Please ask the receiver to sign on the screen to complete delivery.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg(null);
        try {
            const formData = new FormData();
            formData.append('status', 'delivered');
            formData.append('receiver_name', receiverName || 'Receiver');
            formData.append('signature', signatureData);
            formData.append('note', note || `Delivery confirmed & signed by ${receiverName || 'Receiver'}.`);
            if (proofFile) {
                formData.append('proof_of_delivery', proofFile, proofFile.name);
                formData.append('capture_source', captureSource);
            } else {
                formData.append('capture_source', 'camera');
            }
            formData.append('client_captured_at', clientCapturedAt || new Date().toISOString());
            if (coords) {
                formData.append('driver_lat', String(coords.latitude));
                formData.append('driver_lng', String(coords.longitude));
                if (typeof coords.accuracy === 'number') {
                    formData.append('gps_accuracy_meters', String(coords.accuracy));
                }
            }

            await onSubmit(formData);
        } catch (err: any) {
            console.error('Error submitting POD signature:', err);
            setErrorMsg(err?.data?.message || err?.response?.data?.message || err?.message || 'Failed to submit signature. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[999999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150 font-sans"
            onClick={onClose}
        >
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#1e2329] rounded-[8px] max-w-md w-full p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 font-sans my-auto max-h-[calc(100vh-2rem)] overflow-y-auto"
            >
                {/* Compact Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 shrink-0">
                            <ShieldCheck size={16} />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                Proof of Delivery & Digital Signature
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Electronic consignee handover confirmation
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1 cursor-pointer disabled:opacity-50"
                    >
                        <X size={15} />
                    </button>
                </div>

                {errorMsg && (
                    <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-1.5">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <div className={`px-2.5 py-1.5 rounded border text-[11px] flex items-center gap-1.5 ${
                    gpsStatus === 'captured'
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                    <MapPin size={12} className={gpsStatus === 'captured' ? 'text-emerald-600' : 'text-slate-400'} />
                    <span>
                        {gpsStatus === 'captured' && coords
                            ? `GPS location verified (±${coords.accuracy ?? 0}m)`
                            : gpsStatus === 'acquiring'
                                ? 'Acquiring delivery GPS coordinates...'
                                : 'GPS unavailable — submission may require compliance review'}
                    </span>
                </div>

                {/* Receiver Name */}
                <div>
                    <Input
                        label="Receiver / Signee Full Name *"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        placeholder="e.g. Mahbubur Rahman (Consignee Supervisor)"
                        icon={<User size={14} className="text-slate-400" />}
                        disabled={isSubmitting}
                        required
                        className="h-9 text-xs"
                    />
                </div>

                {/* Digital Signature Pad */}
                <SignaturePadCanvas
                    onSignatureChange={handleSignatureChange}
                    disabled={isSubmitting}
                />

                {/* Optional Photo / Signed BOL Attachment */}
                <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Signed BOL / Delivery Photo (Optional)
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            className="px-2.5 py-1.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[4px] text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                            <Camera size={12} />
                            <span>Take Camera Photo</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[4px] text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                            <UploadCloud size={12} />
                            <span>Upload Document</span>
                        </button>
                        {proofFile && (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[190px]">
                                Attached: {proofFile.name}
                            </span>
                        )}
                    </div>
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                                setProofFile(f);
                                setCaptureSource('camera');
                                setClientCapturedAt(new Date().toISOString());
                            }
                        }}
                        className="hidden"
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                                setProofFile(f);
                                setCaptureSource('file_upload');
                                setClientCapturedAt(new Date().toISOString());
                            }
                        }}
                        className="hidden"
                    />
                </div>

                {/* Remarks Textarea */}
                <div>
                    <Textarea
                        label="Delivery Remarks / Notes (Optional)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="e.g. 15 pallets received in 100% undamaged seal condition."
                        rows={2}
                        disabled={isSubmitting}
                        className="text-xs"
                    />
                </div>
                
                {/* Modal Actions */}
                <div className="flex gap-2 justify-end pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="rounded-[4px] text-xs h-8 cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        disabled={isSubmitting || !hasDrawn}
                        className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer rounded-[4px] text-xs font-semibold h-8 flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={12} className="animate-spin" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={12} />
                                <span>Confirm Delivery & Sign</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>,
        document.body
    );
};

export default OrderPODModal;
