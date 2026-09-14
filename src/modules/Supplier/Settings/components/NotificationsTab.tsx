import React, { useState, useEffect } from "react";
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle2, Zap, Loader2 } from "lucide-react";
import Switch from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";

const defaultSupplierSettings = {
  newRfqEmail: false,
  newRfqSms: false,
  newRfqPush: false,
  counterOfferEmail: false,
  counterOfferPush: false,
  bookingConfirmedSms: false,
  bookingConfirmedEmail: false,
  instantAutoQuoteAlerts: false,
  payoutDisbursedEmail: false,
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
        setSettings(d);
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

  return (
    <form id="supplier-notifications-form" onSubmit={handleSave} className="space-y-3 font-sans antialiased w-full">
      {/* RFQ & Quote Request Alerts */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px]">
        <CardHeader className="py-2 px-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-[4px] flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Zap className="w-3.5 h-3.5 text-[#ff4a1f]" />
            New RFQ & Instant Quote Request Alerts
          </CardTitle>
          {isLoading && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
        </CardHeader>
        <CardContent className="p-3 sm:p-3.5 space-y-2">
          <div
    className="flex items-center justify-between p-2 bg-slate-50/70 dark:bg-[#1b2028] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Notifications for New Requests</h4>
                <p className="text-[10.5px] text-slate-500 font-normal">Immediate email when a shipper requests quotes on your routes.</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.newRfqEmail} 
              onCheckedChange={() => toggleSetting("newRfqEmail")} 
            />
          </div>

          <div
    className="flex items-center justify-between p-2 bg-slate-50/70 dark:bg-[#1b2028] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">SMS Urgent Alerts to Dispatch Hotline</h4>
                <p className="text-[10.5px] text-slate-500 font-normal">SMS text message for high-value urgent freight requests (&gt; €10,000).</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.newRfqSms} 
              onCheckedChange={() => toggleSetting("newRfqSms")} 
            />
          </div>

          <div
    className="flex items-center justify-between p-2 bg-slate-50/70 dark:bg-[#1b2028] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-[#ff4a1f] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Browser & Web Push Notifications</h4>
                <p className="text-[10.5px] text-slate-500 font-normal">Desktop popups when working in your dispatch dashboard.</p>
              </div>
            </div>
            <Switch 
              checked={!!settings.newRfqPush} 
              onCheckedChange={() => toggleSetting("newRfqPush")} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Negotiation & Counter Offer Alerts */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px]">
        <CardHeader className="py-2 px-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-[4px]">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <MessageSquare className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Negotiation & Counter Offer Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-3.5 space-y-2">
          <div
    className="flex items-center justify-between p-2 bg-slate-50/70 dark:bg-[#1b2028] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Counter Offer Chat Messages</h4>
              <p className="text-[10.5px] text-slate-500 font-normal">Instant email when a customer counters your quote in chat.</p>
            </div>
            <Switch 
              checked={!!settings.counterOfferEmail} 
              onCheckedChange={() => toggleSetting("counterOfferEmail")} 
            />
          </div>

          <div
    className="flex items-center justify-between p-2 bg-slate-50/70 dark:bg-[#1b2028] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Booking Confirmation Alerts</h4>
              <p className="text-[10.5px] text-slate-500 font-normal">SMS notification to primary dispatcher when a quote is accepted and booked.</p>
            </div>
            <Switch 
              checked={!!settings.bookingConfirmedSms} 
              onCheckedChange={() => toggleSetting("bookingConfirmedSms")} 
            />
          </div>
        </CardContent>
      </Card>

      {isSaved && (
        <div className="flex items-center pt-1">
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Notification preferences saved
          </span>
        </div>
      )}
    </form>
  );
}
