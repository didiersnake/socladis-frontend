import React, { useEffect, useState } from "react";
import { EditOutlined, FilterOutlined } from "@ant-design/icons";
import {
  Button,
  Table,
  Modal,
  message,
  Input,
  DatePicker,
  Select,
  AutoComplete,
} from "antd";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAllAvarisProducts } from "./avarisSlice";
import editAvarisAction from "./actions/editAvarisAction";
import { selectAllProducts } from "../product/productSlice";
import { formatDate } from "../../../utils/formatDate";
import readAvarisAction from "./actions/readAvarisAction";

const Avaris = () => {
  const [isEditing, setIsEditing] = useState(false); //toggle edit button state
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState("");
  const allAvarisProducts = useSelector(selectAllAvarisProducts);
  const allProducts = useSelector(selectAllProducts);
  const dispatch = useDispatch();
  const [productOptions, setProductOptions] = useState([]);
  const [messageApi, contextHolder] = message.useMessage(); // message state
  const [dataSource, setDataSource] = useState(); // table data state
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

  const editItem = (item) => {
    try {
      dispatch(editAvarisAction(item));
    } catch (error) {
      console.log(error.response);
    }
  };

  const readAvaris = async () => {
    try {
      await dispatch(readAvarisAction());
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readAvaris();
  });

  const columns = [
    columnItem(0, "ID", "_id"),
    columnItem(2, "Nom", "name"),
    {
      ...columnItem(3, "Type", "type"),
      filters: [
        {
          text: "Livraison",
          value: "Livraison",
        },
        {
          text: "Magasin",
          value: "Magasin",
        },
      ],
      onFilter: (value, record) => record.type.indexOf(value) === 0,
    },
    {
      ...columnItem(4, "Category", "category"),
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
      ...columnItem(5, "Format", "format"),
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
    columnItem(6, "Nombre", "quantity"),
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
              onClick={() => {
                onEditProduct(record);
              }}
            />
          </>
        );
      },
    },
  ];

  let orderedStock = allAvarisProducts
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
          return a_date <= e_date && a_date >= s_date;
        })
      );
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
            placeholder="Recherche..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setDataSource(
                allAvarisProducts.filter((record) =>
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
        columns={columns.filter((col) => col.dataIndex !== "_id")}
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
              };
            })}
            onSearch={onProductSearch}
            onSelect={onProductSelect}
          >
            <Input name="name" value={editingProduct?.name} type="text" />
          </AutoComplete>

          <Input id="category" value={editingProduct?.category}></Input>

          <Input id="format" value={editingProduct?.format}></Input>
          <Select
            id="type"
            value={editingProduct?.type}
            onChange={(e) =>
              setEditingProduct((pre) => {
                return { ...pre, type: e };
              })
            }
          >
            <Select.Option value="livraison">Livraison</Select.Option>
            <Select.Option value="magasin">Magasin</Select.Option>
          </Select>

          <Input
            id="quantity"
            value={editingProduct?.quantity}
            onChange={(e) =>
              setEditingProduct((pre) => {
                return { ...pre, quantity: e.target.value };
              })
            }
          />
        </div>
      </Modal>
    </>
  );

  return (
    <Container content={content} iconName={"grid_4-1"} contentName={"Avaris"} />
  );
};

export default Avaris;
