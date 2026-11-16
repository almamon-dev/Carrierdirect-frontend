import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { GoogleAuthRole } from '@/utils/googleAuth';

interface GoogleAuthButtonProps {
    role?: GoogleAuthRole;
    label?: string;
    className?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
    role = 'customer',
    label = 'Sign in with Google',
    className = '',
}) => {
    const { signInWithGoogle, isGoogleLoading, googleError } = useGoogleAuth(role);

    return (
        <div className="w-full space-y-2.5">
            {googleError && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-md flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-snug font-medium">{googleError}</span>
                </div>
            )}

            <button
                type="button"
                disabled={isGoogleLoading}
                onClick={signInWithGoogle}
                className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-[#384150] hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 font-semibold text-xs rounded-md transition-all shadow-2xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
            >
                {isGoogleLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#FF4A1F]" />
                        <span>Connecting to Google...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.27v3.13C3.26 21.3 7.31 24 12 24z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.52.38-2.24V6.63H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.37l4.01-3.13z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.63l4.01 3.13c.95-2.85 3.6-4.96 6.72-4.96z"
                            />
                        </svg>
                        <span>{label}</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default GoogleAuthButton;

