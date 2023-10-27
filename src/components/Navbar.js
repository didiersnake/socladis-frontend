import React from "react";
import { Button, Layout, Space, Typography } from "antd";
import { useDispatch } from "react-redux";
import { loginAction } from "../features/auth/actions/loginAction";
import { logoutAction } from "../features/auth/actions/logoutAction";
import { logout } from "../features/auth/authSlice";

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 100px",
      }}
    >
      <Title style={{ color: "whitesmoke" }} level={3}>
        Socladis sarl
      </Title>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Space direction="horizontal" size={20}>
          <Button type="text" danger onClick={handleLogout}>
            Se déconnecter
          </Button>
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;
