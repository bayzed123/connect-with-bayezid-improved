import React, { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { InvoiceTemplate, InvoiceData } from "@/components/InvoiceTemplate";
import { Download, Home, Mail } from "lucide-react";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:orderId");
  const orderId = params?.orderId ? parseInt(params.orderId) : null;
  const [showInvoice, setShowInvoice] = useState(false);

  const orderQuery = trpc.orders.getById.useQuery(
    { id: orderId || 0 },
    { enabled: !!orderId }
  );

  const order = orderQuery.data;
  const productQuery = trpc.products.getById.useQuery(
    { id: order?.productId || 0 },
    { enabled: !!order?.productId }
  );

  const product = productQuery.data;

  const handleDownloadInvoice = () => {
    if (!order || !product) return;

    const invoiceData: InvoiceData = {
      invoiceNumber: order.invoiceNumber || `INV-${order.id}`,
      invoiceDate: new Date(order.createdAt),
      orderDate: new Date(order.createdAt),
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || undefined,
      productName: product.name,
      quantity: order.quantity || 1,
      unitPrice: parseFloat((product.price || "0").toString()),
      totalPrice: parseFloat(order.totalPrice.toString()),
      paymentMethod: order.paymentMethod || "Unknown",
      transactionId: order.transactionId || undefined,
      invoiceStatus: (order.invoiceStatus as "pending" | "successful" | "failed") || "pending",
    };

    // Create a printable version
    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoiceData.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .invoice { max-width: 800px; margin: 0 auto; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .company-name { font-size: 28px; font-weight: bold; color: #4f46e5; }
              .status { padding: 10px; margin: 20px 0; border-radius: 8px; font-weight: bold; }
              .status.pending { background: #fef3c7; color: #92400e; }
              .status.successful { background: #dcfce7; color: #166534; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background: #f3f4f6; font-weight: bold; }
              .total { font-size: 18px; font-weight: bold; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
            </style>
          </head>
          <body>
            <div class="invoice">
              <div class="header">
                <div class="company-name">Connect With Bayezid</div>
                <p>Digital Products & Services</p>
              </div>
              
              <div class="status ${invoiceData.invoiceStatus}">
                Invoice Status: ${invoiceData.invoiceStatus.toUpperCase()}
              </div>

              <h2>Invoice #${invoiceData.invoiceNumber}</h2>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                <div>
                  <h4>Bill To</h4>
                  <p><strong>${invoiceData.customerName}</strong></p>
                  <p>${invoiceData.customerEmail}</p>
                  ${invoiceData.customerPhone ? `<p>${invoiceData.customerPhone}</p>` : ""}
                </div>
                <div>
                  <h4>Invoice Information</h4>
                  <p>Invoice Date: ${invoiceData.invoiceDate.toLocaleDateString()}</p>
                  <p>Order Date: ${invoiceData.orderDate.toLocaleDateString()}</p>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${invoiceData.productName}</td>
                    <td>${invoiceData.quantity}</td>
                    <td>$${invoiceData.unitPrice.toFixed(2)}</td>
                    <td class="total">$${(invoiceData.unitPrice * invoiceData.quantity).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div style="text-align: right; margin: 20px 0;">
                <div style="display: inline-block; background: #f3f4f6; padding: 20px; border-radius: 8px;">
                  <div style="margin-bottom: 10px;">Subtotal: $${invoiceData.totalPrice.toFixed(2)}</div>
                  <div style="margin-bottom: 10px;">Tax: $0.00</div>
                  <div class="total" style="font-size: 20px;">Total: $${invoiceData.totalPrice.toFixed(2)}</div>
                </div>
              </div>

              <div style="background: #eef2ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4>Payment Details</h4>
                <p>Payment Method: ${invoiceData.paymentMethod.toUpperCase()}</p>
                ${invoiceData.transactionId ? `<p>Transaction ID: ${invoiceData.transactionId}</p>` : ""}
              </div>

              <div class="footer">
                <p>Thank you for your business!</p>
                <p>For support, contact us at cwb.agency@outlook.com</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-4">
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 text-center">
          <p className="text-white text-lg">Loading order details...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <Card className="bg-green-500/20 border border-green-500/50 p-6 mb-8 rounded-lg">
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-green-100 mb-2">
              Order Submitted Successfully!
            </h1>
            <p className="text-green-100/70">
              Your order has been received. We'll verify your payment and contact you shortly.
            </p>
          </div>
        </Card>

        {/* Order Details */}
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-white/70 text-sm mb-1">Order Number</p>
              <p className="text-white text-lg font-semibold">#{order.id}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Invoice Number</p>
              <p className="text-white text-lg font-semibold">
                {order.invoiceNumber || `INV-${order.id}`}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Customer Name</p>
              <p className="text-white text-lg font-semibold">{order.customerName}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Customer Email</p>
              <p className="text-white text-lg font-semibold">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Payment Method</p>
              <p className="text-white text-lg font-semibold capitalize">
                {order.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Order Status</p>
              <p className="text-white text-lg font-semibold capitalize">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.invoiceStatus === "pending"
                      ? "bg-amber-500/30 text-amber-100"
                      : order.invoiceStatus === "successful"
                      ? "bg-green-500/30 text-green-100"
                      : "bg-red-500/30 text-red-100"
                  }`}
                >
                  {order.invoiceStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Product Info */}
          {product && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white">{product.name}</p>
                  <p className="text-white/70 text-sm">Quantity: {order.quantity || 1}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-lg font-bold">
                    ${order.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Transaction ID */}
          {order.transactionId && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
              <p className="text-blue-100 text-sm mb-1">Transaction ID</p>
              <p className="text-white font-mono text-lg break-all">
                {order.transactionId}
              </p>
            </div>
          )}

          {/* Status Message */}
          {order.invoiceStatus === "pending" && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8">
              <p className="text-amber-100 font-semibold mb-2">⏳ Payment Verification in Progress</p>
              <p className="text-amber-100/70 text-sm">
                Your payment is being verified. You will receive a confirmation email within 24 hours. Once approved, you'll be able to download your digital product.
              </p>
            </div>
          )}

          {order.invoiceStatus === "successful" && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-8">
              <p className="text-green-100 font-semibold mb-2">✅ Payment Confirmed!</p>
              <p className="text-green-100/70 text-sm">
                Your payment has been verified. You can now download your digital product and invoice below.
              </p>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={handleDownloadInvoice}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Invoice
          </Button>

          {order.invoiceStatus === "successful" && (
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download Product
            </Button>
          )}

          <Button
            onClick={() => window.location.href = "/"}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </div>

        {/* Contact Support */}
        <Card className="bg-white/5 border border-white/10 p-6 text-center">
          <Mail className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">Need Help?</h3>
          <p className="text-white/70 mb-4">
            If you have any questions about your order, please contact us at:
          </p>
          <a
            href="mailto:cwb.agency@outlook.com"
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            cwb.agency@outlook.com
          </a>
        </Card>
      </div>
    </div>
  );
}
