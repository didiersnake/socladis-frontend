import React, { lazy, useEffect, useState } from "react";
import { Button, DatePicker, Input, Table, message } from "antd";
import { formatDate } from "../../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteInvoice,
  selectAllInvoices,
} from "../../../features/sales/invoiceSlice";
import format from "../../../utils/currency";
import { DeleteOutlined, EyeOutlined, FilterOutlined } from "@ant-design/icons";
import readInvoice from "../../../features/sales/actions/readInvoice";
import api from "../../../app/api/axios";
const Container = lazy(() => import("../../components/Container"));

const Sales = () => {
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [isFiltering, setIsFiltering] = useState(false);

  const allInvoices = useSelector(selectAllInvoices);
  const [dataSource, setDataSource] = useState(allInvoices);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function columnItem(key, title, dataIndex) {
    return {
      key,
      title,
      dataIndex,
    };
  }

  const readUsers = async () => {
    try {
      await dispatch(readInvoice());
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readUsers();
  }, []);

  const iMessage = (type, content) => {
    setTimeout(() => {
      messageApi.open({
        type: type,
        content: content,
      });
    }, 1000);
  };

  const number_of_items = (item) =>
    item["products"]
      .map((product) => Number(product.quantity))
      .reduce((accumulator, current) => {
        return accumulator + current;
      }, 0);

  const handleDelete = async (item) => {
    try {
      await api.delete(`/api/current/sales/${item?._id}`, {});
      dispatch(deleteInvoice(item));
      iMessage("success", "Supprimé");
    } catch (error) {
      if (error?.response?.status === 500) {
        iMessage("error", "Verifiez votre connexion internet ");
      }
      console.log(error.response);
    }
  };

  const columns = [
    columnItem(1, "ID", "_id"),
    columnItem(2, "Nom", "clientName"),
    {
      ...columnItem(5, "Quantité", ""),
      render: (item, record) => {
        return number_of_items(record);
      },
    },
    columnItem(4, "Ristourne", "ristourne"),
    {
      ...columnItem(5, "Total HT", "total_without_tax"),
      render: (item) => {
        return Number(item).toFixed(2);
      },
    },

    {
      ...columnItem(5, "Total AVT", "total_with_tax"),
      render: (item) => {
        return format(item);
      },
    },
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
          <div>
            <EyeOutlined
              style={{ margin: 12 }}
              onClick={() => navigate(record._id)}
            />
            <DeleteOutlined
              style={{ margin: 12, color: "red" }}
              onClick={() => handleDelete(record)}
            />
          </div>
        );
      },
    },
  ];

  let orderedInvoices = allInvoices
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const filterByDateRange = () => {
    if (startDate && endDate) {
      setIsFiltering(true);

      setDataSource(
        dataSource.filter((item) => {
          let s_date = new Date(startDate).getTime();
          let e_date = new Date(endDate).getTime();
          let a_date = new Date(item.date).getTime();
          return a_date >= s_date && a_date <= e_date;
        })
      );
    }
  };

  let content = (
    <>
      {contextHolder}
      <div className="flex justify-between mb-2 ">
        <div></div> {/* search bar */}
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
              isFiltering
                ? setDataSource(
                    dataSource.filter((record) =>
                      record?.clientName
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    )
                  )
                : setDataSource(
                    allInvoices.filter((record) =>
                      record?.clientName
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
        dataSource={!searchText && !isFiltering ? orderedInvoices : dataSource}
      ></Table>
    </>
  );

  return (
    <Container content={content} iconName={"grid_4-1"} contentName={"Ventes"} />
  );
};

export default Sales;
