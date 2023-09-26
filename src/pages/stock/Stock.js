import React, { useState } from "react";
import { Tag, message, Table, Modal, Input, Button } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EditOutlined,
} from "@ant-design/icons";
import SearchBar from "../../components/SearchBar";
import { Link } from "react-router-dom";

function columnItem(key, title, dataIndex, filteredValue, onFilter, render) {
  return {
    key,
    title,
    dataIndex,
    filteredValue,
    onFilter,
    render,
  };
}

const filter = (value, record) => {
  return String(record.quantity).toLowerCase().includes(value.toLowerCase());
};

const item = [
  {
    id: 1,
    name: "nom",
    category: "bouteille",
    format: "petit",
    quantity: "10",
    price: "10000",
    date: "20/12/2021",
    status: "instock",
  },
  {
    id: 1,
    name: "yan",
    category: "bouteille",
    format: "petit",
    quantity: "30",
    price: "10000",
    date: "20/12/2021",
    status: "instock",
  },
  {
    id: 1,
    name: "nom",
    category: "bouteille",
    format: "petit",
    quantity: "20",
    price: "10000",
    date: "20/12/2021",
    status: "instock",
  },
];

const Stock = () => {
  const [data, setData] = useState(item);
  const [searchedText, setSearchedText] = useState("");
  const [isEditing, setIsEditing] = useState(false); //toggle edit button state
  const [editingProduct, setEditingProduct] = useState(null);
  const [messageApi, contextHolder] = message.useMessage(); // message state

  const columns = [
    columnItem(1, "#", "id", [searchedText], filter),
    columnItem(2, "Nom", "name", [searchedText], filter),
    columnItem(3, "Category", "category", [searchedText], filter),
    columnItem(4, "Format", "format", [searchedText], filter),
    columnItem(5, "Disponible", "quantity", [searchedText], filter),
    columnItem(6, "Prix", "price", [searchedText], filter),
    columnItem(7, "Date", "date", [searchedText], filter),
    columnItem(8, "Statut", "status", [searchedText], filter, (status) => {
      return (
        <>
          <Tag key={status} color="green">
            {status}
          </Tag>
        </>
      );
    }),
    columnItem(9, "Actions", "", [searchedText], filter, (record) => {
      return (
        <>
          <EditOutlined
            onClick={() => {
              onEditProduct(record);
            }}
          />
        </>
      );
    }),
  ];

  const onEditProduct = (record) => {
    //open edit modal
    setIsEditing(true);
    setEditingProduct({ ...record });
  };

  const resetEditing = () => {
    //reset edited data
    setIsEditing(false);
    setEditingProduct(null);
  };

  // message function
  const iMessage = (type, content) => {
    setTimeout(() => {
      messageApi.open({
        type: type,
        content: content,
      });
    }, 1000);
  };

  return (
    <div style={{ padding: "0 70px" }}>
      <div>
        <Button
          type="default"
          size="large"
          style={{ margin: 20, marginLeft: "80%" }}
          danger
        >
          <Link to={"issues"}>Avaris</Link>
          <ArrowRightOutlined />
        </Button>
      </div>
      <>
        {contextHolder}
        <div className="flex justify-between mb-2 ">
          <Button type="primary" onClick={""}>
            Ajouter un produit
          </Button>

          {/* search bar */}
          <SearchBar setSearchedText={setSearchedText} />
        </div>

        <Table columns={columns} dataSource={data}></Table>

        <Modal
          title="Modifier le produit"
          open={isEditing}
          okText="Sauvegarder"
          cancelText="Annuler"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            setData((pre) => {
              return pre.map((Product) => {
                if (Product.id === editingProduct.id) {
                  return editingProduct;
                } else {
                  return Product;
                }
              });
            });
            //take of modal after edit and display message
            resetEditing();
            iMessage("success", "modifié");
          }}
        >
          <div className="grid gap-2 ">
            <Input
              value={editingProduct?.name}
              onChange={(e) => {
                setEditingProduct((pre) => {
                  return { ...pre, name: e.target.value };
                });
              }}
            />
            <Input
              value={editingProduct?.category}
              onChange={(e) => {
                setEditingProduct((pre) => {
                  return { ...pre, category: e.target.value };
                });
              }}
            />

            <Input
              value={editingProduct?.price}
              onChange={(e) => {
                setEditingProduct((pre) => {
                  return { ...pre, price: e.target.value };
                });
              }}
            />
          </div>
        </Modal>
      </>
    </div>
  );
};

export default Stock;
