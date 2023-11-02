import React from "react";

import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import format from "../../../utils/currency";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";

const InvoiceCard = ({ name, date, invoiceTotal, totalQuantities, id }) => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  return (
    <div
      className="items-center justify-between px-20 py-4 duration-100 ease-in-out bg-white border-purple-500 rounded-lg shadow-sm cursor-pointer md:flex hover:border"
      onClick={() => navigate(id)}
    >
      <div className="flex items-center ">
        <div className="w-52 ">
          <Text className="font-semibold ">{name}</Text>
        </div>
        <Text className="text-sm text-gray-400 ">{formatDate(date)}</Text>
      </div>

      <div className=" w-52">
        <Text className="">
          Nombre de colis : <strong>{totalQuantities}</strong>
        </Text>
      </div>

      <div className="flex items-center ">
        <Text className="text-base font-semibold ">{format(invoiceTotal)}</Text>

        <ArrowRightOutlined className="ml-4" />
      </div>
    </div>
  );
};

export default InvoiceCard;
