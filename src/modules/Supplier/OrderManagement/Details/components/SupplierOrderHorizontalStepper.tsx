import React from 'react';
import { Check } from 'lucide-react';

interface Props {
    timeline: any[];
}

export const SupplierOrderHorizontalStepper: React.FC<Props> = ({ timeline }) => {
    if (!timeline || timeline.length === 0) return null;

    // Use the 4 core steps matching the reference image: Assigned, Pickup, In Transit, Delivered
    const steps = timeline.slice(0, 4);

    // Calculate active step index to determine exact progress bar width
    let activeIdx = steps.findIndex((s) => s.active);
    if (activeIdx === -1) {
        // If delivered or none active, check if all completed
        const allCompleted = steps.every((s) => s.completed);
        activeIdx = allCompleted ? 3 : 0;
    }

    // Determine progress bar percentage between the first and last step
    // Step 0 active = ~14% (extends partway towards step 1, exactly matching the screenshot)
    // Step 1 active = ~45%
    // Step 2 active = ~78%
    // Step 3 active / completed = 100%
    const progressPercents = [14, 45, 78, 100];
    const currentProgress = progressPercents[activeIdx] ?? 14;

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs overflow-x-auto font-sans">
            <div className="min-w-[450px] relative px-6 py-1">
                {/* Background Full Track (Gray line) */}
                <div className="absolute top-[17px] left-[12%] right-[12%] h-[2px] bg-slate-200 dark:bg-slate-700 z-0" />

                {/* Active Progress Line (Orange line extending to current progress) */}
                <div
                    className="absolute top-[17px] left-[12%] h-[2px] bg-[#ff4a1f] z-0 transition-all duration-500 ease-out"
                    style={{ width: `${currentProgress * 0.76}%` }}
                />

                <div className="flex items-center justify-between relative z-10">
                    {steps.map((step, idx) => {
                        const isDone = step.completed && !step.active;
                        const isActive = step.active || (idx === 0 && !steps.some((s) => s.active));
                        const isOrange = isDone || isActive;

                        return (
                            <div key={step.id || idx} className="flex-1 flex flex-col items-center text-center">
                                {/* Step Circle Indicator */}
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all relative z-10 shrink-0 ${
                                        isOrange
                                            ? 'bg-[#ff4a1f] text-white shadow-2xs'
                                            : 'bg-white dark:bg-[#1e2329] border-[1.5px] border-slate-300 dark:border-slate-700 text-slate-500'
                                    }`}
                                >
                                    {isOrange ? <Check size={12} strokeWidth={3} /> : idx + 1}
                                </div>

                                {/* Step Label */}
                                <span
                                    className={`text-xs mt-2 font-bold leading-tight block text-center break-words px-1 ${
                                        isActive
                                            ? 'text-[#ff4a1f]'
                                            : isDone
                                            ? 'text-slate-800 dark:text-slate-200'
                                            : 'text-slate-500 dark:text-slate-400 font-medium'
                                    }`}
                                >
                                    {step.status || step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SupplierOrderHorizontalStepper;
