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
    <div
    className="p-3 sm:p-4 md:p-5 w-full mx-auto space-y-4 min-h-screen pb-12 font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Supplier Account Settings</h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Manage your carrier business identity, payouts, notifications, and security.
          </p>
        </div>

        {FORM_MAP[activeTab] && (
          <Button
            type="submit"
            form={FORM_MAP[activeTab].formId}
            variant="primary"
            className="h-7.5 text-[11px] px-3.5 bg-[#ff4a1f] hover:bg-[#e63d15] font-semibold text-white shadow-2xs cursor-pointer rounded-[4px] flex items-center gap-1.5 shrink-0 self-start sm:self-center"
          >
            <Save size={13} />
            <span>{FORM_MAP[activeTab].label}</span>
          </Button>
        )}
      </div>

      {/* Navigation Tabs - Sleek & Compact */}
      <div className="flex gap-5 overflow-x-auto border-b border-slate-200 dark:border-slate-800 [&::-webkit-scrollbar]:hidden">
        {SUPPLIER_SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 pb-2.5 border-b-2 font-semibold text-xs whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#ff4a1f] text-[#ff4a1f]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#ff4a1f]' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Renderer */}
      <div className="min-h-[400px]">
        {activeTab === 'profile' && <CompanyProfileTab />}
        {activeTab === 'payouts' && <PayoutStripeTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}
