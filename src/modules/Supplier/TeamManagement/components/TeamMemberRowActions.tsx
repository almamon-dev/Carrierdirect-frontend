import React, { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import Button from '@/components/ui/button';
import { TeamMember } from '../types/team.types';
import { TeamMemberActionsMenu } from './TeamMemberActionsMenu';

interface TeamMemberRowActionsProps {
    row: TeamMember;
    onViewProfile: (row: TeamMember) => void;
    onDelete?: (row: TeamMember) => void;
    onBlock?: (row: TeamMember) => void;
    onUnblock?: (row: TeamMember) => void;
    onResendInvite?: (row: TeamMember) => void;
}

export const TeamMemberRowActions: React.FC<TeamMemberRowActionsProps> = ({
    row,
    onDelete,
    onBlock,
    onUnblock,
    onResendInvite,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 192)
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        const handleScroll = () => {
            handleClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    return (
        <div className="relative flex items-center justify-end w-full">
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center"
                onClick={handleToggle}
            >
                <MoreVertical size={15} />
            </Button>

            <TeamMemberActionsMenu
                isOpen={isOpen}
                row={row}
                dropdownPos={dropdownPos}
                onClose={handleClose}
                onDelete={onDelete}
                onBlock={onBlock}
                onUnblock={onUnblock}
                onResendInvite={onResendInvite}
            />
        </div>
    );
};

export default TeamMemberRowActions;
