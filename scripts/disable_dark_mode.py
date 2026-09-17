#!/usr/bin/env python3
"""
Script to permanently disable Dark Mode across the CarrierDirect Frontend:
1. Updates useThemeStore.ts to always enforce light mode (isDark = false, remove 'dark' class, clear theme localStorage).
2. Updates ThemeSwitcher to render null.
3. Cleans Theme Mode row and icon from SupplierLayout, CustomerLayout, DriverLayout profile menus.
4. Removes ThemeSwitcher from LandingPages Header.
"""

import os
import re

ROOT_DIR = "/home/mamon/React/Carrierdirect-frontend/src"

def update_theme_store():
    store_path = os.path.join(ROOT_DIR, "stores/useThemeStore.ts")
    content = """import { create } from 'zustand';

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
"""
    with open(store_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated: src/stores/useThemeStore.ts (Dark mode permanently disabled)")

def update_theme_switcher():
    switcher_path = os.path.join(ROOT_DIR, "components/common/theme-switcher/index.tsx")
    content = """import React from 'react';

export interface ThemeSwitcherProps {
    className?: string;
    showText?: boolean;
    variant?: 'default' | 'hero';
    size?: 'sm' | 'default' | 'lg';
}

export default function ThemeSwitcher(_props: ThemeSwitcherProps) {
    return null;
}
"""
    with open(switcher_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated: src/components/common/theme-switcher/index.tsx (ThemeSwitcher set to null)")

def clean_layouts():
    layouts = [
        os.path.join(ROOT_DIR, "layouts/SupplierLayout/index.tsx"),
        os.path.join(ROOT_DIR, "layouts/CustomerLayout/index.tsx"),
        os.path.join(ROOT_DIR, "layouts/DriverLayout/index.tsx"),
    ]

    for path in layouts:
        if not os.path.exists(path):
            continue
        with open(path, "r", encoding="utf-8") as f:
            code = f.read()

        # Remove the Theme Switcher Row block
        code = re.sub(
            r'\{\/\* Theme Switcher Row \*\/\}[\s\S]*?<ThemeSwitcher\s*\/?>\s*<\/div>\s*(?:<div className="border-t[^"]*?"\s*\/?>)?',
            '',
            code
        )

        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        print(f"Cleaned Theme Mode row from: {os.path.basename(os.path.dirname(path))}")

def clean_landing_header():
    header_path = os.path.join(ROOT_DIR, "modules/LandingPages/components/Header.tsx")
    if os.path.exists(header_path):
        with open(header_path, "r", encoding="utf-8") as f:
            code = f.read()

        code = re.sub(r'<ThemeSwitcher\s+variant=\{[^}]+\}\s*\/>\s*', '', code)
        code = re.sub(r'<ThemeSwitcher\s*\/>\s*', '', code)

        with open(header_path, "w", encoding="utf-8") as f:
            f.write(code)
        print("Cleaned ThemeSwitcher from: src/modules/LandingPages/components/Header.tsx")

def main():
    print("=== Permanently Disabling Dark Mode ===")
    update_theme_store()
    update_theme_switcher()
    clean_layouts()
    clean_landing_header()
    print("=== Finished Successfully ===")

if __name__ == "__main__":
    main()
