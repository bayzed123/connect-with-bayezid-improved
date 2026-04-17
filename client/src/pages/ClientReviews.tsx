import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronRight, Star, Send, Loader, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Design Philosophy: Client Reviews & Testimonials
 * - Submit review form for clients
 * - Display approved reviews with star ratings
 * - Build trust with social proof
 * - Professional testimonial cards
 */

interface ClientReview {
  id: number;
  clientName: string;
  clientEmail: string;
  rating: number;
  review: string;
  company?: string;
  image?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export default function ClientReviews() {
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    rating: 5,
    review: "",
    company: "",
    image: "",
  });

  // Fetch approved reviews
  const { data: reviewsData, refetch } = trpc.reviews.getApproved.useQuery();
  const createMutation = trpc.reviews.create.useMutation();

  useEffect(() => {
    if (reviewsData) {
      setReviews(reviewsData as ClientReview[]);
      setIsLoading(false);
    }
  }, [reviewsData]);

  const handleSubmitReview = async () => {
    if (!formData.clientName || !formData.clientEmail || !formData.review) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.review.length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        rating: formData.rating,
        review: formData.review,
        company: formData.company,
        image: formData.image,
      });

      toast.success("Review submitted! It will appear after admin approval.");
      setFormData({
        clientName: "",
        clientEmail: "",
        rating: 5,
        review: "",
        company: "",
        image: "",
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-600 text-slate-600"
            }`}
          />
        ))}
      </div>
    );
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
            <span className="text-white">Client Reviews</span>
          </div>

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Client Reviews & Testimonials</h1>
            <p className="text-lg text-slate-300">See what our clients say about our services</p>
          </div>

          {/* Submit Review Button */}
          <div className="mb-12 text-center">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Share Your Review
            </button>
          </div>

          {/* Review Form */}
          {showForm && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Share Your Experience</h2>
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-white font-bold mb-3">Your Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white font-bold mb-3">Email Address *</label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-white font-bold mb-3">Company/Organization (Optional)</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your company name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-white font-bold mb-3">Rating *</label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= formData.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-600 text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review */}
                <div>
                  <label className="block text-white font-bold mb-3">Your Review *</label>
                  <textarea
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    placeholder="Share your experience with us (minimum 10 characters)"
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                  <p className="text-slate-400 text-sm mt-2">
                    {formData.review.length} characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                    <Send className="w-4 h-4" />
                    Submit Review
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormData({
                        clientName: "",
                        clientEmail: "",
                        rating: 5,
                        review: "",
                        company: "",
                        image: "",
                      });
                    }}
                    className="flex-1 px-6 py-3 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Display */}
          <div>
            {isLoading ? (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto text-indigo-400" />
                <p className="text-slate-400 text-lg mt-4">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
                <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2"
                  >
                    {/* Stars */}
                    <div className="mb-4">
                      {renderStars(review.rating)}
                    </div>

                    {/* Review Text */}
                    <p className="text-slate-300 text-sm mb-6 line-clamp-4">
                      "{review.review}"
                    </p>

                    {/* Client Info */}
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-white font-bold text-sm">{review.clientName}</p>
                      {review.company && (
                        <p className="text-indigo-400 text-xs">{review.company}</p>
                      )}
                      <p className="text-slate-400 text-xs mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Section */}
          {reviews.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-indigo-400 mb-2">{reviews.length}</p>
                <p className="text-slate-400">Total Reviews</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-amber-400 mb-2">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </p>
                <p className="text-slate-400">Average Rating</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-green-400 mb-2">100%</p>
                <p className="text-slate-400">Verified Reviews</p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-12 p-6 bg-indigo-500/20 border border-indigo-500/50 rounded-2xl">
            <h3 className="text-lg font-bold text-indigo-300 mb-2">💡 About Reviews</h3>
            <p className="text-indigo-200 text-sm">
              All reviews are moderated before appearing on our website to ensure quality and authenticity. Your feedback helps us improve our services and builds trust with potential clients.
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
