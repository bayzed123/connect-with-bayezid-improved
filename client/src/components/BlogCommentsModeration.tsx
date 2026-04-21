import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function BlogCommentsModeration() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  // Fetch all comments
  const { data: comments = [], isLoading, refetch } = trpc.blog.getAllComments.useQuery();

  // Approve comment mutation
  const approveMutation = trpc.blog.approveComment.useMutation({
    onSuccess: () => {
      toast.success("Comment approved!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Reject comment mutation
  const rejectMutation = trpc.blog.rejectComment.useMutation({
    onSuccess: () => {
      toast.success("Comment rejected!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Delete comment mutation
  const deleteMutation = trpc.blog.deleteComment.useMutation({
    onSuccess: () => {
      toast.success("Comment deleted!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Filter comments
  const filteredComments = filter === "all" ? comments : comments.filter((c) => c.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Blog Comments Moderation</h2>
        <p className="text-gray-600">Review and approve/reject reader comments</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{comments.length}</div>
          <div className="text-sm text-gray-600">Total Comments</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{comments.filter((c: any) => c.status === "pending").length}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{comments.filter((c: any) => c.status === "approved").length}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{comments.filter((c: any) => c.status === "rejected").length}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </Card>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredComments.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No comments found with this filter
          </Card>
        ) : (
          filteredComments.map((comment: any) => (
            <Card key={comment.id} className="p-6">
              {/* Comment Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{comment.authorName}</h3>
                  <p className="text-sm text-gray-600">{comment.authorEmail}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      comment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : comment.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Blog Post Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">
                  <strong>On Blog Post:</strong> Blog ID #{comment.blogPostId}
                </p>
              </div>

              {/* Comment Content */}
              <div className="mb-4 p-4 bg-gray-50 rounded">
                <p className="text-gray-800">{comment.content}</p>
              </div>

              {/* Comment Date */}
              <div className="text-sm text-gray-500 mb-4">
                {new Date(comment.createdAt).toLocaleString()}
              </div>

              {/* Action Buttons */}
              {comment.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => approveMutation.mutate({ commentId: comment.id })}
                    disabled={approveMutation.isPending}
                  >
                    {approveMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => rejectMutation.mutate({ commentId: comment.id })}
                    disabled={rejectMutation.isPending}
                  >
                    {rejectMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <X className="w-4 h-4 mr-2" />
                    )}
                    Reject
                  </Button>
                </div>
              )}

              {/* Delete Button (always available) */}
              {comment.status !== "pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this comment?")) {
                      deleteMutation.mutate({ commentId: comment.id });
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete
                </Button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
