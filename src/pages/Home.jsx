import React, { useEffect, useState } from "react";
import HomeComp from "../components/HomeComp";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
export default function Home() {
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      if (!res?.accessToken) {
        navigate("/");
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);
  return <div>{loading ? <Loader /> : <HomeComp />}</div>;
}
