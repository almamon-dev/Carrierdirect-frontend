import React, { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import Input from '@/components/ui/input';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';

export const ChangePasswordCard: React.FC = () => {
  const showToast = useToastStore((state) => state.showToast);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword,
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

  return (
    <form
      onSubmit={handlePasswordSubmit}
      className="bg-white p-4 sm:p-5 rounded-md border border-slate-200 shadow-xs space-y-4"
    >
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
          className="h-9 px-5 rounded-md bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
        >
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isLoading ? 'Updating…' : 'Update Password'}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordCard;
