import React, { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { InvoiceTemplate, InvoiceData } from "@/components/InvoiceTemplate";
import { Download, Home, Mail } from "lucide-react";
import { downloadInvoicePDF } from "@/utils/invoiceGenerator";
import { saveOrderToStorage, getOrderFromStorage } from "@/utils/orderStorage";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:orderId");
  const orderId = params?.orderId ? parseInt(params.orderId) : null;
  const [showInvoice, setShowInvoice] = useState(false);
  const [storedOrder, setStoredOrder] = useState<any>(null);

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

  // Save order to localStorage when it loads
  useEffect(() => {
    if (order && product) {
      const orderData = {
        id: order.id,
        invoiceNumber: order.invoiceNumber || `INV-${order.id}`,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        productName: product.name,
        totalPrice: order.totalPrice.toString(),
        paymentMethod: order.paymentMethod || "Unknown",
        transactionId: order.transactionId || "",
        invoiceStatus: (order.invoiceStatus as "pending" | "successful" | "failed") || "pending",
        createdAt: order.createdAt.toString(),
        paymentProofUrl: order.paymentProofUrl || undefined,
      };
      saveOrderToStorage(orderData);
      setStoredOrder(orderData);
    }
  }, [order, product]);

  // Try to load from localStorage if API fails
  useEffect(() => {
    if (!order && orderId) {
      const cached = getOrderFromStorage(orderId);
      if (cached) {
        setStoredOrder(cached);
      }
    }
  }, [orderId, order]);

  const handleDownloadInvoice = () => {
    const dataSource = order || storedOrder;
    
    if (!dataSource) {
      console.error("[OrderConfirmation] No order data available for invoice download");
      alert("Order data not found. Please refresh the page or contact support.");
      return;
    }

    const invoiceData = {
      invoiceNumber: dataSource.invoiceNumber || `INV-${dataSource.id}`,
      invoiceDate: new Date(dataSource.createdAt || new Date()),
      orderDate: new Date(dataSource.createdAt || new Date()),
      customerName: dataSource.customerName,
      customerEmail: dataSource.customerEmail,
      customerPhone: dataSource.customerPhone || undefined,
      productName: dataSource.productName || product?.name || "Digital Product",
      quantity: 1,
      unitPrice: parseFloat(dataSource.totalPrice),
      totalPrice: parseFloat(dataSource.totalPrice),
      paymentMethod: dataSource.paymentMethod || "Unknown",
      transactionId: dataSource.transactionId || undefined,
      invoiceStatus: (dataSource.invoiceStatus as "pending" | "successful" | "failed") || "pending",
    };

    downloadInvoicePDF(invoiceData);
  };

  // Use stored order as fallback if API data is not available
  const displayOrder = order || storedOrder;

  if (!displayOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-4">
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 text-center">
          <p className="text-white text-lg">Loading order details...</p>
          <p className="text-white/50 text-sm mt-2">If this takes too long, your order details may have been saved locally.</p>
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
              <p className="text-white text-lg font-semibold">#{displayOrder.id}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Invoice Number</p>
              <p className="text-white text-lg font-semibold">
                {displayOrder.invoiceNumber || `INV-${displayOrder.id}`}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Customer Name</p>
              <p className="text-white text-lg font-semibold">{displayOrder.customerName}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Customer Email</p>
              <p className="text-white text-lg font-semibold">{displayOrder.customerEmail}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Payment Method</p>
              <p className="text-white text-lg font-semibold capitalize">
                {displayOrder.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Order Status</p>
              <p className="text-white text-lg font-semibold capitalize">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    displayOrder.invoiceStatus === "pending"
                      ? "bg-amber-500/30 text-amber-100"
                      : displayOrder.invoiceStatus === "successful"
                      ? "bg-green-500/30 text-green-100"
                      : "bg-red-500/30 text-red-100"
                  }`}
                >
                  {displayOrder.invoiceStatus}
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
                  <p className="text-white/70 text-sm">Quantity: {displayOrder.quantity || 1}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-lg font-bold">
                    ${displayOrder.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Transaction ID */}
          {displayOrder.transactionId && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
              <p className="text-blue-100 text-sm mb-1">Transaction ID</p>
              <p className="text-white font-mono text-lg break-all">
                {displayOrder.transactionId}
              </p>
            </div>
          )}

          {/* Status Message */}
          {displayOrder.invoiceStatus === "pending" && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8">
              <p className="text-amber-100 font-semibold mb-2">⏳ Payment Verification in Progress</p>
              <p className="text-amber-100/70 text-sm">
                Your payment is being verified. You will receive a confirmation email within 24 hours. Once approved, you'll be able to download your digital product.
              </p>
            </div>
          )}

          {displayOrder.invoiceStatus === "successful" && (
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

          {displayOrder.invoiceStatus === "successful" && (
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
