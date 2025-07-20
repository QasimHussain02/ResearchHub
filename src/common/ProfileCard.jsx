import React, { useMemo, useState } from "react";
import { Edit3, FileText, Users, MessageCircle, Plus, X } from "lucide-react";
import { getUser } from "../api/FireStore";

export default function UserProfileCard({ onEdit }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showInterestsPopup, setShowInterestsPopup] = useState(false);
  const [name, setName] = useState("");

  const availableInterests = [
    { name: "Machine Learning", color: "bg-blue-100 text-blue-800" },
    { name: "Computer Vision", color: "bg-green-100 text-green-800" },
    { name: "Neural Networks", color: "bg-purple-100 text-purple-800" },
    { name: "Natural Language Processing", color: "bg-pink-100 text-pink-800" },
    { name: "Deep Learning", color: "bg-indigo-100 text-indigo-800" },
    { name: "Robotics", color: "bg-yellow-100 text-yellow-800" },
    { name: "Data Science", color: "bg-red-100 text-red-800" },
    { name: "Computer Graphics", color: "bg-teal-100 text-teal-800" },
    { name: "Artificial Intelligence", color: "bg-orange-100 text-orange-800" },
    { name: "Quantum Computing", color: "bg-violet-100 text-violet-800" },
    { name: "Cybersecurity", color: "bg-gray-100 text-gray-800" },
    { name: "Blockchain", color: "bg-emerald-100 text-emerald-800" },
  ];

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) => {
      const isSelected = prev.some((item) => item.name === interest.name);
      if (isSelected) {
        return prev.filter((item) => item.name !== interest.name);
      } else {
        return [...prev, interest];
      }
    });
  };
  useMemo(() => {
    getUser();
  }, []);
  const handleSaveInterests = () => {
    setShowInterestsPopup(false);
  };

  const stats = [
    { icon: FileText, label: "Papers", value: "24" },
    { icon: Users, label: "Followers", value: "1.2K" },
    { icon: MessageCircle, label: "Discussions", value: "89" },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Cover Image - Full width, responsive height */}
      <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Main Content Area */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
        {/* Profile Section - Mobile: Stack vertically, Desktop: Side by side */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8 -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-32 relative z-10">
          {/* Mobile & Tablet Layout - Profile Picture Centered */}
          <div className="lg:hidden w-full flex flex-col items-center">
            {/* Profile Picture */}
            <div className="mb-4 sm:mb-6">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 sm:border-6 md:border-8 border-white shadow-2xl object-cover"
              />
            </div>
          </div>

          {/* Desktop Layout - Left Column */}
          <div className="hidden lg:flex flex-shrink-0 flex-col">
            <div className="mb-6">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                alt="Profile"
                className="w-48 h-48 rounded-full border-8 border-white shadow-2xl object-cover"
              />
            </div>

            {/* Desktop Stats - Vertical */}
            <div className="bg-white rounded-2xl shadow-xl p-6 w-48">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Statistics
              </h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <stat.icon className="w-6 h-6 text-gray-500" />
                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Responsive */}
          <div className="flex-1 w-full bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12">
            {/* User Info */}
            <div className="mb-6 sm:mb-8 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
                Dr. Sarah Johnson
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-3 sm:mb-4">
                Professor of Computer Science at Stanford University
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                <p className="text-sm sm:text-base md:text-lg text-gray-700 text-center lg:text-left">
                  Software Engineer | AI Researcher | CS Professor
                </p>
                <button onClick={onEdit}>
                  <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                </button>
              </div>

              {/* Mobile Stats - Horizontal (after name) */}
              <div className="lg:hidden bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 w-full mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
                  Statistics
                </h3>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg"
                    >
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mx-auto mb-1 sm:mb-2" />
                      <div className="text-lg sm:text-xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl text-base sm:text-lg transition-all duration-200 hover:shadow-lg hover:scale-105">
                  Follow
                </button>
                <button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl border-2 border-gray-300 hover:border-gray-400 text-base sm:text-lg transition-all duration-200 hover:shadow-lg hover:scale-105">
                  Message
                </button>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                About
              </h3>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                Leading researcher in artificial intelligence and machine
                learning with over 15 years of experience. Published extensively
                in top-tier conferences and journals. Currently focusing on
                advancing the field of computer vision and its applications in
                autonomous systems.
              </p>
            </div>

            {/* Research Interests */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Research Interests
                </h3>
                <button
                  onClick={() => setShowInterestsPopup(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 w-fit"
                >
                  <Plus className="w-4 h-4" />
                  Add Interests
                </button>
              </div>

              {selectedInterests.length > 0 ? (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {selectedInterests.map((interest, index) => (
                    <span
                      key={index}
                      className={`px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-medium ${interest.color} transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer`}
                    >
                      {interest.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm sm:text-base">
                  No research interests added yet. Click "Add Interests" to get
                  started.
                </p>
              )}
            </div>

            {/* Recent Activity */}
          </div>
        </div>
      </div>

      {/* Interests Selection Popup */}
      {showInterestsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Popup Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Select Research Interests
              </h2>
              <button
                onClick={() => setShowInterestsPopup(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              <p className="text-gray-600 mb-6">
                Choose your research interests from the options below:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableInterests.map((interest, index) => {
                  const isSelected = selectedInterests.some(
                    (item) => item.name === interest.name
                  );
                  return (
                    <button
                      key={index}
                      onClick={() => handleInterestToggle(interest)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">{interest.name}</span>
                      {isSelected && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Popup Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                {selectedInterests.length} interest
                {selectedInterests.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInterestsPopup(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveInterests}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Interests
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
