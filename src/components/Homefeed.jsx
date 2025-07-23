import React, { useState, useEffect, useMemo } from "react";
import { auth } from "../firebaseConfig";
import { getStatus, getUser, toggleLike } from "../api/FireStore";
import {
  Heart,
  MessageCircle,
  Share2,
  Download,
  Eye,
  Plus,
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  Code,
  Loader2,
} from "lucide-react";
import CreatePost from "../pages/CreatePost";
import LikesModal from "../components/LikesModal";
import { useNavigate } from "react-router-dom";
import CommentsModal from "../components/CommentsModal";
const Homefeed = ({ currUser }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [likesModal, setLikesModal] = useState({
    isOpen: false,
    postId: null,
    totalLikes: 0,
  });
  const [commentsModal, setCommentsModal] = useState({
    isOpen: false,
    postId: null,
    postTitle: "",
    totalComments: 0,
  });

  const [likingStates, setLikingStates] = useState({}); // Track which posts are being liked
  const navigate = useNavigate();

  // Set up real-time listener for current user data
  useEffect(() => {
    getUser(setUserData);
  }, []);

  // Set up real-time listener for posts
  useMemo(() => {
    getStatus(setPosts);
  }, []);

  const [trendingTopics] = useState([
    {
      icon: "🤖",
      title: "Artificial Intelligence",
      count: "156 discussions",
      color: "bg-blue-500",
    },
    {
      icon: "🧠",
      title: "Machine Learning",
      count: "98 papers",
      color: "bg-purple-500",
    },
    {
      icon: "🔗",
      title: "Blockchain",
      count: "67 projects",
      color: "bg-green-500",
    },
    {
      icon: "🔒",
      title: "Cybersecurity",
      count: "43 discussions",
      color: "bg-red-500",
    },
  ]);

  const [userStats] = useState([
    { number: 3, label: "Papers" },
    { number: 127, label: "Followers" },
    { number: 89, label: "Following" },
    { number: 24, label: "Discussions" },
  ]);

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

  const handleCommentsClick = (post) => {
    setCommentsModal({
      isOpen: true,
      postId: post.id,
      postTitle: post.title || post.status,
      totalComments: post.comments || 0,
    });
  };

  const closeCommentsModal = () => {
    setCommentsModal({
      isOpen: false,
      postId: null,
      postTitle: "",
      totalComments: 0,
    });
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "papers") return post.type === "research-paper";
    if (activeFilter === "discussions") return post.type === "discussion";
    if (activeFilter === "projects") return post.type === "project";
    return true;
  });

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

  const handleProfileClick = (post) => {
    if (post.currUser?.id === auth.currentUser?.uid) {
      navigate("/my-profile");
    } else if (post.currUser?.id) {
      navigate(`/profile/${post.currUser.id}`);
    }
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

  // Check if current user liked a post
  const isPostLikedByCurrentUser = (post) => {
    if (!auth.currentUser || !post.likedBy) return false;
    return post.likedBy.some((like) => like.uid === auth.currentUser.uid);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          {isOpen && (
            <CreatePost
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              currUser={userData || currUser}
            />
          )}

          {/* Likes Modal */}
          <LikesModal
            isOpen={likesModal.isOpen}
            onClose={closeLikesModal}
            postId={likesModal.postId}
            totalLikes={likesModal.totalLikes}
          />

          {/* Comments Modal */}
          <CommentsModal
            isOpen={commentsModal.isOpen}
            onClose={closeCommentsModal}
            postId={commentsModal.postId}
            postTitle={commentsModal.postTitle}
            totalComments={commentsModal.totalComments}
          />

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              {/* Feed Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Academic Feed
                </h1>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "All" },
                    { key: "papers", label: "Papers" },
                    { key: "discussions", label: "Discussions" },
                    { key: "projects", label: "Projects" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => handleFilterChange(tab.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeFilter === tab.key
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform -translate-y-0.5"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          onClick={() => handleProfileClick(post)}
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-lg transition-all duration-200"
                        >
                          {getProfileInitials(
                            post.currUser?.name || post.author
                          )}
                        </div>

                        <div>
                          <button
                            onClick={() => handleProfileClick(post)}
                            className="font-semibold cursor-pointer hover:text-blue-500 hover:underline text-gray-900 transition-colors"
                          >
                            {post.currUser?.name || post.author || "Anonymous"}
                          </button>
                          <p className="text-sm text-gray-500">
                            {post.timeStamp
                              ? new Date(
                                  post.timeStamp.seconds * 1000
                                ).toLocaleDateString()
                              : post.time || "Recently"}
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
                              {post.fileType
                                ? post.fileType.toUpperCase()
                                : "File"}{" "}
                              • Click to view
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
                      <div className="flex space-x-4">
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
                                isPostLikedByCurrentUser(post)
                                  ? "fill-current"
                                  : ""
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
                        <button
                          onClick={() => handleCommentsClick(post)}
                          className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Comment ({post.comments || 0})</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-300">
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
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
                      {(post.postType === "project" ||
                        post.type === "project") && (
                        <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-all duration-300">
                          <Eye className="w-4 h-4" />
                          <span>View Project</span>
                        </button>
                      )}
                    </div>

                    {/* Engagement Info */}
                    {post.likedBy && post.likedBy.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-50">
                        <button
                          onClick={() =>
                            handleLikesClick(post.id, post.likes || 0)
                          }
                          className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
                        >
                          {post.likedBy.length === 1
                            ? `Liked by ${
                                post.likedBy[0].name ||
                                post.likedBy[0].email?.split("@")[0] ||
                                "someone"
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Trending Topics */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300"
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${topic.color} flex items-center justify-center text-white text-sm`}
                      >
                        {topic.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {topic.title}
                        </p>
                        <p className="text-xs text-gray-500">{topic.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-500" />
                  Your Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {userStats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="text-2xl font-bold text-blue-600">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Homefeed;
