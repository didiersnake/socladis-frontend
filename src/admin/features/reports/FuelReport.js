import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { filterByDateRange } from "../../../utils/dateFilters";
import { selectAllExpenses } from "../finances/expenses/expenseSlice";
import exportPdf from "../../../utils/exportPdf";
import format from "../../../utils/currency";
import { formatDate } from "../../../utils/formatDate";
import { Button, Card, Table, Typography } from "antd";

function columnItem(key, title, dataIndex) {
  return {
    key,
    title,
    dataIndex,
  };
}
const { Title } = Typography;
const FuelReport = ({ start_date, end_date }) => {
  const data = useSelector(selectAllExpenses);
  const componentRef = useRef();
  const [loader, setLoader] = useState();
  const filteredData = filterByDateRange(data, start_date, end_date).filter((exp) => exp.modif === "carburant" && exp);
  const total_fuel_expense = filteredData
    .map((exp) => exp.modif === "carburant" && Number(exp.amount))
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
      ...columnItem(0, " Motif", "bank"),
    },
  ];

  let content = (
    <div className="flex flex-col gap-8" ref={componentRef}>
      <div className="text-center px-14">
        <div className="text-lg font-bold text-center capitalize">Socladis Sarl</div>
        <Title level={4}>
          Rapport depense carburant sur la periode du
          {` ${formatDate(start_date)}`} au
          {` ${formatDate(end_date)}`}
        </Title>
      </div>
      <div className="grid grid-cols-2 mx-24">
        <div className="flex items-center gap-4 ">
          <p> Totol depense en carburant </p>
          <h4> {total_fuel_expense.toFixed(2)} </h4>
        </div>
      </div>
      <Table size="small" pagination={false} className="capitalize " columns={columns} dataSource={filteredData}></Table>
    </div>
  );

  const handleExportPdf = () => {
    setLoader(true);
    exportPdf(componentRef, "Rapport Depense Carburant");
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

export default FuelReport;
