import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAllAvarisProducts } from "./avarisSlice";
import { filterDateByMonth } from "../../../utils/dateFilters";
import { formatDate } from "../../../utils/formatDate";
import { Button, Table } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

function columnItem(key, title, dataIndex) {
  return {
    key,
    title,
    dataIndex,
  };
}
const StoreAvaris = () => {
  const navigate = useNavigate();
  const avaris = useSelector(selectAllAvarisProducts);
  const stor_avaris = filterDateByMonth(avaris).filter(
    (item) => item.type === "magasin"
  );
  const columns = [
    columnItem(0, "ID", "_id"),
    columnItem(2, "Nom", "name"),
    columnItem(3, "Type", "type"),
    columnItem(4, "Category", "category"),
    columnItem(5, "Format", "format"),

    columnItem(6, "Nombre", "quantity"),
    {
      ...columnItem(7, "Date", "date"),
      render: (iDate) => {
        return formatDate(iDate);
      },
    },
  ];
  return (
    <div className="mx-8 ">
      <h2>Avaris au magasin</h2>
      <Button
        className="my-4"
        onClick={() => navigate(-1)}
        icon={<ArrowLeftOutlined />}
      ></Button>

      <Table
        className="capitalize "
        columns={columns.filter((col) => col.dataIndex !== "_id")}
        dataSource={stor_avaris}
      ></Table>
    </div>
  );
};

export default StoreAvaris;
