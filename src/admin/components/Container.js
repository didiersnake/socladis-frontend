import React from "react";
import { Layout, Typography } from "antd";
import CircumIcon from "@klarr-agency/circum-icons-react";

const { Title } = Typography;
const { Content } = Layout;
const Container = ({ content, contentName, iconName }) => {
  return (
    <Content
      style={{
        margin: "0 8px",
      }}
    >
      <Title className="flex items-center gap-2 px-2 py-2 " level={5}>
        <CircumIcon name={iconName} size={22} /> {contentName}
      </Title>
      <div
        style={{
          minHeight: 360,
          padding: 4,
        }}
      >
        <div className="">{content}</div>
      </div>
    </Content>
  );
};

export default Container;
