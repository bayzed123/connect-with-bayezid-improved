import React, { useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";

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
  const productId = params?.productId ? parseInt(params.productId) : null;

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

  const { user } = useAuth();
  const productQuery = trpc.products.getById.useQuery(
    { id: productId || 0 },
    { enabled: !!productId }
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
      const paymentProofUrl = `payment-proof-${Date.now()}`;
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

      setSubmitSuccess(true);
      setTimeout(() => {
        if (order && order.id) {
          window.location.href = `/order-confirmation/${order.id}`;
        }
      }, 2000);
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm">Product</p>
                  <p className="text-white font-semibold">{product.name}</p>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Price:</span>
                    <span className="text-white font-semibold">
                      ${product.price}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Quantity:</span>
                    <span className="text-white font-semibold">1</span>
                  </div>
                  <div className="border-t border-white/20 pt-4 flex justify-between">
                    <span className="text-white font-bold">Total:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Phone Number (Optional)
                    </label>
                    <Input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="+880..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method Selection */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Select Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedPayment === method.id
                          ? "border-indigo-500 bg-indigo-500/20"
                          : "border-white/20 bg-white/5 hover:border-white/40"
                      }`}
                    >
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <p className="text-white font-semibold text-sm">
                        {method.name}
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        {method.description}
                      </p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Payment Details */}
              {selectedPayment && (
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Payment Details
                  </h2>
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-4">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-100">
                        <p className="font-semibold mb-1">
                          Payment Instructions:
                        </p>
                        <p>
                          Send ${product.price} to the {selectedPayment} account
                          provided below. Then enter your transaction ID and
                          upload proof of payment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Transaction ID / Reference Number
                    </label>
                    <Input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      placeholder="Enter your transaction ID"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-white/70 text-sm mb-2">
                      Upload Payment Proof
                    </label>
                    <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors">
                      <Upload className="w-8 h-8 text-white/50 mx-auto mb-2" />
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        className="hidden"
                        id="payment-proof"
                        required
                      />
                      <label
                        htmlFor="payment-proof"
                        className="cursor-pointer block"
                      >
                        <p className="text-white/70 text-sm">
                          {paymentProof
                            ? `Selected: ${paymentProof.name}`
                            : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-white/50 text-xs mt-1">
                          PNG, JPG, PDF up to 10MB
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-white/70 text-sm mb-2">
                      Additional Notes (Optional)
                    </label>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional information..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-24"
                    />
                  </div>
                </Card>
              )}

              {/* Submit Button */}
              {submitSuccess ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-green-100 font-semibold">
                      Order submitted successfully!
                    </p>
                    <p className="text-green-100/70 text-sm">
                      Redirecting to confirmation page...
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedPayment}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-2xl hover:shadow-indigo-500/50 text-white font-bold py-3 rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Submit Order"}
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
