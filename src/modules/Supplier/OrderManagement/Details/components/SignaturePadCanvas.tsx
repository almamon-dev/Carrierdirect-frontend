import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Eraser } from 'lucide-react';

interface SignaturePadCanvasProps {
    onSignatureChange: (signatureData: string, hasDrawn: boolean) => void;
    disabled?: boolean;
}

export const SignaturePadCanvas: React.FC<SignaturePadCanvasProps> = ({
    onSignatureChange,
    disabled = false,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    useEffect(() => {
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
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (disabled) return;
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
        if (!isDrawing || disabled) return;
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
            onSignatureChange(canvas.toDataURL('image/png'), true);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
        onSignatureChange('', false);
    };

    return (
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
                        disabled={disabled}
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
    );
};

export default SignaturePadCanvas;
