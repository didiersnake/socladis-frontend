import React from "react";
import { useSelector } from "react-redux";
import { selectAllStockProducts } from "./aStockSlice";
import { formatDate } from "../../../utils/formatDate";
import { Button, Table, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function columnItem(key, title, dataIndex) {
  return {
    key,
    title,
    dataIndex,
  };
}

const LowStock = () => {
  const navigate = useNavigate();
  const stock = useSelector(selectAllStockProducts);
  const low_stock = stock.filter(
    (item) => Number(item.quantity) < Number(item.unitPrice)
  );

  const columns = [
    columnItem(0, "ID", "_id"),
    columnItem(2, "Nom", "name"),
    columnItem(4, "Format", "format"),
    columnItem(3, "Category", "category"),
    columnItem(5, "En Stock", "quantity"),
    {
      ...columnItem(7, "Date", "date"),
      render: (iDate) => {
        return formatDate(iDate);
      },
    },
    /* {
      ...columnItem(8, "Statut", "status"),

      render: (status, record) => {
        return record.quantity > record.unitPrice ? (
          (status = (
            <Tag key={record._id} color={"green"}>
              en stock
            </Tag>
          ))
        ) : (
          <Tag key={record._id} color={"red"}>
            stock faible
          </Tag>
        );
      },
    }, */
  ];

  return (
    <div className="mx-8">
      <h2>Stock Faible</h2>
      <Button
        className="my-4"
        onClick={() => navigate(-1)}
        icon={<ArrowLeftOutlined />}
      ></Button>
      <Table
        className="capitalize "
        scroll={{
          y: 640,
        }}
        columns={columns.filter((col) => col.dataIndex !== "_id")}
        dataSource={low_stock}
      ></Table>
    </div>
  );
};

export default LowStock;
