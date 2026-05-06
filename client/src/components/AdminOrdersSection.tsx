import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  Mail,
  Download,
  Eye,
} from "lucide-react";

interface Order {
  id: number;
  productId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  quantity?: number | null;
  totalPrice: string;
  status: string;
  paymentMethod: string | null;
  transactionId?: string | null;
  paymentProofUrl?: string | null;
  invoiceStatus: string | null;
  invoiceNumber?: string | null;
  createdAt: Date;
  updatedAt?: Date;
}

export default function AdminOrdersSection() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  const ordersQuery = trpc.orders.getAll.useQuery();
  const updateOrderMutation = trpc.orders.update.useMutation({
    onSuccess: () => {
      ordersQuery.refetch();
      setSelectedOrder(null);
    },
  });

  const orders = ordersQuery.data || [];

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApproveOrder = async (orderId: number) => {
    await updateOrderMutation.mutateAsync({
      id: orderId,
      status: "completed",
      invoiceStatus: "successful",
    });
  };

  const handleRejectOrder = async (orderId: number) => {
    await updateOrderMutation.mutateAsync({
      id: orderId,
      status: "failed",
      invoiceStatus: "failed",
    });
  };

  const handleSendEmail = (email: string, orderDetails: Order) => {
    const subject = `Your Order #${orderDetails.id} - Payment Verification`;
    const body = `
Hi ${orderDetails.customerName},

Thank you for your order!

Order Details:
- Order ID: #${orderDetails.id}
- Invoice: ${orderDetails.invoiceNumber || `INV-${orderDetails.id}`}
- Amount: $${orderDetails.totalPrice}
- Payment Method: ${orderDetails.paymentMethod || "Unknown"}
- Status: ${(orderDetails.invoiceStatus || "pending").toUpperCase()}

We have received your payment proof. Our team is verifying it and will send you the digital product download link shortly.

If you have any questions, please reply to this email.

Best regards,
Connect With Bayezid
cwb.agency@outlook.com
    `;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/20 text-amber-100 border-amber-500/30";
      case "successful":
        return "bg-green-500/20 text-green-100 border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-100 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-100 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Orders Management</h2>
        <span className="bg-indigo-500/20 text-indigo-100 px-4 py-2 rounded-lg">
          Total Orders: {orders.length}
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4 text-white font-mono">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-white">{order.customerName}</div>
                    <div className="text-white/60 text-sm">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    ${order.totalPrice}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/70 text-sm capitalize">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                        order.invoiceStatus
                      )}`}
                    >
                      {order.invoiceStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-3"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Order #{selectedOrder.id}
                  </h3>
                  <p className="text-white/60">
                    Invoice: {selectedOrder.invoiceNumber || `INV-${selectedOrder.id}`}
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  ✕
                </Button>
              </div>

              {/* Customer Information */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Name</p>
                    <p className="text-white font-semibold">
                      {selectedOrder.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold break-all">
                        {selectedOrder.customerEmail}
                      </p>
                      <button
                        onClick={() => handleCopyEmail(selectedOrder.customerEmail || "")}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {copied && (
                      <p className="text-green-400 text-xs mt-1">Copied!</p>
                    )}
                  </div>
                  {selectedOrder.customerPhone && (
                    <div>
                      <p className="text-white/60 text-sm mb-1">Phone</p>
                      <p className="text-white font-semibold">
                        {selectedOrder.customerPhone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Order Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Amount</p>
                    <p className="text-white text-2xl font-bold">
                      ${selectedOrder.totalPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm border inline-block ${getStatusColor(
                        selectedOrder.invoiceStatus || "pending"
                      )}`}
                    >
                      {(selectedOrder.invoiceStatus || "pending").toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Order Date</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Invoice Number</p>
                    <p className="text-white font-mono">
                      {selectedOrder.invoiceNumber || `INV-${selectedOrder.id}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-indigo-100 mb-4">
                  Payment Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-indigo-100/70 text-sm mb-1">Payment Method</p>
                    <p className="text-white font-semibold capitalize text-lg">
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                  {selectedOrder.transactionId && (
                    <div>
                      <p className="text-indigo-100/70 text-sm mb-1">Transaction ID</p>
                      <p className="text-white font-mono break-all">
                        {selectedOrder.transactionId}
                      </p>
                    </div>
                  )}
                </div>
              </div>



              {/* Payment Proof Screenshot */}
              {selectedOrder.paymentProofUrl && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-purple-100 mb-4">
                    Payment Proof Screenshot
                  </h4>
                  <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                    <img
                      src={selectedOrder.paymentProofUrl}
                      alt="Payment proof"
                      className="w-full h-auto max-h-96 object-contain rounded"
                    />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={selectedOrder.paymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-semibold text-center transition-colors"
                    >
                      View Full Size
                    </a>
                    <a
                      href={selectedOrder.paymentProofUrl}
                      download
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-semibold text-center transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedOrder.invoiceStatus === "pending" && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mb-6">
                  <p className="text-amber-100 mb-4 font-semibold">
                    ⏳ Pending Verification
                  </p>
                  <p className="text-amber-100/70 text-sm mb-6">
                    Please verify the payment and approve or reject this order.
                  </p>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => handleApproveOrder(selectedOrder.id)}
                      disabled={updateOrderMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve & Send Product
                    </Button>

                    <Button
                      onClick={() => handleRejectOrder(selectedOrder.id)}
                      disabled={updateOrderMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Order
                    </Button>

                    <Button
                      onClick={() =>
                        handleSendEmail(selectedOrder.customerEmail, selectedOrder)
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 flex items-center justify-center gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      Send Email to Customer
                    </Button>
                  </div>
                </div>
              )}

              {selectedOrder.invoiceStatus === "successful" && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
                  <p className="text-green-100 mb-4 font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Order Approved
                  </p>
                  <p className="text-green-100/70 text-sm">
                    This order has been approved. The customer can download their
                    product.
                  </p>
                </div>
              )}

              {selectedOrder.invoiceStatus === "failed" && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
                  <p className="text-red-100 mb-4 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Order Rejected
                  </p>
                  <p className="text-red-100/70 text-sm">
                    This order has been rejected. Please contact the customer for
                    clarification.
                  </p>
                </div>
              )}

              {/* Close Button */}
              <Button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
