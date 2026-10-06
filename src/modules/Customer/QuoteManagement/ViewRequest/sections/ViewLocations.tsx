import { Clock, MapPin, Navigation, Plane } from "lucide-react";
import React from "react";
import { ViewField } from "../components/ViewField";

interface ViewLocationsProps {
    formData: any;
}

export const ViewLocations: React.FC<ViewLocationsProps> = ({ formData }) => {
    const hasDistance = Boolean(formData.estDistance && formData.estDistance !== "-");
    const hasDuration = Boolean(formData.estimatedDurationFormatted);
    const hasRoute = Boolean(formData.pickupCity || formData.deliveryCity);
    const isAir = Boolean(
        formData.isAirDistance ||
        (typeof formData.estDistance === 'string' && (formData.estDistance.includes('(Air)') || formData.estDistance.includes('✈')))
    );

    return (
        <div className="space-y-3.5 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                {/* Minimal Top Header with Route, Distance & Duration */}
                <div className="col-span-1 md:col-span-2 pb-3 mb-1 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                        <MapPin size={17} className="text-[#ff4a1f] shrink-0" />
                        <h2 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100">
                            Location Information
                        </h2>
                        {hasRoute && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
                                ({formData.pickupCity || "Origin"} → {formData.deliveryCity || "Destination"})
                            </span>
                        )}
                    </div>

                    {(hasDistance || hasDuration) && (
                        <div className="flex items-center gap-2 text-xs">
                            {hasDistance && (
                                <div
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] font-semibold border ${
                                        isAir
                                            ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/60'
                                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60'
                                    }`}
                                >
                                    {isAir ? <Plane size={12} className="text-sky-500" /> : <Navigation size={12} className="text-[#ff4a1f]" />}
                                    <span>{formData.estDistance}</span>
                                </div>
                            )}
                            {hasDuration && (
                                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-2.5 py-1 rounded-[3px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                    <Clock size={12} />
                                    <span>{formData.estimatedDurationFormatted}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pickup Info */}
                <div className="col-span-1 md:col-span-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-1">
                    <div className="flex items-center justify-between mb-2.5">
                        <h3 className="text-xs font-bold text-[#ff4a1f] tracking-wider flex items-center gap-1.5 select-none">
                            <MapPin size={14} /> Pickup Details
                        </h3>
                        
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                        <ViewField label="Company Name" value={formData.pickupCompany} />
                        <ViewField label="Contact Person" value={formData.pickupContactName} />
                        <ViewField label="Phone Number" value={formData.pickupPhone} isLink linkHref={`tel:${formData.pickupPhone}`} />
                        <ViewField label="Email" value={formData.pickupEmail} isLink linkHref={`mailto:${formData.pickupEmail}`} />
                        <ViewField label="Country" value={formData.pickupCountry} />
                        <ViewField label="State/Division" value={formData.pickupState} />
                        <ViewField label="City" value={formData.pickupCity} />
                        <ViewField label="ZIP Code" value={formData.pickupZip} />
                        <ViewField label="Pickup Address" colSpan value={formData.pickupAddress} />
                        <ViewField label="Pickup Instructions" colSpan value={<span className="whitespace-pre-wrap">{formData.pickupInstructions}</span>} />
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="col-span-1 md:col-span-2 pt-1">
                    <div className="flex items-center justify-between mb-2.5">
                        <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1.5 select-none">
                            <MapPin size={14} /> Delivery Details
                        </h3>
                        
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                        <ViewField label="Company Name" value={formData.deliveryCompany} />
                        <ViewField label="Contact Person" value={formData.deliveryContactName} />
                        <ViewField label="Phone Number" value={formData.deliveryPhone} isLink linkHref={`tel:${formData.deliveryPhone}`} />
                        <ViewField label="Email" value={formData.deliveryEmail} isLink linkHref={`mailto:${formData.deliveryEmail}`} />
                        <ViewField label="Country" value={formData.deliveryCountry} />
                        <ViewField label="State/Division" value={formData.deliveryState} />
                        <ViewField label="City" value={formData.deliveryCity} />
                        <ViewField label="ZIP Code" value={formData.deliveryZip} />
                        <ViewField label="Delivery Address" colSpan value={formData.deliveryAddress} />
                        <ViewField label="Delivery Instructions" colSpan value={<span className="whitespace-pre-wrap">{formData.deliveryInstructions}</span>} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewLocations;
