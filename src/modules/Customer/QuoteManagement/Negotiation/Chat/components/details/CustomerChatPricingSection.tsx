import React from "react";
import { ChevronDown, CreditCard } from "lucide-react";
import { CustomerChatItem } from "../../types";

interface CustomerChatPricingSectionProps {
    activeChat: CustomerChatItem;
    isOpen: boolean;
    onToggle: () => void;
}

export const CustomerChatPricingSection: React.FC<CustomerChatPricingSectionProps> = ({
    activeChat,
    isOpen,
    onToggle,
}) => {
    const extraCharges = (activeChat?.extraCharges && activeChat.extraCharges.length > 0)
        ? activeChat.extraCharges
        : (activeChat?.raw?.extra_charges || activeChat?.raw?.extraCharges || []);
    const totalExtras = extraCharges.reduce((acc: number, c: any) => acc + Number(c.amount || 0), 0);
    const currentPrice = Number(activeChat.currentPrice || 0);
    const baseFreight = activeChat?.baseFreightAmount || (
        activeChat?.raw?.base_amount_raw ??
        (activeChat?.raw?.base_amount ? parseFloat(String(activeChat.raw.base_amount).replace(/[^0-9.]/g, "")) : (currentPrice > totalExtras && totalExtras > 0 ? currentPrice - totalExtras : currentPrice))
    );

    return (
        <div>
            <div
                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors"
                onClick={onToggle}
            >
                <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Pricing Breakdown</span>
                <ChevronDown size={15} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
            {isOpen && (
                <div className="px-4 pb-3">
                    <table className="w-full text-[11.5px] border-collapse">
                        <tbody>
                            <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[130px]">
                                    <div className="flex items-center gap-1.5">
                                        <CreditCard size={12} className="text-slate-400 shrink-0" />
                                        <span>Base Freight</span>
                                    </div>
                                </td>
                                <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                                <td className="py-1.5 pl-1 font-bold text-slate-800 dark:text-slate-200 text-right">
                                    € {Number(baseFreight).toLocaleString()}
                                </td>
                            </tr>

                            {extraCharges.map((charge: any, idx: number) => (
                                <tr key={idx} className="border-b border-slate-100/80 dark:border-slate-800/80">
                                    <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[130px]">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] shrink-0" />
                                            <span className="truncate max-w-[110px]" title={charge.custom_name || charge.customName || charge.label || charge.type}>
                                                {charge.custom_name || charge.customName || charge.label || charge.type || `Extra Charge #${idx + 1}`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                                    <td className="py-1.5 pl-1 font-semibold text-slate-700 dark:text-slate-300 text-right">
                                        +€ {Number(charge.amount || 0).toLocaleString()}
                                    </td>
                                </tr>
                            ))}

                            <tr>
                                <td className="py-2 text-slate-800 dark:text-slate-200 font-bold whitespace-nowrap w-[130px]">
                                    <div className="flex items-center gap-1.5">
                                        <CreditCard size={12} className="text-[#FF4A1F] shrink-0" />
                                        <span>Current Total</span>
                                    </div>
                                </td>
                                <td className="py-2 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                                <td className="py-2 pl-1 text-[13.5px] font-black text-[#FF4A1F] text-right">
                                    € {currentPrice.toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
