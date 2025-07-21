import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

// Helper function to navigate to user profiles
export const useProfileNavigation = () => {
  const navigate = useNavigate();

  const navigateToProfile = (userId) => {
    if (!userId) return;

    // If it's the current user, go to /my-profile
    if (auth.currentUser && userId === auth.currentUser.uid) {
      navigate("/my-profile");
    } else {
      // Otherwise, go to /profile/:uid
      navigate(`/profile/${userId}`);
    }
  };

  return { navigateToProfile };
};

// Clickable profile component
export const ProfileLink = ({ user, children, className = "" }) => {
  const { navigateToProfile } = useProfileNavigation();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (user?.id || user?.uid) {
      navigateToProfile(user.id || user.uid);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
    >
      {children}
    </div>
  );
};

// Profile avatar component
export const ProfileAvatar = ({ user, size = "md", showName = false }) => {
  const { navigateToProfile } = useProfileNavigation();

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-20 h-20 text-lg",
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (user?.id || user?.uid) {
      navigateToProfile(user.id || user.uid);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
    >
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold`}
      >
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name || "User"}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          getInitials(user?.name)
        )}
      </div>
      {showName && (
        <div>
          <p className="font-semibold text-gray-900">
            {user?.name || "Anonymous"}
          </p>
          {user?.headline && (
            <p className="text-sm text-gray-500">{user.headline}</p>
          )}
        </div>
      )}
    </div>
  );
};
