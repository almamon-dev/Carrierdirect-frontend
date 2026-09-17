import React, { useState, useEffect } from "react";
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle2, Zap, Loader2, Check, CreditCard } from "lucide-react";
import Switch from "@/components/ui/switch";
import Button from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";

const defaultSupplierSettings = {
  newRfqEmail: true,
  newRfqSms: false,
  newRfqPush: true,
  counterOfferEmail: true,
  counterOfferPush: true,
  bookingConfirmedSms: true,
  bookingConfirmedEmail: true,
  instantAutoQuoteAlerts: false,
  payoutDisbursedEmail: true,
};

export default function NotificationsTab() {
  const showToast = useToastStore((state) => state.showToast);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState(defaultSupplierSettings);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/supplier/notification-settings");
      const d = res?.data?.data?.settings || res?.data?.settings || res?.settings;
      if (d) {
        setSettings({ ...defaultSupplierSettings, ...d });
      }
    } catch {
      setSettings(defaultSupplierSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
    <form id="supplier-notifications-form" onSubmit={handleSave} className="space-y-3 font-sans antialiased w-full">
      
      {/* RFQ & Quote Request Alerts */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
        <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Zap className="w-3.5 h-3.5 text-[#ff4a1f]" />
            New RFQ & Instant Quote Request Alerts
          </CardTitle>
          {isSaving && <Loader2 className="w-3.5 h-3.5 text-[#ff4a1f] animate-spin" />}
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 space-y-2">
          <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Notifications for New RFQs</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Immediate email when a shipper requests freight quotes on your matching routes.</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.newRfqEmail} 
              onCheckedChange={() => toggleSetting("newRfqEmail")} 
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">SMS Dispatch Hotline Alerts</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">SMS text message for urgent high-priority freight bookings (&gt; €5,000).</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.newRfqSms} 
              onCheckedChange={() => toggleSetting("newRfqSms")} 
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Browser Web Push Notifications</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time desktop alerts when working in your dispatch portal.</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.newRfqPush} 
              onCheckedChange={() => toggleSetting("newRfqPush")} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Negotiation & Order Alerts */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
        <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px]">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <MessageSquare className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Negotiation, Booking & Payout Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 space-y-2">
          <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Counter Offer Chat Messages</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant notification when a customer counters your quote in live chat.</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.counterOfferEmail} 
              onCheckedChange={() => toggleSetting("counterOfferEmail")} 
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Booking Confirmation Alerts</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Notify primary dispatcher when an order is accepted and driver assignment is ready.</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.bookingConfirmedEmail} 
              onCheckedChange={() => toggleSetting("bookingConfirmedEmail")} 
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Payout Disbursement Notices</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive email receipts when Stripe transfers earnings to your bank account.</p>
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
