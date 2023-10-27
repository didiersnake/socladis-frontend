import React, { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { jsonProducts } from "../utils/dataset";
import { Button, Table, Modal, message, Input } from "antd";
import Container from "../components/Container";

const Roles = () => {
  const RolesItems = () => {
    const [dataSource, setDataSource] = useState(JSON.parse(jsonProducts)); // table data state
    const [isEditing, setIsEditing] = useState(false); //toggle edit button state
    const [editingProduct, setEditingProduct] = useState(null);
    const [messageApi, contextHolder] = message.useMessage(); // message state
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
      columnItem("2", "Nom", "name", [searchedText], filter),
      columnItem("3", "Roles", "category", [searchedText], filter),
      {
        key: "8",
        title: "Actions",
        render: (record) => {
          return (
            <>
              <EditOutlined
                onClick={() => {
                  onEditProduct(record);
                }}
              />
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
        title: "Voulez vous supprimer cet Utilisateurs?",
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
    return (
      <>
        {contextHolder}
        <div className="flex justify-between mb-2 ">
          <Button type="primary" onClick={""}>
            Ajouter un Utilisateur
          </Button>
          {/* search bar */}
          <Input.Search
            style={{ maxWidth: 300 }}
            placeholder="Recherche..."
            onChange={(e) => {
              setSearchedText(e.target.value);
            }}
          />
        </div>
        <Table columns={columns} dataSource={dataSource}></Table>
        <Modal
          title="Modifier"
          open={isEditing}
          okText="Sauvegarder"
          cancelText="Annuler"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            setDataSource((pre) => {
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
          </div>
        </Modal>
      </>
    );
  };
  return (
    <Container
      content={<RolesItems />}
      iconName={"grid_4-1"}
      contentName={"Roles"}
    />
  );
};

export default Roles;
