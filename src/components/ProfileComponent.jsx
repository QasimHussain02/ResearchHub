import React, { useState } from "react";
import ProfileCard from "../common/ProfileCard";
import EditProfile from "../pages/EditProfile";
import PostsProfile from "./PostsProfile";

export default function ProfileComponent({
  userData,
  isOwnProfile,
  targetUID,
}) {
  const [showEditPopup, setShowEditPopup] = useState(false);

  function onEdit() {
    setShowEditPopup(true);
  }

  return (
    <>
      {showEditPopup ? (
        <EditProfile setShowEditPopup={setShowEditPopup} />
      ) : (
        <>
          <ProfileCard
            currentUser={userData}
            onEdit={onEdit}
            isOwnProfile={isOwnProfile}
          />
          <PostsProfile
            currentUser={userData}
            targetUID={targetUID}
            isOwnProfile={isOwnProfile}
          />
        </>
      )}
    </>
  );
}
