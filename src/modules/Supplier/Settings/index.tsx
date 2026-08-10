import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, CreditCard, Truck, Bell, Shield } from 'lucide-react';
import CompanyProfileTab from './components/CompanyProfileTab';
import PayoutStripeTab from './components/PayoutStripeTab';
import FleetCapacityTab from './components/FleetCapacityTab';
import NotificationsTab from './components/NotificationsTab';
import SecurityTab from './components/SecurityTab';

const SUPPLIER_SETTINGS_TABS = [
  { id: 'profile', label: 'Company Profile', icon: Building2 },
  { id: 'payouts', label: 'Payouts & Stripe', icon: CreditCard },
  { id: 'fleet', label: 'Fleet & Capacity', icon: Truck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security & 2FA', icon: Shield },
];

export default function SupplierSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');

  const isValidTab = SUPPLIER_SETTINGS_TABS.some(t => t.id === currentTabParam);
  const activeTab = isValidTab ? currentTabParam! : 'profile';

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId }, { replace: true });
  };

  return (
    <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen pb-16 font-sans antialiased">
      {/* Header matching Team Management & Active Jobs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Supplier Account Settings</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your carrier business identity, payouts, fleet capacity, notifications, and security.
          </p>
        </div>
      </div>

      {/* Navigation Tabs matching Team Management styling */}
      <div className="flex gap-6 overflow-x-auto border-b border-slate-200 [&::-webkit-scrollbar]:hidden">
        {SUPPLIER_SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 pb-3 border-b-2 font-medium text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#ff4a1f] text-[#ff4a1f]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#ff4a1f]' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Renderer */}
      <div className="min-h-[500px]">
        {activeTab === 'profile' && <CompanyProfileTab />}
        {activeTab === 'payouts' && <PayoutStripeTab />}
        {activeTab === 'fleet' && <FleetCapacityTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}
