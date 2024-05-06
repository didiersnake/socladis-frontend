import { Card, Button, Form, Input, Modal, Table, Typography, Select, Checkbox } from "antd";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

//import { selectAllUser } from "../../features/users/userSlice";
import { formatDate } from "../../utils/formatDate";
import { selectAllInvoices } from "../../features/sales/invoiceSlice";
import format from "../../utils/currency";
import exportPdf from "../../utils/exportPdf";
import { EyeOutlined } from "@ant-design/icons";
import { selectAllUser } from "../../features/users/userSlice";

const { Title } = Typography;
const Ristournes = () => {
  const componentRef = useRef();
  const componentRef01 = useRef();

  const [name, setName] = useState();
  const [sequence, SetSequence] = useState();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState();
  const [loader, setLoader] = useState();

  let startDate;
  let endDate;
  const filterByDateRange = (data) => {
    switch (sequence) {
      case "1":
        startDate = `${year}/01/01`;
        endDate = `${year}/03/31`;
        break;
      case "2":
        startDate = `${year}/04/01`;
        endDate = `${year}/06/30`;
        break;
      case "3":
        startDate = `${year}/07/01`;
        endDate = `${year}/09/30`;
        break;
      case "4":
        startDate = `${year}/10/01`;
        endDate = `${year}/12/31`;
        break;
    }
    return data.filter((item) => {
      let s_date = new Date(startDate).getTime();
      let e_date = new Date(endDate).getTime();
      let a_date = new Date(item.date).getTime();
      return a_date >= s_date && a_date <= e_date;
    });
  };

  //const users = useSelector(selectAllUser);
  //const allCustomers = users.filter((obj) => obj.roles.toString() === "CLIENT");
  const invoices = useSelector(selectAllInvoices);
  const user = useSelector(selectAllUser);
  const [searchText, setSearchText] = useState();
  const [dataSource, setDataSource] = useState();
  // Read all customers in invoices
  const allInvoiceCustomers = invoices.reduce((result, invoice) => {
    const { clientName } = invoice;

    // Create an array for the clientName if it doesn't exist in the result object
    result[clientName] = result[clientName] || [];

    // Push the current invoice to the array associated with the clientName
    result[clientName].push(invoice);

    return result;
  }, {});

  function columnItem(key, title, dataIndex) {
    return {
      key,
      title,
      dataIndex,
    };
  }

  //Get ristourne from all invoices
  //iterate allInvoicesCustomers return ristourne and name
  const allRistournes1 = Object.entries(allInvoiceCustomers).map(([key, value]) => {
    let r = filterByDateRange(value)
      .map((item) => Number(item.ristourne))
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    return {
      name: key,
      ristourne: r,
    };
  });

  const [allRistourn, setAllRistourne] = useState(
    allRistournes1.map((item) => {
      return {
        ...item,
        payed: false,
      };
    })
  );

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

  const editRistournPaymentStatus = (name) => {
    setAllRistourne(
      allRistourn.map((item) => {
        if (item.name === name) {
          return {
            ...item,
            payed: true,
          };
        }
        return item;
      })
    );
  };
  const columns_1 = [
    {
      ...columnItem(8, "Payé"),
      render: (record) => {
        return (
          <div key={record.name} className="space-x-1">
            <Checkbox checked={record.payed}></Checkbox>
          </div>
        );
      },
    },
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
              key={record.name}
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

  const ristourne_data = filterByDateRange(invoices).filter((sale) => sale.clientName === name);

  const userData = user.find((user) => user.name === name);

  //total rsitourne on entered period
  const total_ristourn_period = allRistournes1
    .map((item) => {
      return item.ristourne;
    })
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  console.log(total_ristourn_period);

  //Get ristourne from customers list
  /*  const allRistournes = allCustomers.map((cust) => {
    return {
      name: cust.name,
      ristourne: filterByDateRange(invoices)
        .filter((sale) => sale.clientName === cust.name)
        .map((item) => Number(item.ristourne))
        .reduce((acc, curr) => {
          return acc + curr;
        }, 0),
    };
  }); */

  const total_ristourn = ristourne_data
    .map((item) => Number(item.ristourne))
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);

  const onFinish = (values) => {
    setOpen(true);
  };

  const RistourneView = ({ name, phone, niu, group }) => {
    return (
      <>
        <h2 className="text-center ">Apercu PDF</h2>
        <div ref={componentRef} id="content" className="px-12 actual-receipt">
          <div className="text-center px-14">
            <Title level={1} style={{ color: "black" }}>
              Socladis sarl
            </Title>
          </div>
          <Title className="text-center " level={5}>
            État de Ristourne
          </Title>
          <div className="flex items-start justify-between ">
            <p className="font-semibold ">{name}</p>
          </div>
          <div className="flex items-start justify-between ">
            <p>
              Tel : <span className="font-semibold">{phone}</span>
            </p>
            <p>
              NIU : <span className="font-semibold">{niu}</span>
            </p>
            <p>
              Equipe : <span className="font-semibold">{group}</span>
            </p>
          </div>
          <div className="flex items-start justify-between ">
            <p>
              Period :{" "}
              <span className="font-semibold ">
                {startDate && formatDate(startDate)} --- {endDate && formatDate(endDate)}
              </span>
            </p>
          </div>

          <table className="w-full m-auto text-center table-auto border-spacing-y-1">
            <tr>
              <th>Date</th>
              <th>Facture</th>
              <th>Quantité</th>
              <th>Ristourne</th>
            </tr>

            {ristourne_data.map((item) => {
              return (
                <tr>
                  <td>{formatDate(item.date)}</td>
                  <td>{item?.invoice_number}</td>
                  <td>{item?.ristourne / 100}</td>
                  <td>{item?.ristourne}</td>
                </tr>
              );
            })}
          </table>

          <div className="grid grid-cols-4 ">
            <div></div>
            <div></div>
            <div></div>
            <div className="flex justify-between ">
              <p className="font-semibold ">Total </p>
              <p className="font-semibold ">{format(total_ristourn)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div className="flex items-center justify-around col-span-2 ">
              <p>Signature employée </p>
              <p>Signature clients </p>
            </div>
            <p className="text-end">{formatDate(new Date())}</p>
          </div>
        </div>
      </>
    );
  };

  const handleExportPdf = () => {
    exportPdf(componentRef, `${name}.pdf`);
  };

  const handleRistourneExport = () => {
    handleExportPdf();
    setOpen(false);
  };

  const RistourneModal = ({ name }) => {
    return (
      <>
        <Modal open={open} okText="Exporter Pdf" onOk={handleRistourneExport} onCancel={() => setOpen(false)}>
          <div className="p-5">
            <div className="text-center px-14 bg-slate-900">
              <Title level={4} style={{ color: "white" }}>
                Socladis sarl
              </Title>
            </div>
            <Title level={5}>État de Ristourne</Title>
            <div className="flex items-start justify-between w-3/4 ">
              <p className="">Client</p>
              <p className="font-semibold ">{name}</p>
            </div>
            <div className="flex items-start justify-between w-3/4 ">
              <p className="">Period</p>
              <p className="font-semibold ">
                {startDate && formatDate(startDate)} - {endDate && formatDate(endDate)}
              </p>
            </div>

            <Table pagination={false} dataSource={ristourne_data} columns={columns} />

            <div className="flex items-center justify-between ml-52">
              <p className="font-semibold ">Total </p>
              <p className="font-semibold ">{format(total_ristourn)}</p>
            </div>
            <div className="flex items-center justify-between ml-52">
              <p className="font-semibold "> </p>
              <p className="">{formatDate(new Date())}</p>
            </div>
            <div className="grid grid-cols-2">
              <p>Signature employée </p>
              <p>Signature clients </p>
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
            {/* <Form.Item
              name={["user", "startDate"]}
              label="Date de début"
              rules={[
                {
                  required: true,
                  message: "date de bebut",
                },
              ]}
            >
              <DatePicker onChange={(dateString) => setStartDate(dateString)} value={startDate} showTime={false} format={"DD/MM/YYYY"} />
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
                onChange={(dateString) => {
                  setEndDate(dateString);
                }}
                value={end_date}
                showTime={false}
                format={"DD/MM/YYYY"}
              />
            </Form.Item> */}
            <Form.Item
              name={["user", "year"]}
              label="Année"
              rules={[
                {
                  required: true,
                  message: "Année",
                },
              ]}
            >
              <Select
                name="year"
                placeholder="année"
                onChange={(e) => {
                  setYear(e);
                }}
                value={year}
              >
                <Select.Option value="2022">2022</Select.Option>
                <Select.Option value="2023">2023</Select.Option>
                <Select.Option value="2024">2024</Select.Option>
                <Select.Option value="2025">2025</Select.Option>
                <Select.Option value="2026">2026</Select.Option>
                <Select.Option value="2027">2027</Select.Option>
                <Select.Option value="2028">2028</Select.Option>
                <Select.Option value="2029">2029</Select.Option>
                <Select.Option value="2030">2030</Select.Option>
                <Select.Option value="2031">2031</Select.Option>
                <Select.Option value="2032">2031</Select.Option>
                <Select.Option value="2033">2032</Select.Option>
                <Select.Option value="2034">2033</Select.Option>
                <Select.Option value="2035">2035</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={["user", "sequence"]}
              label="Trimestre"
              rules={[
                {
                  required: true,
                  message: "Trimestre",
                },
              ]}
            >
              <Select
                name="sequence"
                placeholder="Trimestre"
                onChange={(e) => {
                  SetSequence(e);
                }}
                value={sequence}
              >
                <Select.Option value="1">Janvier-Mars</Select.Option>
                <Select.Option value="2">Avril-Juin</Select.Option>
                <Select.Option value="3">Juillet-Septembre</Select.Option>
                <Select.Option value="4">Octobre-Decembre</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
        <Input.Search
          style={{ maxWidth: 300 }}
          placeholder="Recherche..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setDataSource(allRistournes1.filter((record) => record?.name.toLowerCase().includes(e.target.value.toLowerCase())));
          }}
        />
      </div>
      <Button
        className="my-4"
        type="primary"
        onClick={() => {
          setLoader(true);
          exportPdf(componentRef01, `Ristourne Trimestre ${sequence} ${year}.pdf`);
          setLoader(false);
        }}
      >
        {!loader ? "Exporter liste de ristourne en PFD" : "Telechargement..."}
      </Button>
      <div ref={componentRef01}>
        <p className="text-center uppercase py-3">
          Ristourne sur la periode du trimestre {sequence} {year}
        </p>
        <Table dataSource={!searchText ? allRistournes1 : dataSource} columns={columns_1} pagination={false} size="small" />
      </div>

      <div className="text-end">
        Total ristourn sur la periond
        <h3> {format(total_ristourn_period)}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-2 py-6 mx-auto bg-white">
      <Card className="rounded-md ">{content}</Card>

      <RistourneModal name={name} />

      <div className="">
        <RistourneView name={name} phone={userData?.phone} niu={userData?.uniqueCode} group={userData?.group} />
      </div>
    </div>
  );
};

export default Ristournes;
