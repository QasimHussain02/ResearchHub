import React, { useState } from "react";
import {
  Search,
  Home,
  Users,
  MessageCircle,
  Bell,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { onLogut } from "../api/AuthApi";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenMobile, setIsPopupOpenMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const togglePopupMobile = () => {
    setIsPopupOpenMobile(!isPopupOpenMobile);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    onLogut();
    setIsPopupOpen(false);
  };

  const navigationItems = [
    {
      icon: Home,
      label: "Home",
      path: "/home",
      active: location.pathname === "/home",
    },
    {
      icon: Users,
      label: "People",
      path: "/people",
      active: location.pathname === "/people",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/messages",
      active: location.pathname === "/messages",
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
      active: location.pathname === "/notifications",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <nav className="bg-[#F4F4F4] shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <img className="h-6 sm:h-7" src="/logo.jpeg" alt="Research hub" />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search research papers, people, topics..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`p-2 rounded-lg transition-all duration-200 relative cursor-pointer ${
                  item.active
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title={item.label}
              >
                <item.icon className="h-6 w-6" />
              </button>
            ))}

            {/* Profile Button */}
            <button
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
              onClick={togglePopup}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </button>
          </div>

          {/* Popup Dropdown */}
          {isPopupOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10 "
                onClick={() => setIsPopupOpen(false)}
              />

              {/* Popup Menu */}
              <div className="absolute top-12 right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                <button
                  onClick={() => {
                    navigate("/my-profile");
                    setIsPopupOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4 mr-3" />
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search research papers, people, topics..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
            <div className="grid grid-cols-2 gap-4">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 relative cursor-pointer ${
                    item.active
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}

              {/* Mobile Profile Button */}
              <button
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
                onClick={togglePopupMobile}
              >
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">Profile</span>
              </button>
              {isPopupOpenMobile && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsPopupOpenMobile(false)}
                  />

                  {/* Popup Menu */}
                  <div className="absolute bottom-3 left-32 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <button
                      onClick={() => {
                        navigate("/my-profile");
                        setIsPopupOpenMobile(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
