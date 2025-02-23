import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import HeaderProfileBtn from "@/app/editor/_components/HeaderProfileBtn";
import { getCommentsForSnippet, addComment, deleteComment } from "@/actions/comment.action"; // Assuming the functions are exported from a comments API file
import Comment from "./Comment";
import CommentForm from "./CommentForm";

function Comments({ snippetId }: { snippetId: string }) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]); // Store comments here

  // Fetch comments for the snippet on component mount
  const fetchComments = async () => {
    const response = await getCommentsForSnippet(snippetId);
    if (response.comments) {
      setComments(response.comments);
    } else {
      toast.error(response.error || "Failed to load comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [snippetId]);

  const handleSubmitComment = async (content: string) => {
    setIsSubmitting(true);

    const response = await addComment(snippetId, content);

    if (response.comment) {
      setComments((prevComments) => [response.comment, ...prevComments]);
      toast.success(response.message);
    } else {
      toast.error(response.error || "Something went wrong");
    }

    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId);

    const response = await deleteComment(commentId);

    if (response.message) {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      toast.success(response.message);
    } else {
      toast.error(response.error || "Failed to delete comment");
    }

    setDeletingCommentId(null);
  };

  return (
        <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-[#ffffff0a]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Discussion ({comments.length})
            </h2>
          </div>
    
          <div className="p-6 sm:p-8">
            {session?.user ? (
              <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} />
            ) : (
              <div className="bg-[#0a0a0f] rounded-xl p-6 text-center mb-8 border border-[#ffffff0a]">
                <p className="text-[#808086] mb-4">Sign in to join the discussion</p>
                <HeaderProfileBtn/>
              </div>
            )}
    
            <div className="space-y-6">
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  isDeleting={deletingCommentId === comment._id}
                  currentUserId={session && session.user ? session.user.id : null}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
    export default Comments;