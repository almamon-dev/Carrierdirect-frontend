import React from 'react';
import { Link } from 'react-router-dom';
import DemoCredentials from './DemoCredentials';

interface LoginSocialAndDemoSectionProps {
    onSelectDemo: (email: string, pass: string) => void;
}

export const LoginSocialAndDemoSection: React.FC<LoginSocialAndDemoSectionProps> = ({ onSelectDemo }) => {
    return (
        <>
            {/* Divider */}
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-[#384150]" />
                </div>
                <div className="relative flex justify-center text-[11px]">
                    <span className="bg-white dark:bg-[#181a20] px-3 text-gray-400 dark:text-slate-400 font-semibold tracking-wider">
                        Or continue with
                    </span>
                </div>
            </div>

            {/* Google Sign-In */}
            <button
                type="button"
                onClick={() => {
                    window.location.href = '/auth/google';
                }}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-[#384150] hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 font-semibold text-xs rounded-md transition-all shadow-2xs cursor-pointer"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.27v3.13C3.26 21.3 7.31 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.63H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.37l4.01-3.13z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.63l4.01 3.13c.95-2.85 3.6-4.96 6.72-4.96z" />
                </svg>
                <span>Sign in with Google</span>
            </button>

            {/* Demo Credentials */}
            <DemoCredentials onSelect={onSelectDemo} />

            {/* Footer Register Link */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/web/register" className="font-semibold text-[#FF4A1F] hover:underline transition-colors">
                    Register
                </Link>
            </p>
        </>
    );
};
