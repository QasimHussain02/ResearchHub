import React, { useEffect, useState } from "react";
import { getPostsWithLikeStatus, toggleLikePost } from "../api/FireStore";
import {
  Heart,
  MessageCircle,
  Share2,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import { ProfileAvatar, ProfileLink } from "../helper/ProfileNavigation";
import { auth } from "../firebaseConfig";

export default function PostsProfile({ currentUser, targetUID, isOwnProfile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [likingPosts, setLikingPosts] = useState(new Set()); // Track which posts are being liked

  useEffect(() => {
    setLoading(true);
    const unsubscribe = getPostsWithLikeStatus(setPosts);
    return () => unsubscribe && unsubscribe();
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

    // Prevent multiple like requests for the same post
    if (likingPosts.has(postId)) return;

    // Add to liking posts set
    setLikingPosts((prev) => new Set(prev).add(postId));

    try {
      const result = await toggleLikePost(postId);

      if (result.success) {
        // Update the local state immediately for better UX
        setUserPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  liked: result.liked,
                  likes: result.newLikeCount,
                }
              : post
          )
        );

        // Also update the main posts array
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  liked: result.liked,
                  likes: result.newLikeCount,
                }
              : post
          )
        );
      } else {
        console.error("Failed to toggle like:", result.error);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      // Remove from liking posts set
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleShare = (post) => {
    // Basic share functionality
    if (navigator.share) {
      navigator.share({
        title: post.title || post.status,
        text: post.description || post.excerpt || post.status,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
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
                    disabled={likingPosts.has(post.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 disabled:opacity-70 ${
                      post.liked
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    {likingPosts.has(post.id) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart
                        className={`w-4 h-4 ${
                          post.liked ? "fill-current" : ""
                        }`}
                      />
                    )}
                    <span>
                      {likingPosts.has(post.id)
                        ? "Loading..."
                        : `Like (${post.likes || 0})`}
                    </span>
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

              {/* Engagement Stats */}
              <div className="mt-4 pt-3 border-t border-gray-50">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{post.likes || 0} likes</span>
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
