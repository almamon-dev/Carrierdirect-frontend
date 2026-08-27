import React from 'react';
import { Phone, Video, Sparkles, ShieldCheck } from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';

interface CallComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: 'audio' | 'video';
}

export const CallComingSoonModal: React.FC<CallComingSoonModalProps> = ({
    isOpen,
    onClose,
    type = 'audio'
}) => {
    const isVideo = type === 'video';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={true}
        >
            <div className="flex flex-col items-center text-center pt-2 pb-1 px-2 font-sans">
                {/* Visual Icon Badge */}
                <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF4A1F] border border-orange-200/80 flex items-center justify-center shadow-md">
                        {isVideo ? <Video size={28} /> : <Phone size={28} />}
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF4A1F] text-white flex items-center justify-center text-[10px] shadow-sm">
                        <Sparkles size={12} />
                    </span>
                </div>

                {/* Heading */}
                <h3 className="text-base font-bold text-slate-900">
                    {isVideo ? 'Video Calling Coming Soon' : 'Audio Calling Coming Soon'}
                </h3>

                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[280px]">
                    Direct {isVideo ? 'high-definition video' : 'crystal-clear voice'} calling with shippers is currently in active development.
                </p>

                {/* Feature preview bullets */}
                <div className="mt-4 w-full bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-left space-y-2">
                    <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                        <span>End-to-End Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                        <span className="w-3.5 h-3.5 rounded-full bg-orange-100 text-[#FF4A1F] flex items-center justify-center text-[9px] font-bold shrink-0">✓</span>
                        <span>Instant in-chat session recording</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                        <span className="w-3.5 h-3.5 rounded-full bg-orange-100 text-[#FF4A1F] flex items-center justify-center text-[9px] font-bold shrink-0">✓</span>
                        <span>Multi-party carrier conference</span>
                    </div>
                </div>

                {/* Action button */}
                <div className="mt-5 w-full">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                        Got it, thanks
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
