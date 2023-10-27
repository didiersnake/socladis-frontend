import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;
const FooterNav = () => {
  return (
    <div className="fixed bottom-0 inset-x-52">
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Socladis sarl ©2023
      </Footer>
    </div>
  );
};

export default FooterNav;
