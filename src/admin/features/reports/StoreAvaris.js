import { Button, Card, Table, Typography } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAllAvarisProducts } from "../avaris/avarisSlice";
import { filterByDateRange } from "../../../utils/dateFilters";
import { formatDate } from "../../../utils/formatDate";
import exportPdf from "../../../utils/exportPdf";

function columnItem(key, title, dataIndex) {
  return {
    key,
    title,
    dataIndex,
  };
}

const { Title } = Typography;
const StoreAvaris = ({ start_date, end_date }) => {
  const data = useSelector(selectAllAvarisProducts);
  const [loader, setLoader] = useState();
  const filteredData = filterByDateRange(data, start_date, end_date).filter(
    (item) => {
      return item.type.toLowerCase() === "magasin" && item;
    }
  );

  const total_store_avaris = filteredData
    .map((item) => {
      return item.type.toLowerCase() === "magasin" && Number(item.quantity);
    })
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const columns = [
    {
      ...columnItem(7, "Date", "date"),
      render: (iDate) => {
        return formatDate(iDate);
      },
    },
    columnItem(2, "Nom", "name"),
    {
      ...columnItem(3, "Type", "type"),
    },
    {
      ...columnItem(4, "Category", "category"),
    },
    {
      ...columnItem(5, "Format", "format"),
    },
    columnItem(6, "Nombre", "quantity"),
  ];

  let content = (
    <div className="flex flex-col gap-8">
      <div className="text-center px-14 bg-slate-900">
        <Title level={4} style={{ color: "white" }}>
          Rapport avaris au magasin sur la periode du
          {` ${formatDate(start_date)}`} au
          {` ${formatDate(end_date)}`}
        </Title>
      </div>
      <div className="grid grid-cols-2 mx-24">
        <div className="flex items-center gap-4 ">
          <p> Totol avaris au magasin </p>
          <h4> {total_store_avaris} </h4>
        </div>
      </div>
      <Table
        pagination={false}
        className="capitalize "
        columns={columns}
        dataSource={filteredData}
      ></Table>
    </div>
  );

  const handleExportPdf = () => {
    setLoader(true);
    exportPdf("Rapport Avaris Magasin");
    setLoader(false);
  };
  return (
    <div>
      <div className="mx-6 my-6">
        <Button className="my-4" type="primary" onClick={handleExportPdf}>
          {!loader ? "Exporter en PFD" : "Telechargement..."}
        </Button>
        <Card className="rounded-md actual-receipt ">{content}</Card>
      </div>
    </div>
  );
};

export default StoreAvaris;
