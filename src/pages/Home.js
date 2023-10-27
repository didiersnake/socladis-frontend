import { Link } from "react-router-dom";
import React from "react";
import { Typography } from "antd";
import Admin from "../images/Admin.png";
import Cash from "../images/Cash.png";
import Warehouse from "../images/Warehouse.png";

const { Title } = Typography;
export const Home = () => {
  const Card = ({ role, image, link }) => {
    return (
      <Link to={link}>
        <div className=" flex justify-start items-center gap-10">
          <img src={image} alt="admin" />
          <Title level={3}>{role}</Title>
        </div>
      </Link>
    );
  };

  return (
    <div className=" w-full h-[100vh] flex items-center justify-center flex-col">
      <p className=" -mt-40  pb-24 text-2xl">
        Veillez choisir votre plateforme respective
      </p>
      <div className=" flex items-center justify-center gap-44">
        <Card role={"Administrateur"} image={Admin} link={"/admin"} />
        <Card role={"Magasin"} image={Warehouse} link={"/product"} />
        <Card role={"Caisses"} image={Cash} link={"/cash"} />
      </div>
    </div>
  );
};
