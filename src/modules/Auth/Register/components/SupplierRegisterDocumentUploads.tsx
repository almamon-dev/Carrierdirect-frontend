import React from 'react';
import { Eye } from 'lucide-react';
import Input from '../../../../components/ui/input';

interface SupplierRegisterDocumentUploadsProps {
    insuranceDocument: any;
    licenses: any;
    insuranceDocumentError?: string;
    licensesError?: string;
    onFileChange: (field: string, file: File) => void;
}

export const SupplierRegisterDocumentUploads: React.FC<SupplierRegisterDocumentUploadsProps> = ({
    insuranceDocument,
    licenses,
    insuranceDocumentError,
    licensesError,
    onFileChange
}) => {
    const getFileUrl = (doc: any) =>
        typeof doc === 'string' ? doc : URL.createObjectURL(doc as File);

    return (
        <>
            <div>
                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Insurance Document <span className="text-red-500">*</span>
                </label>
                <Input
                    type="file"
                    className="bg-white file:border-0 file:bg-[#F3F4F7] file:px-3 file:py-1 file:rounded-[3px] file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-[#E5E7EB] cursor-pointer pt-[6px]"
                    onChange={(e: any) => onFileChange('insuranceDocument', e.target.files[0])}
                    error={insuranceDocumentError}
                />
                {insuranceDocument && (
                    <a
                        href={getFileUrl(insuranceDocument)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-[#FF4A1F] hover:underline mt-1.5 inline-block font-medium flex items-center"
                    >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View selected document
                    </a>
                )}
            </div>

            <div>
                <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Licenses / Certifications
                </label>
                <Input
                    type="file"
                    className="bg-white file:border-0 file:bg-[#F3F4F7] file:px-3 file:py-1 file:rounded-[3px] file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-[#E5E7EB] cursor-pointer pt-[6px]"
                    onChange={(e: any) => onFileChange('licenses', e.target.files[0])}
                    error={licensesError}
                />
                {licenses && (
                    <a
                        href={getFileUrl(licenses)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-[#FF4A1F] hover:underline mt-1.5 inline-block font-medium flex items-center"
                    >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View selected document
                    </a>
                )}
            </div>
        </>
    );
};
