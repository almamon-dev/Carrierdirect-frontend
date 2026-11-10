export const isSubItemActive = (
    subPath: string,
    currentPath: string,
    currentHash?: string,
    locationState?: any,
    locationSearch?: string
) => {
    const fullPath = currentHash ? `${currentPath}${currentHash}` : currentPath;
    if (fullPath === subPath || currentPath === subPath) return true;

    if (subPath === '/supplier/wallet' || subPath === '/supplier/wallet/overview') {
        return currentPath === '/supplier/wallet' || currentPath === '/supplier/wallet/overview';
    }

    if (
        subPath === '/supplier/team/subcontractors' ||
        subPath === '/supplier/subcontractors' ||
        subPath === '/supplier/availability/subcontractors'
    ) {
        return (
            currentPath.startsWith('/supplier/team/subcontractors') ||
            currentPath.startsWith('/supplier/subcontractors') ||
            currentPath.startsWith('/supplier/availability/subcontractors')
        );
    }

    if (subPath === '/supplier/team') {
        if (
            currentPath.startsWith('/supplier/team/subcontractors') ||
            currentPath.startsWith('/supplier/subcontractors') ||
            currentPath.startsWith('/supplier/availability/subcontractors')
        ) {
            return false;
        }
        return currentPath === '/supplier/team' || currentPath.startsWith('/supplier/team');
    }

    const isFromMyQuotes =
        currentPath.startsWith('/supplier/quotes/my-quotes') ||
        locationState?.from === 'my-quotes' ||
        (locationSearch && locationSearch.includes('from=my-quotes'));

    if (isFromMyQuotes) {
        if (subPath === '/supplier/quotes/my-quotes') return true;
        if (subPath === '/supplier/quotes/requests') return false;
    }

    if (subPath !== '/' && (fullPath.startsWith(subPath) || currentPath.startsWith(subPath))) return true;

    if (subPath === '/supplier/orders/active-jobs') {
        if (
            currentPath.startsWith('/supplier/orders/details') ||
            currentPath.startsWith('/supplier/orders/track') ||
            currentPath.startsWith('/supplier/quotes/processing/track')
        ) {
            return true;
        }
    }

    if (subPath === '/supplier/quotes/requests') {
        if (currentPath.startsWith('/supplier/quotes/submit')) {
            return true;
        }
    }

    return false;
};
