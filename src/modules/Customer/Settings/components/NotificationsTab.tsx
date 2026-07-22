import React, { useState } from 'react';
import { Mail, MessageSquare, Bell, Check } from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
}

const defaultNotifs: NotificationSetting[] = [
  {
    id: 'quote_received',
    title: 'New Quote Received',
    description: 'Get notified as soon as a carrier submits a bid on your shipping request.',
    email: true,
    sms: true,
    push: true
  },
  {
    id: 'driver_dispatched',
    title: 'Driver En-Route & GPS Live Tracking',
    description: 'Real-time updates when driver starts journey and approaches pickup.',
    email: true,
    sms: true,
    push: true
  },
  {
    id: 'pod_released',
    title: 'Proof of Delivery (POD) Released',
    description: 'Notification when digital proof of delivery is signed and uploaded.',
    email: true,
    sms: false,
    push: true
  },
  {
    id: 'invoice_issued',
    title: 'Invoices & Escrow Releases',
    description: 'Alerts regarding billing, receipts, and Pay Later invoice deadlines.',
    email: true,
    sms: false,
    push: true
  }
];

export default function NotificationsTab() {
  const [settings, setSettings] = useState<NotificationSetting[]>(() => {
    try {
      const saved = localStorage.getItem('customer_notif_settings');
      return saved ? JSON.parse(saved) : defaultNotifs;
    } catch {
      return defaultNotifs;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleSetting = (id: string, channel: 'email' | 'sms' | 'push') => {
    const updated = settings.map(item => {
      if (item.id === id) {
        return { ...item, [channel]: !item[channel] };
      }
      return item;
    });
    setSettings(updated);
  };

  const handleSave = () => {
    localStorage.setItem('customer_notif_settings', JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Notification Preferences</h3>
          <p className="text-xs text-slate-500">Control which channels notify you about shipping updates and billing.</p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-sm border border-green-200">
            <Check className="w-3.5 h-3.5" /> Saved!
          </span>
        )}
      </div>

      {/* Notification Table Header */}
      <div className="hidden sm:grid grid-cols-12 text-xs font-bold text-slate-500 px-2 pb-1">
        <div className="col-span-6">Event Type</div>
        <div className="col-span-2 text-center">Email</div>
        <div className="col-span-2 text-center">SMS</div>
        <div className="col-span-2 text-center">Push App</div>
      </div>

      <div className="divide-y divide-slate-100">
        {settings.map((item) => (
          <div key={item.id} className="py-3 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center px-2">
            <div className="sm:col-span-6">
              <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{item.description}</p>
            </div>

            {/* Email Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between sm:justify-center">
              <span className="sm:hidden text-xs text-slate-500 font-medium flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </span>
              <button
                type="button"
                onClick={() => toggleSetting(item.id, 'email')}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  item.email ? 'bg-[#ff4a1f]' : 'bg-slate-200'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  item.email ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* SMS Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between sm:justify-center">
              <span className="sm:hidden text-xs text-slate-500 font-medium flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> SMS
              </span>
              <button
                type="button"
                onClick={() => toggleSetting(item.id, 'sms')}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  item.sms ? 'bg-[#ff4a1f]' : 'bg-slate-200'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  item.sms ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Push Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between sm:justify-center">
              <span className="sm:hidden text-xs text-slate-500 font-medium flex items-center gap-1">
                <Bell className="w-3 h-3" /> Push
              </span>
              <button
                type="button"
                onClick={() => toggleSetting(item.id, 'push')}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  item.push ? 'bg-[#ff4a1f]' : 'bg-slate-200'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  item.push ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <button
          onClick={handleSave}
          className="h-9 px-5 rounded-sm bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          Save Notification Settings
        </button>
      </div>

    </div>
  );
}
