// Updated src/common/ProfileCard.jsx with image upload functionality

import React, { useState } from "react";
import {
  Edit,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Building2,
  Users,
  FileText,
  Globe,
  Mail,
  Phone,
  MoreHorizontal,
  MessageCircle,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOrCreateConversation, editUser } from "../api/FireStore";
import ProfileImageUpload from "../components/ProfileImageUpload";

export default function ProfileCard({
  currentUser,
  onEdit,
  isOwnProfile,
  followButton,
  targetUID,
}) {
  const navigate = useNavigate();
  const [isEditingImages, setIsEditingImages] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingCover, setUpdatingCover] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatWebsiteUrl = (website) => {
    if (!website) return "";
    if (website.startsWith("http://") || website.startsWith("https://")) {
      return website;
    }
    return `https://${website}`;
  };

  const getWebsiteDisplay = (website) => {
    if (!website) return "";
    return website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  };

  const handleSendMessage = async () => {
    if (!targetUID) {
      console.error("No target user ID provided for messaging");
      return;
    }

    try {
      const result = await getOrCreateConversation(targetUID);

      if (result.success) {
        navigate(`/messages?userId=${targetUID}`);
      } else {
        console.error("Failed to create conversation:", result.error);
        navigate(`/messages?userId=${targetUID}`);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      navigate(`/messages?userId=${targetUID}`);
    }
  };

  // Handle profile picture upload
  const handleProfileImageUpload = async (imageData) => {
    setUpdatingProfile(true);
    try {
      const result = await editUser({
        photoURL: imageData.url,
        profileImagePublicId: imageData.publicId,
        updatedAt: new Date(),
      });

      if (result.success) {
        console.log("Profile picture updated successfully");
        // The UI will update automatically through real-time listeners
      } else {
        alert("Failed to update profile picture: " + result.error);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Error updating profile picture: " + error.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Handle profile picture removal
  const handleProfileImageRemove = async () => {
    setUpdatingProfile(true);
    try {
      const result = await editUser({
        photoURL: null,
        profileImagePublicId: null,
        updatedAt: new Date(),
      });

      if (result.success) {
        console.log("Profile picture removed successfully");
      } else {
        alert("Failed to remove profile picture: " + result.error);
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      alert("Error removing profile picture: " + error.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Handle cover photo upload
  const handleCoverImageUpload = async (imageData) => {
    setUpdatingCover(true);
    try {
      const result = await editUser({
        coverPhotoURL: imageData.url,
        coverImagePublicId: imageData.publicId,
        updatedAt: new Date(),
      });

      if (result.success) {
        console.log("Cover photo updated successfully");
      } else {
        alert("Failed to update cover photo: " + result.error);
      }
    } catch (error) {
      console.error("Error updating cover photo:", error);
      alert("Error updating cover photo: " + error.message);
    } finally {
      setUpdatingCover(false);
    }
  };

  // Handle cover photo removal
  const handleCoverImageRemove = async () => {
    setUpdatingCover(true);
    try {
      const result = await editUser({
        coverPhotoURL: null,
        coverImagePublicId: null,
        updatedAt: new Date(),
      });

      if (result.success) {
        console.log("Cover photo removed successfully");
      } else {
        alert("Failed to remove cover photo: " + result.error);
      }
    } catch (error) {
      console.error("Error removing cover photo:", error);
      alert("Error removing cover photo: " + error.message);
    } finally {
      setUpdatingCover(false);
    }
  };

  return (
    <div className="w-full">
      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Cover Image Section */}
        <div className="relative">
          {/* Always Display Cover Photo - Don't change it unless specifically editing cover */}
          <div className="h-32 sm:h-40 md:h-48 lg:h-56 relative">
            {currentUser?.coverPhotoURL ? (
              <img
                src={currentUser.coverPhotoURL}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700"></div>
            )}

            {/* Cover Photo Edit Button - Only for own profile */}
            {isOwnProfile && (
              <button
                onClick={() => setIsEditingImages(!isEditingImages)}
                className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                title={isEditingImages ? "Cancel editing" : "Edit photos"}
              >
                <Camera className="h-5 w-5" />
              </button>
            )}

            {/* Cover Photo Upload Overlay - Only show when specifically editing cover */}
            {isOwnProfile && isEditingImages && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <ProfileImageUpload
                  currentImage={currentUser?.coverPhotoURL}
                  onImageUpload={handleCoverImageUpload}
                  onImageRemove={handleCoverImageRemove}
                  type="cover"
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Optional: Add pattern overlay */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="relative px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          {/* Avatar Section - Overlapping the cover */}
          <div className="flex flex-col items-center sm:items-start -mt-12 sm:-mt-16 md:-mt-20">
            {/* Avatar */}
            <div className="relative mb-4">
              {/* Always Display Profile Picture */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center relative overflow-hidden">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold">
                      {getInitials(currentUser?.name)}
                    </div>
                  )}

                  {/* Profile Picture Upload Overlay - Only show when editing */}
                  {isOwnProfile && isEditingImages && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                      <ProfileImageUpload
                        currentImage={currentUser?.photoURL}
                        onImageUpload={handleProfileImageUpload}
                        onImageRemove={handleProfileImageRemove}
                        type="profile"
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>

                {/* Profile Picture Edit Button - Only for own profile */}
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditingImages(!isEditingImages)}
                    className="absolute bottom-1 right-1 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                    title={
                      isEditingImages
                        ? "Cancel editing"
                        : "Edit profile picture"
                    }
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}

                {/* Online Status Indicator */}
                <div className="absolute bottom-1 left-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>

            {/* Action Buttons - Mobile centered, Desktop right aligned */}
            <div className="w-full flex justify-center sm:justify-end mb-4">
              {isOwnProfile ? (
                <div className="flex space-x-2">
                  {/* Edit Images Button */}
                  <button
                    onClick={() => setIsEditingImages(!isEditingImages)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
                      isEditingImages
                        ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Camera className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {isEditingImages ? "Done" : "Edit Photos"}
                    </span>
                    <span className="sm:hidden">
                      {isEditingImages ? "Done" : "Photos"}
                    </span>
                  </button>

                  {/* Edit Profile Button */}
                  <button
                    onClick={onEdit}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all duration-200 border border-gray-200 hover:border-gray-300"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  {followButton}
                  {/* Message button - only show if not own profile */}
                  <button
                    onClick={handleSendMessage}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium text-sm transition-all duration-200 border border-blue-200 hover:border-blue-300"
                    title="Send Message"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Message</span>
                  </button>
                  {/* More options */}
                  <button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info Section - Rest remains the same */}
          <div className="space-y-2 sm:-mt-14 sm:space-y-6">
            {/* Name and Headline */}
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {currentUser?.name || "Anonymous User"}
              </h1>
              {currentUser?.headline && (
                <p className="text-base sm:text-lg text-gray-600 mb-3 font-medium">
                  {currentUser.headline}
                </p>
              )}

              {/* Quick Info Tags */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-500">
                {currentUser?.location && (
                  <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-full">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{currentUser.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-full">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Joined {formatDate(currentUser?.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {currentUser?.bio && (
              <div className="text-center sm:text-left">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto sm:mx-0">
                  {currentUser.bio}
                </p>
              </div>
            )}

            {/* Stats Section - Enhanced */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="group cursor-pointer hover:bg-white rounded-lg p-2 sm:p-3 transition-all duration-200">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {currentUser?.followers?.length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">
                    Followers
                  </div>
                </div>
                <div className="group cursor-pointer hover:bg-white rounded-lg p-2 sm:p-3 transition-all duration-200">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {currentUser?.following?.length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">
                    Following
                  </div>
                </div>
                <div className="group cursor-pointer hover:bg-white rounded-lg p-2 sm:p-3 transition-all duration-200">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {currentUser?.postsCount || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">
                    Posts
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Institution */}
              {currentUser?.institution && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">
                      Institution
                    </div>
                    <div className="text-sm text-gray-900 font-medium">
                      {currentUser.institution}
                    </div>
                  </div>
                </div>
              )}

              {/* Website */}
              {currentUser?.website && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500 font-medium">
                      Website
                    </div>
                    <a
                      href={formatWebsiteUrl(currentUser.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium truncate block"
                    >
                      {getWebsiteDisplay(currentUser.website)}
                    </a>
                  </div>
                </div>
              )}

              {/* Email - Only show for own profile */}
              {isOwnProfile && currentUser?.email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl sm:col-span-2">
                  <div className="flex-shrink-0">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500 font-medium">
                      Email
                    </div>
                    <div className="text-sm text-gray-900 font-medium truncate">
                      {currentUser.email}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Research Interests */}
            {currentUser?.interests && currentUser.interests.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center sm:text-left">
                  Research Interests
                </h3>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {currentUser.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About Section */}
            {currentUser?.about && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center sm:text-left">
                  About
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-center sm:text-left">
                    {currentUser.about}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Actions - Mobile Only */}
            <div className="sm:hidden flex justify-center space-x-4 pt-4 border-t border-gray-100">
              {!isOwnProfile && (
                <>
                  <button className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium text-sm">
                    <Users className="h-4 w-4" />
                    <span>Connect</span>
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-50 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Message</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Cards - Optional Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Recent Activity Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Recent Posts
              </div>
              <div className="text-xs text-gray-500">Last 30 days</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-gray-900">
              {currentUser?.recentPosts || 0}
            </div>
          </div>
        </div>

        {/* Engagement Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Engagement
              </div>
              <div className="text-xs text-gray-500">Total interactions</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-gray-900">
              {currentUser?.totalEngagement || 0}
            </div>
          </div>
        </div>

        {/* Network Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Network</div>
              <div className="text-xs text-gray-500">Total connections</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-gray-900">
              {(currentUser?.followers?.length || 0) +
                (currentUser?.following?.length || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Instructions Modal - Only shown when editing */}
      {isOwnProfile && isEditingImages && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            📸 Photo Upload Tips
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>
              • <strong>Profile Picture:</strong> Square images work best (1:1
              ratio)
            </li>
            <li>
              • <strong>Cover Photo:</strong> Wide images recommended (16:9
              ratio)
            </li>
            <li>• Maximum file size: 5MB per image</li>
            <li>• Supported formats: JPG, PNG, GIF, WEBP</li>
            <li>• Images are automatically optimized for web</li>
          </ul>
        </div>
      )}
    </div>
  );
}
