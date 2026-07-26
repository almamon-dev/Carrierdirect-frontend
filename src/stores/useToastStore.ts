import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string | null;
  type: ToastType;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'success',
  showToast: (message: string, type: ToastType = 'success', duration = 3500) => {
    set({ message, type });
    setTimeout(() => {
      set(state => (state.message === message ? { message: null } : state));
    }, duration);
  },
  hideToast: () => set({ message: null }),
}));

export default useToastStore;
