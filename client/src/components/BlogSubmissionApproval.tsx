import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Check, X, Loader, RefreshCw, Eye } from "lucide-react";

interface BlogSubmission {
  id: number;
  title: string;
  author: string;
  submittedBy?: string;
  submissionStatus: "admin" | "pending" | "approved" | "rejected";
  createdAt: Date;
  excerpt: string;
}

export default function BlogSubmissionApproval() {
  const [submissions, setSubmissions] = useState<BlogSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<number | null>(null);

  // Fetch pending blog submissions
  const { data: allBlogs = [] } = trpc.blog.getAllAdmin.useQuery();

  // Mutations for approval/rejection
  const approveBlogMutation = trpc.blog.updateSubmissionStatus.useMutation({
    onSuccess: () => {
      refetchSubmissions();
    },
    onError: (error) => {
      alert("Error approving blog: " + error.message);
      setApproving(null);
    },
  });

  const rejectBlogMutation = trpc.blog.updateSubmissionStatus.useMutation({
    onSuccess: () => {
      refetchSubmissions();
    },
    onError: (error) => {
      alert("Error rejecting blog: " + error.message);
      setRejecting(null);
    },
  });

  const refetchSubmissions = () => {
    setLoading(true);
    if (allBlogs) {
      const pending = (allBlogs as BlogSubmission[]).filter(
        (blog) => blog.submissionStatus === "pending"
      );
      setSubmissions(pending);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (allBlogs && allBlogs.length > 0) {
      const pending = (allBlogs as BlogSubmission[]).filter(
        (blog) => blog.submissionStatus === "pending"
      );
      setSubmissions(pending);
      setLoading(false);
    }
  }, [allBlogs]);

  const handleApprove = async (submission: BlogSubmission) => {
    setApproving(submission.id);
    await approveBlogMutation.mutateAsync({
      id: submission.id,
      submissionStatus: "approved",
      isPublished: 1, // Auto-publish approved submissions
    });
    setApproving(null);
  };

  const handleReject = async (submission: BlogSubmission) => {
    if (window.confirm(`Are you sure you want to reject "${submission.title}"?`)) {
      setRejecting(submission.id);
      await rejectBlogMutation.mutateAsync({
        id: submission.id,
        submissionStatus: "rejected",
      });
      setRejecting(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
        <Loader className="w-8 h-8 animate-spin mx-auto text-indigo-400" />
        <p className="text-slate-400 text-lg mt-4">Loading submissions...</p>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
        <p className="text-slate-400 text-lg">No pending blog submissions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">
          Blog Submission Approvals ({submissions.length})
        </h3>
        <button
          onClick={refetchSubmissions}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Submission List */}
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
          >
            {/* Title - Full display at top */}
            <div className="w-full mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="text-white font-bold text-lg break-words">{submission.title}</h4>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-slate-400 text-sm">Author</p>
                <p className="text-white font-medium">{submission.author}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Submitted By</p>
                <p className="text-white font-medium break-all">{submission.submittedBy || "Unknown"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Submitted</p>
                <p className="text-white font-medium">
                  {new Date(submission.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs font-bold rounded-full">
                  PENDING
                </span>
              </div>
            </div>

            {/* Excerpt */}
            <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-slate-300 text-sm line-clamp-2">{submission.excerpt}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              {/* Preview Button */}
              <a
                href={`/blog/${submission.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 font-bold rounded-lg hover:bg-blue-500/30 transition-all"
              >
                <Eye className="w-4 h-4" />
                Preview
              </a>

              {/* Approve Button */}
              <button
                onClick={() => handleApprove(submission)}
                disabled={approving === submission.id}
                className={`flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-300 font-bold rounded-lg hover:bg-green-500/30 transition-all ${
                  approving === submission.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Approve Submission"
              >
                {approving === submission.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Approve
              </button>

              {/* Reject Button */}
              <button
                onClick={() => handleReject(submission)}
                disabled={rejecting === submission.id}
                className={`flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 font-bold rounded-lg hover:bg-red-500/30 transition-all ${
                  rejecting === submission.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Reject Submission"
              >
                {rejecting === submission.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
