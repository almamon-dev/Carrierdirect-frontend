import React from 'react';
import { Link } from 'react-router-dom';
import DemoCredentials from './DemoCredentials';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

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

            {/* Google Sign-In (Zero-Reload SPA Popup) */}
            <GoogleAuthButton role="customer" label="Sign in with Google" />

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
