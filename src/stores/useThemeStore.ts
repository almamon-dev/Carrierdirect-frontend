import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const STORAGE_KEY = 'carrierdirect_theme';

const getInitialTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved !== null) {
    return saved === 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useThemeStore = create<ThemeState>((set) => {
  const initialIsDark = getInitialTheme();

  if (typeof window !== 'undefined') {
    if (initialIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return {
    isDark: initialIsDark,
    toggleTheme: () =>
      set((state) => {
        const nextIsDark = !state.isDark;
        if (typeof window !== 'undefined') {
          if (nextIsDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          localStorage.setItem(STORAGE_KEY, nextIsDark ? 'dark' : 'light');
        }
        return { isDark: nextIsDark };
      }),
    setTheme: (isDark: boolean) => {
      if (typeof window !== 'undefined') {
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
      }
      set({ isDark });
    },
  };
});
