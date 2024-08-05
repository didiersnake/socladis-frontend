import { useState, useRef } from "react";

import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectUserById } from "./userSlice";
import { selectAllInvoices } from "../sales/invoiceSlice";
import format from "../../utils/currency";
import { formatDate } from "../../utils/formatDate";
import { Button, DatePicker, Table } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import exportPdf from "../../utils/exportPdf";

const UserInvoiceList = () => {
  const { userId } = useParams();
  const componentRef = useRef();
  const user = useSelector((state) => selectUserById(state, userId));
  const allInvoices = useSelector(selectAllInvoices);
  const userInvoicesArray = allInvoices.filter((item) => {
    return item.clientName === user.name;
  });

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [isFiltering, setIsFiltering] = useState(false);
  const [dataSource, setDataSource] = useState(userInvoicesArray);

  function columnItem(key, title, dataIndex) {
    return {
      key,
      title,
      dataIndex,
    };
  }

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

  const handleExportPdf = async () => {
    await exportPdf(componentRef, "Achat_" + user.name);
  };

  const columns = [
    {
      ...columnItem(7, "Date", "date"),
      render: (iDate) => {
        return formatDate(iDate);
      },
    },
    columnItem(2, "Nom", "clientName"),
    columnItem(4, "Ristourne", "ristourne"),
    {
      ...columnItem(5, "Total HT", "total_without_tax"),
      render: (item) => {
        return Number(item).toFixed(2);
      },
    },

    {
      ...columnItem(5, "Total TTC", "total_with_tax"),
      render: (item) => {
        return format(item);
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-2 ">
        <div>
          <Button className="my-4" type="primary" onClick={handleExportPdf}>
            {"Exporter en PFD"}
          </Button>
        </div>
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

            <Button type="primary" size="small" style={{ padding: "1px 4px" }} icon={<FilterOutlined />} onClick={filterByDateRange}></Button>
          </div>
        </div>
      </div>
      <div className="p-2" ref={componentRef}>
        <div className="p-6">{isFiltering ? "Periode" + "  " + `${formatDate(startDate)}` + " -- " + `${formatDate(endDate)}` : ""}</div>
        <Table className="capitalize" size="small" columns={columns} dataSource={isFiltering ? dataSource : userInvoicesArray} pagination={false}></Table>
      </div>
    </div>
  );
};

export default UserInvoiceList;
