import React, { useState } from "react";
import { Table, Modal, message, Input } from "antd";
import Container from "../components/Container";

const AAvaris = () => {
  const AvariItems = () => {
    const [searchedText, setSearchedText] = useState("");
    const [dataSource, setDataSource] = useState(""); // table data state
    const [messageApi, contextHolder] = message.useMessage(); // message state
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
      columnItem("1", "ID", "id"),
      columnItem("2", "Nom", "name", [searchedText], filter),
      columnItem("3", "Category", "category", [searchedText], filter),
      columnItem("4", "Quantité", "quantity", [searchedText], filter),
      columnItem("6", "Date", "date", [searchedText], filter),
    ];

    // message function
    const iMessage = (type, content) => {
      setTimeout(() => {
        messageApi.open({
          type: type,
          content: content,
        });
      }, 1000);
    };
    // const onDeleteProduct = (record) => {
    //   //confirm  modal
    //   Modal.confirm({
    //     title: "Voulez vous supprimer ce produit?",
    //     okText: "Yes",
    //     okType: "danger",
    //     onOk: () => {
    //       //delete record
    //       setDataSource((pre) => {
    //         return pre.filter((Product) => Product.id !== record.id);
    //       });
    //       //show success message
    //       iMessage("success", "supprimé");
    //     },
    //   });
    // };
    return (
      <>
        {contextHolder}
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
      content={<AvariItems />}
      iconName={"grid_4-1"}
      contentName={"Avaris"}
    />
  );
};

export default AAvaris;
