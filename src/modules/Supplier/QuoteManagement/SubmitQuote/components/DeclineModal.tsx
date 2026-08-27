/**
 * Decline Quote Request Modal Component
 * Displays confirmation dialog with selectable reasons for declining a freight RFQ.
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { XCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import FormLabel from '@/components/ui/label';
import Select from '@/components/ui/select';

interface DeclineModalProps {
    isOpen: boolean;
    requestId: string;
    onClose: () => void;
    onConfirmDecline: (reason: string) => void;
}

export const DeclineModal: React.FC<DeclineModalProps> = ({
    isOpen,
    requestId,
    onClose,
    onConfirmDecline,
}) => {
    const [declineReason, setDeclineReason] = useState<string>('');

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4 z-[99999]">
            <div className="bg-white dark:bg-[#1e2329] rounded-lg max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2 text-red-600 font-bold">
                    <XCircle size={20} />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Decline Quote Request</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    Are you sure you want to decline request <strong className="text-slate-800 dark:text-slate-200">{requestId}</strong>?
                </p>
                <div>
                    <FormLabel className="text-xs">Reason for Declining</FormLabel>
                    <Select value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} showSearch={false} className="text-xs">
                        <option value="">Select reason...</option>
                        <option value="capacity">No vehicle capacity available</option>
                        <option value="route">Route outside our coverage area</option>
                        <option value="equipment">Specialized equipment unavailable</option>
                        <option value="budget">Target budget is too low</option>
                    </Select>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer" 
                        onClick={() => { 
                            onConfirmDecline(declineReason); 
                        }}
                    >
                        Confirm Decline
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
