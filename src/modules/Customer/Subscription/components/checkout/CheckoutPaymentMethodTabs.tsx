import React from "react";
import { CreditCard } from "lucide-react";

interface CheckoutPaymentMethodTabsProps {
  paymentTab: "saved_card" | "new_card";
  onSelectPaymentTab: (tab: "saved_card" | "new_card") => void;
}

export const CheckoutPaymentMethodTabs: React.FC<CheckoutPaymentMethodTabsProps> = ({
  paymentTab,
  onSelectPaymentTab,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
        Payment method
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          onClick={() => onSelectPaymentTab("saved_card")}
          className={`p-3.5 rounded-[3px] border-2 cursor-pointer transition-all flex items-start gap-3 ${
            paymentTab === "saved_card"
              ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-2xs"
              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
          }`}
        >
          <div className="mt-0.5">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                paymentTab === "saved_card"
                  ? "border-blue-600 bg-blue-600"
                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
              }`}
            >
              {paymentTab === "saved_card" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <CreditCard size={15} className={paymentTab === "saved_card" ? "text-blue-600" : "text-slate-500"} />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Saved card</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Use one of your saved cards</p>
          </div>
        </div>

        <div
          onClick={() => onSelectPaymentTab("new_card")}
          className={`p-3.5 rounded-[3px] border-2 cursor-pointer transition-all flex items-start gap-3 ${
            paymentTab === "new_card"
              ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-2xs"
              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
          }`}
        >
          <div className="mt-0.5">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                paymentTab === "new_card"
                  ? "border-blue-600 bg-blue-600"
                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
              }`}
            >
              {paymentTab === "new_card" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <CreditCard size={15} className={paymentTab === "new_card" ? "text-blue-600" : "text-slate-500"} />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Add new card</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Enter a new card to pay</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentMethodTabs;
