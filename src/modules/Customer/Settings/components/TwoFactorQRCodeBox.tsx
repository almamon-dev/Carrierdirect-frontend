import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RotateCw, Clock, Copy, Check } from 'lucide-react';
import { formatSecretKey } from '../types/securityTypes';

interface TwoFactorQRCodeBoxProps {
  totpUri: string;
  rawSecret: string;
  isQRExpired: boolean;
  isRefreshingQR: boolean;
  qrTimer: number;
  copiedKey: boolean;
  onRefreshQR: () => void;
  onCopyKey: () => void;
}

export const TwoFactorQRCodeBox: React.FC<TwoFactorQRCodeBoxProps> = ({
  totpUri,
  rawSecret,
  isQRExpired,
  isRefreshingQR,
  qrTimer,
  copiedKey,
  onRefreshQR,
  onCopyKey,
}) => {
  const formattedKey = formatSecretKey(rawSecret);

  return (
    <div className="flex flex-col items-center justify-center space-y-2 border-l border-slate-100 pl-0 md:pl-4">
      <div className="relative p-2 bg-white rounded-lg border border-slate-200 shadow-xs group overflow-hidden w-[160px] h-[160px] flex items-center justify-center">
        <div
          className={`transition-all duration-300 ${
            isQRExpired
              ? 'blur-md opacity-25 scale-95 pointer-events-none'
              : isRefreshingQR
              ? 'opacity-30'
              : 'opacity-100'
          }`}
        >
          <QRCodeSVG
            value={totpUri}
            size={144}
            level="M"
            fgColor="#0f172a"
            bgColor="#ffffff"
          />
        </div>

        {isQRExpired ? (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center z-20 animate-fade-in">
            <p className="text-[11px] font-bold text-white mb-2">QR code expired</p>
            <button
              type="button"
              onClick={onRefreshQR}
              disabled={isRefreshingQR}
              className="px-3 py-1.5 rounded-full bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-[10.5px] font-bold shadow-lg flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
            >
              <RotateCw size={12} className={isRefreshingQR ? 'animate-spin' : ''} />
              <span>Click to reload</span>
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              onClick={onRefreshQR}
              disabled={isRefreshingQR}
              className="w-8 h-8 rounded-full bg-[#ff4a1f] text-white shadow-md border border-slate-200 hover:bg-[#e03e15] hover:scale-105 transition-all flex items-center justify-center cursor-pointer pointer-events-auto"
              title="Click to Refresh QR Code"
            >
              <RotateCw size={14} className={isRefreshingQR ? 'animate-spin text-white' : ''} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
        <Clock size={11} className={isQRExpired ? 'text-red-500' : 'text-slate-400'} />
        <span>
          {isQRExpired ? (
            <span className="text-red-600 font-bold">Code expired</span>
          ) : (
            <span>
              Expires in <strong className="text-slate-800 font-mono">{qrTimer}s</strong>
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1.5 w-full max-w-[200px] text-[11px] font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
        <span className="text-slate-600 font-bold truncate" title={rawSecret}>
          {formattedKey}
        </span>
        <button
          type="button"
          onClick={onCopyKey}
          className="text-[#ff4a1f] hover:underline font-bold flex items-center gap-1 cursor-pointer shrink-0"
        >
          {copiedKey ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
          <span>{copiedKey ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};

export default TwoFactorQRCodeBox;
