import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

export interface ActiveOrderRow {
    id: string;
    slug?: string | number;
    status: string;
    color: string;
}

interface ActiveOrdersListProps {
    orders: ActiveOrderRow[];
    isLoading?: boolean;
}

export const ActiveOrdersList: React.FC<ActiveOrdersListProps> = ({ orders, isLoading = false }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 -mx-4 px-4">
                <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                    Active Orders
                </h3>
                <button
                    type="button"
                    onClick={() => navigate('/supplier/orders/active-jobs')}
                    className="text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors cursor-pointer"
                >
                    See All
                </button>
            </div>
            <div className="flex flex-col text-[13px] text-slate-500 dark:text-slate-400 flex-1 justify-center min-h-[140px]">
                {isLoading ? (
                    <div className="space-y-3 py-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0">
                                <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                <div className="h-4 w-14 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-2">
                            <Package size={18} />
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            No active orders found
                        </p>
                    </div>
                ) : (
                    orders.slice(0, 5).map((order, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(order.slug ? `/supplier/orders/details/${order.slug}` : '/supplier/orders/active-jobs')}
                            className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-300 dark:border-slate-800 last:border-0 last:pb-0 first:pt-0 cursor-pointer"
                        >
                            <span className="font-bold text-slate-800 dark:text-slate-200">{order.id}</span>
                            <span className={`${order.color} px-2 py-0.5 rounded text-[11px] font-bold`}>{order.status}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
