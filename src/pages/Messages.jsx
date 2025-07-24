import React, { useState } from "react";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Paperclip,
  Smile,
  CheckCheck,
  Check,
} from "lucide-react";
import Navbar from "../common/navbar";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Sample conversations data
  const conversations = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar: "SJ",
      lastMessage:
        "Thanks for sharing your research on AI ethics. Very insightful!",
      timestamp: "2m ago",
      unread: 2,
      online: true,
      role: "Professor",
      institution: "MIT",
    },
    {
      id: 2,
      name: "Muhammad Ahmed",
      avatar: "MA",
      lastMessage:
        "Are you available for collaboration on the blockchain project?",
      timestamp: "1h ago",
      unread: 0,
      online: false,
      role: "PhD Student",
      institution: "Stanford University",
    },
    {
      id: 3,
      name: "Research Group - ML",
      avatar: "RG",
      lastMessage: "Meeting scheduled for tomorrow at 3 PM",
      timestamp: "3h ago",
      unread: 5,
      online: false,
      isGroup: true,
      members: 8,
    },
    {
      id: 4,
      name: "Dr. Emily Chen",
      avatar: "EC",
      lastMessage: "Your paper draft looks great! Just sent my feedback.",
      timestamp: "1d ago",
      unread: 0,
      online: true,
      role: "Research Director",
      institution: "Google Research",
    },
    {
      id: 5,
      name: "Alex Thompson",
      avatar: "AT",
      lastMessage: "Can you help me with the literature review?",
      timestamp: "2d ago",
      unread: 1,
      online: false,
      role: "Master's Student",
      institution: "University of Cambridge",
    },
  ];

  // Sample messages for selected chat
  const sampleMessages = [
    {
      id: 1,
      sender: "other",
      content:
        "Hi! I saw your recent paper on machine learning applications in healthcare. Really impressive work!",
      timestamp: "10:30 AM",
      status: "read",
    },
    {
      id: 2,
      sender: "me",
      content:
        "Thank you so much! It took months of research and data analysis. I'm glad you found it useful.",
      timestamp: "10:32 AM",
      status: "read",
    },
    {
      id: 3,
      sender: "other",
      content:
        "I'm working on something similar for my PhD thesis. Would you be interested in discussing potential collaboration opportunities?",
      timestamp: "10:35 AM",
      status: "read",
    },
    {
      id: 4,
      sender: "me",
      content:
        "Absolutely! I'd love to learn more about your research. Are you free for a video call this week?",
      timestamp: "10:37 AM",
      status: "read",
    },
    {
      id: 5,
      sender: "other",
      content:
        "Perfect! I'm available Thursday afternoon or Friday morning. What works better for you?",
      timestamp: "10:40 AM",
      status: "delivered",
    },
  ];

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedChat(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex h-[calc(100vh-4rem)] max-h-screen">
          {/* Conversations List */}
          <div
            className={`${
              showMobileChat ? "hidden" : "w-full"
            } md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col md:flex`}
          >
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Messages
              </h1>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 transition-colors"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleChatSelect(conversation)}
                    className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100 ${
                      selectedChat?.id === conversation.id
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base ${
                            conversation.isGroup
                              ? "bg-green-500"
                              : "bg-gradient-to-r from-blue-500 to-purple-600"
                          }`}
                        >
                          {conversation.avatar}
                        </div>
                        {conversation.online && !conversation.isGroup && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate pr-2">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {conversation.timestamp}
                          </span>
                        </div>

                        {(conversation.role || conversation.isGroup) && (
                          <p className="text-xs text-gray-500 mb-1 truncate">
                            {conversation.isGroup
                              ? `${conversation.members} members`
                              : `${conversation.role} • ${conversation.institution}`}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <p className="text-xs sm:text-sm text-gray-600 truncate pr-2">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <span className="flex-shrink-0 px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full min-w-[20px] text-center">
                              {conversation.unread > 99
                                ? "99+"
                                : conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-gray-500 text-sm">
                    No conversations found
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={`${
              !showMobileChat ? "hidden md:flex" : "flex"
            } flex-1 bg-white flex-col min-w-0`}
          >
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    {/* Mobile Back Button */}
                    <button
                      onClick={handleBackToList}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg flex-shrink-0 active:bg-gray-200 transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>

                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                          selectedChat.isGroup
                            ? "bg-green-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-600"
                        }`}
                      >
                        {selectedChat.avatar}
                      </div>
                      {selectedChat.online && !selectedChat.isGroup && (
                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {selectedChat.name}
                      </h3>
                      {selectedChat.online && !selectedChat.isGroup && (
                        <p className="text-xs text-green-500">Online</p>
                      )}
                      {selectedChat.isGroup && (
                        <p className="text-xs text-gray-500">
                          {selectedChat.members} members
                        </p>
                      )}
                      {!selectedChat.online && !selectedChat.isGroup && (
                        <p className="text-xs text-gray-500">
                          Last seen 2h ago
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    <button className="p-2 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition-colors hidden sm:block">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition-colors hidden sm:block">
                      <Video className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition-colors">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition-colors">
                      <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {sampleMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "me"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                          message.sender === "me"
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm sm:text-base leading-relaxed break-words">
                          {message.content}
                        </p>
                        <div
                          className={`flex items-center justify-end mt-1 space-x-1 ${
                            message.sender === "me"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">{message.timestamp}</span>
                          {message.sender === "me" && (
                            <div className="flex-shrink-0">
                              {message.status === "read" ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0">
                  <div className="flex items-end space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition-colors flex-shrink-0 hidden sm:block">
                      <Paperclip className="h-5 w-5 text-gray-600" />
                    </button>

                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        rows="1"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm sm:text-base"
                        style={{
                          minHeight: "40px",
                          maxHeight: "120px",
                        }}
                      />
                      <button className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 p-1 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition-colors">
                        <Smile className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 sm:p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors flex-shrink-0 active:bg-blue-700"
                    >
                      <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
