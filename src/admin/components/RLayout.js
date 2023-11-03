import React, { Suspense } from "react";
import SideNav from "./SideNav";
import { Layout } from "antd";

import { Outlet } from "react-router-dom";

const RLayout = () => {
  return (
    <div className="">
      <SideNav
        content={
          <Layout>
            <div className="mb-6 ">
              <Suspense fallback={<h2>Chargement...</h2>}>
                <Outlet />
              </Suspense>
            </div>
          </Layout>
        }
      />
    </div>
  );
};

export default RLayout;
