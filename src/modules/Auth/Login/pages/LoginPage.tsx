import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Login attempt with:', { username, password });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Navigate to Global Admin Dashboard / Modules Selector
      navigate('/modules');
    } catch (error) {
      console.error('Login error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50/50">
      <div className="w-full max-w-md mx-4">
        {/* Logo / Branding Placeholder */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#e4f1ef] mb-4">
            <svg className="w-6 h-6 text-[#008060]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">ERP System</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-10 text-sm"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 block">
                    Password
                  </label>
                  <a href="#" className="text-xs text-[#008060] hover:underline font-medium">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-10 text-sm"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
                className="h-10 text-sm"
              >
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
