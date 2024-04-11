import React, { useState, useRef } from "react";
import { selectAllProducts } from "../product/productSlice";
import { useSelector } from "react-redux";
import { filterByDateRange } from "../../../utils/dateFilters";
import { selectAllInvoices } from "../../../features/sales/invoiceSlice";
import { Button, Card, Typography } from "antd";
import { formatDate } from "../../../utils/formatDate";
import exportPdf from "../../../utils/exportPdf";

const { Title } = Typography;
const BrandSalesReport = ({ start_date, end_date }) => {
  const products = useSelector(selectAllProducts);
  const [loader, setLoader] = useState();
  const sales = useSelector(selectAllInvoices);
  const componentRef = useRef();
  const filteredData = filterByDateRange(sales, start_date, end_date);

  const productsLabel = products.map((i) => i.name);
  const pack_sold = products
    .map((pdt) => pdt.name)
    .map((product) =>
      filteredData
        .map((sale) => {
          //get sale item name with product brand(name in array)
          return sale.products.find((pdt) => pdt.name === product);
        })
        .filter((i) => i !== undefined)
        //get qty
        .map((qty) => Number(qty.quantity))
        //sum
        .reduce((acc, curr) => {
          return acc + curr;
        }, 0)
    );

  let content = (
    <div className="flex flex-col gap-2" ref={componentRef}>
      <div className="text-center px-14">
        <Title level={4}>
          Rapport de ventes selon les marques sur la periode du
          {` ${formatDate(start_date)}`} au
          {` ${formatDate(end_date)}`}
        </Title>
      </div>
      <div className="grid mx-24">
        <div className="flex items-center gap-4 ">
          <p> Totol pack vendus </p>
          <h4>
            {pack_sold.reduce((acc, curr) => {
              return acc + curr;
            }, 0)}
          </h4>
        </div>

        <div className="w-10/12 mx-auto">
          <div className="grid grid-cols-2 gap-y-8">
            <div>
              <h3>Marques</h3>
              {productsLabel.map((item, index) => (
                <div key={index} className="p-1">
                  <p className="bg-slate-300">
                    <strong>{item}</strong>
                  </p>
                </div>
              ))}
            </div>
            <div>
              <h3>Quantité</h3>
              {pack_sold.map((item, index) => (
                <div key={index} className="p-1">
                  <p>
                    <strong>{item}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleExportPdf = () => {
    setLoader(true);
    exportPdf(componentRef, "Rapport Marques Vendu");
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

export default BrandSalesReport;
