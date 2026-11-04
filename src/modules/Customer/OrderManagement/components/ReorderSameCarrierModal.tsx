import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    X, Truck, Calendar, Euro, Clock, ArrowRight, ShieldCheck, 
    Sparkles, CheckCircle2, Send, AlertCircle, FileText, ChevronRight
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';

interface ReorderSameCarrierModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    onSuccess?: (result: any) => void;
}

export const ReorderSameCarrierModal: React.FC<ReorderSameCarrierModalProps> = ({
    isOpen,
    onClose,
    order,
    onSuccess,
}) => {
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);

    // Initial state calculation
    const tomorrowStr = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    };

    const carrierName = order?.supplier?.company_name || order?.supplier?.name || order?.supplier_name || 'Carrier Partner';
    const carrierEmail = order?.supplier?.email || order?.supplier_email || '';
    const originCity = order?.pickup_city || (typeof order?.pickup_address === 'string' ? order.pickup_address.split(',')[0] : '') || order?.route?.split('→')[0]?.trim() || 'Origin';
    const destCity = order?.delivery_city || (typeof order?.delivery_address === 'string' ? order.delivery_address.split(',')[0] : '') || order?.route?.split('→')[1]?.trim() || 'Destination';
    const originalRate = Number(order?.total_amount || order?.amount || order?.pricing?.total || 0);

    const [pickupDate, setPickupDate] = useState<string>(tomorrowStr());
    const [deliveryDate, setDeliveryDate] = useState<string>('');
    const [pickupTimeFrom, setPickupTimeFrom] = useState<string>('09:00');
    const [pickupTimeTill, setPickupTimeTill] = useState<string>('18:00');
    const [agreedAmount, setAgreedAmount] = useState<string>(originalRate > 0 ? String(originalRate) : '500');
    const [mode, setMode] = useState<'direct_booking' | 'direct_rfq'>('direct_booking');
    const [notes, setNotes] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (order) {
            setPickupDate(tomorrowStr());
            const rate = Number(order?.total_amount || order?.amount || order?.pricing?.total || 0);
            if (rate > 0) setAgreedAmount(String(rate));
            setNotes(`Identical repeat shipment of #${order.order_number || order.id}. Same cargo specifications.`);
        }
    }, [order]);

    if (!isOpen || !order) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pickupDate) {
            showToast('Please specify a pickup date.', 'error');
            return;
        }

        const cleanAmount = parseFloat(agreedAmount.replace(/[^0-9.]/g, ''));
        if (isNaN(cleanAmount) || cleanAmount <= 0) {
            showToast('Please enter a valid shipment rate / budget.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const rawId = order.rawId || order.id;
            const payload = {
                pickup_date: pickupDate,
                delivery_date: deliveryDate || null,
                pickup_time_from: pickupTimeFrom,
                pickup_time_till: pickupTimeTill,
                amount: cleanAmount,
                mode: mode,
                customer_notes: notes,
            };

            const res = await apiClient.post(`/customer/orders/${rawId}/reorder-direct`, payload);
            const data = res.data?.data || res.data;

            if (mode === 'direct_booking') {
                showToast(`Repeat order #${data.order_number || ''} placed directly with ${carrierName}!`, 'success');
                window.dispatchEvent(new CustomEvent('carrierdirect_order_created', { detail: data }));
                onClose();
                if (onSuccess) onSuccess(data);
                if (data.order_id || data.order?.id) {
                    navigate(`/customer/orders/${data.order_id || data.order?.id}`);
                }
            } else {
                showToast(`Direct quote request sent directly to ${carrierName}!`, 'success');
                window.dispatchEvent(new CustomEvent('carrierdirect_quote_updated'));
                onClose();
                if (onSuccess) onSuccess(data);
                navigate('/customer/quotes');
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to submit repeat order request';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenFullForm = () => {
        onClose();
        navigate('/customer/quotes/create/new', {
            state: {
                repeatData: {
                    ...order,
                    target_supplier_id: order?.supplier_id || order?.supplier?.id,
                    target_supplier_name: carrierName,
                }
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl bg-white dark:bg-[#1e2329] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
                
                {/* Header Banner */}
                <div className="relative bg-gradient-to-r from-orange-600 via-[#ff4a1f] to-amber-600 text-white p-4 sm:p-5 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-sm shrink-0">
                            <Truck size={22} className="text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                                    Re-order with Same Carrier
                                </h3>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white tracking-wide uppercase">
                                    <Sparkles size={10} /> Fast Track
                                </span>
                            </div>
                            <p className="text-xs text-white/90 font-medium mt-0.5">
                                Dedicated repeat shipment with <strong className="text-white font-semibold underline underline-offset-2">{carrierName}</strong>
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
                    
                    {/* Previous Order Quick Snapshot */}
                    <div className="bg-slate-50 dark:bg-[#252b33] rounded-lg p-3 border border-slate-200 dark:border-slate-700/80 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60 mb-2">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Original Order:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                #{order.order_number || order.id}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-1.5 truncate">
                                <span className="text-slate-400 font-medium">Route:</span>
                                <span className="font-semibold truncate">{originCity} → {destCity}</span>
                            </div>
                            <div className="flex items-center gap-1.5 justify-end">
                                <span className="text-slate-400 font-medium">Agreed Rate:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    €{originalRate.toFixed(2)}
                                </span>
                            </div>
                            {order.vehicle_type && (
                                <div className="flex items-center gap-1.5 truncate col-span-2 text-[11px] text-slate-500 dark:text-slate-400">
                                    <span>Vehicle: <strong className="text-slate-700 dark:text-slate-300 font-medium">{order.vehicle_type}</strong></span>
                                    <span>•</span>
                                    <span>Carrier: <strong className="text-slate-700 dark:text-slate-300 font-medium">{carrierName}</strong></span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mode Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                            Select Re-order Workflow
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div 
                                onClick={() => setMode('direct_booking')}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                    mode === 'direct_booking'
                                        ? 'border-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Sparkles size={14} className={mode === 'direct_booking' ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">Instant Booking</span>
                                    </div>
                                    <input 
                                        type="radio" 
                                        name="reorderMode" 
                                        checked={mode === 'direct_booking'} 
                                        onChange={() => setMode('direct_booking')} 
                                        className="accent-[#ff4a1f]"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                                    Instantly creates confirmed order at the agreed rate. Carrier dispatches driver immediately.
                                </p>
                            </div>

                            <div 
                                onClick={() => setMode('direct_rfq')}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                    mode === 'direct_rfq'
                                        ? 'border-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Send size={14} className={mode === 'direct_rfq' ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">Direct Quote Request</span>
                                    </div>
                                    <input 
                                        type="radio" 
                                        name="reorderMode" 
                                        checked={mode === 'direct_rfq'} 
                                        onChange={() => setMode('direct_rfq')} 
                                        className="accent-[#ff4a1f]"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                                    Sends private RFQ only to {carrierName} to confirm truck availability & final quote first.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Date and Time Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Pickup Date <span className="text-red-500">*</span>
                            </label>
                            <Input 
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                className="h-8.5 text-xs font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Delivery Date (Optional)
                            </label>
                            <Input 
                                type="date"
                                min={pickupDate || new Date().toISOString().split('T')[0]}
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                className="h-8.5 text-xs font-medium"
                            />
                        </div>
                    </div>

                    {/* Pickup Time Window */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Pickup Ready From
                            </label>
                            <Input 
                                type="time"
                                value={pickupTimeFrom}
                                onChange={(e) => setPickupTimeFrom(e.target.value)}
                                className="h-8.5 text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Pickup Latest Till
                            </label>
                            <Input 
                                type="time"
                                value={pickupTimeTill}
                                onChange={(e) => setPickupTimeTill(e.target.value)}
                                className="h-8.5 text-xs"
                            />
                        </div>
                    </div>

                    {/* Rate / Agreed Price */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            {mode === 'direct_booking' ? 'Agreed Shipment Rate (€)' : 'Target Budget (€)'}
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">€</span>
                            <Input 
                                type="number"
                                step="0.01"
                                min="1"
                                value={agreedAmount}
                                onChange={(e) => setAgreedAmount(e.target.value)}
                                placeholder="0.00"
                                className="h-8.5 pl-7 text-xs font-bold text-slate-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Notes / Instructions for {carrierName}
                        </label>
                        <Textarea 
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any specific instructions for driver, loading ramp, contact..."
                            className="text-xs resize-none"
                        />
                    </div>

                    {/* Driver App Notice */}
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-[11.5px] text-emerald-800 dark:text-emerald-300">
                        <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold leading-tight">Driver App Tracking & POD Guaranteed</p>
                            <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400/90 mt-0.5">
                                Once confirmed, {carrierName} will dispatch their assigned driver. You will receive live GPS telemetry and digital POD in your dashboard.
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={handleOpenFullForm}
                            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium flex items-center gap-1 cursor-pointer"
                        >
                            <span>Open in Full Form</span>
                            <ChevronRight size={13} />
                        </button>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="h-8 text-xs font-medium cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                disabled={isSubmitting}
                                className="h-8 px-4 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <span>Processing...</span>
                                ) : mode === 'direct_booking' ? (
                                    <>
                                        <Sparkles size={13} />
                                        <span>Confirm & Book with {carrierName}</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={13} />
                                        <span>Send Direct RFQ</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReorderSameCarrierModal;

