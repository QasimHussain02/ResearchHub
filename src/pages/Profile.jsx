import React, { useEffect, useState } from "react";
import ProfileComponent from "../components/ProfileComponent";
import Navbar from "../common/navbar";
import { getUserDataByUID } from "../api/FireStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const { uid } = useParams(); // Get uid from URL params
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user?.accessToken) {
        navigate("/");
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setUserNotFound(false);
      setUserData(null);

      try {
        // Determine which user's profile to load
        const targetUID = uid || auth.currentUser?.uid;

        if (!targetUID) {
          setUserNotFound(true);
          setLoading(false);
          return;
        }

        // Check if viewing own profile
        setIsOwnProfile(!uid || uid === auth.currentUser?.uid);

        // Fetch user data
        const fetchedUserData = await getUserDataByUID(targetUID);

        if (fetchedUserData) {
          setUserData(fetchedUserData);
        } else {
          setUserNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  if (loading) {
    return <Loader />;
  }

  if (userNotFound) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              User Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The user you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {userData ? (
        <ProfileComponent
          userData={userData}
          isOwnProfile={isOwnProfile}
          targetUID={uid || auth.currentUser?.uid}
        />
      ) : (
        <Loader />
      )}
    </>
  );
}
