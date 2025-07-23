import React, { useState } from "react";
import {
  Search,
  UserPlus,
  UserCheck,
  Users,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Navbar from "../common/navbar";

const People = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with actual data from Firebase
  const followRequests = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      username: "sarah.johnson",
      avatar: null,
      bio: "AI Research Scientist at Stanford University",
      mutualFollowers: 12,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      name: "Ahmed Khan",
      username: "ahmed.khan",
      avatar: null,
      bio: "PhD Student in Computer Science",
      mutualFollowers: 5,
      timestamp: "1 day ago",
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      username: "maria.rodriguez",
      avatar: null,
      bio: "Machine Learning Engineer",
      mutualFollowers: 8,
      timestamp: "3 days ago",
    },
  ];

  const followers = [
    {
      id: 1,
      name: "John Smith",
      username: "john.smith",
      avatar: null,
      bio: "Data Scientist at Google",
      isFollowing: true,
      followedDate: "January 2025",
    },
    {
      id: 2,
      name: "Emily Chen",
      username: "emily.chen",
      avatar: null,
      bio: "Research Fellow in Biomedical Engineering",
      isFollowing: false,
      followedDate: "December 2024",
    },
    {
      id: 3,
      name: "Michael Brown",
      username: "michael.brown",
      avatar: null,
      bio: "Professor of Computer Science",
      isFollowing: true,
      followedDate: "November 2024",
    },
    {
      id: 4,
      name: "Lisa Wang",
      username: "lisa.wang",
      avatar: null,
      bio: "PhD in Artificial Intelligence",
      isFollowing: false,
      followedDate: "October 2024",
    },
  ];

  const following = [
    {
      id: 1,
      name: "Prof. David Miller",
      username: "david.miller",
      avatar: null,
      bio: "Head of AI Research Lab",
      followedDate: "December 2024",
    },
    {
      id: 2,
      name: "Anna Thompson",
      username: "anna.thompson",
      avatar: null,
      bio: "Cybersecurity Researcher",
      followedDate: "November 2024",
    },
  ];

  const handleAcceptRequest = (id) => {
    console.log("Accepting follow request:", id);
    // Add Firebase logic to accept follow request
  };

  const handleRejectRequest = (id) => {
    console.log("Rejecting follow request:", id);
    // Add Firebase logic to reject follow request
  };

  const handleFollowBack = (id) => {
    console.log("Following back:", id);
    // Add Firebase logic to follow user
  };

  const handleUnfollow = (id) => {
    console.log("Unfollowing:", id);
    // Add Firebase logic to unfollow user
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredData = () => {
    let data = [];
    if (activeTab === "requests") data = followRequests;
    else if (activeTab === "followers") data = followers;
    else if (activeTab === "following") data = following;

    return data.filter(
      (person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const tabs = [
    {
      id: "requests",
      label: "Requests",
      count: followRequests.length,
      icon: Clock,
    },
    {
      id: "followers",
      label: "Followers",
      count: followers.length,
      icon: Users,
    },
    {
      id: "following",
      label: "Following",
      count: following.length,
      icon: UserCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">People</h1>
          <p className="text-gray-600">
            Manage your follow requests, followers, and connections
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {filteredData().length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab} found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : `You don't have any ${activeTab} yet`}
              </p>
            </div>
          ) : (
            filteredData().map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {getInitials(person.name)}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {person.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        @{person.username}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{person.bio}</p>

                      {/* Additional Info */}
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        {activeTab === "requests" && (
                          <>
                            <span>
                              {person.mutualFollowers} mutual followers
                            </span>
                            <span>•</span>
                            <span>{person.timestamp}</span>
                          </>
                        )}
                        {(activeTab === "followers" ||
                          activeTab === "following") && (
                          <span>Followed in {person.followedDate}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {activeTab === "requests" && (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(person.id)}
                          className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(person.id)}
                          className="flex items-center space-x-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    {activeTab === "followers" && (
                      <>
                        {person.isFollowing ? (
                          <button
                            onClick={() => handleUnfollow(person.id)}
                            className="flex items-center space-x-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                          >
                            <UserX className="h-4 w-4" />
                            <span>Unfollow</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFollowBack(person.id)}
                            className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            <UserPlus className="h-4 w-4" />
                            <span>Follow Back</span>
                          </button>
                        )}
                      </>
                    )}

                    {activeTab === "following" && (
                      <button
                        onClick={() => handleUnfollow(person.id)}
                        className="flex items-center space-x-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                      >
                        <UserX className="h-4 w-4" />
                        <span>Unfollow</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default People;
