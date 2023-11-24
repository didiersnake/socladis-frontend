import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Table,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { selectAllUser } from "../../features/users/userSlice";
import { formatDate } from "../../utils/formatDate";
import { selectAllInvoices } from "../../features/sales/invoiceSlice";
import format from "../../utils/currency";
import exportPdf from "../../utils/exportPdf";
import { EyeOutlined } from "@ant-design/icons";

const { Title } = Typography;
const Ristournes = () => {
  const [start_date, setStartDate] = useState();
  const [end_date, setEndDate] = useState();
  const [name, setName] = useState();

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
  const allCustomers = users.filter((obj) => obj.roles.toString() === "CLIENT");
  const invoices = useSelector(selectAllInvoices);
  const [searchText, setSearchText] = useState();
  const [dataSource, setDataSource] = useState();
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

  function columnItem(key, title, dataIndex) {
    return {
      key,
      title,
      dataIndex,
    };
  }

  const columns_1 = [
    columnItem(2, "Nom", "name"),
    columnItem(4, "Ristourne", "ristourne"),
    {
      ...columnItem(7, "Date", "date"),
      render: () => {
        return formatDate(new Date());
      },
    },
    {
      ...columnItem(9, "Actions"),
      render: (record) => {
        return (
          <>
            <EyeOutlined
              onClick={() => {
                setName(record.name);
                setOpen(true);
              }}
            />
          </>
        );
      },
    },
  ];

  const data = filterByDateRange(invoices).filter(
    (sale) => sale.clientName === name
  );

  const allRistournes = allCustomers.map((cust) => {
    return {
      name: cust.name,
      ristourne: filterByDateRange(invoices)
        .filter((sale) => sale.clientName === cust.name)
        .map((item) => Number(item.ristourne))
        .reduce((acc, curr) => {
          return acc + curr;
        }, 0),
    };
  });

  const total_ristourn = data
    .map((item) => Number(item.ristourne))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const onFinish = (values) => {
    setOpen(true);
    console.log(values);
  };

  const handleExportPdf = () => {
    setLoader(true);
    exportPdf(name);
  };

  const handleRistourneExport = () => {
    handleExportPdf();
    setOpen(false);
  };

  const RistourneModal = ({ name }) => {
    return (
      <>
        <Modal
          open={open}
          okText="Exporter Pdf"
          onOk={handleRistourneExport}
          onCancel={() => setOpen(false)}
        >
          <div className="p-5 actual-receipt">
            <div className="text-center px-14 bg-slate-900">
              <Title level={4} style={{ color: "white" }}>
                Socladis sarl
              </Title>
            </div>
            <div className="flex items-start justify-between w-3/4 ">
              <p className="">Client</p>
              <p className="font-semibold ">{name}</p>
            </div>
            <div className="flex items-start justify-between w-3/4 ">
              <p className="">Period</p>
              <p className="font-semibold ">
                {formatDate(start_date)} - {formatDate(end_date)}
              </p>
            </div>

            <Table pagination={false} dataSource={data} columns={columns} />

            <div className="flex items-center justify-between ml-52">
              <p className="font-semibold ">Total </p>
              <p className="font-semibold ">{format(total_ristourn)}</p>
            </div>
            <div className="flex items-center justify-between ml-52">
              <p className="font-semibold "> </p>
              <p className="">{formatDate(new Date())}</p>
            </div>
          </div>
        </Modal>
      </>
    );
  };

  let content = (
    <div className="flex flex-col gap-8">
      <div className="py-4 text-center px-14 bg-slate-900 ">
        <Title level={4} style={{ color: "white" }}>
          Ristournes
        </Title>
      </div>
      <div className="flex items-end justify-around ">
        <div>
          <Form
            name="nest-messages"
            onFinish={onFinish}
            style={{
              maxWidth: 500,
            }}
          >
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
          </Form>
        </div>
        <Input.Search
          style={{ maxWidth: 300 }}
          placeholder="Recherche..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setDataSource(
              allRistournes.filter((record) =>
                record?.name
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase())
              )
            );
          }}
        />
      </div>

      <Table
        dataSource={!searchText ? allRistournes : dataSource}
        columns={columns_1}
      />
    </div>
  );

  return (
    <div className="min-h-screen px-2 py-6 mx-auto bg-white">
      <Card className="rounded-md ">{content}</Card>

      <RistourneModal name={name} />
    </div>
  );
};

export default Ristournes;
