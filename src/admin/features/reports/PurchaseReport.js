import { Button, Card, Table, Typography } from "antd";
import React, { useState } from "react";
import { filterByDateRange } from "../../../utils/dateFilters";
import { useSelector } from "react-redux";
import { selectAllExpenses } from "../finances/expenses/expenseSlice";
import { formatDate } from "../../../utils/formatDate";
import format from "../../../utils/currency";
import exportPdf from "../../../utils/exportPdf";

function columnItem(key, title, dataIndex) {
  return {
    key,
    title,
    dataIndex,
  };
}

const { Title } = Typography;
const PurchaseReport = ({ start_date, end_date }) => {
  const data = useSelector(selectAllExpenses);
  const [loader, setLoader] = useState();
  const filteredData = filterByDateRange(data, start_date, end_date).filter(
    (exp) => exp.modif === "versement a la banque" && exp
  );
  const total_fuel_expense = filteredData
    .map((exp) => exp.modif === "versement a la banque" && Number(exp.amount))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const columns = [
    {
      ...columnItem(3, "Date", "date"),
      render: (date) => {
        return formatDate(date);
      },
    },
    {
      ...columnItem(1, "Sortie", "modif"),
    },

    {
      ...columnItem(2, "Montant", "amount"),
      render: (date) => {
        return format(date);
      },
    },
    {
      ...columnItem(0, "Banque", "bank"),
    },
  ];

  let content = (
    <div className="flex flex-col gap-8">
      <div className="text-center px-14 bg-slate-900">
        <Title level={4} style={{ color: "white" }}>
          Rapport des Achat sur la periode du
          {` ${formatDate(start_date)}`} au
          {` ${formatDate(end_date)}`}
        </Title>
      </div>
      <div className="grid grid-cols-2 mx-24">
        <div className="flex items-center gap-4 ">
          <p> Totol depense en achat de produits </p>
          <h4> {total_fuel_expense.toFixed(2)} </h4>
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
    exportPdf("Rapport Ventes");
    setLoader(false);
  };

  return (
    <div className="mx-6 my-6">
      <Button className="my-4" type="primary" onClick={handleExportPdf}>
        {!loader ? "Exporter en PFD" : "Telechargement..."}
      </Button>
      <Card className="rounded-md actual-receipt ">{content}</Card>
    </div>
  );
};

export default PurchaseReport;
