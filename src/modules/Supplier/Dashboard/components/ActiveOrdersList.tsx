import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

export interface ActiveOrderRow {
    id: string;
    slug?: string | number;
    status: string;
    color: string;
    route?: string;
}

interface ActiveOrdersListProps {
    orders: ActiveOrderRow[];
    isLoading?: boolean;
}

export const ActiveOrdersList: React.FC<ActiveOrdersListProps> = ({ orders, isLoading = false }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-[#1e2329] p-2.5 sm:p-3 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1.5 -mx-2.5 px-2.5">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                    <h3 className="text-xs sm:text-[12.5px] font-bold text-slate-800 dark:text-slate-200">
                        Active Orders
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/supplier/orders/active-jobs')}
                    className="text-[11px] font-bold text-brand hover:underline focus:outline-none transition-colors cursor-pointer"
                >
                    See All
                </button>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-12 gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800 tracking-wider">
                <span className="col-span-3">Order #</span>
                <span className="col-span-6">Route</span>
                <span className="col-span-3 text-right">Status</span>
            </div>

            <div className="flex flex-col text-xs text-slate-500 dark:text-slate-400 justify-start">
                {isLoading ? (
                    <div className="space-y-2 py-1">
                        {[1, 2].map((i) => (
                            <div key={i} className="grid grid-cols-12 gap-1 items-center py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0">
                                <div className="col-span-3 h-3 w-12 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                <div className="col-span-6 h-3 w-28 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                <div className="col-span-3 h-3.5 w-14 ml-auto bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-4 flex flex-col items-center justify-center text-center">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-1">
                            <Package size={14} />
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            No active orders found
                        </p>
                    </div>
                ) : (
                    orders.slice(0, 2).map((order, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(order.slug ? `/supplier/orders/details/${order.slug}` : '/supplier/orders/active-jobs')}
                            className="grid grid-cols-12 gap-1 items-center py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800/80 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 -mx-1 px-1 rounded transition-colors cursor-pointer"
                        >
                            <span className="col-span-3 font-bold text-slate-800 dark:text-slate-200 text-[11px] truncate block">
                                {order.id}
                            </span>
                            <span className="col-span-6 text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate block" title={order.route || 'Direct Route'}>
                                {order.route || 'Direct Route'}
                            </span>
                            <div className="col-span-3 text-right">
                                <span className={`${order.color} px-1.5 py-0.2 rounded text-[9.5px] font-bold inline-block`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
