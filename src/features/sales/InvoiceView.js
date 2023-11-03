import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { Button, Table, Typography } from "antd";
import format from "../../utils/currency";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectInvoiceById } from "./invoiceSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { selectAllUser } from "../users/userSlice";

const InvoiceView = () => {
  const { invoiceId } = useParams();
  const invoice = useSelector((state) => selectInvoiceById(state, invoiceId));
  const navigate = useNavigate();
  const allUsers = useSelector(selectAllUser);
  const { Title, Text } = Typography;
  const [userCode, setUserCode] = useState();
  const [user_category, setUserCategory] = useState();
  const [user_tax_system, setUserTaxSystem] = useState();
  const [user_phone, setUserPhone] = useState();
  const [team, setTeam] = useState();
  const [payment_method, setPaymentMode] = useState();

  const [loader, setLoader] = useState(false);
  const columns = [
    {
      title: "Produits",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantité",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Valeur",
      dataIndex: "total",
      key: "total",
    },
  ];

  useEffect(() => {
    const user = allUsers.find((item) => item.name === invoice.clientName);
    setUserCategory(user?.category);
    setUserTaxSystem(user?.tax_system);
    setUserPhone(user?.phone);
    setTeam(user?.group);
  });

  const handleExportPdf = () => {
    const capture = document.querySelector(".actual-receipt");
    setLoader(true);
    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL("img/png");
      const doc = new jsPDF("p", "mm", "a5");
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
      setLoader(false);
      doc.save(`${invoice.clientName}.pdf`);
    });
  };

  return (
    <div className="mx-36">
      <div className="flex items-center justify-between py-6">
        <Button
          className=""
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
        ></Button>

        <Button className="" type="primary" onClick={handleExportPdf}>
          {!loader ? "Exporter en PFD" : "Telechargement..."}
        </Button>
      </div>

      <div className="mb-24 border border-gray-700 border-solid rounded-md actual-receipt">
        <div className="grid grid-cols-3 ">
          <div className="col-span-2 py-1 text-center bg-slate-900">
            <Title level={3} style={{ color: "white" }}>
              Socladis Sarl
            </Title>
          </div>
          <div className="px-12 text-right">
            <Title level={5}>{formatDate(invoice.date)}</Title>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-12 py-6 my-4">
          <div className="grid grid-cols-6 px-12 border border-black outline">
            <p className="col-span-2 font-semibold">Client </p>
            <p className="font-semibold">Code </p>
            <p className="font-semibold">Tel </p>
            <p className="font-semibold"> Regime </p>
            <p className="font-semibold"> Category </p>
          </div>

          <div className="grid grid-cols-6 px-12 ">
            <Text className="col-span-2 ">{invoice.clientName}</Text>
            <Text>#023873</Text>
            <Text>{user_phone}</Text>
            <Text>{user_tax_system}</Text>
            <Text>{user_category}</Text>
          </div>

          <div className="grid grid-cols-5 px-12 mt-4 border border-black outline">
            <p className="col-span-2 font-semibold">Mode de paiement </p>
            <p className="font-semibold ">Equipe </p>
          </div>

          <div className="grid grid-cols-5 px-12">
            <Text className="col-span-2 ">
              {invoice.payment_method.map((item) => `${item},  `)}
            </Text>
            <Text>{team} </Text>
          </div>

          <Table
            className="px-12 mt-4"
            dataSource={invoice.products}
            columns={columns}
          />

          <table class="table-auto w-1/3 text-start border-spacing-2  ml-auto">
            <thead>
              <tr></tr>
            </thead>

            <tbody>
              <tr>
                <td className="font-semibold ">Total HT</td>
                <td>{Number(invoice.total_without_tax).toFixed(2)}</td>
              </tr>

              <tr>
                <td className="font-semibold ">Montant TVA</td>
                <td> {Number(invoice.VAT_amount).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="font-semibold ">Précompte</td>
                <td>{Number(invoice.withdrawal_amount).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="font-semibold ">Ristoune</td>
                <td>{Number(invoice.ristourne).toFixed(2)}</td>
              </tr>
              <tr className="p-1 outline ">
                <td className="font-semibold ">Total TTC</td>
                <td>{format(Number(invoice.total_with_tax).toFixed(2))}</td>
              </tr>
            </tbody>
          </table>

          {/* Invoices total  */}
          {/*  <div className="flex justify-between ">
            <div></div>
            <div>
              <div className="flex items-center justify-between gap-6 ">
                <p className="font-semibold ">Total HT</p>
                <p className="font-semibold ">
                  {Number(invoice.total_without_tax).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-6">
                <p className="font-semibold ">Montant TVA</p>
                <p className="font-semibold ">
                  {Number(invoice.VAT_amount).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-6">
                <p className="font-semibold ">Précompte </p>
                <p className="font-semibold ">
                  {Number(invoice.withdrawal_amount).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-6">
                <p className="font-semibold ">Ristourne </p>
                <p className="font-semibold ">
                  {Number(invoice.ristourne).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-6">
                <p className="font-semibold ">Total TTC </p>
                <p className="font-semibold ">
                  {format(Number(invoice.total_with_tax).toFixed(2))}
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
