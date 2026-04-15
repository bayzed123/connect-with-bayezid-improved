import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Calendar, User, ArrowRight, Newspaper, ExternalLink } from "lucide-react";

/**
 * Design Philosophy: News & Articles Listing
 * - Professional news article layout
 * - Mix of internal blog posts and external news
 * - Clear distinction between content types
 * - Easy navigation to full articles
 */

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  date: string;
  category: string;
  type: "internal" | "external";
  link: string;
  image: string;
}

const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Digital Marketing Trends in Bangladesh 2026",
    excerpt: "Explore the latest digital marketing strategies and trends that are transforming businesses in Bangladesh. Learn how to leverage these trends for your business growth.",
    source: "Connect With Bayezid Blog",
    date: "April 12, 2026",
    category: "Digital Marketing",
    type: "internal",
    link: "/blog/digital-marketing-strategies-2026",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "How AI is Revolutionizing Web Development",
    excerpt: "Discover how artificial intelligence is changing the landscape of web development and what it means for developers and businesses in 2026.",
    source: "Tech News Daily",
    date: "April 10, 2026",
    category: "Technology",
    type: "external",
    link: "#",
    image: "https://images.unsplash.com/photo-1677442d019cecf8e5c1a86da6ec19cc64b2ef490?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Mobile-First Design: Why It Matters Now",
    excerpt: "Learn why mobile-first design is essential for modern web development and how it impacts user experience and SEO rankings.",
    source: "Connect With Bayezid Blog",
    date: "April 8, 2026",
    category: "Web Design",
    type: "internal",
    link: "/blog/mobile-first-design-principles",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "SEO Best Practices for 2026",
    excerpt: "Stay ahead of the competition with the latest SEO best practices. Learn what Google is looking for and how to optimize your website accordingly.",
    source: "Search Engine Journal",
    date: "April 5, 2026",
    category: "SEO",
    type: "external",
    link: "#",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    title: "Complete SEO Optimization Guide",
    excerpt: "Master the art of SEO with our comprehensive guide. Learn on-page, off-page, and technical SEO strategies to boost your rankings.",
    source: "Connect With Bayezid Blog",
    date: "April 1, 2026",
    category: "SEO",
    type: "internal",
    link: "/blog/seo-optimization-guide",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    title: "Social Media Marketing Strategies That Work",
    excerpt: "Proven social media marketing strategies to increase engagement, build community, and drive conversions on all major platforms.",
    source: "Digital Marketing Institute",
    date: "March 28, 2026",
    category: "Social Media",
    type: "external",
    link: "#",
    image: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=600&h=400&fit=crop",
  },
];

export default function News() {
  const internalArticles = newsArticles.filter((article) => article.type === "internal");
  const externalArticles = newsArticles.filter((article) => article.type === "external");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 w-full px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-indigo-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">News & Articles</h1>
            </div>
            <p className="text-lg text-slate-300">Latest insights, industry news, and expert articles on digital marketing, web development, and technology</p>
          </div>

          {/* Internal Blog Posts Section */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded" />
              <h2 className="text-3xl font-bold text-white">Our Latest Blog Posts</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {internalArticles.map((article) => (
                <Link key={article.id} href={article.link}>
                  <div className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full">
                          {article.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-slate-300 text-sm mb-4 flex-1 line-clamp-3">{article.excerpt}</p>

                      {/* Meta Information */}
                      <div className="space-y-2 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <User className="w-3 h-3" />
                          <span>Connect With Bayezid</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                        </div>
                      </div>

                      {/* Read More Link */}
                      <div className="mt-4 flex items-center gap-2 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                        <span className="font-semibold text-sm">Read Full Article</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105">
                View All Blog Posts
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* External News Section */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded" />
              <h2 className="text-3xl font-bold text-white">Industry News & Updates</h2>
            </div>

            <div className="space-y-6">
              {externalArticles.map((article) => (
                <div key={article.id} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/20">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-64 h-48 md:h-auto overflow-hidden bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex-shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Category Badge */}
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full">
                            {article.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                          {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-slate-300 text-sm mb-4">{article.excerpt}</p>
                      </div>

                      {/* Meta Information */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4 text-slate-400 text-sm">
                          <span className="font-semibold text-amber-300">{article.source}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {article.date}
                          </span>
                        </div>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-semibold text-sm ml-auto"
                        >
                          Read More
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-slate-300 mb-6">Don't miss our latest articles and industry insights. Follow us on social media for daily updates.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.facebook.com/share/18GdrYu3LG/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                Follow on Facebook
              </a>
              <a href="https://www.instagram.com/freelancer_bayezid0" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-all">
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
