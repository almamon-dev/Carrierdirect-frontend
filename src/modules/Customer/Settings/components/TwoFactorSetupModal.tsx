import React from 'react';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';
import Modal from '@/components/modals/modal';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import TwoFactorQRCodeBox from './TwoFactorQRCodeBox';
import TwoFactorHelpGuide from './TwoFactorHelpGuide';

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  otpCode: string;
  setOtpCode: (code: string) => void;
  isVerifying: boolean;
  onVerify: (e: React.FormEvent) => void;
  totpUri: string;
  rawSecret: string;
  isQRExpired: boolean;
  isRefreshingQR: boolean;
  qrTimer: number;
  copiedKey: boolean;
  onRefreshQR: () => void;
  onCopyKey: () => void;
  showHelpGuide: boolean;
  setShowHelpGuide: (show: boolean) => void;
}

export const TwoFactorSetupModal: React.FC<TwoFactorSetupModalProps> = ({
  isOpen,
  onClose,
  otpCode,
  setOtpCode,
  isVerifying,
  onVerify,
  totpUri,
  rawSecret,
  isQRExpired,
  isRefreshingQR,
  qrTimer,
  copiedKey,
  onRefreshQR,
  onCopyKey,
  showHelpGuide,
  setShowHelpGuide,
}) => {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <div className="p-1 font-sans text-slate-900 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X size={16} strokeWidth={2} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center pt-1">
          <div className="space-y-3.5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Scan to link 2FA</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Use Google Authenticator, Authy, or phone camera.
              </p>
            </div>

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

            <form onSubmit={onVerify} className="pt-1 space-y-1.5">
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
                  isLoading={isVerifying}
                  disabled={isVerifying || otpCode.length < 6}
                  className={`h-8 px-3 text-xs font-bold text-white shrink-0 transition-all ${
                    otpCode.length === 6
                      ? 'bg-[#ff4a1f] hover:bg-[#e03e15] cursor-pointer shadow-md opacity-100'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60 pointer-events-none'
                  }`}
                >
                  Activate 2FA
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

          <TwoFactorQRCodeBox
            totpUri={totpUri}
            rawSecret={rawSecret}
            isQRExpired={isQRExpired}
            isRefreshingQR={isRefreshingQR}
            qrTimer={qrTimer}
            copiedKey={copiedKey}
            onRefreshQR={onRefreshQR}
            onCopyKey={onCopyKey}
          />
        </div>

        {showHelpGuide && (
          <TwoFactorHelpGuide
            rawSecret={rawSecret}
            onClose={() => setShowHelpGuide(false)}
            onNavigateSupport={() => {
              onClose();
              navigate('/support');
            }}
          />
        )}

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck size={13} className="text-emerald-600" /> End-to-end encrypted
          </span>
          <span className="text-slate-400 font-medium">Standard RFC 6238 TOTP Protocol</span>
        </div>
      </div>
    </Modal>
  );
};

export default TwoFactorSetupModal;
