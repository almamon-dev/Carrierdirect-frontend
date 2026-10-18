import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRightLeft } from 'lucide-react';
import Input from '@/components/ui/input';
import { CounterOfferModalProps } from './counterOfferModalConstants';
import { useCounterOfferForm } from './useCounterOfferForm';
import { CounterOfferExtraChargesSection } from './CounterOfferExtraChargesSection';

export { getServiceIcon, DEFAULT_FALLBACK_CHARGES } from './counterOfferModalConstants';
export type { ExtraChargeItem, CounterOfferModalProps } from './counterOfferModalConstants';

export function CounterOfferModal({
    isOpen,
    onClose,
    onSubmit,
    initialAmount,
    initialBaseFreight,
    originalOfferAmount,
    carrierName,
    currency = '€',
    isSupplier = false,
    extraCharges: propExtraCharges = [],
}: CounterOfferModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const {
        origTotalNum,
        proposedPrice,
        setProposedPrice,
        notes,
        setNotes,
        supplierExtras,
        showAddCustom,
        setShowAddCustom,
        customChargeName,
        setCustomChargeName,
        customChargeAmount,
        setCustomChargeAmount,
        finalAmountNum,
        activeTypesForSelect,
        selectOptions,
        getChargeMeta,
        handleSelectDropdownService,
        handleUpdateExtraAmount,
        handleRemoveExtra,
        handleAddCustomCharge,
        handleSubmit,
    } = useCounterOfferForm({
        isOpen,
        initialAmount,
        initialBaseFreight,
        originalOfferAmount,
        currency,
        isSupplier,
        propExtraCharges,
        onSubmit,
        onClose,
    });

    if (!isOpen) return null;

    const displayCarrier = carrierName || 'Partner Carrier';

    return createPortal(
        <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-[410px] z-[999999] font-sans antialiased animate-in slide-in-from-top-5 fade-in duration-200">
            <div className="relative w-full bg-white dark:bg-[#12161c] rounded-md border border-slate-200/90 dark:border-slate-700/80 shadow-xl p-3 sm:p-3.5 text-left space-y-2.5">
                {/* Header */}
                <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 min-w-[32px] min-h-[32px] aspect-square rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5 bg-slate-50 dark:bg-slate-800">
                        <ArrowRightLeft size={14} strokeWidth={2.2} className="text-[#ff4a1f] shrink-0" />
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                        <p className="text-[11.5px] sm:text-[12px] text-slate-700 dark:text-slate-300 leading-snug font-normal">
                            {isSupplier ? (
                                <>
                                    Propose a revised offer to <strong className="font-bold text-slate-900 dark:text-white">{displayCarrier}</strong> (Current: <strong className="font-semibold text-slate-900 dark:text-white">{currency} {origTotalNum.toLocaleString()}</strong>).
                                </>
                            ) : (
                                <>
                                    Submit a counter offer to <strong className="font-bold text-slate-900 dark:text-white">{displayCarrier}</strong> for quote <strong className="font-semibold text-slate-900 dark:text-white">{currency} {origTotalNum.toLocaleString()}</strong>.
                                </>
                            )}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-0.5 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={14} strokeWidth={2} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div>
                        <Input
                            label={isSupplier ? `Base Freight Rate (${currency}) *` : `Proposed Counter Rate (${currency}) *`}
                            type="number"
                            min="1"
                            step="any"
                            required
                            value={proposedPrice}
                            onChange={e => setProposedPrice(e.target.value)}
                            placeholder="0.00"
                            icon={<span className="text-slate-400 font-bold text-xs">{currency}</span>}
                            className="!h-[32px] text-xs font-bold"
                            autoFocus
                        />
                    </div>

                    {isSupplier && (
                        <CounterOfferExtraChargesSection
                            activeTypesForSelect={activeTypesForSelect}
                            selectOptions={selectOptions}
                            handleSelectDropdownService={handleSelectDropdownService}
                            showAddCustom={showAddCustom}
                            setShowAddCustom={setShowAddCustom}
                            customChargeName={customChargeName}
                            setCustomChargeName={setCustomChargeName}
                            customChargeAmount={customChargeAmount}
                            setCustomChargeAmount={setCustomChargeAmount}
                            handleAddCustomCharge={handleAddCustomCharge}
                            supplierExtras={supplierExtras}
                            getChargeMeta={getChargeMeta}
                            handleUpdateExtraAmount={handleUpdateExtraAmount}
                            handleRemoveExtra={handleRemoveExtra}
                        />
                    )}

                    <div>
                        <Input
                            placeholder="Add a reason or condition (optional)..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="!h-[32px] text-xs"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 w-full">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full h-[26px] px-2 rounded-[4px] border border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
                        >
                            <span>Cancel</span>
                        </button>

                        <button
                            type="submit"
                            disabled={finalAmountNum <= 0}
                            className="w-full h-[26px] px-2 rounded-[4px] border border-[#ff4a1f] bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{isSupplier ? 'Submit Offer' : 'Send Counter'}</span>
                            {finalAmountNum > 0 && (
                                <span>({currency} {finalAmountNum.toLocaleString()})</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default CounterOfferModal;
