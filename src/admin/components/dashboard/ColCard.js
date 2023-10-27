import React from "react";
import { Col, Card, Statistic } from "antd";

//card info
const ColCard = ({ title, value, prefix, suffix, precision, color }) => {
  const format = (price) => {
    const cfa = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XAF",
    });
    return cfa.format(price);
  };

  return (
    <Col span={12}>
      <Card bordered={false}>
        <Statistic
          formatter={format(value)}
          title={title}
          value={value}
          precision={precision}
          valueStyle={{
            color: `${color}`,
            fontWeight: "bolder",
            padding: "0 0px",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
          prefix={prefix}
          suffix={suffix}
        />
      </Card>
    </Col>
  );
};

export default ColCard;
