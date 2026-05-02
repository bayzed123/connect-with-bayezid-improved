import React from "react";

export interface InvoiceData {
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

interface InvoiceTemplateProps {
  data: InvoiceData;
  onDownload?: () => void;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  data,
  onDownload,
}) => {
  const statusColors = {
    pending: "text-amber-600 bg-amber-50 border-amber-200",
    successful: "text-green-600 bg-green-50 border-green-200",
    failed: "text-red-600 bg-red-50 border-red-200",
  };

  const paymentMethodIcons: Record<string, string> = {
    payoneer: "💳",
    paypal: "🅿️",
    bkash: "📱",
    nagad: "📱",
    rocket: "🚀",
    binance: "₿",
  };

  const getPaymentIcon = (method: string) => {
    return paymentMethodIcons[method.toLowerCase()] || "💰";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-gray-200">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Connect With Bayezid
          </h1>
          <p className="text-gray-600 mt-1">Digital Products & Services</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Invoice #</p>
          <p className="text-2xl font-bold text-gray-900">{data.invoiceNumber}</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${statusColors[data.invoiceStatus]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide">
              Invoice Status
            </p>
            <p className="text-lg font-bold capitalize mt-1">{data.invoiceStatus}</p>
          </div>
          <div className="text-4xl">
            {data.invoiceStatus === "pending" && "⏳"}
            {data.invoiceStatus === "successful" && "✅"}
            {data.invoiceStatus === "failed" && "❌"}
          </div>
        </div>
        {data.invoiceStatus === "pending" && (
          <p className="text-sm mt-2 opacity-75">
            Your payment is being verified. You will receive confirmation within 24 hours.
          </p>
        )}
        {data.invoiceStatus === "successful" && (
          <p className="text-sm mt-2 opacity-75">
            Payment confirmed! Your digital product is ready for download.
          </p>
        )}
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Bill To */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Bill To
          </h3>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900">{data.customerName}</p>
            <p className="text-gray-600">{data.customerEmail}</p>
            {data.customerPhone && (
              <p className="text-gray-600">{data.customerPhone}</p>
            )}
          </div>
        </div>

        {/* Invoice Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Invoice Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(data.invoiceDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(data.orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Description
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">
                Qty
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">
                Unit Price
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-4 px-4 text-gray-900">{data.productName}</td>
              <td className="py-4 px-4 text-right text-gray-900">
                {data.quantity}
              </td>
              <td className="py-4 px-4 text-right text-gray-900">
                ${data.unitPrice.toFixed(2)}
              </td>
              <td className="py-4 px-4 text-right font-semibold text-gray-900">
                ${(data.unitPrice * data.quantity).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-xs">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">
                ${data.totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium text-gray-900">$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ${data.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-semibold text-gray-900 mt-1">
              {getPaymentIcon(data.paymentMethod)} {data.paymentMethod.toUpperCase()}
            </p>
          </div>
          {data.transactionId && (
            <div>
              <p className="text-sm text-gray-600">Transaction ID</p>
              <p className="font-semibold text-gray-900 mt-1 break-all">
                {data.transactionId}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-200 pt-6 text-center text-sm text-gray-600">
        <p>Thank you for your business!</p>
        <p className="mt-2">
          For support, contact us at{" "}
          <span className="font-semibold">cwb.agency@outlook.com</span>
        </p>
        <p className="mt-4 text-xs text-gray-500">
          This is an electronically generated invoice. No signature is required.
        </p>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceTemplate;
