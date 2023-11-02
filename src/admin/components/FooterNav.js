import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;
const FooterNav = () => {
  return (
    <div className="fixed bottom-0 w-full text-center ">
      <Footer
        style={{
          height: 55,
        }}
      >
        Socladis sarl ©2023
      </Footer>
    </div>
  );
};

export default FooterNav;
