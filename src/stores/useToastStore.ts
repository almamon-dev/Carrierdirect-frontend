import { toast } from '@/hooks/use-toast';
import React from 'react';
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'destructive';

interface ToastState {
  message: React.ReactNode | null;
  type: ToastType;
  showToast: (
    message: React.ReactNode,
    type?: ToastType,
    duration?: number,
    title?: string,
    action?: any
  ) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'success',
  showToast: (
    message: React.ReactNode,
    type: ToastType = 'success',
    _duration = 6000,
    title?: string,
    action?: any
  ) => {
    set({ message, type });

    const variant =
      type === 'error' || type === 'destructive'
        ? 'destructive'
        : type === 'info'
          ? 'info'
          : 'success';

    let description: React.ReactNode = message;

    if (typeof message === 'string' && message.toLowerCase().includes('link and authorize')) {
      description = React.createElement(
        'div',
        { className: 'space-y-1.5 font-sans' },
        React.createElement('p', { className: 'text-xs leading-normal' }, message),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              import('@/routes/appRouter').then(({ router }) => {
                router.navigate('/customer/settings?tab=payment');
              });
            },
            className: 'inline-flex items-center gap-1 font-bold text-[#ff4a1f] dark:text-orange-400 hover:underline text-xs cursor-pointer mt-1 bg-transparent border-none p-0',
          },
          'Link Card Now'
        )
      );
    }

    toast({
      title:
        title ||
        (typeof message === 'string' && message.toLowerCase().includes('link and authorize')
          ? 'Payment Card Required'
          : undefined),
      description,
      variant,
      action,
      duration: _duration,
    });
  },
  hideToast: () => set({ message: null }),
}));

export default useToastStore;
