import { create } from 'zustand';
import { toast } from '@/hooks/use-toast';

export type ToastType = 'success' | 'error' | 'info' | 'destructive';

interface ToastState {
  message: string | null;
  type: ToastType;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'success',
  showToast: (message: string, type: ToastType = 'success', _duration = 3500) => {
    set({ message, type });

    const variant = type === 'error' || type === 'destructive' 
      ? 'destructive' 
      : type === 'info' 
      ? 'info' 
      : 'success';

    const title = type === 'error' || type === 'destructive' 
      ? 'Error' 
      : type === 'info' 
      ? 'Info' 
      : 'Success';

    toast({
      title,
      description: message,
      variant,
    });
  },
  hideToast: () => set({ message: null }),
}));

export default useToastStore;
