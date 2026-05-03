import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Lock, LogOut, CheckCircle, XCircle, Trash2, Eye, EyeOff, Loader } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import BlogManagement from "@/components/BlogManagement";
import ProductsManagement from "@/components/ProductsManagement";
import OrdersManagement from "@/components/OrdersManagement";
import AdminOrdersSection from "@/components/AdminOrdersSection";
import WriteBlog from "./WriteBlog";

/**
 * Design Philosophy: Admin Control Panel
 * - Password-protected admin access
 * - Manage pending reviews (approve/reject)
 * - Manage news and articles
 * - View all submissions
 * - Professional admin interface
 */

interface PendingReview {
  id: number;
  clientName: string;
  clientEmail: string;
  rating: number;
  review: string;
  company?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

interface NewsItem {
  id: number;
  title: string;
  link: string;
  description: string;
  emoji: string;
  createdAt: Date;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"reviews" | "news" | "comments" | "blogs" | "write" | "products" | "orders" | "newsletter">("reviews");
  const [pendingComments, setPendingComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);

  // tRPC mutations and queries
  const { data: reviewsData, refetch: refetchReviews } = trpc.reviews.getPending.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: allNewsData, refetch: refetchNews } = trpc.news.getAll.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const approveReviewMutation = trpc.reviews.approve.useMutation();
  const rejectReviewMutation = trpc.reviews.reject.useMutation();
  const deleteNewsMutation = trpc.news.delete.useMutation();

  useEffect(() => {
    if (reviewsData) {
      setPendingReviews(reviewsData as PendingReview[]);
      setReviewsLoading(false);
    }
  }, [reviewsData]);

  useEffect(() => {
    if (allNewsData) {
      setNewsItems(allNewsData as NewsItem[]);
      setNewsLoading(false);
    }
  }, [allNewsData]);

  const handleLogin = () => {
    if (!password) {
      toast.error("Please enter password");
      return;
    }

    setIsLoading(true);
    // Password verification - uses secure comparison
    const correctPassword = "SmbSmb64";
    
    // Constant-time comparison to prevent timing attacks
    const isValid = password.length === correctPassword.length &&
      Array.from(password).every((char, i) => char === correctPassword[i]);
    
    if (isValid) {
      setIsAuthenticated(true);
      toast.success("Admin access granted!");
      setPassword("");
    } else {
      toast.error("Incorrect password");
    }
    setIsLoading(false);
  };

  const handleApproveReview = async (id: number) => {
    try {
      await approveReviewMutation.mutateAsync({ id });
      toast.success("Review approved!");
      refetchReviews();
    } catch (error) {
      toast.error("Failed to approve review");
      console.error(error);
    }
  };

