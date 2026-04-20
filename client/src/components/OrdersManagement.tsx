import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Eye, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300",
  confirmed: "bg-blue-500/20 text-blue-300",
  processing: "bg-purple-500/20 text-purple-300",
  completed: "bg-green-500/20 text-green-300",
  cancelled: "bg-red-500/20 text-red-300",
};

export default function OrdersManagement() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");

  // Fetch orders
  const { data: orders = [], refetch, isLoading } = trpc.orders.getAll.useQuery();

  // Fetch products for reference
  const { data: products = [] } = trpc.products.getAll.useQuery();

  // Update order mutation
  const updateMutation = trpc.orders.update.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedOrder(null);
      setIsDetailDialogOpen(false);
      setUpdateStatus("");
    },
  });

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setUpdateStatus(order.status);
    setIsDetailDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (selectedOrder && updateStatus) {
      updateMutation.mutate({
        id: selectedOrder.id,
        status: updateStatus,
      });
    }
  };

  const getProductName = (productId: number) => {
    return products.find((p) => p.id === productId)?.name || `Product #${productId}`;
  };

  const statuses = ["pending", "confirmed", "processing", "completed", "cancelled"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Orders Management</h2>
          <p className="text-slate-400 mt-1">View and manage customer orders</p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{orders.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {orders.filter((o) => o.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {orders.filter((o) => o.status === "processing").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {orders.filter((o) => o.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-400">
              ${orders
                .reduce((sum, o) => sum + parseFloat(o.totalPrice || "0"), 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-slate-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No orders yet</div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="bg-white/10 border-white/20 hover:border-indigo-500/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        Order #{order.id}
                      </h3>
                      <Badge className={STATUS_COLORS[order.status] || "bg-slate-500/20"}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400">Product</p>
                        <p className="text-white">{getProductName(order.productId)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Customer</p>
                        <p className="text-white">{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Quantity</p>
                        <p className="text-white">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Total</p>
                        <p className="text-indigo-400 font-semibold">
                          ${parseFloat(order.totalPrice).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handleViewOrder(order)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Order #{selectedOrder?.id} Details</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-4">
                          {/* Customer Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-slate-400 mb-1">Customer Name</label>
                              <p className="text-white">{selectedOrder.customerName}</p>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-400 mb-1">Email</label>
                              <p className="text-white break-all">{selectedOrder.customerEmail}</p>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-400 mb-1">Phone</label>
                              <p className="text-white">{selectedOrder.customerPhone || "N/A"}</p>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-400 mb-1">Payment Method</label>
                              <p className="text-white">{selectedOrder.paymentMethod || "Not specified"}</p>
                            </div>
                          </div>

                          {/* Order Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-slate-400 mb-1">Product</label>
                              <p className="text-white">{getProductName(selectedOrder.productId)}</p>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-400 mb-1">Quantity</label>
                              <p className="text-white">{selectedOrder.quantity}</p>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-400 mb-1">Total Price</label>
                              <p className="text-indigo-400 font-semibold">
                                ${parseFloat(selectedOrder.totalPrice).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-400 mb-1">Date</label>
                              <p className="text-white">
                                {new Date(selectedOrder.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Notes */}
                          {selectedOrder.notes && (
                            <div>
                              <label className="block text-sm text-slate-400 mb-1">Customer Notes</label>
                              <p className="text-white bg-white/5 p-3 rounded border border-white/10">
                                {selectedOrder.notes}
                              </p>
                            </div>
                          )}

                          {/* Status Update */}
                          <div>
                            <label className="block text-sm text-slate-400 mb-2">Update Status</label>
                            <div className="flex gap-2">
                              <select
                                value={updateStatus}
                                onChange={(e) => setUpdateStatus(e.target.value)}
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                              >
                                {statuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </option>
                                ))}
                              </select>
                              <Button
                                onClick={handleUpdateStatus}
                                disabled={updateMutation.isPending}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Update
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
