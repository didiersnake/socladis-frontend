import React from "react";
import SideNav from "./SideNav";
import { Layout } from "antd";

import { Outlet } from "react-router-dom";
import FooterNav from "./FooterNav";

const RLayout = () => {
  return (
    <div className="">
      <SideNav
        content={
          <Layout>
            <div className="mb-6 ">
              <Outlet />
            </div>
          </Layout>
        }
      />
    </div>
  );
};

export default RLayout;