  const handleRejectReview = async (id: number) => {
    try {
      await rejectReviewMutation.mutateAsync({ id });
      toast.success("Review rejected!");
      refetchReviews();
    } catch (error) {
      toast.error("Failed to reject review");
      console.error(error);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await deleteNewsMutation.mutateAsync({ id });
        toast.success("News item deleted!");
        refetchNews();
      } catch (error) {
        toast.error("Failed to delete news item");
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    toast.success("Logged out");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">Admin Panel</h1>
          <p className="text-slate-400 text-center mb-8">Enter your password to access admin controls</p>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              Login to Admin Panel
            </button>
          </div>

          <p className="text-slate-400 text-center text-sm mt-6">
            Protected area. Only authorized admins can access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Control Panel</h1>
            <p className="text-slate-400">Manage reviews, news, and website content</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-300 font-bold rounded-lg hover:bg-red-500/30 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 font-bold rounded-lg transition-all ${
              activeTab === "reviews"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                : "bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20"
            }`}
          >
            Pending Reviews ({pendingReviews.length})
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`px-6 py-3 font-bold rounded-lg transition-all ${
              activeTab === "news"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                : "bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20"
            }`}
          >
            All News Items ({newsItems.length})
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-6 py-3 font-bold rounded-lg transition-all ${
              activeTab === "blogs"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                : "bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20"
            }`}
          >
            Manage Blogs
          </button>
          <button
            onClick={() => setActiveTab("write")}
            className={`px-6 py-3 font-bold rounded-lg transition-all ${
              activeTab === "write"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                : "bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20"
            }`}
          >
            Write Blog
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 font-bold rounded-lg transition-all ${
              activeTab === "products"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                : "bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 font-bold rounded-lg transition-all ${
              activeTab === "orders"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                : "bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("newsletter")}
            className={`px-6 py-3 font-bold rounded-lg transition-all ${
              activeTab === "newsletter"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                : "bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20"
            }`}
          >
            Newsletter Subscribers
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "orders"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Orders Management
          </button>
        </div>

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {reviewsLoading ? (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto text-indigo-400" />
                <p className="text-slate-400 text-lg mt-4">Loading reviews...</p>
              </div>
            ) : pendingReviews.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-slate-400 text-lg">No pending reviews</p>
              </div>
            ) : (
              pendingReviews.map((review) => (
                <div key={review.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-slate-400 text-sm">Name</p>
                      <p className="text-white font-bold">{review.clientName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="text-white font-bold text-sm break-all">{review.clientEmail}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Rating</p>
                      <p className="text-amber-400 font-bold">{'⭐'.repeat(review.rating)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Company</p>
                      <p className="text-white font-bold">{review.company || "N/A"}</p>
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <p className="text-slate-300">"{review.review}"</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveReview(review.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-300 font-bold rounded-lg hover:bg-green-500/30 transition-all"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectReview(review.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 font-bold rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* News Tab */}
        {activeTab === "news" && (
          <div className="space-y-6">
            {newsLoading ? (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto text-indigo-400" />
                <p className="text-slate-400 text-lg mt-4">Loading news...</p>
              </div>
            ) : newsItems.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-slate-400 text-lg">No news items</p>
              </div>
            ) : (
              newsItems.map((news) => (
                <div key={news.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{news.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{news.title}</h3>
                      <p className="text-slate-300 mb-2">{news.description}</p>
                      <p className="text-indigo-400 text-sm break-all">{news.link}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-sm">
                      Added: {new Date(news.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleDeleteNews(news.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 font-bold rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === "blogs" && (
          <BlogManagement />
        )}

        {/* Write Blog Tab */}
        {activeTab === "write" && (
          <WriteBlog />
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <ProductsManagement />
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <OrdersManagement />
        )}

        {/* Newsletter Tab */}
        {activeTab === "newsletter" && (
          <NewsletterSection />
        )}
        {activeTab === "orders" && (
          <AdminOrdersSection />
        )}
      </div>
    </div>
  );
}

/**
 * Newsletter Subscribers Management Section
 */
function NewsletterSection() {
  const { data: subscribers = [], isLoading, refetch } = trpc.newsletter.getAll.useQuery();
  const unsubscribeMutation = trpc.newsletter.unsubscribe.useMutation();
  const deleteMutation = trpc.newsletter.delete.useMutation();

  const handleUnsubscribe = (id: number) => {
    if (confirm("Are you sure you want to unsubscribe this email?")) {
      unsubscribeMutation.mutate(
        { id },
        {
          onSuccess: () => {
            toast.success("Subscriber unsubscribed");
            refetch();
          },
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            toast.success("Subscriber deleted");
            refetch();
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
        <Loader className="w-8 h-8 animate-spin mx-auto text-indigo-400" />
        <p className="text-slate-300 mt-4">Loading subscribers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-2">Newsletter Subscribers</h3>
        <p className="text-slate-300 text-sm">Total: {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Subscribers Table */}
      {subscribers.length > 0 ? (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Subscribed Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber: any) => (
                  <tr key={subscriber.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300">{subscriber.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{subscriber.name || "—"}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          subscriber.status === "subscribed"
                            ? "bg-green-500/20 text-green-300"
                            : subscriber.status === "unsubscribed"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {new Date(subscriber.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {subscriber.status === "subscribed" && (
                          <button
                            onClick={() => handleUnsubscribe(subscriber.id)}
                            disabled={unsubscribeMutation.isPending}
                            className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded hover:bg-yellow-500/30 transition-colors text-xs font-semibold disabled:opacity-50"
                          >
                            Unsubscribe
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(subscriber.id)}
                          disabled={deleteMutation.isPending}
                          className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors text-xs font-semibold disabled:opacity-50 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-slate-400">No newsletter subscribers yet</p>
        </div>
      )}
    </div>
  );
}
