import React from "react";
import { Col, Row, Card } from "antd";

// first Card info container
const DashboardCard1 = ({ cardItems, title }) => {
  return (
    <Col span={8}>
      <Card
        size="small"
        title={title}
        headStyle={{
          fontSize: 18,
          padding: "0 24px",
        }}
        style={{
          backgroundColor: "#ededed",
        }}
      >
        <Row gutter={[16, 16]}>{cardItems}</Row>
      </Card>
    </Col>
  );
};

export default DashboardCard1;
