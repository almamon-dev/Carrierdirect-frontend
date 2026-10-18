import React from 'react';
import { Smartphone, Laptop, LogOut, CheckCircle2 } from 'lucide-react';
import { SessionItem } from '../types/securityTypes';

interface ActiveSessionsCardProps {
  sessions: SessionItem[];
  onRevokeSession: (sessionId: string) => void;
  onRevokeAllOther: () => void;
}

export const ActiveSessionsCard: React.FC<ActiveSessionsCardProps> = ({
  sessions,
  onRevokeSession,
  onRevokeAllOther,
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="font-bold text-slate-900 text-xs">Active Sessions &amp; Devices</h4>
        {sessions.length > 1 && (
          <button
            type="button"
            onClick={onRevokeAllOther}
            className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LogOut size={12} /> Revoke All Other Sessions
          </button>
        )}
      </div>

      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
          >
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
                onClick={() => onRevokeSession(session.id)}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveSessionsCard;
