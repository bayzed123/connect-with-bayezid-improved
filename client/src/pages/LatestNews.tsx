import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronRight, Plus, Trash2, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

/**
 * Design Philosophy: Latest News with Link Embedding
 * - Easy link management interface
 * - Embedded preview display
 * - Add/remove links functionality
 * - Professional layout
 */

interface NewsLink {
  id: string;
  title: string;
  url: string;
  description: string;
  image?: string;
}

export default function LatestNews() {
  const [newsLinks, setNewsLinks] = useState<NewsLink[]>([
    {
      id: "1",
      title: "Facebook Account Suspensions 2026: Root Causes & Legal Solutions",
      url: "https://example.com/facebook-suspensions",
      description: "Learn about the common reasons for Facebook account suspensions and how to legally resolve them.",
      image: "📄",
    },
    {
      id: "2",
      title: "Facebook Unlock Code Explained: How to Get Back Your Account",
      url: "https://example.com/facebook-unlock",
      description: "Complete guide to understanding Facebook unlock codes and recovering your account.",
      image: "🔓",
    },
    {
      id: "3",
      title: "Digital Marketing 2026: When Data Saturates Humanity",
      url: "https://example.com/digital-marketing-2026",
      description: "Exploring the future of digital marketing in an increasingly data-driven world.",
      image: "📊",
    },
    {
      id: "4",
      title: "Securing Digital Frontier: Vision & Mission as Meta Tech Provider",
      url: "https://example.com/meta-tech-provider",
      description: "Our vision and mission as a verified Meta Tech Provider focused on security and compliance.",
      image: "🛡️",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    image: "📰",
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddLink = () => {
    if (formData.title && formData.url && formData.description) {
      const newLink: NewsLink = {
        id: Date.now().toString(),
        ...formData,
      };
      setNewsLinks([newLink, ...newsLinks]);
      setFormData({ title: "", url: "", description: "", image: "📰" });
      setShowForm(false);
    }
  };

  const handleDeleteLink = (id: string) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      setNewsLinks(newsLinks.filter((link) => link.id !== id));
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(url);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const emojis = ["📰", "📄", "🔓", "📊", "🛡️", "📱", "💻", "🌐", "✨", "🚀"];

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
            <span className="text-white">Latest News</span>
          </div>

          {/* Page Header */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Latest News & Updates</h1>
              <p className="text-lg text-slate-300">Manage and share your latest news, articles, and resources</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add Link
            </button>
          </div>

          {/* Add Link Form */}
          {showForm && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Link</h2>
              <div className="space-y-6">
                {/* Emoji Selector */}
                <div>
                  <label className="block text-white font-bold mb-3">Select Icon/Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setFormData({ ...formData, image: emoji })}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all ${
                          formData.image === emoji
                            ? "bg-indigo-500 border-2 border-indigo-300 scale-110"
                            : "bg-white/10 border border-white/20 hover:bg-white/20"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-white font-bold mb-3">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter article title"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="block text-white font-bold mb-3">URL/Link *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-bold mb-3">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the article or news"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleAddLink}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105"
                  >
                    Add Link
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ title: "", url: "", description: "", image: "📰" });
                    }}
                    className="flex-1 px-6 py-3 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* News Links Display */}
          <div className="space-y-6">
            {newsLinks.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-slate-400 text-lg">No news links added yet. Click "Add Link" to get started!</p>
              </div>
            ) : (
              newsLinks.map((link) => (
                <div key={link.id} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/20">
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div className="text-4xl flex-shrink-0">{link.image}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                          {link.title}
                        </h3>
                        <p className="text-slate-300 text-sm md:text-base mb-4 line-clamp-2">{link.description}</p>

                        {/* Link Preview */}
                        <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                          <p className="text-xs text-slate-400 mb-1">Link:</p>
                          <p className="text-indigo-400 text-xs md:text-sm break-all font-mono">{link.url}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:scale-105"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open Link
                          </a>
                          <button
                            onClick={() => handleCopyLink(link.url)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-lg hover:bg-white/20 transition-all"
                          >
                            {copiedId === link.url ? (
                              <>
                                <Check className="w-4 h-4 text-green-400" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 text-sm font-bold rounded-lg hover:bg-red-500/30 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Info Box */}
          <div className="mt-12 p-6 bg-indigo-500/20 border border-indigo-500/50 rounded-2xl">
            <h3 className="text-lg font-bold text-indigo-300 mb-2">💡 Tip</h3>
            <p className="text-indigo-200 text-sm">
              You can add links to external articles, news, resources, or any content you want to share. Each link will display with an icon, title, description, and a direct link button. Links are saved locally and will appear in your Latest News section.
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
