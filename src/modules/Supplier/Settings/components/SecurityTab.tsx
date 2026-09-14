import React, { useState } from 'react';
import { Shield, KeyRound, Smartphone, CheckCircle2, Monitor, LogOut } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SecurityTab() {
  const [isSaved, setIsSaved] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const activeSessions = [
    { id: '1', device: 'Chrome on Windows 11', ip: '185.220.101.42', location: 'Berlin, Germany', current: true, icon: Monitor },
    { id: '2', device: 'Safari on iPhone 15 Pro', ip: '92.204.11.89', location: 'Frankfurt, Germany', current: false, icon: Smartphone },
  ];

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-3 font-sans antialiased w-full">
      
      {/* Password Change Form */}
      <form id="supplier-security-form" onSubmit={handlePasswordSave}>
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px]">
          <CardHeader className="py-2 px-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-[4px]">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
              <KeyRound className="w-3.5 h-3.5 text-[#ff4a1f]" />
              Change Account Password
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-3.5 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Input
                label="Current Password *"
                type="password"
                placeholder="••••••••••••"
                required
              />

              <Input
                label="New Password *"
                type="password"
                placeholder="Min 8 chars, 1 number"
                required
              />

              <Input
                label="Confirm New Password *"
                type="password"
                placeholder="Re-enter new password"
                required
              />
            </div>

            {isSaved && (
              <div className="flex items-center pt-1.5 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Password updated successfully
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </form>

      {/* Two-Factor Authentication (2FA) */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px]">
        <CardHeader className="py-2 px-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-[4px] flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Shield className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Two-Factor Authentication (2FA)
          </CardTitle>
          {twoFactorEnabled ? (
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-1.5 py-0.5 rounded-[3px]">
              Enabled
            </span>
          ) : (
            <span className="inline-flex items-center text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-[3px]">
              Disabled
            </span>
          )}
        </CardHeader>
        <CardContent className="p-3 sm:p-3.5">
          <div
    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-2.5 bg-slate-50/70 dark:bg-[#1b2028] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Authenticator App (TOTP)</h4>
              <p className="text-[10.5px] text-slate-500 font-normal">
                Secure your account using Google Authenticator or Authy.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`h-7 text-[11px] px-3 font-semibold rounded-[3px] cursor-pointer transition-colors ${
                twoFactorEnabled 
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' 
                  : 'bg-[#ff4a1f] hover:bg-[#e63d15] text-white shadow-2xs'
              }`}
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Login Sessions */}
      <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px]">
        <CardHeader className="py-2 px-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-[4px] flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Monitor className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Active Login Sessions
          </CardTitle>
          <span className="text-[10.5px] font-medium text-slate-400">2 Devices Logged In</span>
        </CardHeader>
        <CardContent className="p-3 sm:p-3.5 space-y-1.5">
          {activeSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div key={session.id} className="p-2 bg-slate-50/70 dark:bg-[#1b2028] rounded-[3px] border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{session.device}</h4>
                      {session.current && (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded-[2px]">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal">
                      IP: {session.ip} • Location: {session.location}
                    </p>
                  </div>
                </div>

                {!session.current && (
                  <button 
                    type="button" 
                    onClick={() => alert('Logged out session')}
                    className="text-[11px] text-red-600 hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" /> Log Out
                  </button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

    </div>
  );
}
