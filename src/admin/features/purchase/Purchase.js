import {
  AutoComplete,
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../../utils/formatDate";
import Container from "../../components/Container";
import { deletePurchase, selectAllPurchase } from "./purchaseSlice";
import editPurchaseAction from "./actions/editPurchaseAction";
import { selectAllProducts } from "../product/productSlice";
import readPurchaseAction from "./actions/readPurchaseAction";
import api from "../../../app/api/axios";

const Purchase = () => {
  const [isEditing, setIsEditing] = useState(false); //toggle edit button state
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();
  const allPurchase = useSelector(selectAllPurchase);
  const [dataSource, setDataSource] = useState(allPurchase); // table data state
  const allProducts = useSelector(selectAllProducts);

  const [productOptions, setProductOptions] = useState([]);

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

  const readStockItems = async () => {
    try {
      await dispatch(readPurchaseAction());
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readStockItems();
  }, []);

  const handleDelete = async (item) => {
    try {
      await api.delete(`api/current/achat/${item?._id}`, {});
      dispatch(deletePurchase(item));
      iMessage("success", "Supprimé");
    } catch (error) {
      if (error?.response?.status === 500) {
        iMessage("error", "Verifiez votre connexion internet ");
      }
    }
  };

  const columns = [
    columnItem(0, "ID", "_id"),
    columnItem(1, "Nom", "name"),

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
      ...columnItem(6, "Category", "category"),
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
    columnItem(1, "Type d'achat", "purchase_type"),

    columnItem(2, "Facture", "invoice_number"),
    columnItem(5, "Quantité", "quantity"),
    {
      ...columnItem(7, "Date", "date"),
      render: (iDate) => {
        return formatDate(iDate);
      },
    },
    {
      ...columnItem(8, "Actions"),
      render: (record) => {
        return (
          <>
            <EditOutlined
              style={{ margin: 12 }}
              onClick={() => {
                onEditProduct(record);
              }}
            />
          </>
        );
      },
    },
  ];

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
    setEditingProduct({ ...record });
  };

  const resetEditing = () => {
    //reset edited data
    setIsEditing(false);
    setEditingProduct(null);
  };

  const editItem = (item) => {
    try {
      dispatch(editPurchaseAction(item));
    } catch (error) {
      console.log(error.response);
    }
  };
  let orderedStock = allPurchase
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

  const DateFilters = () => {
    return (
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
    );
  };

  const onProductSearch = (val) => {
    let filtered = allProducts.filter(
      (obj) =>
        obj._id !== 0 &&
        obj.name.toString().toLowerCase().includes(val.toLowerCase())
    );
    setProductOptions(filtered);
  };

  const onProductSelect = (value, option) => {
    setEditingProduct((pre) => {
      return {
        ...pre,
        name: option.value,
        format: option.format,
        unitPrice: option.unitPrice,
        category: option.category,
        purchase_price: option.unitPrice,
      };
    });
  };
  let content = (
    <>
      {contextHolder}
      <div className="flex justify-between mb-2 ">
        <Button type="primary" onClick={() => navigate("create")}>
          Ajouter un Produit
        </Button>
        {/* search bar */}

        <div className="flex gap-4 ">
          <DateFilters />
          <Input.Search
            style={{ maxWidth: 300 }}
            placeholder="Recherche..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setDataSource(
                allPurchase.filter((record) =>
                  record?.name
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
          <AutoComplete
            size="large"
            options={productOptions.map((product) => {
              return {
                label: product.name,
                value: product.name,
                id: product._id,
                format: product.format,
                category: product.category,
                unitPrice: product.unitPrice,
              };
            })}
            onSearch={onProductSearch}
            onSelect={onProductSelect}
          >
            <Input name="name" value={editingProduct?.name} type="text" />
          </AutoComplete>
          <Input id="format" value={editingProduct?.format}></Input>
          <Input id="category" value={editingProduct?.category}></Input>
          <Select
            name="type"
            onChange={(e) =>
              setEditingProduct((pre) => {
                return { ...pre, purchase_type: e };
              })
            }
            value={editingProduct?.purchase_type}
          >
            <Select.Option value="Achat">Achat</Select.Option>
            <Select.Option value="Commission">Commission</Select.Option>
            <Select.Option value="Promotion">Promotion</Select.Option>
          </Select>

          <Input
            value={editingProduct?.invoice_number}
            placeholder="numero de facture"
            onChange={(e) => {
              setEditingProduct((pre) => {
                return { ...pre, invoice_number: e.target.value };
              });
            }}
          />
          <Input
            value={editingProduct?.quantity}
            placeholder="Quantité"
            onChange={(e) => {
              setEditingProduct((pre) => {
                return { ...pre, quantity: e.target.value };
              });
            }}
          />
        </div>
      </Modal>
    </>
  );
  return (
    <Container content={content} iconName={"grid_4-1"} contentName={"Achats"} />
  );
};

export default Purchase;
