import React from "react";
import { Copy, Check } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { Column } from "@/components/tables/data-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDisplayDate } from "@/lib/utils";
import { EarningItem } from "../types/earnings.types";

interface GetEarningsColumnsProps {
    navigate: NavigateFunction;
    copiedId: string | null;
    onCopy: (text: string) => void;
}

export function getEarningsColumns({
    navigate,
    copiedId,
    onCopy,
}: GetEarningsColumnsProps): Column<EarningItem>[] {
    return [
        {
            id: "id",
            label: "Job / Order Ref",
            sortable: true,
            className: "w-[125px] min-w-[120px]",
            render: (row) => {
                const ordNumber = row.order_number || row.id;
                const ordId = row.order_id || ordNumber;
                const isCopied = copiedId === ordNumber;
                return (
                    <div className="flex items-center gap-1.5 group min-h-[26px]">
                        {row.order_id ? (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/supplier/orders/details/${ordId}`);
                                }}
                                className="font-bold text-[#ff4a1f] hover:underline cursor-pointer text-left text-xs whitespace-nowrap"
                            >
                                {ordNumber}
                            </button>
                        ) : (
                            <span className="font-bold text-[#ff4a1f] text-xs whitespace-nowrap">{ordNumber}</span>
                        )}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCopy(ordNumber);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            title="Copy Order Ref"
                        >
                            {isCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                    </div>
                );
            }
        },
        {
            id: "customer",
            label: "Customer",
            sortable: true,
            className: "w-[130px] min-w-[125px]",
            render: (row) => {
                const customerName = row.customer_name || row.customer || '-';
                const initial = customerName.charAt(0).toUpperCase();
                return (
                    <div className="flex items-center gap-2 whitespace-nowrap min-w-0 min-h-[26px]">
                        <div className="w-5 h-5 min-w-[20px] min-h-[20px] aspect-square rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0">
                            <span>{initial}</span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[105px]" title={customerName}>
                            {customerName}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "date",
            label: "Date",
            sortable: true,
            className: "w-[105px] min-w-[100px] text-center",
            render: (row) => (
                <div className="flex items-center justify-center min-h-[26px]">
                    <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs font-medium">
                        {formatDisplayDate(row.date)}
                    </span>
                </div>
            )
        },
        {
            id: "gross",
            label: "Gross Rate",
            sortable: true,
            className: "w-[105px] min-w-[100px] text-right",
            render: (row) => (
                <div className="flex items-center justify-end min-h-[26px]">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap text-xs">
                        {row.gross}
                    </span>
                </div>
            )
        },
        {
            id: "fee",
            label: "Fee",
            sortable: true,
            className: "w-[90px] min-w-[85px] text-right",
            render: (row) => (
                <div className="flex items-center justify-end min-h-[26px]">
                    <span className="font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap text-xs">
                        -{row.fee}
                    </span>
                </div>
            )
        },
        {
            id: "net",
            label: "Net Earned",
            sortable: true,
            className: "w-[110px] min-w-[105px] text-right",
            render: (row) => (
                <div className="flex items-center justify-end min-h-[26px]">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap text-xs">
                        {row.net}
                    </span>
                </div>
            )
        },
        {
            id: "status",
            label: "Status",
            sortable: true,
            className: "w-[130px] min-w-[125px] text-center",
            render: (row) => {
                const isCleared = row.status === "Cleared" || row.raw_status === "cleared" || row.raw_status === "completed" || row.raw_status === "paid";
                return (
                    <div className="flex items-center justify-center min-h-[26px]">
                        <StatusBadge
                            status={isCleared ? "Cleared" : "Pending Clearance"}
                            category={isCleared ? "success" : "pending"}
                        />
                    </div>
                );
            }
        }
    ];
}
