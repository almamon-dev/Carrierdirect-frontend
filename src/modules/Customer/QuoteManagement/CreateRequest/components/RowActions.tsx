import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';
import Button from '@/components/ui/button';
import { CustomerQuoteRequestItem } from '../types';
import { RowActionsMenu } from './RowActionsMenu';

interface RowActionsProps {
    row: CustomerQuoteRequestItem;
    isRepeating: boolean;
    onRepeatRequest: (row: CustomerQuoteRequestItem) => void;
    onDeleteRequest: (row: CustomerQuoteRequestItem) => void;
}

export const RowActions: React.FC<RowActionsProps> = ({
    row,
    isRepeating,
    onRepeatRequest,
    onDeleteRequest,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 180)
            });
            setIsOpen(true);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(e.target as Node)
            ) {
                handleClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };

        const handleScroll = () => handleClose();

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen, handleClose]);

    return (
        <div className="relative flex items-center justify-end w-full">
            <Button 
                ref={triggerRef}
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center"
                onClick={handleToggle}
            >
                <MoreVertical size={15} />
            </Button>

            {isOpen && createPortal(
                <RowActionsMenu
                    dropdownRef={dropdownRef}
                    dropdownPos={dropdownPos}
                    row={row}
                    isRepeating={isRepeating}
                    onClose={handleClose}
                    onRepeatRequest={onRepeatRequest}
                    onDeleteRequest={onDeleteRequest}
                />,
                document.body
            )}
        </div>
    );
};
