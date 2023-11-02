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
        padding: "40px 200px",
      }}
    >
      <h2 style={{ color: "whitesmoke" }}>Socladis sarl</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginRight: -60,
        }}
      >
        <Button type="text " danger onClick={handleLogout}>
          Se déconnecter
        </Button>
      </div>
    </Header>
  );
};

export default Navbar;
