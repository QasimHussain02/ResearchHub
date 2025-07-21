import React, { useMemo, useState } from "react";
import { getStatus } from "../api/FireStore";
import { Heart, MessageCircle, Share2, Download, Eye } from "lucide-react";
export default function PostsProfile({ currentUser }) {
  const [posts, setPosts] = useState([]);
  useMemo(() => {
    getStatus(setPosts);
  }, []);
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
  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return (
    <>
      <div className="mt-10 ml-12 text-3xl font-bold">Posts</div>

      <div className="space-y-6 mt-12">
        {posts.filter((post) => post.currUser.email === currentUser.email)
          .length === 0 ? (
          <div className="text-center text-gray-500 text-lg font-medium py-20">
            <div className="text-4xl mb-4">📝</div>
            <p>No posts yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Start creating to share your research or thoughts!
            </p>
          </div>
        ) : (
          posts
            .filter((post) => post.currUser.email === currentUser.email)
            .map((post, index) => (
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
                      className={`w-12 h-12 rounded-full ${post.authorBg} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {post.authorInitials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {post.author}
                      </h3>
                      <p className="text-sm text-gray-500">{post.time}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getPostTypeStyle(
                      post.type
                    )}`}
                  >
                    {getPostTypeLabel(post.type)}
                  </span>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Tags */}
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

                {/* Post Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-50 gap-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        post.liked
                          ? "bg-red-500 text-white shadow-lg"
                          : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          post.liked ? "fill-current" : ""
                        }`}
                      />
                      <span>Like ({post.likes})</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300">
                      <MessageCircle className="w-4 h-4" />
                      <span>Comment ({post.comments})</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-300">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                  {post.type === "research-paper" && (
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                  )}
                  {post.type === "project" && (
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-all duration-300">
                      <Eye className="w-4 h-4" />
                      <span>View Project</span>
                    </button>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </>
  );
}
