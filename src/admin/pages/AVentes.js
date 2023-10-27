import React, { useState } from "react";
import { Table, Input, Tag } from "antd";
import Container from "../components/Container";

const AVentes = () => {
  const CommandesItems = () => {
    const [dataSource, setDataSource] = useState(); // table data state
    const [searchedText, setSearchedText] = useState("");

    function columnItem(key, title, dataIndex, filteredValue, onFilter) {
      return {
        key,
        title,
        dataIndex,
        filteredValue,
        onFilter,
      };
    }

    const filter = (value, record) => {
      return String(record.name).toLowerCase().includes(value.toLowerCase());
    };
    const columns = [
      columnItem("2", "Clients", "name", [searchedText], filter),
      columnItem("4", "Quantité", "quantity"),

      {
        key: "5",
        title: "Total",
        dataIndex: "price",
      },
      {
        key: "6",
        title: "Date",
        dataIndex: "date",
      },
      {
        key: "7",
        title: "Statut",
        dataIndex: "status",
        render: (status) => {
          return (
            <>
              <Tag key={status} color="green">
                {status}
              </Tag>
            </>
          );
        },
      },
    ];

    return (
      <>
        <div className="flex justify-between ">
          <div></div>
          <Input.Search
            style={{ maxWidth: 300, marginBottom: 8 }}
            placeholder="Recherche..."
            onChange={(e) => {
              setSearchedText(e.target.value);
            }}
          />
        </div>
        <Table columns={columns} dataSource={dataSource}></Table>
      </>
    );
  };
  return (
    <Container
      content={<CommandesItems />}
      iconName={"grid_4-1"}
      contentName={"Ventes"}
    />
  );
};

export default AVentes;
