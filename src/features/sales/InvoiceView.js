import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { Button, Table, Typography } from "antd";
import format from "../../utils/currency";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectInvoiceById } from "./invoiceSlice";
import { selectAllUser } from "../users/userSlice";
import exportPdf from "../../utils/exportPdf";

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
    setUserCode(user?.uniqueCode);
  }, [allUsers, invoice.clientName]);

  const handleExportPdf = () => {
    setLoader(true);
    exportPdf(invoice.clientName);
    setLoader(false);
  };

  return (
    <div className="mx-2">
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
        <div className="flex flex-col gap-4 px-12 py-6 my-4">
          <div className="flex items-center justify-between w-1/3 ">
            <p className="font-semibold">Facture de: </p>
            <h3>{invoice.clientName}</h3>
          </div>

          <div className="grid grid-cols-4 px-12 border border-black outline">
            <p className="font-semibold">Code client </p>
            <p className="font-semibold">Telephone </p>
            <p className="font-semibold"> Regime </p>
            <p className="font-semibold"> Category </p>
          </div>

          <div className="grid grid-cols-4 px-12 ">
            <Text>{userCode ? userCode : ""}</Text>
            <Text>{user_phone ? user_phone : ""}</Text>
            <Text>{user_tax_system ? user_tax_system : ""}</Text>
            <Text>{user_category ? user_category : ""}</Text>
          </div>

          <div className="grid grid-cols-4 px-12 mt-4 border border-black outline">
            <p className="font-semibold "># Facture</p>
            <p className="font-semibold ">Equipe </p>
          </div>

          <div className="grid grid-cols-4 px-12">
            <Text>{invoice.invoice_number} </Text>
            <Text>{team ? team : ""} </Text>
          </div>

          <Table
            pagination={false}
            className="px-12 mt-4"
            dataSource={invoice.products}
            columns={columns}
          />

          <div className="flex justify-center w-2/3 gap-6 ml-auto ">
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
            <div>
              <h3>Paiement</h3>
              <div>
                <p>
                  Cash : {Number(invoice?.payment_method[0]?.cash)?.toFixed(2)}
                </p>
                <p>
                  Credit :
                  {Number(invoice?.payment_method[0]?.credit)?.toFixed(2)}
                </p>
                <p>
                  Ristourne :
                  {Number(invoice?.payment_method[0]?.ristourn)?.toFixed(2)}
                </p>
                <p>Emballages : {invoice?.payment_method[0]?.emballages}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
