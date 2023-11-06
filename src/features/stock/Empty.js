import React, { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, DatePicker, Input, Table } from "antd";
import { ArrowLeftOutlined, FilterOutlined } from "@ant-design/icons";
import { selectAllEmptyStock } from "../../admin/features/empty_stock/emptyStockSlice";

const Empty = () => {
  const [searchText, setSearchText] = useState("");
  const allProducts = useSelector(selectAllEmptyStock);
  const [dataSource, setDataSource] = useState(allProducts); // table data state

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [isFiltering, setIsFiltering] = useState(false);

  const navigate = useNavigate();

  function columnItem(key, title, dataIndex) {
    return {
      key,
      title,
      dataIndex,
    };
  }

  const columns = [
    columnItem(0, "ID", "_id"),
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
    columnItem(2, "Equipe", "team"),
    columnItem(3, "Casiers", "cashier"),
    columnItem(3, "Bouteuille", "bottle"),
    columnItem(3, "Plastic", "plastic"),

    {
      ...columnItem(7, "Date", "date"),
      render: (iDate) => {
        return formatDate(iDate);
      },
    },
  ];

  let orderedStock = allProducts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const filterByDateRange = () => {
    if (startDate && endDate) {
      setIsFiltering(true);
      setDataSource(
        orderedStock.filter((item) => {
          let s_date = new Date(startDate).getTime();
          let e_date = new Date(endDate).getTime();
          let a_date = new Date(item.date).getTime();
          return a_date >= s_date && a_date <= e_date;
        })
      );
    }
  };

  return (
    <div className="mx-16 my-10 ">
      <div className="py-6">
        <Button
          className=""
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
        ></Button>
        <h2>Magasin vide</h2>
      </div>
      <>
        <div className="flex justify-between mb-2 ">
          <Button type="primary" onClick={() => navigate("create")}>
            Ajouter un Produit
          </Button>
          {/* search bar */}

          <div className="flex gap-4 ">
            <div className="flex items-center gap-2 ">
              <DatePicker
                style={{ width: 150 }}
                onChange={(dateString) => {
                  setStartDate(dateString);
                  setIsFiltering(false);
                }}
                value={startDate}
                placeholder="Debut"
                showTime={false}
                format={"DD/MM/YYYY"}
              />
              <DatePicker
                style={{ width: 150 }}
                onChange={(dateString) => {
                  setEndDate(dateString);
                  setIsFiltering(false);
                }}
                value={endDate}
                placeholder="fin"
                showTime={false}
                format={"DD/MM/YYYY"}
              />

              <Button
                type="primary"
                size="small"
                style={{ padding: "1px 4px" }}
                icon={<FilterOutlined />}
                onClick={filterByDateRange}
              ></Button>
            </div>

            <Input.Search
              style={{ maxWidth: 300 }}
              placeholder="Equipe..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setDataSource(
                  dataSource.filter((record) =>
                    record?.team
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  )
                );
              }}
            />
          </div>
        </div>

        <Table
          className="capitalize "
          columns={columns.filter(
            (col) => col.dataIndex !== "_id" && col.dataIndex !== "unitPrice"
          )}
          dataSource={!searchText && !isFiltering ? orderedStock : dataSource}
        ></Table>
      </>
    </div>
  );
};

export default Empty;
