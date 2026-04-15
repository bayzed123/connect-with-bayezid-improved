import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronRight, FileText, Save, Eye, Send } from "lucide-react";
import { useState } from "react";

/**
 * Design Philosophy: Blog Writing Interface
 * - Clean, distraction-free writing interface
 * - Easy-to-use form for blog creation
 * - Preview functionality
 * - Professional layout
 */

interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
}

export default function WriteBlog() {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    excerpt: "",
    content: "",
    category: "Web Development",
    author: "Bayezid",
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const categories = [
    "Web Development",
    "Digital Marketing",
    "SEO",
    "Design",
    "Technology",
    "Business",
    "Social Media",
    "Other",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Save to localStorage for demonstration
    const blogs = JSON.parse(localStorage.getItem("userBlogs") || "[]");
    const newBlog = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };
    blogs.push(newBlog);
    localStorage.setItem("userBlogs", JSON.stringify(blogs));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePublish = () => {
    handleSave();
    alert("Blog post saved! You can view it in the News & Articles section.");
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all content?")) {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "Web Development",
        author: "Bayezid",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 w-full px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Write Blog</span>
          </div>

          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-indigo-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">Write Your Blog Post</h1>
            </div>
            <p className="text-lg text-slate-300">Create and publish your own blog articles to share your expertise with the world</p>
          </div>

          {/* Main Content */}
          {!isPreview ? (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white font-bold mb-3">Blog Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your blog post title"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Category and Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-bold mb-3">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white font-bold mb-3">Author Name *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-white font-bold mb-3">Excerpt (Short Summary) *</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Write a brief summary of your blog post (100-150 words)"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
                <p className="text-slate-400 text-sm mt-2">Character count: {formData.excerpt.length}/150</p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-white font-bold mb-3">Blog Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your blog post content here. You can use basic formatting like:
- Start lines with # for headings
- Use ** for bold text
- Use * for italic text"
                  rows={12}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none font-mono text-sm"
                />
                <p className="text-slate-400 text-sm mt-2">Character count: {formData.content.length}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <button
                  onClick={() => setIsPreview(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105"
                >
                  <Eye className="w-5 h-5" />
                  Preview
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-amber-500/50 transition-all hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  Save Draft
                </button>
                <button
                  onClick={handlePublish}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                  Publish
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                >
                  Clear
                </button>
              </div>

              {isSaved && (
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
                  ✓ Blog post saved successfully!
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-indigo-500/20 border border-indigo-500/50 rounded-lg">
                <p className="text-indigo-300 text-sm">
                  <strong>Tip:</strong> Your blog posts are saved locally. For a full content management system with database storage, please contact us for a custom solution.
                </p>
              </div>
            </div>
          ) : (
            /* Preview Mode */
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full">
                    {formData.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-white mb-4">{formData.title || "Your Blog Title"}</h1>

                {/* Meta */}
                <div className="flex items-center gap-4 text-slate-400 mb-8 pb-8 border-b border-white/10">
                  <span className="font-semibold text-white">{formData.author || "Author"}</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>

                {/* Excerpt */}
                <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <p className="text-slate-300 text-lg italic">{formData.excerpt || "Your excerpt will appear here..."}</p>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none">
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {formData.content || "Your blog content will appear here..."}
                  </div>
                </div>
              </div>

              {/* Back to Editor */}
              <div className="flex gap-4">
                <button
                  onClick={() => setIsPreview(false)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105"
                >
                  Back to Editor
                </button>
                <button
                  onClick={handlePublish}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                  Publish This Post
                </button>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog" className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-center">
              View Blog
            </Link>
            <Link href="/news" className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-center">
              News & Articles
            </Link>
            <Link href="/" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:scale-105 text-center">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
