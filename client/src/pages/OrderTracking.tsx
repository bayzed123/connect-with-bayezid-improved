import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, Package, Clock, CheckCircle, AlertCircle, Download, Eye } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { downloadInvoicePDF } from "@/utils/invoiceGenerator";

interface StoredOrder {
  id: number;
  invoiceNumber: string;
  customerEmail: string;
  productName: string;
  amount: number;
  paymentMethod: string;
  status: "pending" | "successful" | "failed";
  createdAt: string;
  transactionId: string;
}

export default function OrderTracking() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<StoredOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem("cwb_orders");
    if (storedOrders) {
      try {
        const parsedOrders = JSON.parse(storedOrders);
        setOrders(parsedOrders);
        setFilteredOrders(parsedOrders);
      } catch (error) {
        console.error("Error loading orders from localStorage:", error);
      }
    }
  }, []);

  // Filter orders by email
  useEffect(() => {
    if (searchEmail.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.customerEmail.toLowerCase().includes(searchEmail.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchEmail, orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "bg-green-500/10 border-green-500/30 text-green-300";
      case "pending":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-300";
      case "failed":
        return "bg-red-500/10 border-red-500/30 text-red-300";
      default:
        return "bg-slate-500/10 border-slate-500/30 text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "successful":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "failed":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const handleDownloadInvoice = (order: StoredOrder) => {
    downloadInvoicePDF({
      invoiceNumber: order.invoiceNumber,
      invoiceDate: new Date(order.createdAt),
      orderDate: new Date(order.createdAt),
      customerName: order.customerEmail.split("@")[0],
      customerEmail: order.customerEmail,
      productName: order.productName,
      quantity: 1,
      unitPrice: order.amount,
      totalPrice: order.amount,
      paymentMethod: order.paymentMethod,
      transactionId: order.transactionId,
      invoiceStatus: order.status,
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 w-full px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Order Tracking</span>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-indigo-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Track Your Orders
              </h1>
            </div>
            <p className="text-lg text-slate-300 max-w-2xl">
              View the status of your orders and download invoices. Enter your email address to see all your orders.
            </p>
          </div>

          {/* Search Section */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Find Your Orders</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-indigo-500"
                />
              </div>
              <p className="text-white/60 text-sm">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </Card>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
              <Package className="w-16 h-16 text-slate-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-bold text-white mb-2">No Orders Found</h3>
              <p className="text-white/60 mb-6">
                {searchEmail
                  ? "No orders found with this email address. Please check and try again."
                  : "Enter your email address to view your orders."}
              </p>
              <Link href="/checkout">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Start Shopping
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Order Info */}
                    <div>
                      <p className="text-white/60 text-sm mb-1">Invoice Number</p>
                      <p className="text-white font-bold text-lg">{order.invoiceNumber}</p>
                    </div>

                    {/* Product Info */}
                    <div>
                      <p className="text-white/60 text-sm mb-1">Product</p>
                      <p className="text-white font-bold">{order.productName}</p>
                    </div>

                    {/* Amount */}
                    <div>
                      <p className="text-white/60 text-sm mb-1">Amount</p>
                      <p className="text-indigo-400 font-bold text-lg">${order.amount.toFixed(2)}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-white/60 text-sm mb-1">Status</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="font-semibold capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Row */}
                  <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Payment Method</p>
                      <p className="text-white font-semibold capitalize">{order.paymentMethod}</p>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm mb-1">Transaction ID</p>
                      <p className="text-white font-mono text-sm break-all">{order.transactionId}</p>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm mb-1">Order Date</p>
                      <p className="text-white font-semibold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                    <Button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleDownloadInvoice(order)}
                      className="bg-slate-600 hover:bg-slate-700 text-white flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-white/60 hover:text-white transition text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Invoice Number */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Invoice Number</p>
                    <p className="text-white font-bold text-lg">{selectedOrder.invoiceNumber}</p>
                  </div>

                  {/* Customer Email */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Email Address</p>
                    <p className="text-white font-semibold">{selectedOrder.customerEmail}</p>
                  </div>

                  {/* Product Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">Product</p>
                      <p className="text-white font-semibold">{selectedOrder.productName}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">Amount</p>
                      <p className="text-indigo-400 font-bold text-lg">${selectedOrder.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">Payment Method</p>
                      <p className="text-white font-semibold capitalize">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-1">Status</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="font-semibold capitalize">{selectedOrder.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Transaction ID</p>
                    <p className="text-white font-mono text-sm break-all">{selectedOrder.transactionId}</p>
                  </div>

                  {/* Order Date */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Order Date</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => handleDownloadInvoice(selectedOrder)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </Button>
                    <Button
                      onClick={() => setSelectedOrder(null)}
                      className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
