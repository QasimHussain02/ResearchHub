import React, { useState, useEffect, useMemo } from "react";
import { auth } from "../firebaseConfig";
import { getStatus, getUser } from "../api/FireStore";
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
} from "lucide-react";
import CreatePost from "../pages/CreatePost";

const Homefeed = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  useMemo(() => {
    getStatus(setPosts);
  }, []);
  useMemo(() => {
    getUser();
  }, []);
  localStorage.setItem("userEmail", auth.currentUser.email);
  // console.log(localStorage.getItem("userEmail"));

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

  return (
    <div className="min-h-screen bg-white">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          {isOpen && <CreatePost isOpen={isOpen} setIsOpen={setIsOpen} />}
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
