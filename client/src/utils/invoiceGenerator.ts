export interface InvoiceGeneratorData {
  invoiceNumber: string;
  invoiceDate: Date;
  orderDate: Date;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  transactionId?: string;
  invoiceStatus: "pending" | "successful" | "failed";
}

const paymentMethodNames: Record<string, string> = {
  payoneer: "Payoneer",
  paypal: "PayPal",
  bkash: "Bkash",
  nagad: "Nagad",
  rocket: "Rocket",
  binance: "Binance",
};

const paymentMethodIcons: Record<string, string> = {
  payoneer: "💳",
  paypal: "🅿️",
  bkash: "📱",
  nagad: "📱",
  rocket: "🚀",
  binance: "₿",
};

export const generateInvoiceHTML = (data: InvoiceGeneratorData): string => {
  const paymentMethodDisplay = paymentMethodNames[data.paymentMethod.toLowerCase()] || data.paymentMethod;
  const paymentIcon = paymentMethodIcons[data.paymentMethod.toLowerCase()] || "💰";
  
  const statusStyles = {
    pending: { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" },
    successful: { bg: "#dcfce7", text: "#166534", border: "#22c55e" },
    failed: { bg: "#fee2e2", text: "#991b1b", border: "#ef4444" },
  };

  const statusStyle = statusStyles[data.invoiceStatus];
  
  const watermarkStyle = data.invoiceStatus === 'pending' ? `
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 120px;
      font-weight: bold;
      color: rgba(245, 158, 11, 0.1);
      white-space: nowrap;
      pointer-events: none;
      z-index: 0;
    }
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${data.invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #f3f4f6;
            padding: 20px;
          }
          .invoice-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
          }
          ${watermarkStyle}
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 30px;
            margin-bottom: 30px;
          }
          
          .company-info h1 {
            font-size: 32px;
            background: linear-gradient(135deg, #4f46e5 0%, #a855f7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 5px;
          }
          
          .company-info p {
            color: #666;
            font-size: 14px;
          }
          
          .invoice-number {
            text-align: right;
          }
          
          .invoice-number .label {
            color: #999;
            font-size: 12px;
            text-transform: uppercase;
          }
          
          .invoice-number .number {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
          }
          
          .status-badge {
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 5px solid;
            background-color: ${statusStyle.bg};
            border-color: ${statusStyle.border};
            color: ${statusStyle.text};
          }
          
          .status-badge-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
          }
          
          .status-badge-value {
            font-size: 18px;
            font-weight: bold;
            text-transform: capitalize;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }
          
          .info-section h3 {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 15px;
            letter-spacing: 1px;
          }
          
          .info-section p {
            margin-bottom: 8px;
            color: #1f2937;
            line-height: 1.6;
          }
          
          .info-section .label {
            color: #999;
            font-size: 12px;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          .items-table th {
            background: #f3f4f6;
            padding: 15px;
            text-align: left;
            font-weight: bold;
            color: #1f2937;
            border-bottom: 2px solid #e5e7eb;
            font-size: 13px;
            text-transform: uppercase;
          }
          
          .items-table td {
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
            color: #1f2937;
          }
          
          .items-table tr:last-child td {
            border-bottom: 2px solid #e5e7eb;
          }
          
          .amount {
            text-align: right;
            font-weight: bold;
          }
          
          .totals {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }
          
          .totals-box {
            background: #f9fafb;
            padding: 25px;
            border-radius: 8px;
            min-width: 300px;
            border: 1px solid #e5e7eb;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
          }
          
          .total-row.grand-total {
            border-top: 2px solid #e5e7eb;
            padding-top: 12px;
            font-size: 18px;
            font-weight: bold;
            color: #4f46e5;
          }
          
          .payment-details {
            background: #eef2ff;
            border: 2px solid #c7d2fe;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 40px;
          }
          
          .payment-details h3 {
            font-size: 14px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
          }
          
          .payment-method {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
            font-size: 16px;
            color: #1f2937;
          }
          
          .payment-icon {
            font-size: 24px;
          }
          
          .payment-method-name {
            font-weight: bold;
          }
          
          .transaction-id {
            background: white;
            padding: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            word-break: break-all;
            color: #4f46e5;
            margin-top: 10px;
          }
          
          .footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 25px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          
          .footer p {
            margin-bottom: 8px;
          }
          
          .footer-contact {
            color: #4f46e5;
            font-weight: bold;
          }
          
          @media print {
            body { background: white; padding: 0; }
            .invoice-container { box-shadow: none; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${data.invoiceStatus === 'pending' ? '<div class="watermark">PENDING</div>' : ''}
          <div class="header">
            <div class="company-info">
              <h1>Connect With Bayezid</h1>
              <p>Digital Products & Services</p>
            </div>
            <div class="invoice-number">
              <div class="label">Invoice #</div>
              <div class="number">${data.invoiceNumber}</div>
            </div>
          </div>
          
          <div class="status-badge">
            <div class="status-badge-title">Invoice Status</div>
            <div class="status-badge-value">${data.invoiceStatus}</div>
          </div>
          
          <div class="info-grid">
            <div class="info-section">
              <h3>Bill To</h3>
              <p><strong>${data.customerName}</strong></p>
              <p>${data.customerEmail}</p>
              ${data.customerPhone ? `<p>${data.customerPhone}</p>` : ""}
            </div>
            <div class="info-section">
              <h3>Invoice Information</h3>
              <p>
                <span class="label">Invoice Date:</span><br>
                ${data.invoiceDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <p>
                <span class="label">Order Date:</span><br>
                ${data.orderDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${data.productName}</td>
                <td style="text-align: center;">${data.quantity}</td>
                <td style="text-align: right;">$${data.unitPrice.toFixed(2)}</td>
                <td class="amount">$${(data.unitPrice * data.quantity).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="totals">
            <div class="totals-box">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>$${data.totalPrice.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Tax:</span>
                <span>$0.00</span>
              </div>
              <div class="total-row grand-total">
                <span>Total:</span>
                <span>$${data.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div class="payment-details">
            <h3>Payment Details</h3>
            <div class="payment-method">
              <span class="payment-icon">${paymentIcon}</span>
              <span class="payment-method-name">${paymentMethodDisplay}</span>
            </div>
            ${data.transactionId ? `<div class="transaction-id"><strong>Transaction ID:</strong> ${data.transactionId}</div>` : ""}
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>For support, contact us at <span class="footer-contact">cwb.agency@outlook.com</span></p>
            <p>© 2026 Connect With Bayezid. All Rights Reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const downloadInvoicePDF = (data: InvoiceGeneratorData) => {
  try {
    const html = generateInvoiceHTML(data);
    const printWindow = window.open("", "", "height=800,width=1000");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert("Could not open print window. Please check if popups are blocked in your browser.");
    }
  } catch (error) {
    alert("Failed to generate invoice. Please try again.");
  }
};
