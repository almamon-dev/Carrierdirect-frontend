import React from 'react';
import { RotateCcw } from 'lucide-react';
import Button from '@/components/ui/button';

interface CreateRequestHeaderProps {
  isRepeatMode: boolean;
  repeatSource?: string;
  onReset: () => void;
}

export const CreateRequestHeader: React.FC<CreateRequestHeaderProps> = ({
  isRepeatMode,
  repeatSource,
  onReset,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
          {isRepeatMode ? `Repeat Quote Request (${repeatSource})` : 'Create New Quote Request'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Fill in all specifications to receive competitive bids from verified carriers.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-[34px] text-[12px] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer font-medium"
          onClick={onReset}
        >
          <RotateCcw size={14} />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CreateRequestHeader;
