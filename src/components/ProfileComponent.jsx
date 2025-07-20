import React, { useState } from "react";
import ProfileCard from "../common/ProfileCard";
import EditProfile from "../pages/EditProfile";

export default function ProfileComponent({ currentUser }) {
  const [showEditPopup, setShowEditPopup] = useState(false);
  function onEdit() {
    setShowEditPopup(true);
  }
  return (
    <>
      {showEditPopup ? (
        <EditProfile setShowEditPopup={setShowEditPopup} />
      ) : (
        <ProfileCard currentUser={currentUser} onEdit={onEdit} />
      )}
      ;
    </>
  );
}
