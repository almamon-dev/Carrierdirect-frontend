import React from 'react';
import { Link } from 'react-router-dom';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

export const CustomerRegisterSocialFooter: React.FC = () => {
    return (
        <>
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6">
                    <GoogleAuthButton
                        role="customer"
                        label="Sign up with Google"
                        className="h-[42px] text-[14px] font-bold border-gray-300 shadow-sm"
                    />
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/web/login" className="font-semibold text-[#FF4A1F] hover:text-[#D13915] transition-colors">
                    Log In
                </Link>
            </p>
        </>
    );
};
