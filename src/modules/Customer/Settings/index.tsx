import { Bell, ChevronRight, CreditCard, LucideIcon, MapPin, Shield, User } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import AddressBookTab from './components/AddressBookTab';
import NotificationsTab from './components/NotificationsTab';
import PaymentTab from './components/PaymentTab';
import ProfileTab from './components/ProfileTab';
import SecurityTab from './components/SecurityTab';

type TabType = 'profile' | 'addresses' | 'notifications' | 'security' | 'payment';

const SETTINGS_TABS: { id: TabType; label: string; icon: LucideIcon }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'addresses', label: 'Address Book', icon: MapPin },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security & 2FA', icon: Shield },
  { id: 'payment', label: 'Payment & Credit', icon: CreditCard },
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
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full mx-auto font-sans">
      {/* Left Sidebar and Right Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar (Matching Quote Create Management Categories card with border & rounded-[4px]) */}
        <div className="w-full lg:w-[240px] xl:w-[250px] shrink-0 space-y-3">

          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] overflow-hidden shadow-2xs">
            <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider">
                Settings
              </h3>
            </div>

            <div className="flex flex-col">
              {SETTINGS_TABS.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors border-l-[3px] border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 cursor-pointer ${isSelected
                      ? 'border-l-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20 text-[#ff4a1f] font-semibold'
                      : 'border-l-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={15}
                        className={isSelected ? 'text-[#ff4a1f]' : 'text-slate-400'}
                      />
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight
                      size={13}
                      className={isSelected ? 'text-[#ff4a1f]' : 'text-slate-300 dark:text-slate-600'}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 w-full min-w-0">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'addresses' && <AddressBookTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'payment' && <PaymentTab />}
        </div>
      </div>
    </div>
  );
}
