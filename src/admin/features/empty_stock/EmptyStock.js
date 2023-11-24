import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, DatePicker, Input, Modal, Select, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import Container from "../../components/Container";
import { formatDate } from "../../../utils/formatDate";
import { deleteProduct, selectAllEmptyStock } from "./emptyStockSlice";
import { selectAllTeams } from "../teams/teamSlice";
import editEmptyStockAction from "./actions/editEmptyStockAction";
import readEmptyStockAction from "./actions/readEmptyStockAction";
import api from "../../../app/api/axios";

const EmptyStock = () => {
  const [isEditing, setIsEditing] = useState(false); //toggle edit button state
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState("");
  const allProducts = useSelector(selectAllEmptyStock);
  const dispatch = useDispatch();
  const allTeams = useSelector(selectAllTeams);
  const [messageApi, contextHolder] = message.useMessage(); // message state
  const [dataSource, setDataSource] = useState(allProducts); // table data state

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

  const readUsers = async () => {
    try {
      await dispatch(readEmptyStockAction());
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readUsers();
  }, []);

  const editItem = (item) => {
    try {
      dispatch(editEmptyStockAction(item));
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleDelete = async (item) => {
    try {
      await api.delete(`/api/current/empty/store/${item?._id}`, {});
      dispatch(deleteProduct(item));
      iMessage("success", "Supprimé");
    } catch (error) {
      if (error?.response?.status === 500) {
        iMessage("error", "Verifiez votre connexion internet ");
      }
      console.log(error.response);
    }
  };

  const columns = [
    columnItem(0, "ID", "_id"),
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
    columnItem(2, "Equipe", "team"),
    columnItem(3, "Casiers", "cashier"),
    columnItem(3, "Bouteuille", "bottle"),
    columnItem(3, "Plastic", "plastic"),

    {
      ...columnItem(7, "Date", "date"),
      render: (iDate) => {
        return formatDate(iDate);
      },
    },
    {
      ...columnItem(9, "Actions"),
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

  let orderedStock = allProducts
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

  // message function
  const iMessage = (type, content) => {
    setTimeout(() => {
      messageApi.open({
        type: type,
        content: content,
      });
    }, 1000);
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
            placeholder="Equipe..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setDataSource(
                dataSource.filter((record) =>
                  record?.team
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

      {
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
              onChange={(e) =>
                setEditingProduct((pre) => {
                  return { ...pre, team: e };
                })
              }
              value={editingProduct?.team}
            >
              <Select.Option value="magasin"> Magasin</Select.Option>
              {allTeams.map((team) => (
                <Select.Option key={team._id} value={team.name}>
                  {team.name}
                </Select.Option>
              ))}
            </Select>

            <Input
              id="quantity"
              value={editingProduct?.cashier}
              placeholder="Casiers"
              onChange={(e) =>
                setEditingProduct((pre) => {
                  return { ...pre, cashier: e.target.value };
                })
              }
            />
            <Input
              id="quantity"
              value={editingProduct?.bottle}
              placeholder="bouteille"
              onChange={(e) =>
                setEditingProduct((pre) => {
                  return { ...pre, bottle: e.target.value };
                })
              }
            />
            <Input
              id="quantity"
              value={editingProduct?.plastic}
              placeholder="Plastics"
              onChange={(e) =>
                setEditingProduct((pre) => {
                  return { ...pre, plastic: e.target.value };
                })
              }
            />
          </div>
        </Modal>
      }
    </>
  );

  return (
    <div>
      <Container
        content={content}
        iconName={"grid_4-1"}
        contentName={"Magasin vide"}
      />
    </div>
  );
};

export default EmptyStock;
