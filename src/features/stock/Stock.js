import React, { useState } from "react";
import { Tag, Table, Input, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllStockProducts } from "../../admin/features/stock/aStockSlice";
import { formatDate } from "../../utils/formatDate";

function columnItem(key, title, dataIndex) {
  return {
    key,
    title,
    dataIndex,
  };
}

const Stock = () => {
  const [searchText, setSearchText] = useState();
  const allProducts = useSelector(selectAllStockProducts);
  const [dataSource, setDataSource] = useState(allProducts); // table data state

  const navigate = useNavigate();

  const columns = [
    columnItem(0, "ID", "_id"),
    columnItem(2, "Nom", "name"),
    {
      ...columnItem(4, "Format", "format"),
      filters: [
        {
          text: "Grand format",
          value: "Grand format",
        },
        {
          text: "Petit format",
          value: "Petit format",
        },
      ],
      onFilter: (value, record) => record.format.indexOf(value) === 0,
    },
    {
      ...columnItem(3, "Category", "category"),
      filters: [
        {
          text: "Casier",
          value: "Casier",
        },
        {
          text: "Plastic",
          value: "Plastic",
        },
      ],
      onFilter: (value, record) => record.category.indexOf(value) === 0,
    },

    columnItem(5, "En Stock", "quantity"),
    {
      ...columnItem(7, "Date", "date"),
      render: (iDate) => {
        return formatDate(iDate);
      },
    },
    {
      ...columnItem(8, "Statut", "status"),
      render: (status, record) => {
        return record.quantity > record.unitPrice ? (
          <Tag key={record._id} color={"green"}>
            en stock
          </Tag>
        ) : (
          <Tag key={record._id} color={"red"}>
            stock faible
          </Tag>
        );
      },
    },
  ];

  let orderedStock = allProducts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ padding: "30px 70px" }}>
      <div className="flex items-center justify-between pb-8 ">
        <h2>Magasin</h2>
        <div className="flex justify-around ">
          <Button type="link" danger>
            <Link className="px-4 " to={"issues"}>
              Avaris
            </Link>
          </Button>
          <Button type="link" danger>
            <Link className="px-4 " to={"empty"}>
              Magasin vide
            </Link>
          </Button>
        </div>
      </div>
      <>
        <div className="flex justify-between mb-2 ">
          <Button type="primary" onClick={() => navigate("create")}>
            Ajouter un produit
          </Button>

          {/* search bar */}
          <Input.Search
            style={{ maxWidth: 300 }}
            placeholder="Recherche..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setDataSource(
                allProducts.filter((record) =>
                  record?.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
                )
              );
            }}
          />
        </div>

        <Table
          className="capitalize "
          scroll={{
            y: 640,
          }}
          columns={columns.filter((col) => col.dataIndex !== "_id")}
          dataSource={!searchText ? orderedStock : dataSource}
        ></Table>
      </>
    </div>
  );
};

export default Stock;
