import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Table, Modal, message, Input, Select } from "antd";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, selectAllProducts } from "./productSlice";
import format from "../../../utils/currency";
import editProductAction from "./actions/editProductAction";
import readProductAction from "./actions/readProductAction";
import api from "../../../app/api/axios";
import { useEffect, useState } from "react";

const Products = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); //toggle edit button state
  const [editingProduct, setEditingProduct] = useState(null);
  const [messageApi, contextHolder] = message.useMessage(); // message state
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const allProducts = useSelector(selectAllProducts);
  const [dataSource, setDataSource] = useState(allProducts); // table data state
  let grossiste;
  let semi_grossiste;
  let detaillant;

  const readProducts = async () => {
    try {
      await dispatch(readProductAction());
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readProducts();
  }, []);

  const handleDelete = async (item) => {
    try {
      await api.delete(`api/current/product/${item?._id}`, {});
      dispatch(deleteProduct(item));
      iMessage("success", "Supprimé");
    } catch (error) {
      if (error?.response?.status === 500) {
        iMessage("error", "Verifiez votre connexion internet ");
      }
    }
  };

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
              style={{ margin: 12 }}
              onClick={() => {
                onEditProduct(record);
              }}
            />
            <DeleteOutlined
              style={{ margin: 12, color: "red" }}
              onClick={() => handleDelete(record)}
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
            placeholder="prix d'achat TTC"
            value={editingProduct?.unitPrice}
            onChange={(e) => {
              setEditingProduct((pre) => {
                return { ...pre, unitPrice: e.target.value };
              });
            }}
          />

          <Input
            placeholder="prix grossiste"
            value={(grossiste = editingProduct?.sale_price[0].grossiste)}
            onChange={(e) => {
              setEditingProduct((pre) => {
                return {
                  ...pre,
                  sale_price: [
                    {
                      grossiste: e.target.value,
                      Semi_grossiste: semi_grossiste,
                      detaillant: detaillant,
                    },
                  ],
                };
              });
            }}
          />
          <Input
            placeholder="prix semi grossiste"
            value={
              (semi_grossiste = editingProduct?.sale_price[0].Semi_grossiste)
            }
            onChange={(e) => {
              setEditingProduct((pre) => {
                return {
                  ...pre,
                  sale_price: [
                    {
                      grossiste: grossiste,
                      Semi_grossiste: e.target.value,
                      detaillant: detaillant,
                    },
                  ],
                };
              });
            }}
          />
          <Input
            placeholder="prix detaillant"
            value={(detaillant = editingProduct?.sale_price[0].detaillant)}
            onChange={(e) => {
              setEditingProduct((pre) => {
                return {
                  ...pre,
                  sale_price: [
                    {
                      grossiste: grossiste,
                      Semi_grossiste: semi_grossiste,
                      detaillant: e.target.value,
                    },
                  ],
                };
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
