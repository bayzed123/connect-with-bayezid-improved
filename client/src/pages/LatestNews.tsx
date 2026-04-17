import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronRight, Plus, Trash2, ExternalLink, Copy, Check, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Design Philosophy: Latest News with Link Embedding & Database Persistence
 * - Easy link management interface
 * - Embedded preview display with iframe
 * - Add/remove links functionality
 * - Permanent database storage
 * - Professional layout
 */

interface NewsLink {
  id: number;
  title: string;
  link: string;
  emoji: string;
  description?: string;
  isExternal: number;
  createdAt: Date;
}

export default function LatestNews() {
  const [newsLinks, setNewsLinks] = useState<NewsLink[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    description: "",
    emoji: "📰",
    isExternal: 1,
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Fetch news from database
  const { data: newsData, refetch } = trpc.news.getAll.useQuery();
  const createMutation = trpc.news.create.useMutation();
  const deleteMutation = trpc.news.delete.useMutation();

  useEffect(() => {
    if (newsData) {
      setNewsLinks(newsData as NewsLink[]);
      setIsLoading(false);
    }
  }, [newsData]);

  const handleAddLink = async () => {
    if (!formData.title || !formData.link || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        link: formData.link,
        description: formData.description,
        emoji: formData.emoji,
        isExternal: formData.isExternal,
      });

      toast.success("News link added successfully!");
      setFormData({ title: "", link: "", description: "", emoji: "📰", isExternal: 1 });
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Failed to add news link");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("News link deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete news link");
        console.error(error);
      }
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(Date.now());
    setTimeout(() => setCopiedId(null), 2000);
  };

  const emojis = ["📰", "📄", "🔓", "📊", "🛡️", "📱", "💻", "🌐", "✨", "🚀"];

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
                        onClick={() => setFormData({ ...formData, emoji })}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all ${
                          formData.emoji === emoji
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
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {formData.link && !isValidUrl(formData.link) && (
                    <p className="text-red-400 text-sm mt-2">Please enter a valid URL</p>
                  )}
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
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                    Add Link
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ title: "", link: "", description: "", emoji: "📰", isExternal: 1 });
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
            {isLoading ? (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto text-indigo-400" />
                <p className="text-slate-400 text-lg mt-4">Loading news...</p>
              </div>
            ) : newsLinks.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-slate-400 text-lg">No news links added yet. Click "Add Link" to get started!</p>
              </div>
            ) : (
              newsLinks.map((link) => (
                <div key={link.id} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/20">
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div className="text-4xl flex-shrink-0">{link.emoji}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                          {link.title}
                        </h3>
                        <p className="text-slate-300 text-sm md:text-base mb-4 line-clamp-2">{link.description}</p>

                        {/* Link Preview */}
                        <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                          <p className="text-xs text-slate-400 mb-1">Link:</p>
                          <p className="text-indigo-400 text-xs md:text-sm break-all font-mono">{link.link}</p>
                        </div>

                        {/* Embedded Preview (if valid URL) */}
                        {isValidUrl(link.link) && (
                          <div className="mb-4 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                            <iframe
                              src={link.link}
                              title={link.title}
                              className="w-full h-64 border-0"
                              sandbox="allow-same-origin allow-scripts allow-popups"
                            />
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <a
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:scale-105"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open Link
                          </a>
                          <button
                            onClick={() => handleCopyLink(link.link)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-lg hover:bg-white/20 transition-all"
                          >
                            {copiedId === link.id ? (
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
              Add links to external articles, news, resources, or any content you want to share. Each link will display with an icon, title, description, and a direct link button. All links are permanently saved in the database and will always appear in your Latest News section.
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
