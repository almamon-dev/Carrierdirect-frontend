import React from 'react';
import Skeleton from '@/components/ui/skeleton';
import { Column } from './dataTableTypes';

interface DataTableSkeletonBodyProps<T = any> {
  effectiveSkeletonCount: number;
  rowHeightClass: string;
  cellPaddingClass: string;
  showCheckbox: boolean;
  currentColumns: Column<T>[];
  visibleColumns: string[];
  actions?: (item: T) => React.ReactNode;
  actionsColumnClassName?: string;
}

export function DataTableSkeletonBody<T = any>({
  effectiveSkeletonCount,
  rowHeightClass,
  cellPaddingClass,
  showCheckbox,
  currentColumns,
  visibleColumns,
  actions,
  actionsColumnClassName,
}: DataTableSkeletonBodyProps<T>) {
  return (
    <>
      {Array.from({ length: effectiveSkeletonCount }).map((_, rIdx) => (
        <tr key={rIdx} className={rowHeightClass}>
          {showCheckbox && (
            <td className={`${cellPaddingClass} w-[36px] min-w-[36px] max-w-[36px] whitespace-nowrap`}>
              <div className="flex items-center justify-center">
                <Skeleton className="h-3.5 w-3.5 rounded-[2px]" />
              </div>
            </td>
          )}
          {currentColumns.map(col => {
            if (!visibleColumns.includes(col.id)) return null;

            if (col.skeleton) {
              return (
                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                  {col.skeleton()}
                </td>
              );
            }

            const colId = String(col?.id || '').toLowerCase();
            const colLabel = typeof col?.label === 'string' ? col.label.toLowerCase() : '';

            if (colId === 'id' || colId === 'code' || colLabel.includes('id') || colLabel.includes('code')) {
              return (
                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                  <div className="flex items-center min-h-[26px]">
                    <Skeleton className="h-3.5 w-16 rounded-[3px]" />
                  </div>
                </td>
              );
            }
            if (colId === 'status' || colLabel.includes('status')) {
              return (
                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                  <div className="flex items-center min-h-[26px]">
                    <Skeleton className="h-4 w-14 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
                  </div>
                </td>
              );
            }
            if (colId === 'customer' || colLabel.includes('customer') || colLabel.includes('user') || colLabel.includes('supplier')) {
              return (
                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                  <div className="flex items-center gap-2 min-h-[26px]">
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                    <Skeleton className="h-3.5 w-24 rounded-[3px]" />
                  </div>
                </td>
              );
            }
            if (colId === 'pickup' || (colLabel.includes('pickup') && colLabel.includes('address'))) {
              return (
                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                  <div className="flex items-center min-w-0 pr-1 min-h-[26px]">
                    <Skeleton className="h-3.5 w-28 max-w-full rounded-[3px]" />
                  </div>
                </td>
              );
            }
            if (colId === 'delivery' || (colLabel.includes('delivery') && colLabel.includes('address'))) {
              return (
                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                  <div className="flex items-center min-w-0 pr-1 min-h-[26px]">
                    <Skeleton className="h-3.5 w-28 max-w-full rounded-[3px]" />
                  </div>
                </td>
              );
            }
            if (colLabel.includes('address') || colLabel.includes('route')) {
              return (
                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                  <div className="flex items-center min-w-0 min-h-[26px]">
                    <Skeleton className="h-3.5 w-28 max-w-full rounded-[3px]" />
                  </div>
                </td>
              );
            }
            if (colId === 'vehicle' || colId === 'vehicletype' || colLabel.includes('vehicle')) {
              return (
                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                  <div className="flex items-center min-h-[26px]">
                    <Skeleton className="h-3.5 w-24 rounded-[3px]" />
                  </div>
                </td>
              );
            }
            if (colId === 'price' || colId === 'budget' || colId === 'amount' || colLabel.includes('price') || colLabel.includes('budget') || colLabel.includes('amount')) {
              return (
                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                  <div className="flex justify-end items-center min-h-[26px]">
                    <Skeleton className="h-3.5 w-16 rounded-[3px]" />
                  </div>
                </td>
              );
            }
            if (colId === 'date' || colId === 'requestdate' || colLabel.includes('date')) {
              return (
                <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                  <div className="flex justify-center items-center min-h-[26px]">
                    <Skeleton className="h-3.5 w-20 rounded-[3px]" />
                  </div>
                </td>
              );
            }

            const isCentered = col.className?.includes('text-center');
            const isRight = col.className?.includes('text-right');

            return (
              <td key={col.id} className={`${cellPaddingClass} ${col.className || ''}`}>
                <div className={`flex ${isCentered ? 'justify-center' : isRight ? 'justify-end' : 'items-center'} items-center min-h-[26px]`}>
                  <Skeleton className="h-3.5 w-20 rounded-[3px]" />
                </div>
              </td>
            );
          })}
          {actions && (
            <td className={`${cellPaddingClass} whitespace-nowrap text-right pr-3.5 sm:pr-4 ${actionsColumnClassName || 'w-[76px] min-w-[70px]'}`}>
              <div className="flex items-center justify-end gap-1.5 w-full min-h-[26px]">
                {actionsColumnClassName?.includes('220') || actionsColumnClassName?.includes('200') ? (
                  <>
                    <Skeleton className="h-7 w-14 rounded-[5px]" />
                    <Skeleton className="h-7 w-16 rounded-[5px]" />
                    <Skeleton className="h-7 w-7 rounded-[5px]" />
                  </>
                ) : actionsColumnClassName?.includes('180') || actionsColumnClassName?.includes('175') || actionsColumnClassName?.includes('170') || actionsColumnClassName?.includes('165') || actionsColumnClassName?.includes('160') || actionsColumnClassName?.includes('145') || actionsColumnClassName?.includes('140') || actionsColumnClassName?.includes('130') || actionsColumnClassName?.includes('125') || actionsColumnClassName?.includes('115') || actionsColumnClassName?.includes('120') || actionsColumnClassName?.includes('100') ? (
                  <>
                    <Skeleton className="h-7 w-20 rounded-[5px]" />
                    <Skeleton className="h-7 w-7 rounded-[5px]" />
                  </>
                ) : (
                  <Skeleton className="h-7 w-7 rounded-[5px]" />
                )}
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
}
