import React from 'react';
import { Truck, Check, MapPin } from 'lucide-react';

export default function MapSection({ order, timeline }: { order: any, timeline: any[] }) {
    return (
        <div className="w-full h-[220px] bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center shadow-2xs font-sans">
            {/* Real Map Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <iframe 
                    src={`https://maps.google.com/maps?q=${order.from},Bangladesh&t=&z=8&ie=UTF8&iwloc=&output=embed`} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'opacity(0.65) grayscale(0.4)' }} 
                    loading="lazy" 
                ></iframe>
            </div>
            {/* Overlay to give it a custom tint */}
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[0.5px] z-0 pointer-events-none"></div>
            
            <div className="relative w-[92%] flex items-center justify-between z-10">
                {timeline.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="relative flex justify-center items-center">
                            {/* Label */}
                            <div className={`flex flex-col items-center absolute ${index % 2 === 0 ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
                                <div className={`px-2 py-0.5 rounded shadow-2xs border text-[10px] font-bold whitespace-nowrap ${
                                    step.active ? 'bg-[#ff4a1f] text-white border-orange-600' : 
                                    step.completed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white/90 text-slate-500 border-slate-200'
                                }`}>
                                    {step.status}
                                </div>
                            </div>
                            
                            {/* Dot */}
                            <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs z-10 ${
                                step.completed ? 'bg-emerald-500' : step.active ? 'bg-[#ff4a1f] ring-4 ring-orange-100' : 'bg-slate-300'
                            }`}></div>
                            
                            {/* Truck Icon on Active step */}
                            {step.active && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow-md border-2 border-[#ff4a1f] text-[#ff4a1f] z-20">
                                    <Truck size={14} />
                                </div>
                            )}
                        </div>

                        {/* Line connecting to next */}
                        {index < timeline.length - 1 && (
                            <div className={`flex-1 h-0 border-t-[2px] ${
                                step.completed && timeline[index + 1].completed 
                                    ? 'border-solid border-emerald-500' 
                                    : step.completed && (timeline[index + 1].active || !timeline[index + 1].completed)
                                        ? 'border-dashed border-orange-400'
                                        : 'border-dashed border-slate-300'
                            }`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
