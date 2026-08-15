import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, Bell, Loader2 } from "lucide-react";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";

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
    id: "quote_received",
    title: "New Quote Received",
    description: "Get notified as soon as a carrier submits a bid on your shipping request.",
    email: false,
    sms: false,
    push: false,
  },
  {
    id: "driver_dispatched",
    title: "Driver En-Route & GPS Live Tracking",
    description: "Real-time updates when driver starts journey and approaches pickup.",
    email: false,
    sms: false,
    push: false,
  },
  {
    id: "pod_released",
    title: "Proof of Delivery (POD) Released",
    description: "Notification when digital proof of delivery is signed and uploaded.",
    email: false,
    sms: false,
    push: false,
  },
  {
    id: "invoice_issued",
    title: "Invoices & Escrow Releases",
    description: "Alerts regarding billing, receipts, and Pay Later invoice deadlines.",
    email: false,
    sms: false,
    push: false,
  },
];

export default function NotificationsTab() {
  const showToast = useToastStore((state) => state.showToast);
  const [settings, setSettings] = useState<NotificationSetting[]>(defaultNotifs);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/customer/notification-settings");
      if (res.data?.data?.settings && Array.isArray(res.data.data.settings)) {
        setSettings(res.data.data.settings);
      } else if (Array.isArray(res.data?.settings)) {
        setSettings(res.data.settings);
      } else {
        setSettings(defaultNotifs);
      }
    } catch {
      setSettings(defaultNotifs);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetting = (id: string, channel: "email" | "sms" | "push") => {
    const updated = settings.map((item) => {
      if (item.id === id) {
        return { ...item, [channel]: !item[channel] };
      }
      return item;
    });
    setSettings(updated);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await apiClient.post("/customer/notification-settings", { settings });
      showToast("Notification preferences updated successfully!", "success");
    } catch (err: any) {
      const errMsg = err.data?.message || err.message || "Failed to update notification preferences.";
      showToast(errMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-md border border-slate-200 shadow-sm space-y-4 font-sans">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Notification Preferences</h3>
          <p className="text-xs text-slate-500">Control which channels notify you about shipping updates and billing.</p>
        </div>
        {isLoading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
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
                onClick={() => toggleSetting(item.id, "email")}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${item.email ? "bg-[#ff4a1f]" : "bg-slate-200"
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${item.email ? "translate-x-4" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            {/* SMS Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between sm:justify-center">
              <span className="sm:hidden text-xs text-slate-500 font-medium flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> SMS
              </span>
              <button
                type="button"
                onClick={() => toggleSetting(item.id, "sms")}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${item.sms ? "bg-[#ff4a1f]" : "bg-slate-200"
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${item.sms ? "translate-x-4" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            {/* Push Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between sm:justify-center">
              <span className="sm:hidden text-xs text-slate-500 font-medium flex items-center gap-1">
                <Bell className="w-3 h-3" /> Push
              </span>
              <button
                type="button"
                onClick={() => toggleSetting(item.id, "push")}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${item.push ? "bg-[#ff4a1f]" : "bg-slate-200"
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${item.push ? "translate-x-4" : "translate-x-0"
                    }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="h-9 px-5 rounded-md bg-[#ff4a1f] hover:bg-[#e63d15] disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
        >
          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isSaving ? "Saving..." : "Save Notification Settings"}
        </button>
      </div>
    </div>
  );
}
