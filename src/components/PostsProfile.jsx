import React, { useEffect, useState } from "react";
import { getStatus, toggleLike } from "../api/FireStore";
import { auth } from "../firebaseConfig";
import {
  Heart,
  MessageCircle,
  Share2,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import { ProfileAvatar, ProfileLink } from "../helper/ProfileNavigation";
import LikesModal from "./LikesModal";

export default function PostsProfile({ currentUser, targetUID, isOwnProfile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [likesModal, setLikesModal] = useState({
    isOpen: false,
    postId: null,
    totalLikes: 0,
  });
  const [likingStates, setLikingStates] = useState({});

  useEffect(() => {
    setLoading(true);
    getStatus(setPosts);
  }, []);

  useEffect(() => {
    if (posts.length > 0 && currentUser?.email) {
      // Filter posts for the target user
      const filteredPosts = posts.filter((post) => {
        // If we have a target user's email, filter by that
        if (currentUser?.email) {
          return post.currUser?.email === currentUser.email;
        }
        return false;
      });

      setUserPosts(filteredPosts);
      setLoading(false);
    } else if (posts.length === 0 && currentUser?.email) {
      // If we have the user data but no posts loaded yet, keep loading
      setLoading(true);
    } else {
      // No posts found, stop loading
      setLoading(false);
    }
  }, [posts, currentUser]);

  const getPostTypeStyle = (type) => {
    switch (type) {
      case "research-paper":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "discussion":
        return "bg-red-50 text-red-600 border-red-200";
      case "project":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getPostTypeLabel = (type) => {
    switch (type) {
      case "research-paper":
        return "Research Paper";
      case "discussion":
        return "Discussion";
      case "project":
        return "Project";
      default:
        return "Post";
    }
  };

  const handleLike = async (postId) => {
    if (!auth.currentUser) {
      alert("Please log in to like posts");
      return;
    }

    // Prevent multiple simultaneous like requests for the same post
    if (likingStates[postId]) return;

    setLikingStates((prev) => ({ ...prev, [postId]: true }));

    try {
      const result = await toggleLike(postId);

      if (result.success) {
        // The posts will be updated automatically through the real-time listener
        console.log("Like toggled successfully");
      } else {
        console.error("Failed to toggle like:", result.error);
        alert("Failed to update like. Please try again.");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLikingStates((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleLikesClick = (postId, totalLikes) => {
    if (totalLikes > 0) {
      setLikesModal({ isOpen: true, postId, totalLikes });
    }
  };

  const closeLikesModal = () => {
    setLikesModal({ isOpen: false, postId: null, totalLikes: 0 });
  };

  const handleShare = (post) => {
    // Basic share functionality
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Check if current user liked a post
  const isPostLikedByCurrentUser = (post) => {
    if (!auth.currentUser || !post.likedBy) return false;
    return post.likedBy.some((like) => like.uid === auth.currentUser.uid);
  };

  if (loading) {
    return (
      <div className="mt-10 mx-4 sm:mx-8 lg:mx-16">
        <div className="text-3xl font-bold mb-8 text-center lg:text-left">
          {isOwnProfile ? "My Posts" : `${currentUser?.name || "User"}'s Posts`}
        </div>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading posts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 mx-4 sm:mx-8 lg:mx-16">
      <div className="text-3xl font-bold mb-8 text-center lg:text-left">
        {isOwnProfile ? "My Posts" : `${currentUser?.name || "User"}'s Posts`}
      </div>

      {/* Likes Modal */}
      <LikesModal
        isOpen={likesModal.isOpen}
        onClose={closeLikesModal}
        postId={likesModal.postId}
        totalLikes={likesModal.totalLikes}
      />

      <div className="space-y-6">
        {userPosts.length === 0 ? (
          <div className="text-center text-gray-500 text-lg font-medium py-20">
            <div className="text-4xl mb-4">📝</div>
            <p>
              {isOwnProfile
                ? "No posts yet"
                : `${
                    currentUser?.name || "This user"
                  } hasn't posted anything yet`}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {isOwnProfile
                ? "Start creating to share your research or thoughts!"
                : "Check back later for new content!"}
            </p>
          </div>
        ) : (
          userPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <ProfileAvatar
                    user={post.currUser || currentUser}
                    size="md"
                    showName={false}
                  />
                  <div>
                    <ProfileLink user={post.currUser || currentUser}>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {post.currUser?.name ||
                          currentUser?.name ||
                          "Anonymous"}
                      </h3>
                    </ProfileLink>
                    <p className="text-sm text-gray-500">
                      {post.timeStamp
                        ? new Date(
                            post.timeStamp.seconds * 1000
                          ).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getPostTypeStyle(
                    post.postType || post.type
                  )}`}
                >
                  {getPostTypeLabel(post.postType || post.type)}
                </span>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                  {post.title || post.status}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {post.description || post.excerpt || post.status}
                </p>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* File Preview */}
              {post.fileURL && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {post.fileType === "pdf" ? "📄" : "📎"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {post.fileName || "Attached file"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {post.fileType ? post.fileType.toUpperCase() : "File"} •
                        Click to view
                      </p>
                    </div>
                    <button
                      onClick={() => window.open(post.fileURL, "_blank")}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-50 gap-4">
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={likingStates[post.id]}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isPostLikedByCurrentUser(post)
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600"
                    } ${
                      likingStates[post.id]
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {likingStates[post.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart
                        className={`w-4 h-4 ${
                          isPostLikedByCurrentUser(post) ? "fill-current" : ""
                        }`}
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikesClick(post.id, post.likes || 0);
                      }}
                      className="hover:underline"
                      disabled={likingStates[post.id]}
                    >
                      Like ({post.likes || 0})
                    </button>
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300">
                    <MessageCircle className="w-4 h-4" />
                    <span>Comment ({post.comments || 0})</span>
                  </button>

                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Action Buttons Based on Post Type */}
                <div className="flex gap-2">
                  {(post.postType === "research-paper" ||
                    post.type === "research-paper") &&
                    post.fileURL && (
                      <button
                        onClick={() => window.open(post.fileURL, "_blank")}
                        className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </button>
                    )}

                  {(post.postType === "project" || post.type === "project") && (
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-all duration-300">
                      <Eye className="w-4 h-4" />
                      <span>View Project</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Engagement Info */}
              {post.likedBy && post.likedBy.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => handleLikesClick(post.id, post.likes || 0)}
                    className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
                  >
                    {post.likedBy.length === 1
                      ? `Liked by ${
                          post.likedBy[0].name ||
                          post.likedBy[0].email?.split("@")[0] ||
                          "1 person"
                        }`
                      : post.likedBy.length === 2
                      ? `Liked by ${
                          post.likedBy[0].name ||
                          post.likedBy[0].email?.split("@")[0] ||
                          "someone"
                        } and ${
                          post.likedBy[1].name ||
                          post.likedBy[1].email?.split("@")[0] ||
                          "1 other"
                        }`
                      : `Liked by ${
                          post.likedBy[0].name ||
                          post.likedBy[0].email?.split("@")[0] ||
                          "someone"
                        } and ${post.likedBy.length - 1} others`}
                  </button>
                </div>
              )}

              {/* Engagement Stats */}
              <div className="mt-4 pt-3 border-t border-gray-50">
                <div className="flex justify-between text-sm text-gray-500">
                  <button
                    onClick={() => handleLikesClick(post.id, post.likes || 0)}
                    className="hover:underline"
                  >
                    {post.likes || 0} likes
                  </button>
                  <div className="flex gap-4">
                    <span>{post.comments || 0} comments</span>
                    <span>{post.views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button (if needed) */}
      {userPosts.length > 0 && userPosts.length >= 10 && (
        <div className="text-center mt-8">
          <button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 hover:shadow-lg">
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
}
