import { FileText, Truck, User as UserIcon } from "lucide-react";

export const EXPERIENCE_OPTIONS = [
    { value: "Less than 1 year", label: "Less than 1 year" },
    { value: "1-2 years", label: "1-2 years" },
    { value: "3-5 years", label: "3-5 years" },
    { value: "5-10 years", label: "5-10 years" },
    { value: "10+ years", label: "10+ years" },
];

export const LICENSE_CLASS_OPTIONS = [
    { value: "Class A CDL", label: "Class A CDL" },
    { value: "Class B CDL", label: "Class B CDL" },
    { value: "Class C CDL", label: "Class C CDL" },
    { value: "Standard Commercial License", label: "Standard Commercial License" },
];

export const COMPLIANCE_STEPS = [
    {
        number: 1,
        title: "Personal Info",
        subtitle: "Personal information & contact",
        icon: UserIcon,
    },
    {
        number: 2,
        title: "Driver Details",
        subtitle: "Experience & license class",
        icon: Truck,
    },
    {
        number: 3,
        title: "Documents & Submit",
        subtitle: "Upload clear verification docs",
        icon: FileText,
    },
];

export const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
