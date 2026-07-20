// Theme basic settings
export const THEME_CONFIG = {
    // Key used to store theme preference in localStorage
    storageKey: 'erp_ui_theme',
    
    // Default theme if not set
    defaultTheme: 'light', // 'light' | 'dark' | 'system'
};

// Z-Index scale for the application to prevent overlapping issues
// Usage: z-index: Z_INDEX.modal
export const Z_INDEX = {
    base: 0,
    dropdown: 50,
    sticky: 100,
    header: 200,
    sidebar: 300,
    backdrop: 400,
    modal: 500,
    popover: 600,
    toast: 700,
    tooltip: 800,
};

// JavaScript Color constants (useful for Charts, Graphs, or Canvas elements)
// Note: UI components usually use Tailwind classes, but JS libraries (like Recharts) need hex codes
export const CHART_COLORS = {
    primary: '#008060',    // Brand primary
    success: '#008060',    // Green
    warning: '#e4a11b',    // Yellow/Orange
    danger: '#d82c0d',     // Red
    info: '#2c6ecb',       // Blue
    
    // Data series colors for charts
    series: [
        '#008060', '#2c6ecb', '#e4a11b', '#d82c0d', 
        '#5c6ac4', '#9c6ade', '#43467f', '#47c1bf'
    ],
};

// Breakpoints matching Tailwind config (useful for JS window resize hooks)
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};
