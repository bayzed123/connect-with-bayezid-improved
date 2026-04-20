import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { Link } from "wouter";

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const productId = parseInt(params?.id || "0");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: 1,
    notes: "",
  });

  const [orderStatus, setOrderStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch product details
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });

  // Create order mutation
  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: () => {
      setOrderStatus("success");
      setFormData({ name: "", email: "", phone: "", quantity: 1, notes: "" });
      setTimeout(() => setOrderStatus("idle"), 3000);
    },
    onError: (error) => {
      setOrderStatus("error");
      setErrorMessage(error.message || "Failed to create order");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus("loading");

    if (!product) return;

    const totalPrice = (
      parseFloat(product.discountPrice || product.price || "0") * formData.quantity
    ).toFixed(2);

    createOrderMutation.mutate({
      productId: product.id,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone || undefined,
      quantity: formData.quantity,
      totalPrice,
      status: "pending",
      notes: formData.notes || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Product not found</p>
          <Link href="/products">
            <a>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                Back to Products
              </Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.discountPrice || product.price || "0");
  const totalPrice = (price * formData.quantity).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Back Button */}
      <div className="w-full px-4 py-4 border-b border-indigo-500/20">
        <div className="max-w-6xl mx-auto">
          <Link href="/products">
            <a className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </a>
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              {product.image ? (
                <div className="relative h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-96 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
                  <p className="text-slate-400">No image available</p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
                {product.category && (
                  <Badge className="mb-4">{product.category}</Badge>
                )}
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-slate-300 whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              {/* Pricing */}
              <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  {product.discountPrice ? (
                    <>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Price</p>
                        <p className="text-3xl font-bold text-indigo-400">
                          ${parseFloat(product.discountPrice).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Original</p>
                        <p className="text-xl text-slate-400 line-through">
                          ${parseFloat(product.price || "0").toFixed(2)}
                        </p>
                      </div>
                    </>
                  ) : product.price ? (
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Price</p>
                      <p className="text-3xl font-bold text-indigo-400">
                        ${parseFloat(product.price).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-400">Contact for pricing</p>
                  )}
                </div>
              </div>

              {/* Purchase Form */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Order Now</CardTitle>
                  <CardDescription>Fill in your details to place an order</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:bg-white/15 transition-all"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:bg-white/15 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:bg-white/15 transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                        }
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:bg-white/15 transition-all"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Special Requests / Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:bg-white/15 transition-all resize-none"
                        rows={3}
                        placeholder="Any special requests?"
                      />
                    </div>

                    {/* Total Price */}
                    <div className="bg-indigo-500/20 border border-indigo-500/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-indigo-400">
                          ${totalPrice}
                        </span>
                      </div>
                    </div>

                    {/* Status Messages */}
                    {orderStatus === "success" && (
                      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-400" />
                        <p className="text-green-300">Order submitted successfully! We'll contact you soon.</p>
                      </div>
                    )}

                    {orderStatus === "error" && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-300">{errorMessage}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={orderStatus === "loading"}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center gap-2"
                    >
                      {orderStatus === "loading" ? (
                        "Processing..."
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
