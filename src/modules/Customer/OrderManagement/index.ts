export { default as Orders } from './Orders';
export { default as OrderDetails } from './Details';
export { DataTable } from './components/DataTable';

export * from './components/DataTable';
export * from './Orders/types/order.types';
export * from './Orders/hooks/useOrders';
export * from './Orders/services/orderService';
export * from './Details/types/orderDetail.types';
export * from './Details/hooks/useOrderDetails';
export * from './Details/services/orderDetailService';

export default {
    Orders: () => import('./Orders'),
    OrderDetails: () => import('./Details'),
};
