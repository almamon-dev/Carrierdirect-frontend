import React from 'react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { SupplierProfileHeader } from './profile/SupplierProfileHeader';
import { SupplierProfileDetailsTable } from './profile/SupplierProfileDetailsTable';
import { SupplierProfileLogisticsTable } from './profile/SupplierProfileLogisticsTable';

interface SupplierProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplier: any;
    onCallClick?: () => void;
}

export const SupplierProfileModal: React.FC<SupplierProfileModalProps> = ({
    isOpen,
    onClose,
    supplier,
}) => {
    if (!supplier) return null;

    const raw = supplier.raw || {};
    const supplierName = supplier.supplier || supplier.supplierName || raw.supplier_name || 'Verified Carrier';
    const rating = supplier.supplierRating || supplier.rating || 4.9;
    const completedOrders = supplier.completedOrders || 58;
    const vehicleType = supplier.vehicleType || raw.vehicle_type || 'Curtain Sider (18T)';
    const route = (supplier.pickup && supplier.delivery) ? `${supplier.pickup} → ${supplier.delivery}` : (supplier.routeText || 'Munich Logistics Terminal → Stuttgart Freight Hub');
    const supplierId = supplier.quoteNo || supplier.supplierId || supplier.id || '0021';
    const formattedId = typeof supplierId === 'string' && supplierId.startsWith('#')
        ? supplierId
        : `#CD-SUP-${String(supplierId).replace(/\D/g, '').padStart(4, '0') || '0021'}`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Carrier Profile & Verification"
            size="2xl"
            className="w-full max-w-2xl lg:max-w-3xl"
        >
            <div className="space-y-4 max-h-[82vh] overflow-y-auto px-1 pr-2 custom-scrollbar">
                <SupplierProfileHeader
                    supplier={supplier}
                    supplierName={supplierName}
                    formattedId={formattedId}
                    rating={rating}
                    completedOrders={completedOrders}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-5 pt-2 pb-2">
                    <SupplierProfileDetailsTable
                        supplierName={supplierName}
                        formattedId={formattedId}
                        rating={rating}
                    />

                    <SupplierProfileLogisticsTable
                        route={route}
                        vehicleType={vehicleType}
                        palletType={raw.pallet_type}
                    />
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

export default SupplierProfileModal;
