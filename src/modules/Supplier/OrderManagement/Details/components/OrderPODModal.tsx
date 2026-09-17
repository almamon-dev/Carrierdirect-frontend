import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { X, Loader2, CheckCircle2, AlertCircle, PenTool, Eraser, User, ShieldCheck } from 'lucide-react';

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
    const [note, setNote] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Canvas state for digital signature
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setReceiverName(customerName || '');
        setSignatureData('');
        setHasDrawn(false);
        setErrorMsg(null);
    }, [isOpen, customerName]);

    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2.2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }, 100);
        return () => clearTimeout(timer);
    }, [isOpen]);

    if (!isOpen) return null;

    // Drawing handlers
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
        setHasDrawn(true);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas && hasDrawn) {
            setSignatureData(canvas.toDataURL('image/png'));
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
        setSignatureData('');
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
            
            await onSubmit(formData);
        } catch (err: any) {
            console.error('Error submitting POD signature:', err);
            setErrorMsg(err?.response?.data?.message || 'Failed to submit signature. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150 font-sans">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1e2329] rounded-[8px] max-w-md w-full p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 font-sans">
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

                {/* Receiver Name Input Component */}
                <div>
                    <Input
                        label="Receiver / Signee Full Name *"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        placeholder="e.g. John Doe (Consignee Supervisor)"
                        icon={<User size={14} className="text-slate-400" />}
                        disabled={isSubmitting}
                        required
                        className="h-9 text-xs"
                    />
                </div>

                {/* Digital Signature Pad */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <PenTool size={12} className="text-[#ff4a1f]" />
                            <span>Receiver E-Signature on Screen *</span>
                        </label>
                        {hasDrawn && (
                            <button
                                type="button"
                                onClick={clearCanvas}
                                className="text-[10.5px] text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                            >
                                <Eraser size={11} />
                                <span>Clear Signature</span>
                            </button>
                        )}
                    </div>

                    <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-[6px] bg-slate-50/70 dark:bg-slate-900/50 relative overflow-hidden">
                        <canvas
                            ref={canvasRef}
                            width={420}
                            height={110}
                            className="w-full h-26 touch-none cursor-crosshair block bg-transparent"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        {!hasDrawn && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[11px] text-slate-400 select-none">
                                ✍️ Sign here using finger or mouse
                            </div>
                        )}
                    </div>
                </div>

                {/* Remarks Textarea Component */}
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
