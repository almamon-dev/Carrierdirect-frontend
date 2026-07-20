export const APP_CONFIG = {
    name: 'ERP System',
    version: '1.0.0',
    description: 'Enterprise Resource Planning Application',
    defaultLanguage: 'en',
    currency: {
        code: 'USD',
        symbol: '$',
        position: 'left' // 'left' or 'right'
    },
    date: {
        format: 'YYYY-MM-DD',
        displayFormat: 'DD MMM YYYY',
        timeFormat: 'HH:mm',
    },
    pagination: {
        defaultPageSize: 10,
        pageSizes: [10, 20, 50, 100]
    },
    layout: {
        sidebarWidth: 260,
        sidebarCollapsedWidth: 80,


// Available languages supported by the application
export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'bn', name: 'Bengali' },
];
