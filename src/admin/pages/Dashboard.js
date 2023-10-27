import React from "react";
import Container from "../components/Container";
import { Row } from "antd";
import DashboardCard1 from "../components/dashboard/DashboardCard1";
import ColCard from "../components/dashboard/ColCard";
import ColCardIcon from "../components/dashboard/ColCardIcon";
import Sales from "../assets/png/sales.png";
import Revenu from "../assets/png/revenue1.png";
import Profit from "../assets/png/profit.png";
import Users from "../assets/png/people.png";
import Staff from "../assets/png/staff.png";
import Cart from "../assets/png/cart.png";
import Cancel from "../assets/png/cancel.png";
import Deposit from "../assets/png/deposit.png";
import Low from "../assets/png/Low.png";
import Stock from "../assets/png/Stock.png";

const Dashbord = () => {
  //convert long numbers to strings
  function intToString(value) {
    var suffixes = ["", "k", "M", "B", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = parseFloat(
      (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
        3
      )
    );
    if (shortValue % 1 !== 0) {
      shortValue = shortValue.toFixed(1);
    }
    return shortValue + suffixes[suffixNum];
  }

  //body
  const DashboardItems = () => {
    return (
      <Row justify={"space-center"} gutter={24}>
        <DashboardCard1
          title={""}
          cardItems={
            <>
              <ColCard
                title={"Total ventes"}
                value={650}
                prefix={<ColCardIcon iconName={Sales} color={"#d3ecfc"} />}
                suffix={""}
                color={"#000000"}
              />
              <ColCard
                title={"Revenus (CFA)"}
                value={intToString(1452303)}
                prefix={<ColCardIcon iconName={Revenu} color={"#d3fce0"} />}
                suffix={""}
                color={"#2de218"}
              />
              <ColCard
                title={"Coût (CFA)"}
                value={intToString(850500)}
                prefix={<ColCardIcon iconName={Deposit} color={"#fcf9d3"} />}
                suffix={""}
                color={"#000000"}
              />
              <ColCard
                title={"Profit"}
                value={"48%"}
                prefix={<ColCardIcon iconName={Profit} color={"#fcf9d3"} />}
                suffix={""}
                color={""}
              />
            </>
          }
        />

        <DashboardCard1
          title={""}
          cardItems={
            <>
              <ColCard
                title={"Utilisateurs"}
                value={6}
                prefix={<ColCardIcon iconName={Staff} color={"#91e5f7"} />}
                suffix={""}
                color={"#000000"}
              />
              <ColCard
                title={"Total Clients"}
                value={intToString(1239)}
                prefix={<ColCardIcon iconName={Users} color={"#91e5f7"} />}
                suffix={""}
                color={""}
              />
              <ColCard
                title={"Finances"}
                value={intToString(1239)}
                prefix={<ColCardIcon iconName={Profit} color={"#fcf9d3"} />}
                suffix={""}
                color={""}
              />
            </>
          }
        />
        <DashboardCard1
          title={""}
          cardItems={
            <>
              <ColCard
                title={"Commandes"}
                value={13}
                prefix={<ColCardIcon iconName={Cart} color={"#d3ecfc"} />}
                suffix={""}
                color={"#000000"}
              />
              <ColCard
                title={"Avaris"}
                value={7}
                prefix={<ColCardIcon iconName={Cancel} color={"#fabcb6"} />}
                suffix={""}
                color={"#e21818"}
              />
              <ColCard
                title={"Stock faible"}
                value={11}
                prefix={<ColCardIcon iconName={Low} color={"#fabcb6"} />}
                suffix={""}
                color={"#e21818"}
              />
              <ColCard
                title={"Stock total"}
                value={120}
                prefix={<ColCardIcon iconName={Stock} color={"#fcf9d3"} />}
                suffix={""}
                color={"#00000"}
              />
            </>
          }
        />
      </Row>
    );
  };
  return (
    <Container
      content={<DashboardItems />}
      iconName={"grid_4-1"}
      contentName={"Dashboard"}
    />
  );
};

export default Dashbord;
