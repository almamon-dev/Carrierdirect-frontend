import React from "react";
import Select from "@/components/ui/select";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface PaymentFilterContentProps {
    stageFilter: string;
    setStageFilter: (val: string) => void;
    methodFilter: string;
    setMethodFilter: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    endDate: string;
    setEndDate: (val: string) => void;
    onResetFilters: () => void;
}

export const PaymentFilterContent: React.FC<PaymentFilterContentProps> = ({
    stageFilter,
    setStageFilter,
    methodFilter,
    setMethodFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onResetFilters,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 font-sans">
            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Payment Stage
                </label>
                <Select
                    size="sm"
                    value={stageFilter}
                    onChange={(val) => {
                        const v = typeof val === "object" && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                        setStageFilter(v);
                    }}
                    showSearch={false}
                    placeholder="All Stages"
                    options={[
                        { id: "all", name: "All Stages" },
                        { id: "cleared", name: "Cleared & Ready" },
                        { id: "escrow", name: "Held in Escrow" },
                        { id: "pay_later", name: "Pay Later (30 Days)" },
                        { id: "pending", name: "Pending Settlement" },
                    ]}
                />
            </div>

            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Payment Terms / Method
                </label>
                <Select
                    size="sm"
                    value={methodFilter}
                    onChange={(val) => {
                        const v = typeof val === "object" && val?.target ? val.target.value : (val?.id ?? val?.value ?? val);
                        setMethodFilter(v);
                    }}
                    showSearch={false}
                    placeholder="All Methods"
                    options={[
                        { id: "all", name: "All Methods & Terms" },
                        { id: "card", name: "Credit Card (Stripe)" },
                        { id: "pay_later", name: "Pay Later (30 Days)" },
                        { id: "bank_transfer", name: "Bank Transfer" },
                    ]}
                />
            </div>

            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    From Date
                </label>
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-[30px] text-xs py-1"
                />
            </div>

            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    To Date
                </label>
                <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-[30px] text-xs py-1"
                />
            </div>

            <div className="flex items-end">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onResetFilters}
                    className="h-[30px] w-full px-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Reset All Filters"
                >
                    <RotateCcw size={12} />
                    <span>Reset Filters</span>
                </Button>
            </div>
        </div>
    );
};

export default PaymentFilterContent;
