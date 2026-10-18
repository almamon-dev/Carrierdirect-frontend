import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Input from "@/components/ui/input";
import FormLabel from "@/components/ui/label";
import { CardData, renderCardLogo } from './checkoutCardUtils';

export interface AcceptCheckoutNewCardFormProps {
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
    fieldErrors: Record<string, string>;
    isNameValid: boolean;
    isCardNumValid: boolean;
    isExpValid: boolean;
    isCvcValid: boolean;
    brand: string;
    expectedCvcLength: number;
    saveCard: boolean;
    setSaveCard: (val: boolean) => void;
    cardNameRef: React.RefObject<HTMLInputElement | null>;
    cardNumberRef: React.RefObject<HTMLInputElement | null>;
    expDateRef: React.RefObject<HTMLInputElement | null>;
    cvcRef: React.RefObject<HTMLInputElement | null>;
    markBlurred: (field: string) => void;
    handleCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCvcChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AcceptCheckoutNewCardForm: React.FC<AcceptCheckoutNewCardFormProps> = ({
    cardData,
    setCardData,
    fieldErrors,
    isNameValid,
    isCardNumValid,
    isExpValid,
    isCvcValid,
    brand,
    expectedCvcLength,
    saveCard,
    setSaveCard,
    cardNameRef,
    cardNumberRef,
    expDateRef,
    cvcRef,
    markBlurred,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvcChange,
}) => {
    return (
        <div className="space-y-3.5 pt-1">
            {/* Cardholder Name */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <FormLabel htmlFor="checkout-card-name" required className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                        Cardholder Name
                    </FormLabel>
                    {isNameValid && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 size={12} /> Valid
                        </span>
                    )}
                </div>
                <Input
                    id="checkout-card-name"
                    value={cardData.cardName}
                    placeholder="e.g. John Doe"
                    onChange={(e) => setCardData((prev) => ({ ...prev, cardName: e.target.value }))}
                    onBlur={() => markBlurred("cardName")}
                    ref={cardNameRef}
                    error={fieldErrors.cardName}
                    className={`!h-[42px] text-[13px] rounded-[3px] px-3 font-medium transition-colors ${
                        fieldErrors.cardName
                            ? "border-red-500 focus:border-red-500"
                            : isNameValid
                            ? "border-emerald-500/80 focus:border-emerald-500"
                            : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                    }`}
                />
            </div>

            {/* Card Number */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <FormLabel htmlFor="checkout-card-number" required className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                        Card Number
                    </FormLabel>
                    <div className="flex items-center gap-1.5">
                        {isCardNumValid && (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle2 size={12} /> Valid
                            </span>
                        )}
                        {renderCardLogo(brand)}
                    </div>
                </div>
                <Input
                    id="checkout-card-number"
                    value={cardData.cardNumber}
                    placeholder="4242 •••• •••• 4242"
                    maxLength={19}
                    onChange={handleCardNumberChange}
                    onBlur={() => markBlurred("cardNumber")}
                    ref={cardNumberRef}
                    error={fieldErrors.cardNumber}
                    className={`!h-[42px] text-[13px] rounded-[3px] px-3 font-medium tracking-wide transition-colors ${
                        fieldErrors.cardNumber
                            ? "border-red-500 focus:border-red-500"
                            : isCardNumValid
                            ? "border-emerald-500/80 focus:border-emerald-500"
                            : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                    }`}
                />
            </div>

            {/* Expiry Date & CVC in 2-cols */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <FormLabel htmlFor="checkout-card-exp" required className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                            Expiry Date
                        </FormLabel>
                        {isExpValid && (
                            <CheckCircle2 size={13} className="text-emerald-500" />
                        )}
                    </div>
                    <Input
                        id="checkout-card-exp"
                        value={cardData.expDate}
                        placeholder="MM/YY"
                        maxLength={5}
                        onChange={handleExpiryChange}
                        onBlur={() => markBlurred("expDate")}
                        ref={expDateRef}
                        error={fieldErrors.expDate}
                        className={`!h-[42px] text-[13px] rounded-[3px] px-3 font-medium transition-colors ${
                            fieldErrors.expDate
                                ? "border-red-500 focus:border-red-500"
                                : isExpValid
                                ? "border-emerald-500/80 focus:border-emerald-500"
                                : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                        }`}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <FormLabel htmlFor="checkout-card-cvc" required className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                            Security CVC {brand === "amex" ? "(4 Digits)" : "(3 Digits)"}
                        </FormLabel>
                        {isCvcValid && (
                            <CheckCircle2 size={13} className="text-emerald-500" />
                        )}
                    </div>
                    <Input
                        id="checkout-card-cvc"
                        value={cardData.cvc}
                        placeholder={brand === "amex" ? "1234" : "888"}
                        maxLength={expectedCvcLength}
                        onChange={handleCvcChange}
                        onBlur={() => markBlurred("cvc")}
                        ref={cvcRef}
                        error={fieldErrors.cvc}
                        className={`!h-[42px] text-[13px] rounded-[3px] px-3 font-medium transition-colors ${
                            fieldErrors.cvc
                                ? "border-red-500 focus:border-red-500"
                                : isCvcValid
                                ? "border-emerald-500/80 focus:border-emerald-500"
                                : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                        }`}
                    />
                </div>
            </div>

            {/* Save card checkbox */}
            <div className="flex items-center gap-2 pt-1">
                <input
                    id="checkout-save-card"
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-4 h-4 text-[#ff4a1f] accent-[#ff4a1f] border-slate-300 rounded-[3px] cursor-pointer"
                />
                <label
                    htmlFor="checkout-save-card"
                    className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                >
                    Save this card for future shipments &amp; faster checkout
                </label>
            </div>
        </div>
    );
};
