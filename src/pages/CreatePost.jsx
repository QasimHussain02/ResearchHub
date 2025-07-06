import React, { useState } from "react";
import {
  X,
  Upload,
  FileText,
  Image,
  Link,
  Users,
  Eye,
  Globe,
  Lock,
} from "lucide-react";

const CreatePost = ({ isOpen, setIsOpen }) => {
  const [postType, setPostType] = useState("discussion");
  const [visibility, setVisibility] = useState("public");
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const postTypes = [
    {
      value: "discussion",
      label: "Discussion",
      icon: Users,
      desc: "Start a conversation or ask questions",
    },
    {
      value: "research",
      label: "Research Paper",
      icon: FileText,
      desc: "Share your research work",
    },
    {
      value: "announcement",
      label: "Announcement",
      icon: Globe,
      desc: "Share news or updates",
    },
  ];

  const popularTags = [
    "Machine Learning",
    "Computer Science",
    "AI",
    "Data Science",
    "Research Methods",
    "Statistics",
    "Programming",
    "Academic Writing",
    "Literature Review",
    "Methodology",
  ];
  function tagsSubmit(e) {
    e.preventDefault();
    const tagInput = e.target.querySelector("input[type='text']");
    const newTag = tagInput.value.trim();
    if (newTag && !selectedTags.includes(newTag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, newTag]);
      tagInput.value = ""; // Clear input after adding
    }
  }
  const addTag = (tag) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black opacity-100  flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2  shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {" "}
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Create New Post
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        {/* Main content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Left side */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {/* Post Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Post Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {postTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setPostType(type.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        postType === type.value
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Icon
                          className={`w-5 h-5 mr-2 ${
                            postType === type.value
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            postType === type.value
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {type.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{type.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter a compelling title for your post..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Write your post content here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-2">
                  {[
                    { icon: FileText, label: "Attach File" },
                    { icon: Image, label: "Add Image" },
                    { icon: Link, label: "Add Link" },
                  ].map(({ icon: Icon, label }, idx) => (
                    <button
                      key={idx}
                      className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {label}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-500">0/2000 characters</span>
              </div>
            </div>

            {/* Upload for research papers */}
          </div>

          {/* Right side - Settings */}
          <div className="w-full lg:w-80 bg-gray-50 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto">
            {/* Visibility */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Visibility
              </label>
              <div className="space-y-2">
                {[
                  {
                    val: "public",
                    label: "Public",
                    Icon: Globe,
                    color: "text-green-600",
                  },
                  {
                    val: "private",
                    label: "Private",
                    Icon: Lock,
                    color: "text-orange-600",
                  },
                ].map(({ val, label, Icon, color }) => (
                  <button
                    key={val}
                    onClick={() => setVisibility(val)}
                    className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
                      visibility === val
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${color}`} />
                    <div className="text-left">
                      <div className="font-medium text-gray-700">{label}</div>
                      <div className="text-sm text-gray-500">
                        {val === "public"
                          ? "Anyone can see this post"
                          : "Only you can see this post"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tags <span className="text-gray-500">(up to 5)</span>
              </label>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <form action="" onSubmit={(e) => tagsSubmit(e)}>
                <input
                  type="text"
                  placeholder="Add a tag..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-3"
                />
              </form>
              <p className="text-sm text-gray-600 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    disabled={
                      selectedTags.includes(tag) || selectedTags.length >= 5
                    }
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Category (only for research) */}
            {postType === "research" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option value="">Select a category</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="engineering">Engineering</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="biology">Biology</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="social-science">Social Science</option>
                  <option value="literature">Literature</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {/* Preview */}
          </div>
        </div>
        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <span className="text-sm text-gray-600">
              {visibility === "public"
                ? "This post will be visible to everyone"
                : "This post will be private"}
            </span>
            {visibility === "public" ? (
              <Globe className="w-4 h-4 text-green-600" />
            ) : (
              <Lock className="w-4 h-4 text-orange-600" />
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button className="px-6 py-2 cursor-pointer bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors">
              Save Draft
            </button>
            <button className="px-2 cursor-pointer sm:px-6 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
