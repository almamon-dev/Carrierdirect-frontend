import React from 'react';
import { Mail, Bell, Zap, Loader2 } from 'lucide-react';
import Switch from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RFQAlertsCardProps {
  settings: {
    newRfqEmail: boolean;
    newRfqPush: boolean;
  };
  isSaving: boolean;
  toggleSetting: (key: any) => void;
}

export function RFQAlertsCard({ settings, isSaving, toggleSetting }: RFQAlertsCardProps) {
  return (
    <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
      <CardHeader className="py-2.5 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
          <Zap className="w-3.5 h-3.5 text-[#ff4a1f]" />
          New RFQ & Instant Quote Request Alerts
        </CardTitle>
        {isSaving && <Loader2 className="w-3.5 h-3.5 text-[#ff4a1f] animate-spin" />}
      </CardHeader>
      <CardContent className="p-3.5 sm:p-4 space-y-2">
        {/* Email Alert */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-[#ff4a1f] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Notifications for New RFQs</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Immediate email when a shipper requests freight quotes matching your operational routes.</p>
            </div>
          </div>
          <Switch 
            checked={!!settings.newRfqEmail} 
            onCheckedChange={() => toggleSetting('newRfqEmail')} 
          />
        </div>

        {/* Web Push Alert */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#14181f] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#ff4a1f] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Browser Web Push Notifications</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant desktop alerts when new quote opportunities become available, even if the portal is in background.</p>
            </div>
          </div>
          <Switch 
            checked={!!settings.newRfqPush} 
            onCheckedChange={() => toggleSetting('newRfqPush')} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
