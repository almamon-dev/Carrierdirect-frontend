import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Truck, Users, LayoutDashboard, Settings, FileText, ArrowRight, LogOut } from 'lucide-react';

export default function ModulesSelectorPage() {
    const navigate = useNavigate();

    const modules = [
        {
            title: "Supplier Portal",
            description: "Manage incoming quotes, active jobs, availability, and earnings.",
            icon: Truck,
            path: "/supplier/dashboard",
            color: "bg-orange-600",
            lightColor: "bg-orange-50",
            textColor: "text-orange-600",
            borderColor: "border-orange-100"
        },
        {
            title: "Customer Portal",
            description: "Request quotes, track orders, view invoices, and manage billing.",
            icon: Users,
            path: "/customer/dashboard",
            color: "bg-emerald-600",
            lightColor: "bg-emerald-50",
            textColor: "text-emerald-600",
            borderColor: "border-emerald-100"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl leading-none">E</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">Enterprise ERP</h1>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">System Modules</p>
                    </div>
                </div>
                <button onClick={() => navigate('/web/login')} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
                    <LogOut size={16} />
                    Logout
                </button>
            </header>

            <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Select System Module</h2>
                    <p className="text-slate-600 max-w-xl mx-auto">
                        Choose a module below to enter the respective dashboard. This portal is for testing and demonstration purposes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modules.map((mod, idx) => (
                        <Link 
                            key={idx}
                            to={mod.path}
                            className={`group relative bg-white rounded-2xl p-6 border ${mod.borderColor} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full`}
                        >
                            <div className={`w-14 h-14 ${mod.lightColor} ${mod.textColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <mod.icon size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{mod.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1">
                                {mod.description}
                            </p>
                            <div className={`flex items-center gap-2 text-sm font-semibold ${mod.textColor} mt-auto`}>
                                <span>Enter Portal</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
