import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingModal from '@/components/modals/rating-modal';
import { openInvoicePreview } from '@/utils/exportInvoicePdf';
import InvoiceViewHeader from './components/InvoiceViewHeader';
import InvoicePaperDetails from './components/InvoicePaperDetails';
import InvoiceItemsAndTotals from './components/InvoiceItemsAndTotals';

interface InvoiceViewProps {
  onBack?: () => void;
  invoice?: any;
  onDownload?: (inv: any) => void;
}

export default function InvoiceView({ onBack, invoice, onDownload }: InvoiceViewProps) {
  const navigate = useNavigate();
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  const invoiceData = invoice || {
    id: 'INV-2026-003',
    invoice_number: 'INV-2026-003',
    order_number: 'ORD-0007',
    date: '2026-07-18',
    dueDate: '2026-07-30',
    amount: '€ 2,136.70',
    total_amount_formatted: '€ 2,136.70',
    status: 'Paid',
    supplier: 'Express Freight Logistics',
    supplier_name: 'Express Freight Logistics',
    customer_company: 'Walton Group Logistics BD',
    customer_name: 'Rahim Uddin',
    customer_address: 'Plot-1088, Block-I, Bashundhara R/A, Dhaka',
    route: 'Dhaka EPZ ➔ Chittagong Port',
  };

  const rawStatus = (invoiceData.status || invoiceData.payment_status || 'Paid').toLowerCase();
  const isPaid = rawStatus === 'paid' || rawStatus === 'cleared' || rawStatus === 'completed';
  const isDue = rawStatus === 'due' || rawStatus === 'overdue' || rawStatus === 'pending';
  const isOverdue = rawStatus === 'overdue';
  const isPayLater = invoiceData.is_pay_later || invoiceData.invoice_type === 'pay_later';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleExport = () => {
    if (onDownload) {
      onDownload(invoiceData);
    } else {
      openInvoicePreview(invoiceData);
    }
  };

  const displayInvId =
    invoiceData.invoice_number || invoiceData.invoice_id || invoiceData.id || 'INV-0001';
  const displayOrderId =
    invoiceData.order_number || invoiceData.order_id || (invoiceData.id ? `ORD-${invoiceData.id}` : 'ORD-0001');

  return (
    <div className="p-3 md:p-6 w-full mx-auto min-h-screen bg-slate-50/60 dark:bg-[#12161c] flex flex-col items-center font-sans antialiased pb-16">
      <InvoiceViewHeader
        isPaid={isPaid}
        onBack={handleBack}
        onRateSupplier={() => setIsRatingOpen(true)}
        onExport={handleExport}
      />

      <div className="w-full max-w-2xl bg-white dark:bg-[#1b2027] shadow-xs rounded-lg border border-slate-200 dark:border-slate-800 p-5 md:p-6 space-y-4">
        <InvoicePaperDetails
          invoiceData={invoiceData}
          isPaid={isPaid}
          isDue={isDue}
          isOverdue={isOverdue}
          isPayLater={isPayLater}
          displayInvId={displayInvId}
          displayOrderId={displayOrderId}
        />

        <InvoiceItemsAndTotals invoiceData={invoiceData} />
      </div>

      {isPaid && (
        <RatingModal
          isOpen={isRatingOpen}
          onClose={() => setIsRatingOpen(false)}
          orderId={invoiceData.id}
          targetName={invoiceData.supplier_name || invoiceData.supplier || 'Express Freight Logistics'}
          targetRole="Supplier"
          orderTitle="Priority Freight Logistics Dispatch"
          onSubmit={(data) => console.log('Invoice rating submitted:', data)}
        />
      )}
    </div>
  );
}
