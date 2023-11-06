import React, { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, Table, Modal, message, Input, Tag } from "antd";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAllStockProducts } from "./aStockSlice";
import editItemAction from "./actions/editItemAction";
import readStockActions from "./actions/readStockActions";
import { formatDate } from "../../../utils/formatDate";

const AStock = () => {
  const [isEditing, setIsEditing] = useState(false); //toggle edit button state
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage(); // message state
  const allProducts = useSelector(selectAllStockProducts);
  const [dataSource, setDataSource] = useState(allProducts); // table data state

  const navigate = useNavigate();

  function columnItem(key, title, dataIndex) {
    return {
      key,
      title,
      dataIndex,
    };
  }

  const readStockItems = async () => {
    try {
      await dispatch(readStockActions());
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readStockItems();
  }, []);

  const columns = [
    columnItem(0, "ID", "_id"),
    columnItem(2, "Nom", "name"),
    columnItem(2, "Price", "unitPrice"),
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
          <>
            <Tag key={record._id} color={"green"}>
              en stock
            </Tag>
          </>
        ) : (
          <>
            <Tag key={record._id} color={"red"}>
              stock faible
            </Tag>
          </>
        );
      },
    },
    {
      ...columnItem(9, "Actions"),
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

  let orderedStock = allProducts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  // message function
  const iMessage = (type, content) => {
    setTimeout(() => {
      messageApi.open({
        type: type,
        content: content,
      });
    }, 1000);
  };

  const onEditProduct = (record) => {
    //open edit modal
    setIsEditing(true);
    //get editing record
    setEditingProduct({ ...record });
  };

  const resetEditing = () => {
    //reset edited data
    setIsEditing(false);
    setEditingProduct(null);
  };

  const editItem = (item) => {
    try {
      dispatch(editItemAction(item));
      iMessage("success", "modifié");
    } catch (error) {
      console.log(error.response);
    }
  };

  let content = (
    <>
      {contextHolder}
      <div className="flex justify-between mb-2">
        <Button type="primary" onClick={() => navigate("create")}>
          Ajouter un Produit
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
        pagination={true}
        scroll={{
          y: 640,
        }}
        columns={columns.filter(
          (col) => col.dataIndex !== "_id" && col.dataIndex !== "unitPrice"
        )}
        dataSource={!searchText ? orderedStock : dataSource}
      ></Table>

      <Modal
        title="Modifiez le seuil de stock"
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
        }}
      >
        <div className="grid gap-2 ">
          <Input
            placeholder="seuil de stock"
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
    <Container content={content} iconName={"grid_4-1"} contentName={"Stock"} />
  );
};

export default AStock;
