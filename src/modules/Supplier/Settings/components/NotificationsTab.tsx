import React, { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  Check,
  CreditCard,
  FileCheck,
} from "lucide-react";
import Switch from "@/components/ui/switch";
import Button from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RFQAlertsCard } from "./RFQAlertsCard";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";
import {
  isWebPushSupported,
  getPushPermissionState,
  subscribeToWebPush,
} from "@/lib/webpush";

interface SupplierNotificationSettings {
  newRfqEmail: boolean;
  newRfqPush: boolean;
  counterOfferEmail: boolean;
  counterOfferPush: boolean;
  bookingConfirmedEmail: boolean;
  payoutDisbursedEmail: boolean;
}

const defaultSupplierSettings: SupplierNotificationSettings = {
  newRfqEmail: true,
  newRfqPush: true,
  counterOfferEmail: true,
  counterOfferPush: true,
  bookingConfirmedEmail: true,
  payoutDisbursedEmail: true,
};

export default function NotificationsTab() {
  const showToast = useToastStore((state) => state.showToast);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isSubscribingPush, setIsSubscribingPush] = useState(false);

  const [settings, setSettings] = useState<SupplierNotificationSettings>(defaultSupplierSettings);

  useEffect(() => {
    setIsPushSupported(isWebPushSupported());
    setPushPermission(getPushPermissionState());
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/supplier/notification-settings");
      const d = res?.data?.data?.settings || res?.data?.settings || res?.settings;
      if (d && typeof d === 'object') {
        setSettings({
          newRfqEmail: d.newRfqEmail ?? defaultSupplierSettings.newRfqEmail,
          newRfqPush: d.newRfqPush ?? defaultSupplierSettings.newRfqPush,
          counterOfferEmail: d.counterOfferEmail ?? defaultSupplierSettings.counterOfferEmail,
          counterOfferPush: d.counterOfferPush ?? defaultSupplierSettings.counterOfferPush,
          bookingConfirmedEmail: d.bookingConfirmedEmail ?? defaultSupplierSettings.bookingConfirmedEmail,
          payoutDisbursedEmail: d.payoutDisbursedEmail ?? defaultSupplierSettings.payoutDisbursedEmail,
        });
      }
    } catch {
      setSettings(defaultSupplierSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetting = async (key: keyof SupplierNotificationSettings) => {
    const nextVal = !settings[key];

    // If enabling a push channel, ensure browser notification permission
    if ((key === 'newRfqPush' || key === 'counterOfferPush') && nextVal) {
      if (!isPushSupported) {
        showToast("Web Push is not supported in this browser.", "error");
        return;
      }

      if (Notification.permission !== 'granted') {
        setIsSubscribingPush(true);
        const res = await subscribeToWebPush();
        setIsSubscribingPush(false);
        setPushPermission(getPushPermissionState());

        if (!res.success) {
          showToast(res.message || "Failed to enable Web Push", "error");
          return;
        }
        showToast("Web Push notifications enabled for your browser!", "success");
      }
    }

    setSettings((prev) => ({ ...prev, [key]: nextVal }));
  };

  const handleEnableGlobalPush = async () => {
    setIsSubscribingPush(true);
    const res = await subscribeToWebPush();
    setIsSubscribingPush(false);
    setPushPermission(getPushPermissionState());

    if (res.success) {
      setSettings((prev) => ({
        ...prev,
        newRfqPush: true,
        counterOfferPush: true,
      }));
      showToast("Browser notifications enabled!", "success");
    } else {
      showToast(res.message || "Failed to enable notifications.", "error");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await apiClient.post("/supplier/notification-settings", { settings });
      setIsSaved(true);
      showToast("Notification preferences updated successfully!", "success");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      const errMsg = err.data?.message || err.message || "Failed to update notification preferences.";
      showToast(errMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-[4px]" />
        <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-[4px]" />
      </div>
    );
  }

  return (
    <form id="supplier-notifications-form" onSubmit={handleSave} className="space-y-4 font-sans antialiased w-full">
      
      {/* Web Push Status Banner */}
      {isPushSupported && (
        <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-md bg-[#ff4a1f]/10 text-[#ff4a1f] mt-0.5 sm:mt-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Dispatcher Desktop Web Push
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
                Receive instant sound & popup alerts on new RFQs and counter offers even when your dispatch browser tab is minimized.
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

      {/* RFQ & Quote Request Alerts */}
      <RFQAlertsCard 
        settings={settings} 
        isSaving={isSaving} 
        toggleSetting={toggleSetting} 
      />

      {/* Negotiation & Live Chat Alerts */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
        <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px]">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <MessageSquare className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Negotiation & Live Chat Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 space-y-2">
          {/* Counter Offer Email */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Email for Counter Offer Chats</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive an email when a customer submits a counter offer on your quote.</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.counterOfferEmail} 
              onCheckedChange={() => toggleSetting("counterOfferEmail")} 
            />
          </div>

          {/* Counter Offer Web Push */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Instant Desktop Web Push for Chat</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant browser alert when a customer counters or sends a live negotiation message.</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.counterOfferPush} 
              onCheckedChange={() => toggleSetting("counterOfferPush")} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking & Financial Alerts */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
        <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px]">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <FileCheck className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Booking Confirmation & Payout Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 space-y-2">
          {/* Booking Confirmation Email */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Order Booking Confirmation</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Notify primary dispatcher when an order is officially accepted and driver assignment is ready.</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.bookingConfirmedEmail} 
              onCheckedChange={() => toggleSetting("bookingConfirmedEmail")} 
            />
          </div>

          {/* Payout Email */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Payout & Wallet Settlement Notices</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive email confirmations when escrow funds or earnings are credited to your balance.</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.payoutDisbursedEmail} 
              onCheckedChange={() => toggleSetting("payoutDisbursedEmail")} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold h-8.5 px-4 rounded-[4px] cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Saving Alerts...' : 'Save Notification Preferences'}</span>
        </Button>

        {isSaved && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" /> Notification preferences saved
          </span>
        )}
      </div>

    </form>
  );
}
