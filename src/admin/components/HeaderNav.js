/* import React from "react";
import { Layout, theme, Dropdown, Button, message, Space } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const HeaderNav = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/");
  };
  const handleMenuClick = (e) => {
    console.log("click", e);
  };

  const items = [
    {
      label: "Deconnexion",
      key: "1",
      icon: <LogoutOutlined />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <div>
      <Header
        className="flex items-center justify-between "
        style={{
          padding: "0 22px",
          background: colorBgContainer,
        }}
      >
        <h1 className="p-4 text-2xl font-semibold ">Socladis Sarl</h1>
        <Dropdown className="mr-20 " menu={menuProps}>
          <Button onClick={signOut} danger size="large">
            <Space>
              <UserOutlined />
              admin
            </Space>
          </Button>
        </Dropdown>
      </Header>
    </div>
  );
};

export default HeaderNav;
 */
