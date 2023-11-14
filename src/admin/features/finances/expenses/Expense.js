import React, { useEffect, useState } from "react";
import Container from "../../../components/Container";
import { Button, DatePicker, Input, Modal, Select, Table, message } from "antd";
import { EditOutlined, FilterOutlined } from "@ant-design/icons";
import { formatDate } from "../../../../utils/formatDate";
import format from "../../../../utils/currency";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAllExpenses } from "./expenseSlice";
import editExpenseAction from "./actions/editExpenseAction";
import readExpenseAction from "./actions/readExpenseAction";

const Expense = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); //toggle edit button state
  const [editingProduct, setEditingProduct] = useState(null);
  const [messageApi, contextHolder] = message.useMessage(); // message state

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [isFiltering, setIsFiltering] = useState(false);

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const allExpense = useSelector(selectAllExpenses);
  const [dataSource, setDataSource] = useState(allExpense); // table data state

  function columnItem(key, title, dataIndex) {
    return {
      key,
      title,
      dataIndex,
    };
  }

  const readUsers = async () => {
    try {
      await dispatch(readExpenseAction());
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

  let orderedExpenses = allExpense
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

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
      ...columnItem(1, "Sortie", "modif"),
      filters: [
        {
          text: "depense courante",
          value: "depense courante",
        },
        {
          text: "versement a la banque",
          value: "versement a la banque",
        },
      ],
      onFilter: (value, record) => record.modif.indexOf(value) === 0,
    },

    {
      ...columnItem(2, "Montant", "amount"),
      render: (date) => {
        return format(date);
      },
    },
    {
      ...columnItem(0, "Banque / Motif", "bank"),
      filters: [
        {
          text: "BGFI Bank",
          value: "BGFI Bank",
        },
        {
          text: "Afriland First Bank",
          value: "Afriland First Bank",
        },
      ],
      onFilter: (value, record) => record.bank.indexOf(value) === 0,
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

  const filterByDateRange = () => {
    if (startDate && endDate) {
      setIsFiltering(true);
      setDataSource(
        orderedExpenses.filter((item) => {
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
      dispatch(editExpenseAction(item));
      iMessage("success", "modifié");
    } catch (error) {
      console.log(error.response);
    }
  };

  let content = (
    <>
      {contextHolder}
      <div className="flex justify-between mb-2 ">
        <Button type="primary" onClick={() => navigate("create")}>
          Ajouter une Depenses
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
                orderedExpenses.filter((record) =>
                  record?.modif
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
        dataSource={!searchText && !isFiltering ? orderedExpenses : dataSource}
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
        }}
      >
        <div className="grid gap-2 ">
          <Select
            onChange={(e) => {
              setEditingProduct((pre) => {
                return { ...pre, modif: e };
              });
            }}
            value={editingProduct?.modif}
          >
            <Select.Option value="versement a la banque">
              Versement a la banque
            </Select.Option>
            <Select.Option value="carburant">Carburant</Select.Option>
            <Select.Option value="depense courante">
              Depense courante
            </Select.Option>
          </Select>

          <Input
            value={editingProduct?.amount}
            onChange={(e) => {
              setEditingProduct((pre) => {
                return { ...pre, amount: e.target.value };
              });
            }}
          />

          {editingProduct?.modif === "versement a la banque" ? (
            <Select
              onChange={(e) => {
                setEditingProduct((pre) => {
                  return { ...pre, bank: e };
                });
              }}
              value={editingProduct?.bank}
            >
              <Select.Option value="Afriland First Bank">
                Afriland First Bank
              </Select.Option>
              <Select.Option value="BGFI Bank">BGFI Bank</Select.Option>
            </Select>
          ) : editingProduct?.modif === "carburant" ? (
            <Input
              name="motif"
              onChange={(e) => {
                setEditingProduct((pre) => {
                  return { ...pre, bank: e.target.value };
                });
              }}
              value={editingProduct?.bank}
            />
          ) : (
            <Input
              name="motif"
              onChange={(e) => {
                setEditingProduct((pre) => {
                  return { ...pre, bank: e.target.value };
                });
              }}
              value={editingProduct?.bank}
            />
          )}

          {/* {editingProduct?.modif === "depense courante" ? (
            <Input
              name="amount"
              onChange={(e) =>
                setEditingProduct((pre) => {
                  return { ...pre, bank: e.target.value };
                })
              }
              value={editingProduct?.bank}
            />
          ) : (
            <Select
              onChange={(e) => {
                setEditingProduct((pre) => {
                  return { ...pre, bank: e };
                });
              }}
              value={editingProduct?.bank}
            >
              <Select.Option value="Afriland First Bank">
                Afriland First Bank
              </Select.Option>
              <Select.Option value="BGFI Bank">BGFI Bank</Select.Option>
            </Select>
          )} */}
        </div>
      </Modal>
    </>
  );

  return (
    <Container
      content={content}
      iconName={"grid_4-1"}
      contentName={"Depenses"}
    />
  );
};

export default Expense;
