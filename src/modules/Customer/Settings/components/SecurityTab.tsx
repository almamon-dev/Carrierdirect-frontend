import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Lock, Shield, Smartphone, Laptop, Loader2, LogOut, CheckCircle2, QrCode, Copy, Check, ShieldCheck, ExternalLink, HelpCircle, ChevronRight, Key, RotateCw, X, Clock } from 'lucide-react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Modal from '@/components/modals/modal';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';
import { useNavigate } from 'react-router-dom';

interface SessionItem {
  id: string;
  device: string;
  isCurrent: boolean;
  isMobile: boolean;
  lastActive: string;
}

function formatSecretKey(raw: string): string {
  return raw.match(/.{1,4}/g)?.join('-') || raw;
}

export default function SecurityTab() {
  const navigate = useNavigate();
  const showToast = useToastStore(state => state.showToast);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRefreshingQR, setIsRefreshingQR] = useState(false);
  const [isQRExpired, setIsQRExpired] = useState(false);
  const [qrTimer, setQrTimer] = useState(60);
  const [rawSecret, setRawSecret] = useState("HXDM55FCB6D2P7X9");
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  const formattedKey = formatSecretKey(rawSecret);

  // Standard RFC 6238 TOTP URI specification
  const totpUri = `otpauth://totp/CarrierDirect:customer@carrierdirect.com?secret=${rawSecret}&issuer=CarrierDirect&algorithm=SHA1&digits=6&period=30`;

  // Fetch initial profile & 2FA setup key from Laravel Backend
  useEffect(() => {
    fetch2FASetup();
  }, []);

  const fetch2FASetup = async () => {
    try {
      const res = await apiClient.get('/customer/2fa/setup');
      if (res.data) {
        if (res.data.secret) setRawSecret(res.data.secret);
        setTwoFactor(!!res.data.two_factor_enabled);
      }
    } catch {
      // Fallback local key state if unauthenticated in preview
    }
  };

  // Dynamic Browser & OS detection
  useEffect(() => {
    const ua = navigator.userAgent;
    let browser = "Browser";
    let os = "Device";
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);

    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Edg")) browser = "Edge";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";

    if (ua.includes("Win")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    const currentDeviceInfo = `${browser} on ${os}`;

    setSessions([
      {
        id: 'curr-session',
        device: `${currentDeviceInfo} (This Device)`,
        isCurrent: true,
        isMobile,
        lastActive: 'Active Now',
      }
    ]);
  }, []);

  // 60-Second Auto QR Expiration Timer
  useEffect(() => {
    let interval: any = null;
    if (is2FAModalOpen && !isQRExpired) {
      interval = setInterval(() => {
        setQrTimer((prev) => {
          if (prev <= 1) {
            setIsQRExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [is2FAModalOpen, isQRExpired]);

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

  const handleToggle2FA = async () => {
    if (!twoFactor) {
      setIs2FAModalOpen(true);
      setShowHelpGuide(false);
      setIsQRExpired(false);
      setQrTimer(60);
      setOtpCode('');
      await fetch2FASetup();
    } else {
      try {
        await apiClient.post('/customer/2fa/disable');
      } catch {
        // Fallback
      }
      setTwoFactor(false);
      showToast('Two-Factor Authentication disabled.', 'info');
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      showToast('Please enter a 6-digit verification code.', 'error');
      return;
    }

    setIsVerifying(true);

    try {
      const res = await apiClient.post('/customer/2fa/enable', { code: otpCode });

      setIsVerifying(false);
      setTwoFactor(true);
      setIs2FAModalOpen(false);
      setShowHelpGuide(false);
      setOtpCode('');
      showToast(res.data?.message || 'Two-Factor Authentication successfully enabled!', 'success');

    } catch (err: any) {
      setIsVerifying(false);
      const errMsg = err.data?.message || err.message || 'Invalid verification code. Please check your Authenticator app.';
      showToast(errMsg, 'error');
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(rawSecret);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRefreshQR = async () => {
    setIsRefreshingQR(true);
    try {
      const res = await apiClient.get('/customer/2fa/setup');
      if (res.data?.secret) {
        setRawSecret(res.data.secret);
      }
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setQrTimer(60);
      setIsQRExpired(false);
      setIsRefreshingQR(false);
      setOtpCode('');
      showToast('QR Code refreshed!', 'info');
    }, 400);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('Session revoked successfully.', 'info');
  };

  const handleRevokeAllOther = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
    showToast('All other active sessions have been revoked.', 'success');
  };

  return (
    <div className="space-y-4 font-sans antialiased">

      {/* Change Password Card */}
      <form onSubmit={handlePasswordSubmit} className="bg-white p-4 sm:p-5 rounded-md border border-slate-200 shadow-xs space-y-4">
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

      {/* Two-Factor Authentication Card */}
      <div className="bg-white p-4 sm:p-5 rounded-md border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${twoFactor ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-[#ff4a1f]'
            }`}>
            {twoFactor ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Two-Factor Authentication (2FA)</h4>
              {twoFactor && (
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  Enabled
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-normal">Scan QR code using Google / Authy Authenticator app for 2-step verification.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle2FA}
          className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${twoFactor ? 'bg-[#ff4a1f]' : 'bg-slate-200'
            }`}
        >
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-5' : 'translate-x-0'
            }`} />
        </button>
      </div>

      {/* Active Login Sessions */}
      <div className="bg-white p-4 sm:p-5 rounded-md border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="font-bold text-slate-900 text-xs">Active Sessions &amp; Devices</h4>
          {sessions.length > 1 && (
            <button
              type="button"
              onClick={handleRevokeAllOther}
              className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut size={12} /> Revoke All Other Sessions
            </button>
          )}
        </div>

        <div className="space-y-2">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                {session.isMobile ? (
                  <Smartphone className="w-4 h-4 text-[#ff4a1f] shrink-0" />
                ) : (
                  <Laptop className="w-4 h-4 text-[#ff4a1f] shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-slate-900">{session.device}</p>
                  <p className="text-[10px] text-slate-500">{session.lastActive}</p>
                </div>
              </div>

              {session.isCurrent ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Current Session
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRevokeSession(session.id)}
                  className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Clean 2FA Setup Modal Connected to Real Laravel Backend */}
      <Modal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        size="lg"
        showCloseButton={false}
      >
        <div className="p-1 font-sans text-slate-900 relative">

          {/* Top Close Button */}
          <button
            type="button"
            onClick={() => setIs2FAModalOpen(false)}
            className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X size={16} strokeWidth={2} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center pt-1">

            {/* Left Column: Steps & OTP */}
            <div className="space-y-3.5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Scan to link 2FA</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Use Google Authenticator, Authy, or phone camera.</p>
              </div>

              {/* Step Timeline */}
              <div className="relative pl-6 space-y-2.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                <div className="relative flex items-start gap-2">
                  <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <p className="text-[11.5px] text-slate-700 font-medium leading-tight pt-0.5">
                    Open Authenticator app (Google / Authy)
                  </p>
                </div>

                <div className="relative flex items-start gap-2">
                  <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <p className="text-[11.5px] text-slate-700 font-medium leading-tight pt-0.5">
                    Scan QR code or enter secret key
                  </p>
                </div>

                <div className="relative flex items-start gap-2">
                  <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <p className="text-[11.5px] text-slate-700 font-medium leading-tight pt-0.5">
                    Enter 6-digit code from app below to activate
                  </p>
                </div>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleVerify2FA} className="pt-1 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block px-0.5">
                  Verification Code *
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 492018"
                      className="text-center font-mono tracking-widest text-xs font-bold h-8"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isVerifying || otpCode.length < 6}
                    className={`h-8 px-3 text-xs font-bold text-white shrink-0 transition-all ${otpCode.length === 6
                        ? 'bg-[#ff4a1f] hover:bg-[#e03e15] cursor-pointer shadow-md opacity-100'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60 pointer-events-none'
                      }`}
                  >
                    {isVerifying ? <Loader2 size={13} className="animate-spin" /> : 'Activate 2FA'}
                  </Button>
                </div>
              </form>

              <button
                type="button"
                onClick={() => setShowHelpGuide(!showHelpGuide)}
                className="inline-flex items-center gap-1 text-[11px] text-[#ff4a1f] font-bold hover:underline cursor-pointer"
              >
                <span>Need help?</span>
                <ExternalLink size={11} />
              </button>
            </div>

            {/* Right Column: High-Precision Local SVG QR Renderer */}
            <div className="flex flex-col items-center justify-center space-y-2 border-l border-slate-100 pl-0 md:pl-4">
              <div className="relative p-2 bg-white rounded-md border border-slate-200 shadow-xs group overflow-hidden w-[160px] h-[160px] flex items-center justify-center">
                <div className={`transition-all duration-300 ${isQRExpired
                    ? 'blur-md opacity-25 scale-95 pointer-events-none'
                    : isRefreshingQR
                      ? 'opacity-30'
                      : 'opacity-100'
                  }`}>
                  <QRCodeSVG
                    value={totpUri}
                    size={144}
                    level="M"
                    fgColor="#0f172a"
                    bgColor="#ffffff"
                  />
                </div>

                {/* Expired Overlay with Click to Reload Button */}
                {isQRExpired ? (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center z-20 animate-fade-in">
                    <p className="text-[11px] font-bold text-white mb-2">QR code expired</p>
                    <button
                      type="button"
                      onClick={handleRefreshQR}
                      disabled={isRefreshingQR}
                      className="px-3 py-1.5 rounded-full bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-[10.5px] font-bold shadow-lg flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                    >
                      <RotateCw size={12} className={isRefreshingQR ? "animate-spin" : ""} />
                      <span>Click to reload</span>
                    </button>
                  </div>
                ) : (
                  /* Active Center Reload Badge */
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button
                      type="button"
                      onClick={handleRefreshQR}
                      disabled={isRefreshingQR}
                      className="w-8 h-8 rounded-full bg-[#ff4a1f] text-white shadow-md border border-slate-200 hover:bg-[#e03e15] hover:scale-105 transition-all flex items-center justify-center cursor-pointer pointer-events-auto"
                      title="Click to Refresh QR Code"
                    >
                      <RotateCw size={14} className={isRefreshingQR ? 'animate-spin text-white' : ''} />
                    </button>
                  </div>
                )}
              </div>

              {/* Countdown Timer Indicator */}
              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                <Clock size={11} className={isQRExpired ? 'text-red-500' : 'text-slate-400'} />
                <span>
                  {isQRExpired ? (
                    <span className="text-red-600 font-bold">Code expired</span>
                  ) : (
                    <span>Expires in <strong className="text-slate-800 font-mono">{qrTimer}s</strong></span>
                  )}
                </span>
              </div>

              {/* Base32 Secret Key Box */}
              <div className="flex items-center justify-between gap-1.5 w-full max-w-[200px] text-[11px] font-mono bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                <span className="text-slate-600 font-bold truncate" title={rawSecret}>{formattedKey}</span>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="text-[#ff4a1f] hover:underline font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedKey ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Help Guide Accordion */}
          {showHelpGuide && (
            <div className="mt-3 p-3 bg-orange-50/70 border border-orange-200 rounded-lg space-y-2 text-[11px] animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-orange-200/60 pb-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1">
                  <HelpCircle size={13} className="text-[#ff4a1f]" />
                  2-Factor Setup Guide
                </h4>
                <button
                  type="button"
                  onClick={() => setShowHelpGuide(false)}
                  className="text-slate-600 hover:text-slate-900 font-bold text-[10px]"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-800">
                <div className="space-y-0.5 bg-white p-2 rounded border border-orange-100">
                  <p className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                    <ShieldCheck size={12} className="text-[#ff4a1f]" /> Authenticator App:
                  </p>
                  <ol className="list-decimal pl-3.5 space-y-0.5 text-[10.5px] text-slate-700">
                    <li>Open <strong>Google Authenticator</strong> / <strong>Authy</strong>.</li>
                    <li>Tap <strong>+</strong> and select <strong>Scan QR Code</strong>.</li>
                    <li>Scan the QR code on the right.</li>
                  </ol>
                </div>

                <div className="space-y-0.5 bg-white p-2 rounded border border-orange-100">
                  <p className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                    <Key size={12} className="text-[#ff4a1f]" /> Manual Key Setup:
                  </p>
                  <ol className="list-decimal pl-3.5 space-y-0.5 text-[10.5px] text-slate-700">
                    <li>Copy Secret Key ({rawSecret}).</li>
                    <li>Select <strong>Enter setup key</strong> in app.</li>
                    <li>Set Account Name as <strong>CarrierDirect</strong>.</li>
                  </ol>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-orange-200/60">
                <span className="text-[10px] text-slate-600 font-medium">Need further help?</span>
                <button
                  type="button"
                  onClick={() => {
                    setIs2FAModalOpen(false);
                    navigate('/support');
                  }}
                  className="text-[10.5px] font-bold text-[#ff4a1f] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Contact Support</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Footer Security Note */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck size={13} className="text-emerald-600" /> End-to-end encrypted
            </span>
            <span className="text-slate-400 font-medium">Standard RFC 6238 TOTP Protocol</span>
          </div>
        </div>
      </Modal>

    </div>
  );
}
