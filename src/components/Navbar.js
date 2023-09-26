import React from "react";
import { Button, Layout, Space, Typography } from "antd";
import SearchBar from "./SearchBar";

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 70px",
      }}
    >
      <Title style={{ color: "whitesmoke" }} level={1}>
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
          <Button type="default" size="large">
            Deconnexion
          </Button>
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;
