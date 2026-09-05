import {
    AllowedValuesOptions,
    defaultVehicles,
    defaultLoads,
    defaultServices,
    defaultPriorities
} from './allowedValuesDefaults';
import { renderAllowedValuesHtml } from './allowedValuesHtml';

export * from './allowedValuesDefaults';
export * from './allowedValuesHtml';

/**
 * Freight Import Allowed Values Guide Window Generator
 */
export const openAllowedValuesGuideWindow = (options?: AllowedValuesOptions) => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
        alert('Popup blocked! Please allow popups for this site to view the specification.');
        return;
    }

    const vehicles = (options?.dynamicVehicleTypes && options.dynamicVehicleTypes.length > 0) ? options.dynamicVehicleTypes : defaultVehicles;
    const loads = (options?.dynamicLoadTypes && options.dynamicLoadTypes.length > 0) ? options.dynamicLoadTypes : defaultLoads;
    const services = (options?.dynamicServiceTypes && options.dynamicServiceTypes.length > 0) ? options.dynamicServiceTypes : defaultServices;
    const priorities = (options?.dynamicPriorityTypes && options.dynamicPriorityTypes.length > 0) ? options.dynamicPriorityTypes : defaultPriorities;

    const vehicleBadges = vehicles.map(v => `<span class="badge">${v.name || v.id}</span>`).join(' ');
    const loadBadges = loads.map(l => `<span class="badge">${l.name || l.id}</span>`).join(' ');
    const serviceBadges = services.map(s => `<span class="badge">${s.name || s.id}</span>`).join(' ');
    const priorityBadges = priorities.map(p => `<span class="badge">${p.name || p.id}</span>`).join(' ');

    newWindow.document.write(renderAllowedValuesHtml(vehicleBadges, loadBadges, serviceBadges, priorityBadges));
    newWindow.document.close();
};
