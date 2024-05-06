import { useState, useRef } from "react";
import { selectAllInvoices } from "../../../features/sales/invoiceSlice";
import format from "../../../utils/currency";
import exportPdf from "../../../utils/exportPdf";
import { formatDate } from "../../../utils/formatDate";
import { useSelector } from "react-redux";
import { filterByDateRange } from "../../../utils/dateFilters";
import { Button, Card, Table, Typography } from "antd";
import { selectAllUser } from "../../../features/users/userSlice";

const { Title } = Typography;

const SalesReport = ({ start_date, end_date }) => {
  const data = useSelector(selectAllInvoices);
  const users = useSelector(selectAllUser).filter((user) => user.roles === "CLIENT");
  const [loader, setLoader] = useState();
  const componentRef = useRef();
  const filteredData = filterByDateRange(data, start_date, end_date);

  const number_of_items = (item) =>
    item["products"]
      .map((product) => Number(product.quantity))
      .reduce((accumulator, current) => {
        return accumulator + current;
      }, 0);

  const allUsersData = users.map((user) => {
    let userSales = filteredData.filter((user1) => user.name === user1.clientName);
    let userQuantity = userSales
      .map((user) => Number(number_of_items(user)))
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    let userRistourne = userSales
      .map((user) => Number(user.ristourne))
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    let userTHT = userSales
      .map((user) => Number(user.total_without_tax))
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    let userTTC = userSales
      .map((user) => Number(user.total_with_tax))
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);

    return { clientName: user.name, ristourne: userRistourne, quantity: userQuantity, total_without_tax: userTHT, total_with_tax: userTTC };
  });
  const total_income = filteredData
    .map((item) => Number(item.total_with_tax))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  const income_without_tax = filteredData
    .map((sale) => Number(sale.VAT_amount))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const ristourne = filteredData
    .map((sale) => Number(sale.ristourne))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const withdrawal_amount = filteredData
    .map((sale) => Number(sale.withdrawal_amount))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const handleExportPdf = () => {
    setLoader(true);
    exportPdf(componentRef, "Rapport Ventes");
    setLoader(false);
  };

  function columnItem(key, title, dataIndex) {
    return {
      key,
      title,
      dataIndex,
    };
  }

  const columns = [
    columnItem(2, "Nom", "clientName"),
    columnItem(5, "Quantité", "quantity"),
    // {
    //   // render: (item, record) => {
    //   //   return number_of_items(record);
    //   // },
    // },
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

  let content = (
    <div className="flex flex-col gap-4" ref={componentRef}>
      <div className="text-center px-14">
        <Title level={4}>
          Rapport ventes sur la periode du
          {` ${formatDate(start_date)}`} au
          {` ${formatDate(end_date)}`}
        </Title>
      </div>
      <div className="grid grid-cols-4">
        <div className="flex items-center gap-2 ">
          <p> Totol HT </p>
          <p> {income_without_tax.toFixed(2)} </p>
        </div>
        <div className="flex items-center gap-2 ">
          <p> Précompte </p>
          <p> {withdrawal_amount.toFixed(2)} </p>
        </div>
        <div className="flex items-center gap-2 ">
          <p> Ristournes </p>
          <p> {ristourne.toFixed(2)} </p>
        </div>
        <div className="flex items-center gap-2 ">
          <p> Totol TTC </p>
          <p> {total_income.toFixed(2)} </p>
        </div>
      </div>
      <Table size="small" pagination={false} className="capitalize " columns={columns} dataSource={allUsersData}></Table>
    </div>
  );

  return (
    <div className="mx-6 my-6">
      <Button className="my-4" type="primary" onClick={handleExportPdf}>
        {!loader ? "Exporter en PFD" : "Telechargement..."}
      </Button>
      <Card className="rounded-md actual-receipt ">{content}</Card>
    </div>
  );
};

export default SalesReport;
