import React from 'react';
import { FileText, Image as ImageIcon, Video } from 'lucide-react';

export default function AttachmentsList() {
    return (
        <div className="space-y-4 mt-1">
            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 transition-colors group-hover:bg-red-100">
                    <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">Contract_Agreement.pdf</p>
                    <p className="text-[11.5px] text-slate-500">PDF • 2.4 MB</p>
                </div>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 transition-colors group-hover:bg-blue-100">
                    <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">Inventory_List.csv</p>
                    <p className="text-[11.5px] text-slate-500">CSV • 145 KB</p>
                </div>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 transition-colors group-hover:bg-emerald-100">
                    <ImageIcon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">Warehouse_Photo.jpg</p>
                    <p className="text-[11.5px] text-slate-500">Image • 4.1 MB</p>
                </div>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 transition-colors group-hover:bg-purple-100">
                    <Video size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">Loading_Preview.mp4</p>
                    <p className="text-[11.5px] text-slate-500">Video • 12.8 MB</p>
                </div>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 transition-colors group-hover:bg-indigo-100">
                    <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">Terms_Conditions.doc</p>
                    <p className="text-[11.5px] text-slate-500">DOCX • 1.1 MB</p>
                </div>
            </div>
        </div>
    );
}
