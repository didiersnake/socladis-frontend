import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { selectAllAvarisProducts } from "../avaris/avarisSlice";
import { filterByDateRange } from "../../../utils/dateFilters";
import { formatDate } from "../../../utils/formatDate";
import exportPdf from "../../../utils/exportPdf";
import { Button, Card, Table, Typography } from "antd";

function columnItem(key, title, dataIndex) {
  return {
    key,
    title,
    dataIndex,
  };
}

const { Title } = Typography;

const DeliveryAvaris = ({ start_date, end_date }) => {
  const data = useSelector(selectAllAvarisProducts);
  const [loader, setLoader] = useState();
  const componentRef = useRef();
  const filteredData = filterByDateRange(data, start_date, end_date).filter((item) => {
    return item.type.toLowerCase() === "livraison" && item;
  });

  const total_deluvery_avaris = filteredData
    .map((item) => {
      return item.type.toLowerCase() === "livraison" && Number(item.quantity);
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
    <div className="flex flex-col gap-8" ref={componentRef}>
      <div className="text-center px-14">
        <div className="text-lg font-bold text-center capitalize">Socladis Sarl</div>
        <Title level={4}>
          Rapport avaris a la livraison sur la periode du
          {` ${formatDate(start_date)}`} au
          {` ${formatDate(end_date)}`}
        </Title>
      </div>
      <div className="grid grid-cols-2 mx-24">
        <div className="flex items-center gap-4 ">
          <p> Totol avaris a la livraison </p>
          <h4> {total_deluvery_avaris} </h4>
        </div>
      </div>
      <Table size="small" pagination={false} className="capitalize " columns={columns} dataSource={filteredData}></Table>
    </div>
  );

  const handleExportPdf = () => {
    setLoader(true);
    exportPdf(componentRef, "Rapport Avaris Livraison");
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

export default DeliveryAvaris;
