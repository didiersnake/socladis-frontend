import { useState, useRef } from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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

  const filterDateRange = () => {
    if (startDate && endDate) {
      setIsFiltering(true);
      const filterData = userInvoicesArray.filter((item) => {
        let s_date = new Date(startDate).getTime();
        let e_date = new Date(endDate).getTime();
        let a_date = new Date(item.date).getTime();

        console.log(e_date, a_date);

        return Number(s_date) <= Number(a_date) && Number(a_date) <= Number(e_date);
      });
      // filterByDateRange(dataSource, startDate, endDate);
      setDataSource(filterData);
    }
  };

  const handleExportPdf = async () => {
    await exportPdf(componentRef, user.name + "Etat_Achat_");
  };

  const calTotals = (data) => {
    let VAT_amount = data.reduce((acc, curr) => acc + Number(curr.VAT_amount), 0);
    let withdrawal_amount = data.reduce((acc, curr) => acc + Number(curr.withdrawal_amount), 0);
    let ristourne = data.reduce((acc, curr) => acc + Number(curr.ristourne), 0);
    let total_without_tax = data.reduce((acc, curr) => acc + Number(curr.total_without_tax), 0);
    let total_with_tax = data.reduce((acc, curr) => acc + Number(curr.total_with_tax), 0);

    return { VAT_amount, withdrawal_amount, ristourne, total_with_tax, total_without_tax };
  };

  const userSalesListResume = calTotals(dataSource);

  const columns = [
    {
      ...columnItem(7, "Date", "date"),
      render: (iDate) => {
        return formatDate(iDate);
      },
    },
    columnItem(2, "Facture", "invoice_number"),
    columnItem(3, "Ristourne", "ristourne"),
    columnItem(4, "Precompte", "withdrawal_amount"),
    columnItem(8, "TVA", "VAT_amount"),
    {
      ...columnItem(5, "Total HT", "total_without_tax"),
      render: (item) => {
        return Number(item).toFixed(2);
      },
    },

    {
      ...columnItem(6, "Total TTC", "total_with_tax"),
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

            <Button type="primary" size="small" style={{ padding: "1px 4px" }} icon={<FilterOutlined />} onClick={filterDateRange}></Button>
          </div>
        </div>
      </div>
      <div className="justify-center p-4 m-auto" ref={componentRef}>
        <div className="text-lg font-bold text-center capitalize">Socladis Sarl</div>
        <div className="p-2 text-base font-bold text-center capitalize">ETAT DES ACHATS</div>
        <div class=" px-5 grid grid-cols-4 gap-4">
          <div className="font-semibold capitalize ">Nom</div>
          <div className="font-semibold capitalize">Telephone</div>
          <div className="font-semibold capitalize ">Localisation</div>
          <div className="font-semibold capitalize ">NIU</div>
          <div>{user?.name}</div>
          <div>{user?.phone}</div>
          <div>{user?.location}</div>
          <div>{user?.uniqueCode}</div>
        </div>
        <div className="p-3 text-center">{isFiltering ? "Periode" + "  " + "  " + ` ${formatDate(startDate)}` + " -- " + ` ${formatDate(endDate)}` : ""}</div>
        <Table className="mx-auto capitalize" size="small" columns={columns} dataSource={isFiltering ? dataSource : userInvoicesArray} pagination={false}></Table>
        <div class="p-5 grid grid-cols-5 gap-3">
          <div className="text-base font-semibold capitalize">Total TVA</div>
          <div className="text-base font-semibold capitalize">Ristourne</div>
          <div className="text-base font-semibold capitalize">Precompte</div>
          <div className="text-base font-semibold capitalize">Total HT</div>
          <div className="text-base font-semibold capitalize">Total TTC</div>
          <div>{userSalesListResume?.VAT_amount}</div>
          <div>{userSalesListResume?.ristourne}</div>
          <div>{userSalesListResume?.withdrawal_amount}</div>
          <div>{userSalesListResume?.total_without_tax}</div>
          <div>{userSalesListResume?.total_with_tax}</div>
        </div>
      </div>
    </div>
  );
};

export default UserInvoiceList;
