export * from '../types/order.types';
export { mapApiOrderToSupplierOrder } from '../utils/orderMapper';
import { SupplierOrder } from '../types/order.types';
import { mapApiOrderToSupplierOrder } from '../utils/orderMapper';

export const mockSupplierOrders: SupplierOrder[] = [];

export const getSupplierOrderBySlug = (slug?: string): SupplierOrder => {
    return mapApiOrderToSupplierOrder({ id: slug || '1', slug: slug || '1' });
};
