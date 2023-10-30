import React from "react";
import SideNav from "./SideNav";
import { Layout } from "antd";

import { Outlet } from "react-router-dom";
import FooterNav from "./FooterNav";

const RLayout = () => {
  return (
    <div className="flex items-start ">
      <SideNav
        content={
          <Layout>
            {/* <HeaderNav /> */}
            <Outlet />
            <FooterNav />
          </Layout>
        }
      />
    </div>
  );
};

export default RLayout;
