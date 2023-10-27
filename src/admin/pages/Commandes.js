import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Table, Modal, message, Input, Tag } from "antd";
import Container from "../components/Container";

const Commandes = () => {
  const CommandesItems = () => {
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
      columnItem("2", "Client", "name", [searchedText], filter),

      {
        key: "4",
        title: "Quantité",
        dataIndex: "quantity",
      },
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
        key: "8",
        title: "Actions",
        render: (record) => {
          return (
            <>
              <DeleteOutlined
                onClick={() => {
                  onDeleteProduct(record);
                }}
                style={{ color: "red", marginLeft: 24 }}
              />
            </>
          );
        },
      },
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
    const onDeleteProduct = (record) => {
      //confirm  modal
      Modal.confirm({
        title: "Voulez vous supprimer cette commandes?",
        okText: "Yes",
        okType: "danger",
        onOk: () => {
          //delete record
          setDataSource((pre) => {
            return pre.filter((Product) => Product.id !== record.id);
          });
          //show success message
          iMessage("success", "supprimé");
        },
      });
    };

    return (
      <>
        {contextHolder}
        <div className="flex justify-between ">
          <Button type="primary" onClick={""}>
            Ajouter une Commande
          </Button>

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

export default Commandes;
