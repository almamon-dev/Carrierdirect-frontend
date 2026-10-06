import React from "react";
import { FileText, Activity } from "lucide-react";
import Input from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import TimePicker from "@/components/ui/time-picker";
import Select from "@/components/ui/select";
import TabHeader from "@/components/ui/tab-header";
import { QuoteFormData } from "../../types/formTypes";
import { FormRow, SectionHeader } from "../FormHelpers";
import { useDropdownOptions } from "@/hooks/useDropdownOptions";

interface SectionProps {
    formData: QuoteFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: keyof QuoteFormData, value: string) => void;
    requestNumber?: string;
    getFieldError?: (field: string) => string | undefined;
    markTouched?: (field: string) => void;
}

export const BasicInfoSection: React.FC<SectionProps> = ({
    formData,
    handleChange,
    handleSelectChange,
    requestNumber,
    getFieldError = () => undefined,
    markTouched = () => {},
}) => {
    const { getOptions } = useDropdownOptions();

    const PRIORITY_OPTIONS = getOptions("priority", [
        { id: "Normal", name: "Normal" },
        { id: "High", name: "High" },
        { id: "Urgent", name: "Urgent" },
    ]);

    const SHIPMENT_OPTIONS = getOptions("shipment_type", [
        { id: "One Way", name: "One Way" },
        { id: "Round Trip", name: "Round Trip" },
    ]);

    const SERVICE_OPTIONS = getOptions("service_type", [
        { id: "Standard", name: "Standard (Ground / Road)" },
        { id: "Air Freight", name: "Air Freight (Air Cargo / Flight)" },
        { id: "Express", name: "Express" },
        { id: "Same Day", name: "Same Day" },
        { id: "Sea Freight", name: "Sea Freight (Ocean)" },
    ]);

    const todayStr = React.useMemo(() => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }, []);

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
                <TabHeader title="Basic Information" icon={FileText} />
                
                <FormRow label="Request Title" required colSpan error={getFieldError("requestTitle")}>
                    <Input
                        name="requestTitle"
                        value={formData.requestTitle}
                        onChange={handleChange}
                        onBlur={() => markTouched("requestTitle")}
                        error={getFieldError("requestTitle")}
                        placeholder="e.g. 5 Pallets Heavy Machinery Parts - Dhaka to Chittagong"
                    />
                </FormRow>
                
                <FormRow label="Request Number">
                    <Input value={requestNumber || "Auto-generated (REQ-NEW)"} disabled className="bg-slate-50 text-slate-500 font-semibold" />
                </FormRow>
                
                <FormRow label="Priority" required error={getFieldError("priority")}>
                    <Select 
                        name="priority" 
                        value={formData.priority} 
                        onChange={(e) => handleSelectChange("priority", e.target.value)} 
                        options={PRIORITY_OPTIONS}
                        showSearch={false} 
                    />
                </FormRow>
                
                <FormRow label="Shipment Type" required error={getFieldError("shipmentType")}>
                    <Select 
                        name="shipmentType" 
                        value={formData.shipmentType} 
                        onChange={(e) => handleSelectChange("shipmentType", e.target.value)} 
                        options={SHIPMENT_OPTIONS}
                        showSearch={false} 
                    />
                </FormRow>
                
                <FormRow label="Service Type" required error={getFieldError("serviceType")}>
                    <Select 
                        name="serviceType" 
                        value={formData.serviceType} 
                        onChange={(e) => handleSelectChange("serviceType", e.target.value)} 
                        options={SERVICE_OPTIONS}
                        showSearch={false} 
                    />
                </FormRow>
                
                <SectionHeader title="Schedule" icon={Activity} />
                
                <FormRow label="Pickup Date" required error={getFieldError("pickupDate")}>
                    <DatePicker
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        min={todayStr}
                        error={getFieldError("pickupDate")}
                        placeholder="YYYY-MM-DD"
                    />
                </FormRow>
                
                <FormRow label="Pickup Time" required error={getFieldError("pickupTime")}>
                    <TimePicker
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleChange}
                        error={getFieldError("pickupTime")}
                        placeholder="HH:MM AM/PM"
                    />
                </FormRow>
                
                <FormRow label="Delivery Date" required error={getFieldError("deliveryDate")}>
                    <DatePicker
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        min={formData.pickupDate || todayStr}
                        error={getFieldError("deliveryDate")}
                        placeholder="YYYY-MM-DD"
                    />
                </FormRow>
                
                <FormRow label="Delivery Time">
                    <TimePicker name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} placeholder="HH:MM AM/PM" />
                </FormRow>

                <FormRow label="Transit Time (Days)">
                    <Input type="text" inputMode="numeric" name="expectedTransitTime" value={formData.expectedTransitTime} onChange={handleChange} placeholder="e.g. 1" />
                </FormRow>
            </div>
        </div>
    );
};

export default BasicInfoSection;
