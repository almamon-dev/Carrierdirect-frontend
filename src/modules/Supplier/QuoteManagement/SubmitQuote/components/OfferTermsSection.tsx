import React from 'react';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import Input from '@/components/ui/input';

interface OfferTermsSectionProps {
    validity: string;
    setValidity: (val: string) => void;
    customValidity: string;
    setCustomValidity: (val: string) => void;
    paymentTerm: string;
    setPaymentTerm: (val: string) => void;
    customPaymentTerm: string;
    setCustomPaymentTerm: (val: string) => void;
    isExpired: boolean;
}

export const OfferTermsSection: React.FC<OfferTermsSectionProps> = ({
    validity,
    setValidity,
    customValidity,
    setCustomValidity,
    paymentTerm,
    setPaymentTerm,
    customPaymentTerm,
    setCustomPaymentTerm,
    isExpired,
}) => {
    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                    <FormLabel className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Validity
                    </FormLabel>
                    <Select
                        disabled={isExpired}
                        value={validity}
                        onChange={(e) => setValidity(e.target.value)}
                        showSearch={false}
                        className="w-full h-8 text-xs rounded-[3px] border-slate-300 dark:border-slate-700 bg-white dark:bg-[#181d24]"
                        options={[
                            { value: '24h', label: '24 Hours' },
                            { value: '48h', label: '48 Hours' },
                            { value: '3d', label: '3 Days' },
                            { value: '7d', label: '7 Days' },
                            { value: 'custom', label: 'Custom...' },
                        ]}
                    />
                </div>

                <div className="space-y-1">
                    <FormLabel className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Payment Term
                    </FormLabel>
                    <Select
                        disabled={isExpired}
                        value={paymentTerm}
                        onChange={(e) => setPaymentTerm(e.target.value)}
                        showSearch={false}
                        className="w-full h-8 text-xs rounded-[3px] border-slate-300 dark:border-slate-700 bg-white dark:bg-[#181d24]"
                        options={[
                            { value: 'immediate', label: 'On POD / Complete' },
                            { value: 'net7', label: 'Net 7 Days' },
                            { value: 'net15', label: 'Net 15 Days' },
                            { value: 'net30', label: 'Net 30 Days' },
                            { value: 'custom', label: 'Custom...' },
                        ]}
                    />
                </div>
            </div>

            {validity === 'custom' && !isExpired && (
                <div className="space-y-1 pt-1">
                    <FormLabel className="text-xs text-slate-600 dark:text-slate-400">Custom Validity Period</FormLabel>
                    <Input
                        type="text"
                        placeholder="e.g. Valid until Friday 5 PM"
                        className="text-xs !h-8 border-slate-300 dark:border-slate-700 rounded-[3px]"
                        value={customValidity}
                        onChange={(e) => setCustomValidity(e.target.value)}
                    />
                </div>
            )}

            {paymentTerm === 'custom' && !isExpired && (
                <div className="space-y-1 pt-1">
                    <FormLabel className="text-xs text-slate-600 dark:text-slate-400">Custom Payment Terms</FormLabel>
                    <Input
                        type="text"
                        placeholder="e.g. 50% advance, 50% on delivery"
                        className="text-xs !h-8 border-slate-300 dark:border-slate-700 rounded-[3px]"
                        value={customPaymentTerm}
                        onChange={(e) => setCustomPaymentTerm(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};
