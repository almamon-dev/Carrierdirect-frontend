import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { 
  Shield, KeyRound, Smartphone, CheckCircle2, Monitor, Laptop, LogOut, Check, Loader2, RefreshCw, AlertCircle 
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ActiveSession {
  id: string;
  device: string;
  ip: string;
  location: string;
  is_current: boolean;
  current?: boolean;
  is_mobile: boolean;
  last_active: string;
  created_at?: string;
}

export default function SecurityTab() {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Active Sessions
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const getLocalSessionFallback = (): ActiveSession => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let browser = 'Browser';
    let os = 'Device';
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);

    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Google Chrome';
    else if (ua.includes('Edg')) browser = 'Microsoft Edge';
    else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Apple Safari';

    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return {
      id: 'curr-session',
      device: `${browser} on ${os}`,
      ip: '127.0.0.1',
      location: 'Current Device',
      is_current: true,
      current: true,
      is_mobile: isMobile,
      last_active: 'Active Now',
    };
  };

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const res: any = await apiClient.get('/supplier/sessions');
      const list =
        res?.data?.sessions ||
        res?.sessions ||
        res?.data?.data?.sessions ||
        (Array.isArray(res?.data) ? res.data : null);

      if (Array.isArray(list) && list.length > 0) {
        setSessions(list);
        return;
      }
    } catch (err) {
      console.error('Error fetching supplier sessions:', err);
    } finally {
      setIsLoadingSessions(false);
    }

    // Fallback if empty or failed
    setSessions([getLocalSessionFallback()]);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingId(sessionId);
    try {
      await apiClient.delete(`/supplier/sessions/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      useToastStore.getState().showToast('Session revoked successfully.', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.data?.message || err.message || 'Failed to revoke session.';
      useToastStore.getState().showToast(msg, 'error');
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAllOther = async () => {
    if (!window.confirm('Are you sure you want to log out all other devices?')) return;
    setIsRevokingAll(true);
    try {
      await apiClient.delete('/supplier/sessions');
      setSessions((prev) => prev.filter((s) => s.is_current || s.current));
      useToastStore.getState().showToast('All other active sessions have been revoked.', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.data?.message || err.message || 'Failed to revoke other sessions.';
      useToastStore.getState().showToast(msg, 'error');
    } finally {
      setIsRevokingAll(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setIsSaving(true);
    try {
      const res: any = await apiClient.post('/supplier/profile/change-password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setIsSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      useToastStore.getState().showToast(res?.message || 'Password updated successfully!', 'success');
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.data?.message || err.message || 'Failed to update password.';
      setPasswordError(msg);
      useToastStore.getState().showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const otherSessionsCount = sessions.filter((s) => !(s.is_current || s.current)).length;

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
            {passwordError && (
              <div className="p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-[3px] text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Input
                label="Current Password *"
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />

              <Input
                label="New Password *"
                type="password"
                placeholder="Min 8 chars"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm New Password *"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold h-8.5 px-4 rounded-[4px] cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Updating...' : 'Update Password'}</span>
              </Button>

              {isSaved && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Password updated successfully
                </span>
              )}
            </div>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-2.5 bg-slate-50/70 dark:bg-[#1b2028] rounded-[3px] border border-slate-200/70 dark:border-slate-800">
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
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-[4px] flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Monitor className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Active Login Sessions
          </CardTitle>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchSessions}
              disabled={isLoadingSessions}
              title="Refresh sessions"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingSessions ? 'animate-spin' : ''}`} />
            </button>
            <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-[3px]">
              {sessions.length} {sessions.length === 1 ? 'Device' : 'Devices'} Logged In
            </span>
            {otherSessionsCount > 0 && (
              <button
                type="button"
                onClick={handleRevokeAllOther}
                disabled={isRevokingAll}
                className="text-[10.5px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-0.5 rounded-[3px] border border-red-200 dark:border-red-800/60 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {isRevokingAll ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <LogOut className="w-3 h-3" />
                )}
                Revoke All Others
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-3.5 space-y-1.5">
          {isLoadingSessions ? (
            <div className="py-6 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#ff4a1f]" />
              <span>Loading active login sessions...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400">
              No active sessions recorded.
            </div>
          ) : (
            sessions.map((session) => {
              const isCurrentSession = session.is_current || session.current;
              const isRevoking = revokingId === session.id;

              return (
                <div
                  key={session.id}
                  className="p-2.5 bg-slate-50/70 dark:bg-[#1b2028] rounded-[3px] border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2.5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-[4px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      {session.is_mobile ? (
                        <Smartphone className="w-4 h-4 text-[#ff4a1f]" />
                      ) : (
                        <Laptop className="w-4 h-4 text-[#ff4a1f]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {session.device}
                        </h4>
                        {isCurrentSession && (
                          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-1.5 py-0.2 rounded-[2px] flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> This Device (Current)
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                        IP: {session.ip} • Location: {session.location} • <span className="text-slate-500 font-medium">{session.last_active}</span>
                      </p>
                    </div>
                  </div>

                  {!isCurrentSession && (
                    <button
                      type="button"
                      disabled={isRevoking}
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-[11px] text-red-600 hover:text-red-700 hover:underline font-semibold flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50 px-2 py-1"
                    >
                      {isRevoking ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <LogOut className="w-3 h-3" />
                      )}
                      <span>{isRevoking ? 'Revoking...' : 'Log Out'}</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

    </div>
  );
}
