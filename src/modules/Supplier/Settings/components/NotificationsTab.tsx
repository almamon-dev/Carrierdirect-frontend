import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle2, Zap } from 'lucide-react';
import Button from '@/components/ui/button';
import Switch from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function NotificationsTab() {
  const [isSaved, setIsSaved] = useState(false);

  const [settings, setSettings] = useState({
    newRfqEmail: true,
    newRfqSms: true,
    newRfqPush: true,
    counterOfferEmail: true,
    counterOfferPush: true,
    bookingConfirmedSms: true,
    bookingConfirmedEmail: true,
    instantAutoQuoteAlerts: true,
    payoutDisbursedEmail: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-3.5 font-sans antialiased">
      
      {/* RFQ & Quote Request Alerts */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Zap className="w-3.5 h-3.5 text-[#ff4a1f]" />
            New RFQ & Instant Quote Request Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#ff4a1f]" />
              <div>
                <h4 className="text-xs font-semibold text-slate-800">Email Notifications for New Requests</h4>
                <p className="text-[11px] text-slate-500 font-normal">Immediate email when a shipper requests quotes on your matching routes.</p>
              </div>
            </div>
            <Switch 
              defaultChecked={settings.newRfqEmail} 
              onChange={() => toggleSetting('newRfqEmail')} 
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-[#ff4a1f]" />
              <div>
                <h4 className="text-xs font-semibold text-slate-800">SMS Urgent Alerts to Dispatch Hotline</h4>
                <p className="text-[11px] text-slate-500 font-normal">SMS text message for high-value urgent freight requests (&gt; €10,000).</p>
              </div>
            </div>
            <Switch 
              defaultChecked={settings.newRfqSms} 
              onChange={() => toggleSetting('newRfqSms')} 
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#ff4a1f]" />
              <div>
                <h4 className="text-xs font-semibold text-slate-800">Browser & Web Push Notifications</h4>
                <p className="text-[11px] text-slate-500 font-normal">Desktop popups when working in your dispatch dashboard.</p>
              </div>
            </div>
            <Switch 
              defaultChecked={settings.newRfqPush} 
              onChange={() => toggleSetting('newRfqPush')} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Negotiation & Counter Offer Alerts */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <MessageSquare className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Negotiation & Counter Offer Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div>
              <h4 className="text-xs font-semibold text-slate-800">Counter Offer Chat Messages</h4>
              <p className="text-[11px] text-slate-500 font-normal">Instant email when a customer counters your quote in chat.</p>
            </div>
            <Switch 
              defaultChecked={settings.counterOfferEmail} 
              onChange={() => toggleSetting('counterOfferEmail')} 
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div>
              <h4 className="text-xs font-semibold text-slate-800">Booking Confirmation Alerts</h4>
              <p className="text-[11px] text-slate-500 font-normal">SMS notification to primary dispatcher when a quote is accepted and booked.</p>
            </div>
            <Switch 
              defaultChecked={settings.bookingConfirmedSms} 
              onChange={() => toggleSetting('bookingConfirmedSms')} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Action Footer */}
      <div className="flex items-center justify-between pt-1">
        {isSaved ? (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Notification preferences saved
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-normal">Dispatchers can adjust alerts at any time.</span>
        )}

        <Button
          type="submit"
          variant="primary"
          className="h-8 text-xs px-5 bg-[#ff4a1f] hover:bg-[#e63d15] font-semibold text-white shadow-2xs cursor-pointer rounded-md"
        >
          Save Alerts
        </Button>
      </div>

    </form>
  );
}
