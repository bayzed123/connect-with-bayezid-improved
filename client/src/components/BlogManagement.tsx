import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Trash2, Eye, EyeOff, Loader, RefreshCw } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category?: string;
  author?: string;
  isPublished: number;
  createdAt: Date;
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  // Fetch all blogs (admin view)
  const { data: allBlogs = [] } = trpc.blog.getAllAdmin.useQuery();

  // Mutations
  const togglePublishMutation = trpc.blog.togglePublish.useMutation({
    onSuccess: () => {
      // Refetch blogs after toggle
      refetchBlogs();
    },
    onError: (error) => {
      alert("Error updating blog: " + error.message);
      setToggling(null);
    },
  });

  const deleteBlogMutation = trpc.blog.deleteAdmin.useMutation({
    onSuccess: () => {
      // Refetch blogs after delete
      refetchBlogs();
    },
    onError: (error) => {
      alert("Error deleting blog: " + error.message);
      setDeleting(null);
    },
  });

  const refetchBlogs = () => {
    setLoading(true);
    if (allBlogs) {
      setBlogs(allBlogs as BlogPost[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (allBlogs && allBlogs.length > 0) {
      setBlogs(allBlogs as BlogPost[]);
      setLoading(false);
    }
  }, [allBlogs]);

  const handleTogglePublish = async (blog: BlogPost) => {
    setToggling(blog.id);
    const newStatus = blog.isPublished === 1 ? 0 : 1;
    await togglePublishMutation.mutateAsync({
      id: blog.id,
      isPublished: newStatus,
    });
    setToggling(null);
  };

  const handleDeleteBlog = async (blog: BlogPost) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"? This cannot be undone.`)) {
      setDeleting(blog.id);
      await deleteBlogMutation.mutateAsync({
        id: blog.id,
      });
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
        <Loader className="w-8 h-8 animate-spin mx-auto text-indigo-400" />
        <p className="text-slate-400 text-lg mt-4">Loading blogs...</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
        <p className="text-slate-400 text-lg">No blogs yet. Start writing!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Blog Management</h3>
        <button
          onClick={refetchBlogs}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Blog List */}
      <div className="space-y-3">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Blog Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold truncate">{blog.title}</h4>
                <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                  <span className="truncate">Category: {blog.category || "Uncategorized"}</span>
                  <span>•</span>
                  <span className="truncate">Author: {blog.author || "Unknown"}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {blog.isPublished === 1 ? (
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-300 text-xs font-bold rounded-full">
                    PUBLIC
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs font-bold rounded-full">
                    DRAFT
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Toggle Publish Button */}
                <button
                  onClick={() => handleTogglePublish(blog)}
                  disabled={toggling === blog.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                    blog.isPublished === 1
                      ? "bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30"
                      : "bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30"
                  } ${toggling === blog.id ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={blog.isPublished === 1 ? "Make Private" : "Make Public"}
                >
                  {toggling === blog.id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : blog.isPublished === 1 ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  {blog.isPublished === 1 ? "Private" : "Public"}
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteBlog(blog)}
                  disabled={deleting === blog.id}
                  className={`flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 font-bold rounded-lg hover:bg-red-500/30 transition-all ${
                    deleting === blog.id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Delete Blog"
                >
                  {deleting === blog.id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
        <p className="text-slate-300">
          Total Blogs: <span className="font-bold text-white">{blogs.length}</span> •
          Published: <span className="font-bold text-green-400">{blogs.filter((b) => b.isPublished === 1).length}</span> •
          Drafts: <span className="font-bold text-yellow-400">{blogs.filter((b) => b.isPublished === 0).length}</span>
        </p>
      </div>
    </div>
  );
}
