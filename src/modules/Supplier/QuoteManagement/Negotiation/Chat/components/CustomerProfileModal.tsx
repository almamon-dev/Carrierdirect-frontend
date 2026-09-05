import React from 'react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { CustomerProfileHeader } from './profile/CustomerProfileHeader';
import { CustomerProfileAccountTable } from './profile/CustomerProfileAccountTable';
import { CustomerProfileFreightTable } from './profile/CustomerProfileFreightTable';

interface CustomerProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: any;
    onCallClick?: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
    isOpen,
    onClose,
    customer,
}) => {
    if (!customer) return null;

    const customerName = customer.customer || customer.customerName || 'Customer Co 1';
    const customerId = customer.quoteId || customer.customerId || customer.id || '0005';
    const formattedId = typeof customerId === 'string' && customerId.startsWith('#')
        ? customerId
        : `#CD-CUS-${String(customerId).replace(/\D/g, '').padStart(4, '0') || '0005'}`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Customer Profile & Verification"
            size="2xl"
            className="w-full max-w-2xl lg:max-w-3xl"
        >
            <div className="space-y-4 max-h-[82vh] overflow-y-auto px-1 pr-2 custom-scrollbar">
                <CustomerProfileHeader
                    customer={customer}
                    customerName={customerName}
                    formattedId={formattedId}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-5 pt-2 pb-2">
                    <CustomerProfileAccountTable
                        customerName={customerName}
                        formattedId={formattedId}
                        customerRating={customer.customerRating}
                    />

                    <CustomerProfileFreightTable customer={customer} />
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="outline" onClick={onClose} className="px-5 py-2 text-xs font-semibold rounded-[3px] cursor-pointer">
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CustomerProfileModal;
