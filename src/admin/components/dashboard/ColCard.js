import React from "react";
import { Col, Card, Statistic } from "antd";
import ColCardIcon from "./ColCardIcon";
import Sales from "../../assets/png/shopping-cart.svg";

//card info
const ColCard = ({ title, value, prefix, suffix, icon, color }) => {
  return (
    <>
      <Card
        bordered={false}
        size="small"
        bodyStyle={{ padding: 10, paddingLeft: 18 }}
      >
        <div>{icon}</div>
        <Statistic
          title={title}
          value={value}
          valueStyle={{
            color: `${color}`,
            fontSize: 18,
            fontWeight: 450,
            display: "flex",
            alignItems: "center",
          }}
          prefix={prefix}
          suffix={suffix}
        />
      </Card>
    </>
  );
};

export default ColCard;
