import React, { useEffect, useState } from "react";
import ProfileCard from "../common/ProfileCard";
import EditProfile from "../pages/EditProfile";
import { getUserDataByUID } from "../api/FireStore";
import { auth } from "../firebaseConfig";
import PostsProfile from "./PostsProfile";

export default function ProfileComponent({ currentUser }) {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    getUserDataByUID(auth.currentUser.uid, setUserData);
  }, []);

  function onEdit() {
    setShowEditPopup(true);
  }
  return (
    <>
      {showEditPopup ? (
        <EditProfile setShowEditPopup={setShowEditPopup} />
      ) : (
        <ProfileCard currentUser={userData} onEdit={onEdit} />
      )}
      <PostsProfile currentUser={userData} />
    </>
  );
}
