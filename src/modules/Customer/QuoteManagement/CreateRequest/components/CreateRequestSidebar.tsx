import React from 'react';
import { ChevronRight, AlertCircle, FileText, MapPin, Truck, Euro, Paperclip, Send } from 'lucide-react';

export const CREATE_TABS = [
  { id: 'general', label: 'Basic Info', icon: FileText },
  { id: 'locations', label: 'Locations & Route', icon: MapPin },
  { id: 'load', label: 'Vehicle & Cargo Specs', icon: Truck },
  { id: 'preferences', label: 'Budget & Bidding', icon: Euro },
  { id: 'files', label: 'Attachments & Notes', icon: Paperclip },
  { id: 'review', label: 'Review & Post', icon: Send },
];

interface CreateRequestSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasTabError: (tabId: string) => boolean;
  servicesCount: number;
}

export const CreateRequestSidebar: React.FC<CreateRequestSidebarProps> = ({
  activeTab,
  setActiveTab,
  hasTabError,
  servicesCount,
}) => {
  return (
    <div className="w-full lg:w-[260px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider">
          Categories
        </h3>
      </div>
      <div className="flex flex-col">
        {CREATE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          const tabError = hasTabError(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-colors border-l-[3px] border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 cursor-pointer ${
                isSelected
                  ? 'border-l-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20 text-[#ff4a1f] font-semibold'
                  : tabError
                  ? 'border-l-red-500 bg-red-50/30 dark:bg-red-950/10 text-red-600 dark:text-red-400'
                  : 'border-l-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  size={15}
                  className={isSelected ? 'text-[#ff4a1f]' : tabError ? 'text-red-500' : 'text-slate-400'}
                />
                <span>{tab.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {tabError && <AlertCircle size={13} className="text-red-500 shrink-0" />}
                {tab.id === 'load' && servicesCount > 0 && (
                  <span className="bg-orange-100 dark:bg-orange-950/60 text-[#ff4a1f] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {servicesCount}
                  </span>
                )}
                {isSelected && <ChevronRight size={14} className="text-[#ff4a1f]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CreateRequestSidebar;
