import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import FooterNav from "../admin/components/FooterNav";

export const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="mb-6 ">
        <Outlet />
      </div>
      <FooterNav />
    </>
  );
};
