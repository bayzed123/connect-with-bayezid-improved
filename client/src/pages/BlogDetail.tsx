import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRoute, Link } from "wouter";
import { Calendar, User, Share2, ArrowLeft, Loader2, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

/**
 * Blog Post Detail Page
 * - Displays full blog post content
 * - Shows author, date, category information
 * - Includes related posts
 * - Share functionality
 */

export default function BlogDetail() {
  const [match, params] = useRoute("/blog/:slug");

  // Fetch blog post by slug
  const { data: blog, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug: params?.slug || "" },
    { enabled: !!params?.slug }
  );

  // Fetch all blogs for related posts
  const { data: allBlogs = [] } = trpc.blog.getAll.useQuery();

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
