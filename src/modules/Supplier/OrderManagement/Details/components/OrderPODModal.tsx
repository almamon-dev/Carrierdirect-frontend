import React from 'react';
import Button from '@/components/ui/button';

interface OrderPODModalProps {
    isOpen: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export const OrderPODModal: React.FC<OrderPODModalProps> = ({
    isOpen,
    onSubmit,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <form onSubmit={onSubmit} className="bg-white dark:bg-[#1e2329] rounded-lg max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Upload Proof of Delivery</h3>
                <p className="text-xs text-slate-500">Upload signed delivery note or receipt (PDF, PNG, JPG max 5MB).</p>
                <input type="file" className="text-xs border border-slate-200 dark:border-slate-700 rounded p-2 w-full" required />
                <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" size="sm" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                        Confirm & Upload
                    </Button>
                </div>
            </form>
        </div>
    );
};
