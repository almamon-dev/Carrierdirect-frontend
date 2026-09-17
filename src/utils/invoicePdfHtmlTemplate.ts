export interface InvoiceExportData {
    id?: string | number;
    invoice_number?: string;
    invoice_id?: string;
    order_id?: string | number;
    order_number?: string;
    date?: string;
    created_at?: string;
    issue_date?: string;
    due_date?: string;
    dueDate?: string;
    status?: string;
    raw_status?: string;
    status_raw?: string;
    payment_status?: string;
    payment_method?: string;

    // Customer
    customer_name?: string;
    customer_company?: string;
    customer_email?: string;
    customer_phone?: string;
    customer_address?: string;
    customer?: string | {
        name?: string;
        company_name?: string;
        email?: string;
        phone?: string;
        phone_number?: string;
        address?: string;
        city?: string;
        country?: string;
    };

    // Supplier / Carrier
    supplier_name?: string;
    carrier_name?: string;
    carrier?: string;
    supplier_id?: string | number;
    supplier_email?: string;
    supplier?: string | {
        id?: string | number;
        name?: string;
        company_name?: string;
        email?: string;
        phone?: string;
    };

    // Shipment & Route
    route?: string;
    pickup_address?: string;
    pickup_city?: string;
    delivery_address?: string;
    delivery_city?: string;
    vehicle?: string;
    vehicle_type?: string;

    // Financials
    amount?: string | number;
    total_amount?: string | number;
    total_amount_formatted?: string;
    gross_amount?: string | number;
    gross_amount_formatted?: string;
    subtotal?: string | number;
    subtotal_formatted?: string;
    platform_fee?: string | number;
    platform_fee_formatted?: string;
    supplier_amount?: string | number;
    supplier_amount_formatted?: string;

    // Items
    items?: Array<{
        id?: string | number;
        sku?: string;
        item_type?: string;
        description?: string;
        desc?: string;
        quantity?: number;
        qty?: number;
        length?: number;
        width?: number;
        height?: number;
        weight?: number;
        rate?: string | number;
        unit_price?: string | number;
        amount?: string | number;
    }>;
}

