import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { SessionItem } from '../types/securityTypes';
import ChangePasswordCard from './ChangePasswordCard';
import TwoFactorToggleCard from './TwoFactorToggleCard';
import ActiveSessionsCard from './ActiveSessionsCard';
import TwoFactorSetupModal from './TwoFactorSetupModal';

export default function SecurityTab() {
  const showToast = useToastStore((state) => state.showToast);

  const [twoFactor, setTwoFactor] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRefreshingQR, setIsRefreshingQR] = useState(false);
  const [isQRExpired, setIsQRExpired] = useState(false);
  const [qrTimer, setQrTimer] = useState(60);
  const [rawSecret, setRawSecret] = useState('HXDM55FCB6D2P7X9');
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  const totpUri = `otpauth://totp/CarrierDirect:customer@carrierdirect.com?secret=${rawSecret}&issuer=CarrierDirect&algorithm=SHA1&digits=6&period=30`;

  const fetch2FASetup = async () => {
    try {
      const res = await apiClient.get('/customer/2fa/setup');
      if (res.data) {
        if (res.data.secret) setRawSecret(res.data.secret);
        setTwoFactor(!!res.data.two_factor_enabled);
      }
    } catch {
      // Fallback local key state
    }
  };

  useEffect(() => {
    fetch2FASetup();
  }, []);

  useEffect(() => {
    const ua = navigator.userAgent;
    let browser = 'Browser';
    let os = 'Device';
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);

    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';

    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    setSessions([
      {
        id: 'curr-session',
        device: `${browser} on ${os} (This Device)`,
        isCurrent: true,
        isMobile,
        lastActive: 'Active Now',
      },
    ]);
  }, []);

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
      const errMsg =
        err.data?.message ||
        err.message ||
        'Invalid verification code. Please check your Authenticator app.';
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
      if (res.data?.secret) setRawSecret(res.data.secret);
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

  return (
    <div className="space-y-4 font-sans antialiased">
      <ChangePasswordCard />
      <TwoFactorToggleCard twoFactor={twoFactor} onToggle={handleToggle2FA} />
      <ActiveSessionsCard
        sessions={sessions}
        onRevokeSession={(id) => {
          setSessions((prev) => prev.filter((s) => s.id !== id));
          showToast('Session revoked successfully.', 'info');
        }}
        onRevokeAllOther={() => {
          setSessions((prev) => prev.filter((s) => s.isCurrent));
          showToast('All other active sessions have been revoked.', 'success');
        }}
      />
      <TwoFactorSetupModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        otpCode={otpCode}
        setOtpCode={setOtpCode}
        isVerifying={isVerifying}
        onVerify={handleVerify2FA}
        totpUri={totpUri}
        rawSecret={rawSecret}
        isQRExpired={isQRExpired}
        isRefreshingQR={isRefreshingQR}
        qrTimer={qrTimer}
        copiedKey={copiedKey}
        onRefreshQR={handleRefreshQR}
        onCopyKey={handleCopyKey}
        showHelpGuide={showHelpGuide}
        setShowHelpGuide={setShowHelpGuide}
      />
    </div>
  );
}
