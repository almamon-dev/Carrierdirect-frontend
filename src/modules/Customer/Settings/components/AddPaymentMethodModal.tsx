import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock } from 'lucide-react';
import Drawer from '@/components/modals/drawer';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Checkbox from '@/components/ui/checkbox';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSuccess?: (newCard: any) => void;
}

export const AddPaymentMethodModal: React.FC<ModalProps> = ({ isOpen, onClose, onAddSuccess }) => {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [isPrimary, setIsPrimary] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            const last4 = cardNumber.slice(-4) || '9999';
            if (onAddSuccess) {
                onAddSuccess({
                    id: Date.now(),
                    type: cardNumber.startsWith('5') ? 'MC' : 'VISA',
                    last4: last4,
                    expiry: expiry || '12/28',
                    isPrimary: isPrimary
                });
            }
            onClose();
        }, 600);
    };

    const drawerTitle = (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#ff4a1f]/10 text-[#ff4a1f] flex items-center justify-center shrink-0">
                <CreditCard size={18} />
            </div>
            <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Add Payment Method</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Add a new credit or debit card for instant bookings.</p>
            </div>
        </div>
    );

    const drawerFooter = (
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                <ShieldCheck size={15} className="text-emerald-600" />
                <span>256-bit Encrypted</span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="h-8 px-3 text-xs font-semibold cursor-pointer"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="h-8 px-4 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                    {isSubmitting ? 'Saving Card...' : 'Save Card'}
                </Button>
            </div>
        </div>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={drawerTitle}
            footer={drawerFooter}
            position="right"
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Instructions & Guidelines - Transparent Minimalist Design */}
                <div className="border-b border-slate-100 pb-3.5 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <ShieldCheck size={16} className="text-[#ff4a1f]" />
                        <span>Payment Terms & Guidelines</span>
                    </div>
                    <ul className="text-slate-600 font-medium space-y-2 text-xs leading-normal">
                        <li className="flex items-start gap-2">
                            <span className="text-[#ff4a1f] font-bold text-sm leading-none">•</span>
                            <span><strong>No Upfront Fees:</strong> Posting quote requests is 100% free. Your card will only be charged when you accept a carrier quote.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#ff4a1f] font-bold text-sm leading-none">•</span>
                            <span><strong>Escrow Protection:</strong> Payments are securely held in escrow and released to the carrier only after Proof of Delivery (POD) is uploaded.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#ff4a1f] font-bold text-sm leading-none">•</span>
                            <span><strong>Supported Cards:</strong> We accept Visa, Mastercard, and American Express with 3D Secure 2.0 verification.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#ff4a1f] font-bold text-sm leading-none">•</span>
                            <span><strong>Automatic Invoicing:</strong> Official VAT tax receipts are instantly generated in EUR (€) upon transaction.</span>
                        </li>
                    </ul>
                </div>

                <Input
                    label="Cardholder Name *"
                    placeholder="e.g. John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                />

                <Input
                    label="Card Number *"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                    icon={<CreditCard size={16} />}
                    required
                />

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Expires (MM/YY) *"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        maxLength={5}
                        required
                    />
                    <Input
                        label="Security Code (CVC) *"
                        placeholder="123"
                        type="password"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        maxLength={4}
                        icon={<Lock size={14} />}
                        required
                    />
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                    <Checkbox
                        checked={isPrimary}
                        onChange={(e) => setIsPrimary(e.target.checked)}
                    />
                    <span className="text-[13px] font-semibold text-slate-700">Set as primary payment method</span>
                </label>

                {/* Security Note - Transparent Minimalist */}
                <div className="pt-2.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
                    <Lock size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <p className="leading-normal font-medium">
                        Your payment details are protected with <strong>256-bit SSL encryption</strong> and are <strong>PCI-DSS Level 1 compliant</strong>.
                    </p>
                </div>
            </form>
        </Drawer>
    );
};
