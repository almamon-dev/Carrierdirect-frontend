import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, CreditCard, Bell, Shield, Save } from 'lucide-react';
import Button from '@/components/ui/button';
import CompanyProfileTab from './components/CompanyProfileTab';
import PayoutStripeTab from './components/PayoutStripeTab';
import NotificationsTab from './components/NotificationsTab';
import SecurityTab from './components/SecurityTab';

const SUPPLIER_SETTINGS_TABS = [
  { id: 'profile', label: 'Company Profile', icon: Building2 },
  { id: 'payouts', label: 'Payouts & Stripe', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security & 2FA', icon: Shield },
];

const FORM_MAP: Record<string, { formId: string; label: string }> = {
  profile: { formId: 'supplier-profile-form', label: 'Save Profile' },
  payouts: { formId: 'supplier-payouts-form', label: 'Save Preferences' },
  notifications: { formId: 'supplier-notifications-form', label: 'Save Alerts' },
  security: { formId: 'supplier-security-form', label: 'Update Password' },
};

export default function SupplierSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');

  const isValidTab = SUPPLIER_SETTINGS_TABS.some(t => t.id === currentTabParam);
  const activeTab = isValidTab ? currentTabParam! : 'profile';

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId }, { replace: true });
  };

  return (
    <div className="p-4 sm:p-5 md:p-6 w-full space-y-4 font-sans antialiased min-h-screen pb-16">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Supplier Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Manage your carrier business identity, payouts, notifications, and security.
          </p>
        </div>

        {FORM_MAP[activeTab] && (
          <Button
            type="submit"
            form={FORM_MAP[activeTab].formId}
            variant="primary"
            className="h-8 text-xs px-3.5 bg-[#ff4a1f] hover:bg-[#e63d15] font-bold text-white shadow-2xs cursor-pointer rounded-[4px] flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-all"
          >
            <Save size={13} />
            <span>{FORM_MAP[activeTab].label}</span>
          </Button>
        )}
      </div>

      {/* Navigation Tabs - Flush Underline */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto overflow-y-hidden hide-scrollbar no-scrollbar">
        {SUPPLIER_SETTINGS_TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer -mb-px ${
                idx === 0 ? 'pl-0.5 pr-3' : 'px-3'
              } ${
                isActive
                  ? 'border-[#ff4a1f] text-[#ff4a1f]'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#ff4a1f]' : 'text-slate-400 dark:text-slate-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-1 w-full max-w-5xl">
        {activeTab === 'profile' && <CompanyProfileTab />}
        {activeTab === 'payouts' && <PayoutStripeTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}
