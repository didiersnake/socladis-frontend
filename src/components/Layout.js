import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export const Layout = () => {
  const [searchedText, setSearchedText] = useState("");
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
