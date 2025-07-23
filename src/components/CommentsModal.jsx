import React, { useState, useEffect, useRef } from "react";
import {
  X,
  MessageCircle,
  Heart,
  Send,
  Loader2,
  MoreHorizontal,
  Edit3,
  Trash2,
  Reply,
} from "lucide-react";
import {
  addComment,
  getPostComments,
  toggleCommentLike,
  deleteComment,
  editComment,
} from "../api/FireStore";
import { auth } from "../firebaseConfig";

const CommentsModal = ({
  isOpen,
  onClose,
  postId,
  postTitle,
  totalComments,
}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getPostComments(postId);
      if (result.success) {
        setComments(result.comments || []);
      } else {
        setError(result.error || "Failed to load comments");
      }
    } catch (err) {
      setError("An error occurred while loading comments");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    if (!auth.currentUser) {
      alert("Please log in to comment");
      return;
    }

    setSubmitting(true);

    try {
      const result = await addComment(postId, newComment);
      if (result.success) {
        setNewComment("");
        await fetchComments(); // Refresh comments

        // Scroll to bottom to show new comment
        setTimeout(() => {
          const container = document.querySelector(".comments-container");
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 100);
      } else {
        alert(result.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("An error occurred while adding comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!auth.currentUser) {
      alert("Please log in to like comments");
      return;
    }

    try {
      const result = await toggleCommentLike(postId, commentId);
      if (result.success) {
        await fetchComments(); // Refresh comments to show updated likes
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const result = await deleteComment(postId, commentId);
      if (result.success) {
        await fetchComments(); // Refresh comments
        setShowDropdown(null);
      } else {
        alert(result.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred while deleting comment");
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const result = await editComment(postId, commentId, editText);
      if (result.success) {
        setEditingComment(null);
        setEditText("");
        await fetchComments(); // Refresh comments
      } else {
        alert(result.error || "Failed to edit comment");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      alert("An error occurred while editing comment");
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
    setShowDropdown(null);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText("");
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Recently";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const getProfileInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isCommentLikedByCurrentUser = (comment) => {
    if (!auth.currentUser || !comment.likedBy) return false;
    return comment.likedBy.some((like) => like.uid === auth.currentUser.uid);
  };

  const canDeleteComment = (comment) => {
    if (!auth.currentUser) return false;
    return comment.uid === auth.currentUser.uid;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
              <p className="text-sm text-gray-500 truncate max-w-xs">
                {postTitle || "Post"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto comments-container">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading comments...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">{error}</p>
              <button
                onClick={fetchComments}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Try again
              </button>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No comments yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Be the first to comment on this post!
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {getProfileInitials(comment.author)}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-gray-900">
                          {comment.author || "Anonymous"}
                        </h4>

                        {/* Comment Options */}
                        {canDeleteComment(comment) && (
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowDropdown(
                                  showDropdown === comment.id
                                    ? null
                                    : comment.id
                                )
                              }
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>

                            {showDropdown === comment.id && (
                              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                <button
                                  onClick={() => startEditing(comment)}
                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Comment Text or Edit Form */}
                      {editingComment === comment.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditComment(comment.id)}
                              className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {comment.text}
                          {comment.editedAt && (
                            <span className="text-xs text-gray-400 ml-2">
                              (edited)
                            </span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 mt-1 ml-3">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center space-x-1 text-xs transition-colors ${
                          isCommentLikedByCurrentUser(comment)
                            ? "text-red-500"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className={`w-3 h-3 ${
                            isCommentLikedByCurrentUser(comment)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                        <span>{comment.likes || 0}</span>
                      </button>

                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(comment.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleAddComment} className="flex space-x-3">
            {/* Current User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {auth.currentUser
                ? getProfileInitials(
                    auth.currentUser.displayName ||
                      auth.currentUser.email?.split("@")[0] ||
                      "U"
                  )
                : "?"}
            </div>

            {/* Comment Input */}
            <div className="flex-1">
              <div className="flex space-x-2">
                <textarea
                  ref={textareaRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={
                    auth.currentUser
                      ? "Write a comment..."
                      : "Please log in to comment"
                  }
                  disabled={!auth.currentUser || submitting}
                  className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows={2}
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={
                    !newComment.trim() || !auth.currentUser || submitting
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Character count */}
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-gray-400">
                  {!auth.currentUser && "Please log in to comment"}
                </div>
                <div className="text-xs text-gray-400">
                  {newComment.length}/500
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
