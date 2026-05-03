import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Mail,
  Phone,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

export default function PaymentVerificationDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Fetch pending orders
  const { data: pendingOrders = [], isLoading, refetch } = trpc.orders.getByStatus.useQuery({
    status: "pending",
  });

  // Fetch successful orders
  const { data: successfulOrders = [] } = trpc.orders.getByStatus.useQuery({
    status: "successful",
  });

  const approveOrderMutation = trpc.orders.update.useMutation();

  const handleApproveOrder = (orderId: number) => {
    if (confirm("Approve this payment?")) {
      approveOrderMutation.mutate(
        {
          id: orderId,
          status: "completed",
          invoiceStatus: "successful",
        },
        {
          onSuccess: () => {
            toast.success("Order approved successfully!");
            refetch();
            setSelectedOrder(null);
          },
        }
      );
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    {
      label: "Pending Payments",
      value: pendingOrders.length,
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Verified Payments",
      value: successfulOrders.length,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Total Revenue",
      value: `$${(
        [...pendingOrders, ...successfulOrders].reduce(
          (sum: number, order: any) => sum + (parseFloat(String(order.totalPrice)) || 0),
          0
        ) || 0
      ).toFixed(2)}`,
      icon: DollarSign,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className="bg-white/5 border border-white/10 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pending Payments Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <h2 className="text-2xl font-bold text-white">
            Pending Payments ({pendingOrders.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-white/60 mt-2">Loading orders...</p>
          </div>
        ) : pendingOrders.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-white/60">No pending payments</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60 font-semibold">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-white/60 font-semibold">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-white/60 font-semibold">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-white/60 font-semibold">
                    Method
                  </th>
                  <th className="text-left py-3 px-4 text-white/60 font-semibold">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-white/60 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-4 text-white font-semibold">
                      #{order.id}
                    </td>
                    <td className="py-3 px-4 text-white/70">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-4 text-indigo-400 font-semibold">
                      ${order.totalPrice}
                    </td>
                    <td className="py-3 px-4 text-white/70">
                      {order.paymentMethod || "Unknown"}
                    </td>
                    <td className="py-3 px-4 text-white/70 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Order #{selectedOrder.id}
                  </h2>
                  <p className="text-white/60">
                    Invoice: {selectedOrder.invoiceNumber || `INV-${selectedOrder.id}`}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Customer Details */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Customer Information
                </h3>
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
                        onClick={() =>
                          handleCopyEmail(selectedOrder.customerEmail || "")
                        }
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
                <h3 className="text-lg font-semibold text-white mb-4">
                  Order Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Amount</span>
                    <span className="text-white font-semibold">
                      ${selectedOrder.totalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Payment Method</span>
                    <span className="text-white font-semibold">
                      {selectedOrder.paymentMethod || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Transaction ID</span>
                    <span className="text-white font-semibold">
                      {selectedOrder.transactionId || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Order Date</span>
                    <span className="text-white font-semibold">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Proof */}
              {selectedOrder.paymentProofUrl && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Payment Proof
                  </h3>
                  <a
                    href={selectedOrder.paymentProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline"
                  >
                    View Payment Proof
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    handleApproveOrder(selectedOrder.id)
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Payment
                </Button>
                <Button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
