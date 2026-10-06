import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const STORAGE_KEY = 'carrierdirect_theme';

export const useThemeStore = create<ThemeState>(() => {
  if (typeof window !== 'undefined') {
    document.documentElement.classList.remove('dark');
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, 'light');
    } catch {
      // Ignore localStorage errors
    }
  }

  return {
    isDark: false,
    toggleTheme: () => {
      if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: () => {
      if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('dark');
      }
    },
  };
});
