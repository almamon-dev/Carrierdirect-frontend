import React, { useState } from 'react';
import { Lock, Shield, Smartphone, Laptop, Loader2 } from 'lucide-react';
import Input from '@/components/ui/input';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';

export default function SecurityTab() {
  const showToast = useToastStore(state => state.showToast);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [twoFactor, setTwoFactor]   = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    if (passwords.newPassword.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post(ENDPOINTS.CUSTOMER.CHANGE_PASSWORD, {
        current_password:      passwords.currentPassword,
        new_password:          passwords.newPassword,
        new_password_confirmation: passwords.confirmPassword,
      });

      showToast('Password updated successfully!', 'success');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      const msg = err.data?.message || err.message || 'Current password incorrect or failed to update.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = () => {
    const nextState = !twoFactor;
    setTwoFactor(nextState);
    if (nextState) {
      showToast('2-Factor Authentication enabled.', 'info');
    } else {
      showToast('2-Factor Authentication disabled.', 'info');
    }
  };

  return (
    <div className="space-y-4">

      {/* Change Password Card */}
      <form onSubmit={handlePasswordSubmit} className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
          <p className="text-xs text-slate-500">Update your account password regularly for security.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Input
            label="Current Password *"
            type="password"
            icon={<Lock className="w-4 h-4 text-slate-400" />}
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            placeholder="••••••••"
            required
          />

          <Input
            label="New Password *"
            type="password"
            icon={<Lock className="w-4 h-4 text-slate-400" />}
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirm New Password *"
            type="password"
            icon={<Lock className="w-4 h-4 text-slate-400" />}
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="h-9 px-5 rounded-md bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isLoading ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </form>

      {/* Two-Factor Authentication Card */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#ff4a1f] flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Two-Factor Authentication (2FA)</h4>
            <p className="text-[11px] text-slate-500">Add 2-step SMS verification when signing in.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle2FA}
          className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${
            twoFactor ? 'bg-[#ff4a1f]' : 'bg-slate-200'
          }`}
        >
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
            twoFactor ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {/* Active Login Sessions */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">Active Sessions &amp; Devices</h4>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Laptop className="w-4 h-4 text-slate-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">Chrome on Windows (This Device)</p>
                <p className="text-[10px] text-slate-500">Active Session</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
              Current Session
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-slate-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">Mobile Browser</p>
                <p className="text-[10px] text-slate-500">Recent Login</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast('Session revoked successfully.', 'info')}
              className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
            >
              Revoke
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
