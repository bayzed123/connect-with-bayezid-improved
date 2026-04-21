import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRoute, Link } from "wouter";
import { Calendar, User, Share2, ArrowLeft, Loader2, ChevronRight, Send, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { useState, useEffect } from "react";
import { initializeAdSense, ADSENSE_CLIENT } from "@/lib/adsense";

/**
 * Blog Post Detail Page
 * - Displays full blog post content
 * - Shows author, date, category information
 * - Includes related posts
 * - Share functionality
 * - Blog comments section
 */

export default function BlogDetail() {
  const [match, params] = useRoute("/blog/:slug");

  // Initialize AdSense on component mount
  useEffect(() => {
    initializeAdSense();
  }, []);

  // Fetch blog post by slug
  const { data: blog, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug: params?.slug || "" },
    { enabled: !!params?.slug }
  );

  // Fetch all blogs for related posts
  const { data: allBlogs = [] } = trpc.blog.getAll.useQuery();

  // Fetch approved comments
  const { data: comments = [], refetch: refetchComments } = trpc.comments.getApproved.useQuery(
    { blogPostId: blog?.id || 0 },
    { enabled: !!blog?.id }
  );

  // Create comment mutation
  const createCommentMutation = trpc.comments.create.useMutation({
    onSuccess: () => {
      refetchComments();
      setCommentForm({ name: "", email: "", content: "" });
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
    },
  });

  // Comment form state
  const [commentForm, setCommentForm] = useState({ name: "", email: "", content: "" });
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Get related posts (same category, exclude current)
  const relatedPosts = allBlogs
    .filter((post) => post.slug !== params?.slug && post.category === blog?.category)
    .slice(0, 3);

  if (!match) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
        <Header />
        <main className="flex-1 w-full px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Blog Post Not Found</h1>
            <p className="text-slate-300 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    const title = blog.title;

    if (navigator.share) {
      navigator.share({
        title,
        url,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 w-full px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white truncate">{blog.title}</span>
          </div>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <div className="mb-8">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-indigo-500/20 text-indigo-300 text-sm font-semibold rounded-full">
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{blog.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-slate-300 mb-8 pb-8 border-b border-white/10">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span>{new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <Streamdown>{blog.content}</Streamdown>
          </div>

          {/* Author Bio */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {blog.author && blog.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">About {blog.author}</h3>
                <p className="text-slate-300">
                  {blog.author} is a passionate writer and digital expert sharing insights about technology and digital growth.
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Comments</h2>

            {/* Comment Form */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-white mb-6">Leave a Comment</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (blog?.id && commentForm.name && commentForm.email && commentForm.content) {
                    createCommentMutation.mutate({
                      blogPostId: blog.id,
                      authorName: commentForm.name,
                      authorEmail: commentForm.email,
                      content: commentForm.content,
                    });
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={commentForm.email}
                    onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <textarea
                  placeholder="Your Comment"
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={createCommentMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createCommentMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  <span>{createCommentMutation.isPending ? "Posting..." : "Post Comment"}</span>
                </button>
              </form>

              {commentSuccess && (
                <div className="mt-4 flex items-center gap-2 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
                  <CheckCircle className="w-5 h-5" />
                  <span>Comment submitted! It will appear after admin approval.</span>
                </div>
              )}

              {createCommentMutation.error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                  <span>{createCommentMutation.error.message}</span>
                </div>
              )}
            </div>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-white">{comment.authorName}</h4>
                        <p className="text-sm text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-300">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>

          {/* AdSense Ad Space - Between Content and Related Posts */}
          <div className="my-12 text-center">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={ADSENSE_CLIENT}
              data-ad-slot="9876543210"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2"
                  >
                    {post.featuredImage && (
                      <div className="w-full h-40 overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded mb-2">
                        {post.category}
                      </span>
                      <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600/20 text-indigo-300 rounded-lg hover:bg-indigo-600/30 transition-colors border border-indigo-500/30"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to All Articles
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
