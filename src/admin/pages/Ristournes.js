import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAllUser } from "../../features/users/userSlice";
import { formatDate } from "../../utils/formatDate";
import { selectAllInvoices } from "../../features/sales/invoiceSlice";
import format from "../../utils/currency";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import exportPdf from "../../utils/exportPdf";

const Ristournes = () => {
  const [start_date, setStartDate] = useState();
  const [end_date, setEndDate] = useState();
  const [name, setName] = useState();

  const [nameOptions, setNameOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState();

  const filterByDateRange = (data) => {
    return data.filter((item) => {
      let s_date = new Date(start_date).getTime();
      let e_date = new Date(end_date).getTime();
      let a_date = new Date(item.date).getTime();
      return a_date >= s_date && a_date <= e_date;
    });
  };

  const users = useSelector(selectAllUser);
  const invoices = useSelector(selectAllInvoices);
  const navigate = useNavigate();
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "1",
      render: (item) => {
        return formatDate(item);
      },
    },
    {
      title: "Facture",
      dataIndex: "invoice_number",
      key: "2",
    },
    {
      title: "Quantité",
      dataIndex: "quantity",
      key: "3",
      render: (item, record) => {
        return record.ristourne / 100;
      },
    },
    {
      title: "Ristourne",
      dataIndex: "ristourne",
      key: "4",
    },
  ];

  const data = filterByDateRange(invoices).filter(
    (sale) => sale.clientName === name
  );

  const total_ristourn = data
    .map((item) => Number(item.ristourne))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const onNameSearch = (val) => {
    let filtered = users.filter(
      (obj) =>
        obj.roles.toString() === "CLIENT" &&
        obj.name.toString().toLowerCase().includes(val.toLowerCase())
    );
    setNameOptions(filtered);
  };

  const onNameSelect = (value, option) => {
    setName(option.value);
  };

  const onFinish = (values) => {
    setOpen(true);
    console.log(values);
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  let content = (
    <div className="flex flex-col gap-8">
      <div className="py-4 text-center px-14 bg-slate-900 ">
        <Title level={4} style={{ color: "white" }}>
          Ristournes
        </Title>
      </div>
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item
          name={["user", "name"]}
          label="Name"
          rules={[
            {
              required: true,
              message: "Entrez le nom",
            },
          ]}
        >
          <AutoComplete
            size="large"
            className="w-full"
            options={nameOptions.map((name) => ({
              label: name.name,
              value: name.name,
              id: name._id,
              phone: name.phone,
            }))}
            onSearch={onNameSearch}
            onSelect={onNameSelect}
          >
            <Input
              name="name"
              size="large"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="entrez le nom du client..."
            />
          </AutoComplete>
        </Form.Item>

        <Form.Item
          name={["user", "start_date"]}
          label="Date de début"
          rules={[
            {
              required: true,
              message: "date de bebut",
            },
          ]}
        >
          <DatePicker
            onChange={(dateString) => setStartDate(dateString)}
            value={start_date}
            showTime={false}
            format={"DD/MM/YYYY"}
          />
        </Form.Item>
        <Form.Item
          name={["user", "end_date"]}
          label="Date de fin"
          rules={[
            {
              required: true,
              message: "date de fin",
            },
          ]}
        >
          <DatePicker
            onChange={(dateString) => setEndDate(dateString)}
            value={end_date}
            showTime={false}
            format={"DD/MM/YYYY"}
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
          }}
        >
          <Button className="w-full text-white bg-slate-900" htmlType="submit">
            Calcul Ristourne
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const handleExportPdf = () => {
    setLoader(true);
    exportPdf("Rapport Ristournes");
    setLoader(true);
  };

  const handleRistourneExport = () => {
    handleExportPdf();
    setOpen(false);
  };

  const RistourneModal = ({ name }) => {
    return (
      <>
        <Modal
          title="Total Ristourne"
          open={open}
          okText="Exporter Pdf"
          onOk={handleRistourneExport}
          onCancel={() => setOpen(false)}
        >
          <div className="p-5 actual-receipt">
            <div className="flex items-start justify-between w-1/2 ">
              <p className="font-semibold ">Client</p>
              <p className="font-semibold ">{name}</p>
            </div>
            <div className="flex items-start justify-between w-1/2 ">
              <p className="font-semibold ">Date</p>
              <p className="font-semibold ">{formatDate(new Date())}</p>
            </div>

            <Table pagination={false} dataSource={data} columns={columns} />

            <div className="flex items-center justify-between ml-52">
              <p className="font-semibold ">Total </p>
              <p className="font-semibold ">{format(total_ristourn)}</p>
            </div>
          </div>
        </Modal>
      </>
    );
  };

  return (
    <div className="min-h-screen py-6 bg-white px-44">
      <Card className="rounded-md ">{content}</Card>

      <RistourneModal name={name} />
    </div>
  );
};

export default Ristournes;
