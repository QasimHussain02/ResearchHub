import React, { useEffect, useMemo, useState } from "react";
import ProfileComponent from "../components/ProfileComponent";
import Navbar from "../common/navbar";
import { getUser, getUserDataByUID } from "../api/FireStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Profile() {
  const [userData, setUserData] = useState({});
  useEffect(() => {
    getUserDataByUID(auth.currentUser?.uid, setUserData);
  }, []);
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      if (!res?.accessToken) {
        navigate("/");
      } else {
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
          {userData ? <ProfileComponent userData={userData} /> : <Loader />}
        </>
      )}
    </>
  );
}
