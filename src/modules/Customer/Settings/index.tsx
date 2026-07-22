import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, MapPin, Bell, Shield, CreditCard } from 'lucide-react';
import ProfileTab from './components/ProfileTab';
import AddressBookTab from './components/AddressBookTab';
import NotificationsTab from './components/NotificationsTab';
import SecurityTab from './components/SecurityTab';
import PaymentTab from './components/PaymentTab';

type TabType = 'profile' | 'addresses' | 'notifications' | 'security' | 'payment';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-3.5 h-3.5" /> },
  { id: 'addresses', label: 'Address Book', icon: <MapPin className="w-3.5 h-3.5" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-3.5 h-3.5" /> },
  { id: 'security', label: 'Security & 2FA', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'payment', label: 'Payment & Credit', icon: <CreditCard className="w-3.5 h-3.5" /> },
];

export default function CustomerSettings() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get active tab from URL query param '?tab=...' or sessionStorage or default to 'profile'
  const paramTab = searchParams.get('tab') as TabType | null;
  const sessionTab = sessionStorage.getItem('customer_settings_active_tab') as TabType | null;

  const validTabs: TabType[] = ['profile', 'addresses', 'notifications', 'security', 'payment'];
  const activeTab: TabType = (paramTab && validTabs.includes(paramTab))
    ? paramTab
    : (sessionTab && validTabs.includes(sessionTab))
    ? sessionTab
    : 'profile';

  const handleTabChange = (tabId: TabType) => {
    setSearchParams({ tab: tabId }, { replace: true });
    sessionStorage.setItem('customer_settings_active_tab', tabId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-5">
      
      {/* Module Header */}
      <div className="border-b border-slate-200/80 pb-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage profile, address book, notification preferences and security.
        </p>
      </div>

      {/* Flush Left Aligned Underline Tab Bar */}
      <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto custom-scrollbar">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1 px-2 py-1.5 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer -mb-px ${
                idx === 0 ? 'pl-0 pr-3' : 'px-3'
              } ${
                isActive
                  ? 'border-[#ff4a1f] text-[#ff4a1f]'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <span className={isActive ? 'text-[#ff4a1f]' : 'text-slate-400'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Container */}
      <div className="pt-1 w-full">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'addresses' && <AddressBookTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'payment' && <PaymentTab />}
      </div>

    </div>
  );
}
