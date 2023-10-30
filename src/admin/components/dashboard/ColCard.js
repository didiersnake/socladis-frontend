import React from "react";
import { Card, Statistic } from "antd";
import CountUp from "react-countup";

//card info
const ColCard = ({ title, value, prefix, suffix, icon, color }) => {
  const formatter = (value) => <CountUp end={value} separator="," />;
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
          formatter={formatter}
        />
      </Card>
    </>
  );
};

export default ColCard;
