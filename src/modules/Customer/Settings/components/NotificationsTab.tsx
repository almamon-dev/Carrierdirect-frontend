import React, { useState, useEffect } from "react";
import { Mail, Bell, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import Button from "@/components/ui/button";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";
import {
  isWebPushSupported,
  getPushPermissionState,
  subscribeToWebPush,
  unsubscribeFromWebPush,
  getExistingSubscription,
} from "@/lib/webpush";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
}

const defaultNotifs: NotificationSetting[] = [
  {
    id: "quote_received",
    title: "New Quote Received",
    description: "Get notified as soon as a carrier submits a bid on your shipping request.",
    email: true,
    push: true,
  },
  {
    id: "driver_dispatched",
    title: "Driver En-Route & Assignment",
    description: "Real-time updates when a carrier assigns a driver and vehicle to your cargo.",
    email: true,
    push: true,
  },
  {
    id: "pod_released",
    title: "Proof of Delivery (POD) Released",
    description: "Alert when digital proof of delivery is signed and uploaded by the driver.",
    email: true,
    push: true,
  },
  {
    id: "invoice_issued",
    title: "Billing & Escrow Releases",
    description: "Alerts regarding invoice receipts, pay later balances, and release confirmations.",
    email: true,
    push: false,
  },
];

export default function NotificationsTab() {
  const showToast = useToastStore((state) => state.showToast);
  const [settings, setSettings] = useState<NotificationSetting[]>(defaultNotifs);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isSubscribingPush, setIsSubscribingPush] = useState(false);

  useEffect(() => {
    setIsPushSupported(isWebPushSupported());
    setPushPermission(getPushPermissionState());
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/customer/notification-settings");
      const remoteSettings = res.data?.data?.settings || res.data?.settings || res.settings;

      if (Array.isArray(remoteSettings) && remoteSettings.length > 0) {
        // Merge with default list to guarantee proper shape
        const merged = defaultNotifs.map((d) => {
          const match = remoteSettings.find((r: any) => r.id === d.id);
          return match
            ? { ...d, email: Boolean(match.email), push: Boolean(match.push) }
            : d;
        });
        setSettings(merged);
      } else {
        setSettings(defaultNotifs);
      }
    } catch {
      setSettings(defaultNotifs);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, channel: "email" | "push") => {
    const currentItem = settings.find((item) => item.id === id);
    if (!currentItem) return;

    const nextValue = !currentItem[channel];

    // If enabling push, ensure browser permission and registration
    if (channel === "push" && nextValue) {
      if (!isPushSupported) {
        showToast("Web Push notifications are not supported in this browser.", "error");
        return;
      }

      if (Notification.permission !== "granted") {
        setIsSubscribingPush(true);
        const result = await subscribeToWebPush();
        setIsSubscribingPush(false);
        setPushPermission(getPushPermissionState());

        if (!result.success) {
          showToast(result.message || "Could not enable Web Push.", "error");
          return;
        }
        showToast("Web Push notifications enabled for your browser!", "success");
      }
    }

    setSettings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [channel]: nextValue } : item))
    );
  };

  const handleEnableGlobalPush = async () => {
    setIsSubscribingPush(true);
    const result = await subscribeToWebPush();
    setIsSubscribingPush(false);
    setPushPermission(getPushPermissionState());

    if (result.success) {
      // Turn on push for all items
      setSettings((prev) => prev.map((item) => ({ ...item, push: true })));
      showToast(result.message || "Browser notifications enabled!", "success");
    } else {
      showToast(result.message || "Failed to enable notifications.", "error");
    }
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
    <div className="bg-white dark:bg-[#181a20] p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 font-sans">
      
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3.5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Notification Preferences
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure how and when you receive shipping status updates and alerts.
          </p>
        </div>
        {isLoading && <Loader2 className="w-4 h-4 text-[#ff4a1f] animate-spin" />}
      </div>

      {/* Web Push Banner */}
      {isPushSupported && (
        <div className="p-3.5 rounded-md bg-slate-50 dark:bg-[#151921] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-md bg-[#ff4a1f]/10 text-[#ff4a1f] mt-0.5 sm:mt-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Instant Browser Web Push
                </h4>
                {pushPermission === "granted" ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : pushPermission === "denied" ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400">
                    <AlertCircle className="w-3 h-3" /> Blocked in Browser
                  </span>
                ) : (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                    Ready to Enable
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Receive desktop alerts even when the browser tab is minimized or in the background.
              </p>
            </div>
          </div>

          {pushPermission !== "granted" && (
            <Button
              type="button"
              onClick={handleEnableGlobalPush}
              isLoading={isSubscribingPush}
              disabled={isSubscribingPush || pushPermission === "denied"}
              className="h-8 px-3 text-xs font-bold rounded bg-[#ff4a1f] hover:bg-[#e03e15] text-white shrink-0 cursor-pointer shadow-2xs"
            >
              <Bell className="w-3.5 h-3.5 mr-1" />
              Enable Web Push
            </Button>
          )}
        </div>
      )}

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-12 text-xs font-bold text-slate-400 dark:text-slate-500 px-3 pb-1 border-b border-slate-100 dark:border-slate-800">
        <div className="col-span-8">Activity & Event</div>
        <div className="col-span-2 text-center">Email Digest</div>
        <div className="col-span-2 text-center">Web Push</div>
      </div>

      {/* Settings Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {settings.map((item) => (
          <div
            key={item.id}
            className="py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center px-2 sm:px-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 rounded-md transition-colors"
          >
            <div className="sm:col-span-8">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                {item.description}
              </p>
            </div>

            {/* Email Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between sm:justify-center">
              <span className="sm:hidden text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-[#ff4a1f]" /> Email
              </span>
              <button
                type="button"
                onClick={() => handleToggle(item.id, "email")}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  item.email ? "bg-[#ff4a1f]" : "bg-slate-200 dark:bg-slate-700"
                }`}
                aria-label={`Toggle email for ${item.title}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    item.email ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Push Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between sm:justify-center">
              <span className="sm:hidden text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <Bell className="w-3 h-3 text-[#ff4a1f]" /> Web Push
              </span>
              <button
                type="button"
                onClick={() => handleToggle(item.id, "push")}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  item.push ? "bg-[#ff4a1f]" : "bg-slate-200 dark:bg-slate-700"
                }`}
                aria-label={`Toggle push for ${item.title}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    item.push ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
        <Button
          type="button"
          onClick={handleSave}
          isLoading={isSaving}
          disabled={isSaving || isLoading}
          className="h-9 px-5 rounded-md bg-[#ff4a1f] hover:bg-[#e63d15] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          Save Notification Settings
        </Button>
      </div>

    </div>
  );
}
