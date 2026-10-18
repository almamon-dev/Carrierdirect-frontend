import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Package } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import { getCustomerColumns } from '@/modules/Customer/QuoteManagement/CreateRequest/components/columns';
import { RowActions } from '@/modules/Customer/QuoteManagement/CreateRequest/components/RowActions';
import { mapCustomerQuoteRequestItems } from '@/modules/Customer/QuoteManagement/CreateRequest/utils/customerQuoteRequestMapper';

interface LiveActiveShipmentsTableProps {
  loading: boolean;
  requests?: any[];
  shipments?: any[];
  quoteRequests?: any[];
  onTrack?: (data: { isOpen: boolean; destination: string }) => void;
}

export const LiveActiveShipmentsTable: React.FC<LiveActiveShipmentsTableProps> = ({
  loading,
  requests,
  shipments,
  quoteRequests,
}) => {
  const navigate = useNavigate();
  const rawList = requests || quoteRequests || shipments || [];

  const columns = useMemo(() => getCustomerColumns(navigate), [navigate]);

  const mappedData = useMemo(() => {
    if (!Array.isArray(rawList)) return [];
    const mapped = mapCustomerQuoteRequestItems(rawList, []);
    return mapped.slice(0, 6);
  }, [rawList]);

  const emptyState = (
    <div className="p-8 text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
        <Package size={22} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No quote requests found</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          When you submit freight quote requests, they will appear here.
        </p>
      </div>
      <Link
        to="/customer/quotes/create/new"
        className="inline-block text-xs font-bold text-white bg-[#ff4a1f] px-3.5 py-1.5 rounded-[3px] shadow-xs hover:bg-[#e03d15] transition-colors"
      >
        Create a Quote Request
      </Link>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#12161c] rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
      <div className="flex items-center justify-between px-3.5 sm:px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181a20]/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100/70 dark:bg-[#ff4a1f]/15 text-brand flex items-center justify-center shrink-0">
            <FileText size={15} strokeWidth={2.5} />
          </div>
          <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">
            Quote Requests ({rawList.length})
          </h3>
        </div>
        <Link
          to="/customer/quotes/create"
          className="text-[11px] sm:text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors"
        >
          See All
        </Link>
      </div>

      <div className="[&_.border]:border-0 [&_.rounded-\\[3px\\]]:rounded-none">
        <DataTable
          data={mappedData}
          columns={columns}
          actions={(row) => (
            <RowActions
              row={row}
              isRepeating={false}
              onRepeatRequest={(r) => navigate(`/customer/quotes/create/new?repeat=${r.rawId || r.id}`)}
              onDeleteRequest={() => navigate('/customer/quotes/create')}
            />
          )}
          actionsColumnClassName="w-[76px] min-w-[70px] text-right pr-3.5 sm:pr-4"
          compact={true}
          selectable={false}
          hideCheckbox={true}
          hideToolbar={true}
          hideViewToggle={true}
          hidePagination={true}
          isLoading={loading}
          skeletonCount={6}
          keyExtractor={(item) => item.id}
          syncUrlParams={false}
          emptyState={emptyState}
        />
      </div>
    </div>
  );
};

export default LiveActiveShipmentsTable;
