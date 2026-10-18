import React from 'react';
import { Camera } from 'lucide-react';
import { DriverProfile } from '../../../types';

interface DriverAvatarHeaderProps {
    profile: DriverProfile;
    name: string;
    avatarUrl?: string;
    imgError: boolean;
    setImgError: (val: boolean) => void;
    handleAvatarClick: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DriverAvatarHeader: React.FC<DriverAvatarHeaderProps> = ({
    profile,
    name,
    avatarUrl,
    imgError,
    setImgError,
    handleAvatarClick,
    fileInputRef,
    handleFileChange,
}) => {
    return (
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                    {avatarUrl && !imgError ? (
                        <img
                            src={avatarUrl}
                            alt={name}
                            onError={() => setImgError(true)}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#FF4A1F]/10 dark:bg-[#FF4A1F]/20 text-[#FF4A1F] flex items-center justify-center font-bold text-sm">
                            {name ? name.charAt(0).toUpperCase() : 'D'}
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    aria-label="Upload Driver Avatar"
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                >
                    <Camera size={13} />
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {name || 'Driver'}
                    </h4>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    <span className="font-mono text-[#FF4A1F] font-bold">
                        {`DRV-${profile.id || '0'}`}
                    </span>
                    {profile.licenseBadge && (
                        <>
                            <span>•</span>
                            <span className="px-1 py-0.2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold rounded-[2px] text-[10px]">
                                {profile.licenseBadge}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
