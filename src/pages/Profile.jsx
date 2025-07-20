import React, { useEffect, useMemo, useState } from "react";
import ProfileComponent from "../components/ProfileComponent";
import Navbar from "../common/navbar";
import { getUser } from "../api/FireStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      if (!res?.accessToken) {
        navigate("/");
      } else {
        setCurrentUser(auth.currentUser.displayName);
        // console.log(auth.currentUser.email);

        setLoading(false);
      }
    });
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          {currentUser ? (
            <ProfileComponent currentUser={currentUser} />
          ) : (
            <p>no wayy</p>
          )}
        </>
      )}
    </>
  );
}
