import React, { useState } from 'react';
import { Lock, Shield, KeyRound, Smartphone, CheckCircle2, Monitor, LogOut } from 'lucide-react';
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
    <div className="space-y-3.5 font-sans antialiased">
      
      {/* Password Change Form */}
      <form onSubmit={handlePasswordSave}>
        <Card className="shadow-2xs border-slate-200">
          <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
              <KeyRound className="w-3.5 h-3.5 text-[#ff4a1f]" />
              Change Account Password
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {isSaved ? (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Password updated
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-normal">Use letters, numbers & symbols.</span>
              )}

              <Button
                type="submit"
                variant="primary"
                className="h-8 text-xs px-5 bg-[#ff4a1f] hover:bg-[#e63d15] font-semibold text-white shadow-2xs cursor-pointer rounded-md"
              >
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Two-Factor Authentication (2FA) */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Shield className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Two-Factor Authentication (2FA)
          </CardTitle>
          {twoFactorEnabled ? (
            <Badge className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
              Enabled
            </Badge>
          ) : (
            <Badge className="bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
              Disabled
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-3.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <div>
              <h4 className="text-xs font-semibold text-slate-800">Authenticator App (TOTP)</h4>
              <p className="text-[11px] text-slate-500 font-normal">
                Secure your account using Google Authenticator or Authy.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`h-7.5 text-xs px-3 font-semibold rounded-md cursor-pointer transition-colors ${
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
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Monitor className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Active Login Sessions
          </CardTitle>
          <span className="text-[11px] font-medium text-slate-500">2 Devices Logged In</span>
        </CardHeader>
        <CardContent className="p-3.5 space-y-2">
          {activeSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div key={session.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-slate-600 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-slate-800">{session.device}</h4>
                      {session.current && (
                        <Badge className="bg-emerald-50 text-emerald-700 text-[9.5px] font-semibold border border-emerald-200">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10.5px] text-slate-500 font-normal mt-0.5">
                      IP: {session.ip} • Location: {session.location}
                    </p>
                  </div>
                </div>

                {!session.current && (
                  <button 
                    type="button" 
                    onClick={() => alert('Logged out session')}
                    className="text-xs text-red-600 hover:underline font-medium flex items-center gap-1 cursor-pointer"
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
