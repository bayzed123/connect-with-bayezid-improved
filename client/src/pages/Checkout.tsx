import React, { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AlertCircle, CheckCircle2, Upload, ArrowLeft } from "lucide-react";
import { saveOrderToStorage } from "@/utils/orderStorage";

const PAYMENT_METHODS = [
  {
    id: "payoneer",
    name: "Payoneer",
    icon: "💳",
    description: "Pay via Payoneer account",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "🅿️",
    description: "Pay via PayPal (Saudi Arabia)",
  },
  {
    id: "bkash",
    name: "Bkash",
    icon: "📱",
    description: "Mobile payment (Bangladesh)",
  },
  {
    id: "nagad",
    name: "Nagad",
    icon: "📱",
    description: "Mobile payment (Bangladesh)",
  },
  {
    id: "rocket",
    name: "Rocket",
    icon: "🚀",
    description: "Mobile payment (Bangladesh)",
  },
  {
    id: "binance",
    name: "Binance",
    icon: "₿",
    description: "Cryptocurrency payment",
  },
];

export default function Checkout() {
  const [, params] = useRoute("/checkout/:productId");
  const [, setLocation] = useLocation();
  const routeProductId = params?.productId ? parseInt(params.productId) : null;

  const [selectedProductId, setSelectedProductId] = useState<number | null>(routeProductId);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    transactionId: "",
    notes: "",
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  
  // Fetch all products for selection
  const { data: allProducts = [] } = trpc.products.getActive.useQuery();
  
  // Fetch selected product details
  const productQuery = trpc.products.getById.useQuery(
    { id: selectedProductId || 0 },
    { enabled: !!selectedProductId }
  );
  
  const createOrderMutation = trpc.orders.create.useMutation();

  const product = productQuery.data;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) {
      alert("Product not found");
      return;
    }

    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    if (!formData.transactionId) {
      alert("Please enter your transaction ID");
      return;
    }

    if (!paymentProof) {
      alert("Please upload payment proof");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload payment proof to S3
      let paymentProofUrl = "";
      if (paymentProof) {
        const formDataForUpload = new FormData();
        formDataForUpload.append("file", paymentProof);
        
        try {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formDataForUpload,
          });
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            paymentProofUrl = uploadData.url || uploadData.paymentProofUrl || "";
            if (!paymentProofUrl) {
              const errorMsg = "File upload failed: No URL returned from server";
              console.error("[Checkout]", errorMsg);
              setError(errorMsg);
              throw new Error(errorMsg);
            }
          } else {
            const errorText = await uploadResponse.text();
            const errorMsg = `File upload failed (${uploadResponse.status}): ${errorText}`;
            console.error("[Checkout] Upload failed:", errorMsg);
            setError(errorMsg);
            throw new Error(errorMsg);
          }
        } catch (uploadError) {
          const errorMsg = uploadError instanceof Error ? uploadError.message : "File upload failed";
          console.error("[Checkout] Upload error:", errorMsg);
          setError(errorMsg);
          throw new Error(errorMsg);
        }
      }

      const totalPrice = typeof product.price === "string"
        ? parseFloat(product.price)
        : (product.price || 0);

      const order = await createOrderMutation.mutateAsync({
        productId: product.id,
        customerName: formData.customerName || user?.name || "Guest",
        customerEmail: formData.customerEmail || user?.email || "",
        customerPhone: formData.customerPhone,
        quantity: 1,
        totalPrice: totalPrice.toString(),
        paymentMethod: selectedPayment,
        transactionId: formData.transactionId,
        paymentProofUrl,
        notes: formData.notes,
      });

      // Save order to localStorage
      if (order && order.id) {
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
      }

      setSubmitSuccess(true);
      
      // Ensure we have a valid order ID before redirecting
      if (!order || !order.id) {
        console.error("[Checkout] Order created but no ID returned");
        setError("Order created but confirmation failed. Please check your email or contact support.");
        setIsSubmitting(false);
        return;
      }
      
      // Redirect after brief delay to show success message
      setTimeout(() => {
        setLocation(`/order-confirmation/${order.id}`);
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Failed to create order: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show product selection if no product is selected
  if (!selectedProductId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-12 text-center">
            Select a Product to Purchase
          </h1>

          {allProducts.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <p className="text-white/60 text-lg">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProducts.map((prod: any) => (
                <Card
                  key={prod.id}
                  className="bg-white/10 border border-white/20 hover:border-indigo-500/50 transition overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedProductId(prod.id)}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                      {prod.name}
                    </h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">
                      {prod.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-indigo-400">
                        ${typeof prod.price === "string" ? prod.price : (prod.price as number)?.toFixed(2)}
                      </span>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Select
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show loading state while fetching product
  if (productQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show error if product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-4">
        <Card className="bg-white/10 border border-white/20 max-w-md w-full p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
            <p className="text-white/60 mb-6">The product you're looking for doesn't exist.</p>
            <Button
              onClick={() => setSelectedProductId(null)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show checkout form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setSelectedProductId(null)}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 border border-white/20 p-6 sticky top-4">
              <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Product</p>
                  <p className="text-white font-semibold">{product.name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Price</p>
                  <p className="text-2xl font-bold text-indigo-400">
                    ${typeof product.price === "string" ? product.price : (product.price as any)?.toFixed(2)}
                  </p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white/60 text-sm mb-1">Total</p>
                  <p className="text-3xl font-bold text-indigo-400">
                    ${typeof product.price === "string" ? product.price : (product.price as any)?.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Success Message */}
              {submitSuccess && (
                <Card className="bg-green-500/10 border border-green-500/50 p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-green-400 font-semibold">Order Submitted!</p>
                      <p className="text-green-400/70 text-sm">Redirecting to confirmation...</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Customer Information */}
              <Card className="bg-white/10 border border-white/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Customer Information</h3>
                <div className="space-y-4">
                  <Input
                    name="customerName"
                    placeholder="Full Name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    required
                  />
                  <Input
                    name="customerEmail"
                    type="email"
                    placeholder="Email Address"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    required
                  />
                  <Input
                    name="customerPhone"
                    placeholder="Phone Number (Optional)"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </Card>

              {/* Payment Method Selection */}
              <Card className="bg-white/10 border border-white/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 rounded-lg border-2 transition text-left ${
                        selectedPayment === method.id
                          ? "border-indigo-500 bg-indigo-500/20"
                          : "border-white/20 bg-white/5 hover:border-white/40"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{method.icon}</span>
                      <p className="text-white font-semibold text-sm">{method.name}</p>
                      <p className="text-white/60 text-xs">{method.description}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Payment Instructions */}
              {selectedPayment && (
                <Card className="bg-blue-500/10 border border-blue-500/30 p-6">
                  <h3 className="text-lg font-bold text-blue-300 mb-4">Payment Instructions</h3>
                  <div className="space-y-3 text-white/80">
                    {selectedPayment === "payoneer" && (
                      <>
                        <p>Send payment to: <span className="font-bold text-white">cwb.agency@payoneer.com</span></p>
                        <p>Amount: <span className="font-bold text-indigo-400">${typeof product.price === "string" ? product.price : (product.price as any)?.toFixed(2)}</span></p>
                        <p className="text-sm text-white/60">After payment, upload the transaction receipt as proof</p>
                      </>
                    )}
                    {selectedPayment === "paypal" && (
                      <>
                        <p>Send payment to: <span className="font-bold text-white">cwb.agency@paypal.com</span></p>
                        <p>Amount: <span className="font-bold text-indigo-400">${typeof product.price === "string" ? product.price : (product.price as any)?.toFixed(2)}</span></p>
                        <p className="text-sm text-white/60">Include transaction ID in the payment details field</p>
                      </>
                    )}
                    {selectedPayment === "bkash" && (
                      <>
                        <p>Send to: <span className="font-bold text-white">01519601517</span></p>
                        <p>Amount: <span className="font-bold text-indigo-400">${typeof product.price === "string" ? product.price : (product.price as any)?.toFixed(2)}</span></p>
                        <p className="text-sm text-white/60">Use reference: CWB-{Date.now().toString().slice(-6)}</p>
                      </>
                    )}
                    {selectedPayment === "nagad" && (
                      <>
                        <p>Send to: <span className="font-bold text-white">01519601517</span></p>
                        <p>Amount: <span className="font-bold text-indigo-400">${typeof product.price === "string" ? product.price : (product.price as any)?.toFixed(2)}</span></p>
                        <p className="text-sm text-white/60">Merchant ID: CWB Agency</p>
                      </>
                    )}
                    {selectedPayment === "rocket" && (
                      <>
                        <p>Send to: <span className="font-bold text-white">01519601517</span></p>
                        <p>Amount: <span className="font-bold text-indigo-400">${typeof product.price === "string" ? product.price : (product.price as any)?.toFixed(2)}</span></p>
                        <p className="text-sm text-white/60">Account holder: Bayezid</p>
                      </>
                    )}
                    {selectedPayment === "binance" && (
                      <>
                        <p>Send to wallet: <span className="font-bold text-white">0x...</span></p>
                        <p>Amount: <span className="font-bold text-indigo-400">${typeof product.price === "string" ? product.price : (product.price as any)?.toFixed(2)}</span> (in USD equivalent)</p>
                        <p className="text-sm text-white/60">Contact us for current wallet address</p>
                      </>
                    )}
                  </div>
                </Card>
              )}

              {/* Payment Details */}
              <Card className="bg-white/10 border border-white/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Payment Details</h3>
                <div className="space-y-4">
                  <Input
                    name="transactionId"
                    placeholder="Transaction ID / Reference Number"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    required
                  />
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      Upload Payment Proof (Screenshot/Receipt)
                    </label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-indigo-500/50 transition cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        className="hidden"
                        id="payment-proof"
                        required
                      />
                      <label htmlFor="payment-proof" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                        <p className="text-white font-semibold">
                          {paymentProof ? paymentProof.name : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-white/60 text-sm">PNG, JPG, PDF (Max 5MB)</p>
                      </label>
                    </div>
                  </div>
                  <Textarea
                    name="notes"
                    placeholder="Additional notes (Optional)"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    rows={3}
                  />
                </div>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !selectedPayment}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-bold py-3 text-lg"
              >
                {isSubmitting ? "Processing..." : "Submit Order"}
              </Button>

              <p className="text-white/60 text-sm text-center">
                By submitting, you agree to our payment terms and conditions.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
