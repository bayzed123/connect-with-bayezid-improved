import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { useState } from "react";

/**
 * Design Philosophy: Modern Blog Listing
 * - Clean card-based layout with gradient accents
 * - Search and filter capabilities
 * - Consistent with site design
 * - Responsive grid layout
 */

interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

const blogPosts: BlogPostData[] = [
  {
    slug: "getting-started-with-web-development",
    title: "Getting Started with Web Development",
    excerpt: "Learn the fundamentals of web development and start your journey as a developer. We'll cover HTML, CSS, and JavaScript basics.",
    author: "Bayezid",
    date: "April 10, 2026",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
  },
  {
    slug: "digital-marketing-strategies-2026",
    title: "Digital Marketing Strategies for 2026",
    excerpt: "Discover the most effective digital marketing strategies that will help your business grow in 2026. From SEO to social media.",
    author: "Bayezid",
    date: "April 8, 2026",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=600&h=400&fit=crop",
  },
  {
    slug: "mobile-first-design-principles",
    title: "Mobile-First Design Principles",
    excerpt: "Understand why mobile-first design is essential in today's digital landscape and how to implement it effectively.",
    author: "Bayezid",
    date: "April 5, 2026",
    category: "Design",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=400&fit=crop",
  },
  {
    slug: "seo-optimization-guide",
    title: "Complete SEO Optimization Guide",
    excerpt: "Master the art of SEO with our comprehensive guide. Learn on-page, off-page, and technical SEO strategies.",
    author: "Bayezid",
    date: "April 1, 2026",
    category: "SEO",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=400&fit=crop",
  },
  {
    slug: "building-responsive-websites",
    title: "Building Responsive Websites",
    excerpt: "Create websites that look great on all devices. Learn responsive design techniques and best practices.",
    author: "Bayezid",
    date: "March 28, 2026",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
  },
  {
    slug: "social-media-marketing-tips",
    title: "Social Media Marketing Tips",
    excerpt: "Boost your social media presence with proven strategies and tips for engaging your audience effectively.",
    author: "Bayezid",
    date: "March 25, 2026",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=600&h=400&fit=crop",
  },
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(blogPosts.map((post) => post.category)));

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 w-full px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Blog</h1>
            <p className="text-lg text-slate-300">Insights, tips, and stories about digital growth and web development</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === null
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-slate-300 text-sm mb-4 flex-1">{post.excerpt}</p>

                      {/* Meta Information */}
                      <div className="space-y-2 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                      </div>

                      {/* Read More Link */}
                      <div className="mt-4 flex items-center gap-2 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                        <span className="font-semibold">Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
