import React from "react";
import Navbar from "../common/navbar";
import Homefeed from "./Homefeed";

export default function HomeComp() {
  return (
    <div className="main h-[100vh] w-[100vw] bg-[#F2F3EE] overflow-x-hidden">
      <Navbar />
      <Homefeed />
    </div>
  );
}
