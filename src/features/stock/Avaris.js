import React, { useEffect, useState } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Table, Input, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { selectAllAvarisProducts } from "../../admin/features/avaris/avarisSlice";
import { formatDate } from "../../utils/formatDate";
import readAvarisAction from "../../admin/features/avaris/actions/readAvarisAction";

const Avaris = () => {
  const [searchText, setSearchText] = useState("");
  const allProducts = useSelector(selectAllAvarisProducts);
  const dispatch = useDispatch();
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

  const readAvaris = async () => {
    try {
      await dispatch(readAvarisAction());
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readAvaris();
  }, []);

  const columns = [
    columnItem(0, "ID", "_id"),
    columnItem(2, "Nom", "name"),
    {
      ...columnItem(3, "Type", "type"),
      filters: [
        {
          text: "Au dechargement",
          value: "Au dechargement",
        },
        {
          text: "Au magasin",
          value: "Au magasin",
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
  ];

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

  let content = (
    <>
      <div className="">
        <Button
          className=""
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
        ></Button>
        <h2>Avaris</h2>
      </div>
      <div className="flex justify-between mb-2 ">
        <Button type="primary" onClick={() => navigate("create")}>
          Ajouter un Avari
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
                allProducts.filter((record) =>
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
    </>
  );
  return <div className="pb-6 mx-16 my-10 ">{content}</div>;
};

export default Avaris;