export const generateInvoicePdfHtml = (data: InvoiceExportData): string => {
    const rawInvId = data.invoice_number || data.invoice_id || (data.id ? `INV-${String(data.id).padStart(6, '0')}` : 'INV-003058');
    const rawOrderId = data.order_number || data.order_id || (data.id ? `#ORD-${String(data.id).padStart(4, '0')}` : '#ORD-13003');
    const displayInvId = String(rawInvId).startsWith('INV-') ? rawInvId : `INV-${rawInvId}`;
    const displayOrderId = String(rawOrderId).startsWith('#') ? rawOrderId : `#${rawOrderId}`;

    const printDate = new Date().toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    });

    const issueDate = data.issue_date || data.date || printDate;

    // Financial calculations
    const parseAmount = (val: any): number => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        const cleaned = String(val).replace(/[^0-9.-]+/g, '');
        return parseFloat(cleaned) || 0;
    };

    let total = parseAmount(data.total_amount || data.gross_amount || data.amount);
    let subtotal = parseAmount(data.subtotal || data.supplier_amount);
    let fee = parseAmount(data.platform_fee);

    if (total <= 0 && subtotal > 0) {
        fee = fee > 0 ? fee : Math.round(subtotal * 0.05 * 100) / 100;
        total = subtotal + fee;
    } else if (subtotal <= 0 && total > 0) {
        subtotal = Math.round((total / 1.05) * 100) / 100;
        fee = Math.round((total - subtotal) * 100) / 100;
    } else if (total <= 0 && subtotal <= 0) {
        total = 0;
        subtotal = 0;
        fee = 0;
    }

    const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const statusStr = (data.status_raw || data.payment_status || data.raw_status || data.status || 'QUOTE').toUpperCase();

    // Customer info
    const customerObj = typeof data.customer === 'object' && data.customer !== null ? data.customer : undefined;
    const customerStr = typeof data.customer === 'string' ? data.customer : undefined;

    const customerName = (data.customer_name || customerObj?.name || customerStr || 'LUCA').toUpperCase();
    const customerCompany = data.customer_company || customerObj?.company_name || 'N/A';
    const customerAddress = data.customer_address || customerObj?.address || data.pickup_address || 'N/A, VAUGHN';
    const deliveryAddress = data.delivery_address || customerAddress;
    const customerEmail = data.customer_email || customerObj?.email || 'N/A';
    const customerPhone = data.customer_phone || customerObj?.phone || customerObj?.phone_number || '647-529-7097';
    const city = (data.pickup_city || 'VAUGHN').toUpperCase();
    const method = data.vehicle || data.vehicle_type || 'Delivery';

    // Line items
    const items = (data.items && data.items.length > 0) ? data.items : [
        {
            sku: 'PP19611',
            description: `${(method || '2024 CHEVROLET SILVERADO 3500 FREIGHT LOGISTICS DELIVERY').toUpperCase()}`,
            qty: 1,
            unit_price: fmt(subtotal),
            amount: fmt(subtotal)
        }
    ];

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CarrierDirect_Invoice_${displayInvId}</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        @page {
            size: A4 portrait;
            margin: 15mm 18mm;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #000000;
            background: #ffffff;
            font-size: 11px;
            line-height: 1.35;
            padding: 24px 30px;
            max-width: 820px;
            margin: 0 auto;
        }
        
        /* Interactive Print Button */
        .print-toolbar {
            position: fixed;
            top: 16px;
            right: 20px;
            z-index: 9999;
            display: flex;
            gap: 10px;
        }
        .btn-print {
            background: #ff4a1f;
            color: #ffffff;
            border: none;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 700;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 74, 31, 0.25);
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .btn-print:hover {
            background: #e03e15;
        }
        @media print {
            .print-toolbar {
                display: none !important;
            }
            body {
                padding: 0 !important;
                max-width: 100% !important;
            }
        }

        /* Top Section Grid */
        .top-grid {
            display: grid;
            grid-template-columns: 1.1fr 1.2fr 1.1fr;
            gap: 16px;
            margin-bottom: 14px;
            align-items: start;
        }

        .brand-logo-area {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        .logo-text-styled {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: -0.5px;
            color: #000000;
            line-height: 1;
        }
        .logo-text-styled span {
            color: #ff4a1f;
        }
        .slogan-banner {
            background: #000000;
            color: #ffffff;
            font-size: 9px;
            font-weight: 700;
            padding: 3.5px 8px;
            text-align: center;
            width: 100%;
            margin-top: 5px;
            letter-spacing: 0.3px;
        }
        .slogan-sub {
            font-size: 8.5px;
            color: #555555;
            text-align: center;
            width: 100%;
            margin-top: 2px;
        }

        .company-contacts {
            font-size: 10px;
            color: #222222;
            line-height: 1.4;
            padding-left: 5px;
        }
        .company-title {
            font-size: 14px;
            font-weight: 900;
            color: #000000;
            letter-spacing: 0.3px;
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .contact-row {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 2px;
        }
        .contact-icon {
            color: #ff4a1f;
            font-weight: bold;
            font-size: 11px;
        }

        .meta-box-wrap {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            border: 1.5px solid #000000;
        }
        .meta-table td {
            border: 1px solid #000000;
            padding: 3px 6px;
            font-size: 10px;
        }
        .meta-lbl {
            background: #f1f5f9;
            font-weight: 700;
            text-align: center;
            width: 50%;
        }
        .meta-val {
            font-weight: 700;
            text-align: center;
            width: 50%;
        }
        .meta-val-red {
            color: #ff4a1f;
            font-weight: 700;
            text-align: center;
        }

        .barcode-area {
            margin-top: 6px;
            width: 100%;
            text-align: center;
        }
        .barcode-lines {
            font-family: 'Courier New', Courier, monospace;
            font-size: 22px;
            font-weight: 900;
            letter-spacing: 1px;
            line-height: 0.9;
        }

        /* 2 Column Box (Bill To & Ship To) */
        .section-box {
            border: 1.5px solid #000000;
            margin-bottom: 8px;
        }
        .section-box-header {
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: #f1f5f9;
            border-bottom: 1.5px solid #000000;
            font-weight: 700;
            text-align: center;
            font-size: 10.5px;
        }
        .section-box-header div {
            padding: 4px;
        }
        .section-box-header div:first-child {
            border-right: 1.5px solid #000000;
        }
        .section-box-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            font-size: 9.5px;
            line-height: 1.45;
        }
        .section-col {
            padding: 6px 10px;
        }
        .section-col:first-child {
            border-right: 1.5px solid #000000;
        }
        .field-row {
            display: flex;
            margin-bottom: 1px;
        }
        .field-lbl {
            width: 75px;
            font-weight: 700;
            color: #000000;
        }
        .field-val {
            color: #111111;
        }
        .field-val.bold {
            font-weight: 700;
        }

        /* Mid Summary Method, City, Status Table */
        .mid-table {
            width: 100%;
            border-collapse: collapse;
            border: 1.5px solid #000000;
            margin-bottom: 8px;
        }
        .mid-table th {
            background: #f1f5f9;
            border: 1px solid #000000;
            padding: 4px;
            font-weight: 700;
            font-size: 10px;
            text-align: center;
        }
        .mid-table td {
            border: 1px solid #000000;
            padding: 5px 8px;
            font-size: 10px;
            font-weight: 700;
            text-align: center;
        }

        /* Items Table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            border: 1.5px solid #000000;
            margin-bottom: 0px;
        }
        thead th {
            background: #f1f5f9;
            border: 1px solid #000000;
            padding: 4px 8px;
            font-size: 9.5px;
            font-weight: 700;
            text-align: left;
        }
        tbody td {
            border: 1px solid #000000;
            padding: 6px 8px;
            font-size: 10px;
        }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: 700; }

        /* Totals Box */
        .bottom-wrap {
            display: flex;
            justify-content: flex-end;
            margin-top: -1.5px;
        }
        .totals-table {
            width: 250px;
            border-collapse: collapse;
            border: 1.5px solid #000000;
            border-top: none;
        }
        .totals-table td {
            padding: 3px 8px;
            font-size: 10px;
            font-weight: 700;
        }
        .totals-row-dashed td {
            border-top: 1px dashed #000000;
        }
        .totals-grand-row {
            border-top: 1.5px solid #000000;
        }
        .grand-lbl {
            background: #f1f5f9;
            border-right: 1.5px solid #000000;
            font-size: 11.5px;
            font-weight: 900;
            padding: 6px 8px !important;
            width: 45%;
        }
        .grand-val {
            font-size: 14px;
            font-weight: 900;
            text-align: right;
            padding: 6px 8px !important;
            width: 55%;
        }
    </style>
</head>
<body>
    <div class="print-toolbar">
        <button class="btn-print" onclick="window.print()">
            <span>🖨️ Save as PDF / Print</span>
        </button>
    </div>

    <!-- 1. Top Section -->
    <div class="top-grid">
        <div class="brand-logo-area">
            <div class="logo-text-styled">CARRIER<span>DIRECT</span></div>
            <div class="slogan-banner">Quality Supply, Trusted Service</div>
            <div class="slogan-sub">Freight Logistics &amp; Carrier Network</div>
        </div>

        <div class="company-contacts">
            <div class="company-title">CARRIERDIRECT</div>
            <div class="contact-row"><span class="contact-icon">📍</span> 123 Logistics Avenue, Industrial Park</div>
            <div class="contact-row"><span class="contact-icon">📞</span> +880 1711-000000 / 800-790-4469</div>
            <div class="contact-row"><span class="contact-icon">✉</span> billing@carrierdirect.com</div>
            <div class="contact-row"><span class="contact-icon">🌐</span> www.carrierdirect.com</div>
        </div>

        <div class="meta-box-wrap">
            <table class="meta-table">
                <tr>
                    <td class="meta-lbl">Date</td>
                    <td class="meta-val">${issueDate}</td>
                </tr>
                <tr>
                    <td class="meta-lbl">Order Number</td>
                    <td class="meta-val">${displayOrderId}</td>
                </tr>
                <tr>
                    <td class="meta-lbl">Invoice Number</td>
                    <td class="meta-val">${displayInvId}</td>
                </tr>
                <tr>
                    <td class="meta-lbl">P.O. Number</td>
                    <td class="meta-val-red">N/A</td>
                </tr>
            </table>
            <div class="barcode-area">
                <div class="barcode-lines">||||| | |||| ||| |||||| | ||| |||||</div>
            </div>
        </div>
    </div>

    <!-- 2. Bill To & Ship To Table -->
    <div class="section-box">
        <div class="section-box-header">
            <div>Bill To</div>
            <div>Ship To</div>
        </div>
        <div class="section-box-content">
            <div class="section-col">
                <div class="field-row"><span class="field-lbl">Name:</span> <span class="field-val bold">${customerName}</span></div>
                <div class="field-row"><span class="field-lbl">Shop Name:</span> <span class="field-val">${customerCompany}</span></div>
                <div class="field-row"><span class="field-lbl">Address:</span> <span class="field-val">${customerAddress}</span></div>
                <div class="field-row"><span class="field-lbl">Country:</span> <span class="field-val">Canada</span></div>
                <div class="field-row"><span class="field-lbl">Province:</span> <span class="field-val">Ontario</span></div>
                <div class="field-row"><span class="field-lbl">Email:</span> <span class="field-val">${customerEmail}</span></div>
                <div class="field-row"><span class="field-lbl">Phone:</span> <span class="field-val">${customerPhone}</span></div>
            </div>

            <div class="section-col">
                <div class="field-row"><span class="field-lbl">Name:</span> <span class="field-val bold">${customerName}</span></div>
                <div class="field-row"><span class="field-lbl">Shop Name:</span> <span class="field-val">${customerCompany}</span></div>
                <div class="field-row"><span class="field-lbl">Address:</span> <span class="field-val">${deliveryAddress}</span></div>
                <div class="field-row"><span class="field-lbl">Country:</span> <span class="field-val">Canada</span></div>
                <div class="field-row"><span class="field-lbl">Province:</span> <span class="field-val">Ontario</span></div>
                <div class="field-row"><span class="field-lbl">Email:</span> <span class="field-val">${customerEmail}</span></div>
                <div class="field-row"><span class="field-lbl">Phone:</span> <span class="field-val">${customerPhone}</span></div>
            </div>
        </div>
    </div>

    <!-- 3. Method, City, Status Table -->
    <table class="mid-table">
        <thead>
            <tr>
                <th style="width: 33.33%;">Method</th>
                <th style="width: 33.33%;">City</th>
                <th style="width: 33.34%;">Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${method}</td>
                <td>${city}</td>
                <td>${statusStr}</td>
            </tr>
        </tbody>
    </table>

    <!-- 4. Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 14%;" class="center">SKU</th>
                <th style="width: 48%;">Description</th>
                <th style="width: 10%;" class="center">QTY</th>
                <th style="width: 14%;" class="right">Unit Price</th>
                <th style="width: 14%;" class="right">Amount</th>
            </tr>
        </thead>
        <tbody>
            ${items.map((it, idx) => `
                <tr>
                    <td class="center bold">${it.sku || `PP${String(idx + 1).padStart(5, '0')}`}</td>
                    <td class="bold">${(it.item_type || it.description || it.desc || 'Freight Logistics Delivery').toUpperCase()}</td>
                    <td class="center bold">${it.quantity || it.qty || 1}</td>
                    <td class="right bold">${it.unit_price || it.rate || fmt(subtotal / Math.max(1, items.length))}</td>
                    <td class="right bold">${it.amount || fmt(subtotal / Math.max(1, items.length))}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <!-- 5. Totals Box (Right Aligned, Attached) -->
    <div class="bottom-wrap">
        <table class="totals-table">
            <tr>
                <td style="width: 45%;">Subtotal</td>
                <td style="width: 55%; text-align: right;">${fmt(subtotal)}</td>
            </tr>
            <tr class="totals-row-dashed">
                <td>Discount</td>
                <td style="text-align: right;">(0.00)</td>
            </tr>
            <tr class="totals-row-dashed">
                <td>Shipping</td>
                <td style="text-align: right;">0.00</td>
            </tr>
            <tr class="totals-row-dashed">
                <td>Tax (Tax 0%)</td>
                <td style="text-align: right;">0.00</td>
            </tr>
            <tr class="totals-grand-row">
                <td class="grand-lbl">Total</td>
                <td class="grand-val">$${fmt(total)}</td>
            </tr>
        </table>
    </div>
</body>
</html>`;
};
