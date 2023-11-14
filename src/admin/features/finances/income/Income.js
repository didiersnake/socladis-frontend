import { Button, DatePicker, Input, Modal, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EditOutlined, FilterOutlined } from "@ant-design/icons";
import format from "../../../../utils/currency";
import { selectAllTeams } from "../../teams/teamSlice";
import Container from "../../../components/Container";
import { selectAllIncomes } from "./incomeSlice";
import { formatDate } from "../../../../utils/formatDate";
import editIncome from "./actions/editIncome";
import readIncomeAction from "./actions/readIncomeAction";

const Income = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); //toggle edit button state
  const [editingProduct, setEditingProduct] = useState(null);
  const [messageApi, contextHolder] = message.useMessage(); // message state

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [isFiltering, setIsFiltering] = useState(false);

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const allIncome = useSelector(selectAllIncomes);
  const teams = useSelector(selectAllTeams);
  const [dataSource, setDataSource] = useState(allIncome); // table data state

  function columnItem(key, title, dataIndex) {
    return {
      key,
      title,
      dataIndex,
    };
  }

  const readUsers = async () => {
    try {
      await dispatch(readIncomeAction());
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readUsers();
  }, []);

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

  const iMessage = (type, content) => {
    setTimeout(() => {
      messageApi.open({
        type: type,
        content: content,
      });
    }, 1000);
  };

  const columns = [
    columnItem(0, "ID", "_id"),
    {
      ...columnItem(1, "Source d'approvisionement", "income_source"),
    },

    {
      ...columnItem(2, "Montant", "amount"),
      render: (date) => {
        return format(date);
      },
    },
    {
      ...columnItem(3, "Date", "date"),
      render: (date) => {
        return formatDate(date);
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

  let orderedIncome = allIncome
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const filterByDateRange = () => {
    if (startDate && endDate) {
      setIsFiltering(true);
      console.log(formatDate(endDate));
      console.log(formatDate(orderedIncome[0].date));
      setDataSource(
        orderedIncome.filter((item) => {
          let s_date = new Date(startDate).getTime();
          let e_date = new Date(endDate).getTime();
          let a_date = new Date(item.date).getTime();
          return a_date >= s_date && a_date <= e_date;
        })
      );
    }
  };

  const editItem = (item) => {
    try {
      dispatch(editIncome(item));
    } catch (error) {
      console.log(error.response);
    }
  };

  let content = (
    <>
      {contextHolder}
      <div className="flex justify-between mb-2 ">
        <Button type="primary" onClick={() => navigate("create")}>
          Ajouter un Versement
        </Button>

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
            allowClear
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setDataSource(
                allIncome.filter((record) =>
                  record?.income_source
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
        dataSource={!searchText && !isFiltering ? orderedIncome : dataSource}
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
          <Select
            onChange={(e) => {
              setEditingProduct((pre) => {
                return { ...pre, income: e };
              });
            }}
            value={editingProduct?.income_source}
          >
            <Select.Option value="magasin">Magasin</Select.Option>
            <Select.Option value="autres">Autres</Select.Option>
            {teams.map((item) => (
              <Select.Option key={item._id} value={item.name}>
                {item.name}{" "}
              </Select.Option>
            ))}
          </Select>

          <Input
            value={editingProduct?.amount}
            onChange={(e) => {
              setEditingProduct((pre) => {
                return { ...pre, amount: e.target.value };
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
      contentName={"Approvisionement"}
    />
  );
};

export default Income;
