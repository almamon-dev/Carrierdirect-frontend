import React, { useState } from 'react';
import { Building2, CreditCard, Truck, Bell, Shield, Settings as SettingsIcon } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen pb-16 font-sans antialiased">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Supplier Account Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your carrier business identity, payouts, fleet capacity, notifications, and security.
          </p>
        </div>
      </div>

      {/* Sleek Minimal Underline Tab Bar (Tight Underline, Even 24px Gap, Natural Font) */}
      <div className="border-b border-slate-200 flex items-center gap-6 overflow-x-auto custom-scrollbar">
        {SUPPLIER_SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2.5 px-0.5 border-b-2 text-[13px] font-medium transition-colors whitespace-nowrap cursor-pointer -mb-px ${
                isSelected
                  ? 'border-[#ff4a1f] text-[#ff4a1f] font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#ff4a1f]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Renderer */}
      <div className="pt-2">
        {activeTab === 'profile' && <CompanyProfileTab />}
        {activeTab === 'payouts' && <PayoutStripeTab />}
        {activeTab === 'fleet' && <FleetCapacityTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>

    </div>
  );
}
