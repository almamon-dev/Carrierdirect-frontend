/**
 * Quotation Offer Form Panel Component
 * Right-hand proposal form allowing carriers to specify freight base rates,
 * extra surcharges, validity terms, remarks, and submit their bid.
 */

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import FormLabel from '@/components/ui/label';
import Select from '@/components/ui/select';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { ExtraChargesSection, ExtraChargeItem } from './ExtraChargesSection';

interface QuotationOfferFormProps {
    slug?: string;
    requestDetails: QuoteRequest;
    onSubmittedSuccess: (total: string) => void;
}

export const QuotationOfferForm: React.FC<QuotationOfferFormProps> = ({
    slug,
    requestDetails,
    onSubmittedSuccess,
}) => {
    const [price, setPrice] = useState<string>('');
    const [extraCharges, setExtraCharges] = useState<ExtraChargeItem[]>([]);
    const [notes, setNotes] = useState<string>('');
    const [validity, setValidity] = useState<string>('48h');
    const [paymentTerm, setPaymentTerm] = useState<string>('net15');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Calculate base and total offer price
    const calculateBasePrice = () => parseFloat(price) || 0;
    const calculateExtras = () => extraCharges.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    const calculateTotal = () => (calculateBasePrice() + calculateExtras()).toFixed(2);

    const applyBudgetPreset = () => {
        if (!requestDetails.budget || requestDetails.budget === 'Open') {
            setPrice('450');
        } else {
            const numericBudget = requestDetails.budget.replace(/[^0-9.]/g, '');
            if (numericBudget) setPrice(numericBudget);
        }
    };

    const addPresetNote = (noteText: string) => {
        if (notes.includes(noteText)) return;
        setNotes(prev => prev ? `${prev}\n• ${noteText}` : `• ${noteText}`);
    };

    const handleSubmit = async () => {
        const cleanId = slug ? slug.replace('REQ-', '') : '1';
        setIsSubmitting(true);
        try {
            await apiClient.post(ENDPOINTS.SUPPLIER.SUBMIT_QUOTE(cleanId), {
                amount: parseFloat(calculateTotal()),
                base_amount: parseFloat(price) || 0,
                estimated_time: validity === '24h' ? '1 day' : '2-3 days',
                notes: notes || 'Standard offer',
                extra_charges: extraCharges
                    .filter(c => c.type && parseFloat(c.amount) > 0)
                    .map(c => ({
                        type: c.type,
                        custom_name: c.type === 'Custom' ? c.customName : c.type,
                        amount: parseFloat(c.amount) || 0
                    }))
            });
        } catch (err: any) {
            console.error('Failed to submit quote via API', err);
        } finally {
            setIsSubmitting(false);
            onSubmittedSuccess(calculateTotal());
        }
    };

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs p-5 space-y-4 sticky top-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Your Quotation Offer</h3>
                <span className="text-xs text-slate-500 font-medium">{requestDetails.id}</span>
            </div>

            {/* Target Budget Helper */}
            <div className="p-2.5 bg-slate-50 dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded text-xs flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                    Budget: <strong className="text-slate-900 dark:text-slate-200">{requestDetails.budget}</strong>
                </span>
                <button 
                    type="button" 
                    onClick={applyBudgetPreset} 
                    className="text-xs font-semibold text-[#ff4a1f] hover:underline cursor-pointer"
                >
                    Use Budget
                </button>
            </div>

            {/* Base Freight Price */}
            <div>
                <FormLabel required className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Freight Price (€)
                </FormLabel>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                        €
                    </div>
                    <Input 
                        id="offer-price-input"
                        type="number" 
                        placeholder="0.00" 
                        className="pl-7 font-bold text-sm h-9 border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f] focus:ring-[#ff4a1f]"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-1.5 mt-2">
                    {['350', '450', '550', '750'].map(val => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => setPrice(val)}
                            className="flex-1 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-700 transition-colors text-center cursor-pointer"
                        >
                            €{val}
                        </button>
                    ))}
                </div>
            </div>

            {/* Extra Charges Section Component */}
            <ExtraChargesSection 
                extraCharges={extraCharges} 
                onChange={setExtraCharges} 
            />

            {/* Price Summary Breakdown */}
            <div className="p-3 bg-slate-50 dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between items-center">
                    <span>Base Rate:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">€{parseFloat(price || '0').toFixed(2)}</span>
                </div>
                {extraCharges.map((ch, i) => ch.type && (
                    <div key={i} className="flex justify-between items-center">
                        <span>{ch.type === 'Custom' ? (ch.customName || 'Custom Charge') : ch.type}:</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">€{parseFloat(ch.amount || '0').toFixed(2)}</span>
                    </div>
                ))}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center font-bold text-sm">
                    <span className="text-slate-900 dark:text-slate-100">Total Offer:</span>
                    <span className="text-slate-900 dark:text-slate-100 font-extrabold">€{calculateTotal()}</span>
                </div>
            </div>

            {/* Validity & Payment Terms */}
            <div className="grid grid-cols-2 gap-2.5">
                <div>
                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quote Validity</FormLabel>
                    <Select value={validity} onChange={(e) => setValidity(e.target.value)} showSearch={false} className="text-xs h-8">
                        <option value="24h">24 Hours</option>
                        <option value="48h">48 Hours</option>
                        <option value="3d">3 Days</option>
                        <option value="7d">7 Days</option>
                    </Select>
                </div>
                <div>
                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Payment Terms</FormLabel>
                    <Select value={paymentTerm} onChange={(e) => setPaymentTerm(e.target.value)} showSearch={false} className="text-xs h-8">
                        <option value="immediate">Immediate</option>
                        <option value="net15">Net 15 Days</option>
                        <option value="net30">Net 30 Days</option>
                        <option value="advance">50% Advance</option>
                    </Select>
                </div>
            </div>

            {/* Remarks with quick chips */}
            <div>
                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Remarks</FormLabel>
                <Textarea 
                    placeholder="Add any special conditions or notes..."
                    className="h-16 text-xs resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                    <button type="button" onClick={() => addPresetNote('Includes loading & unloading')} className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium cursor-pointer">
                        + Loading included
                    </button>
                    <button type="button" onClick={() => addPresetNote('Driver GPS live tracking provided')} className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium cursor-pointer">
                        + GPS Tracking
                    </button>
                </div>
            </div>

            {/* Submit Offer Button */}
            <div className="pt-2">
                <Button 
                    variant="primary" 
                    className="w-full h-10 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-2xs cursor-pointer"
                    icon={<Send size={14} />}
                    onClick={handleSubmit}
                    disabled={!price || parseFloat(price) <= 0 || isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : `Submit Offer (€${calculateTotal()})`}
                </Button>
            </div>
        </div>
    );
};
