import React from "react";
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
} from "lucide-react";

export default function ProfileCard({
  currentUser,
  onEdit,
  isOwnProfile,
  followButton,
}) {
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

  return (
    <div className="w-full">
      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Cover Image */}
        <div className="relative">
          <div className="h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700">
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
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center relative">
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
                {/* Online Status Indicator - Optional */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>

            {/* Action Buttons - Mobile centered, Desktop right aligned */}
            <div className="w-full flex justify-center sm:justify-end mb-4">
              {isOwnProfile ? (
                <button
                  onClick={onEdit}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  {followButton}
                  {/* Additional action button - could be Message */}
                  <button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300">
                    <Mail className="h-4 w-4" />
                  </button>
                  {/* More options */}
                  <button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info Section - Now clearly below cover */}
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
              <button className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium text-sm">
                <Users className="h-4 w-4" />
                <span>Connect</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-50 text-gray-600 rounded-xl font-medium text-sm">
                <Mail className="h-4 w-4" />
                <span>Message</span>
              </button>
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
    </div>
  );
}
