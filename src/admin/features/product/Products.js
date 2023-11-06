import React, { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, Table, Modal, message, Input, Select } from "antd";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAllProducts } from "./productSlice";
import format from "../../../utils/currency";
import editProductAction from "./actions/editProductAction";
import readProductAction from "./actions/readProductAction";

const Products = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); //toggle edit button state
  const [editingProduct, setEditingProduct] = useState(null);
  const [messageApi, contextHolder] = message.useMessage(); // message state
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const allProducts = useSelector(selectAllProducts);
  const [dataSource, setDataSource] = useState(allProducts); // table data state

  /* const readProducts = async () => {
    try {
      await dispatch(readProductAction());
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readProducts();
  }, []); */

  function columnItem(key, title, dataIndex) {
    return {
      key,
      title,
      dataIndex,
    };
  }

  const columns = [
    columnItem(0, "ID", "_id"),
    columnItem(1, "Nom", "name"),
    {
      ...columnItem(2, "Format", "format"),
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
      title: "Category",
      dataIndex: "category",
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

    {
      ...columnItem(3, "Prix TTC", "unitPrice"),
      render: (price) => {
        return format(price);
      },
    },
    {
      ...columnItem(4, "Actions"),
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditProduct(record);
              }}
            />
          </>
        );
      },
    },
  ];

  const editItem = (item) => {
    try {
      dispatch(editProductAction(item));
    } catch (error) {
      console.log(error.response);
    }
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
  let content = (
    <>
      {contextHolder}
      <div className="flex justify-between mb-2 ">
        <Button type="primary" onClick={() => navigate("create")}>
          Ajouter un Produit
        </Button>
        <Input.Search
          style={{ maxWidth: 300 }}
          placeholder="Recherche..."
          allowClear
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
        columns={columns.filter((col) => col.dataIndex !== "_id")}
        dataSource={!searchText ? allProducts : dataSource}
      ></Table>

      <Modal
        title="Modifier le produit"
        open={isEditing}
        okText="Sauvegarder"
        cancelText="Annuler"
        onCancel={() => {
          resetEditing();
        }}
        onOk={() => {
          editItem(editingProduct);
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
          <Select
            id="format"
            value={editingProduct?.format}
            onChange={(e) => {
              setEditingProduct((pre) => {
                return { ...pre, format: e };
              });
            }}
          >
            <Select.Option value="Grand format">Grand format</Select.Option>
            <Select.Option value="Petit format">Petit format</Select.Option>
          </Select>

          <Select
            id="category"
            value={editingProduct?.category}
            onChange={(e) => {
              setEditingProduct((pre) => {
                return { ...pre, category: e };
              });
            }}
          >
            <Select.Option value="Casier">Casier</Select.Option>
            <Select.Option value="Plastic">Plastic</Select.Option>
          </Select>

          <Input
            value={editingProduct?.unitPrice}
            onChange={(e) => {
              setEditingProduct((pre) => {
                return { ...pre, unitPrice: e.target.value };
              });
            }}
          />
        </div>
      </Modal>
    </>
  );
  return (
    <Container
      content={content}
      iconName={"grid_4-1"}
      contentName={"Produits"}
    />
  );
};

export default Products;
