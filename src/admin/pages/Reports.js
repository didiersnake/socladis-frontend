import { Button, Card, DatePicker, Form, Select } from "antd";
import Title from "antd/es/typography/Title";
import React, { lazy, useState } from "react";

import { useNavigate } from "react-router-dom";

const SalesReport = lazy(() => import("../features/reports/ SalesReport"));
const FuelReport = lazy(() => import("../features/reports/FuelReport"));
const PurchaseReport = lazy(() => import("../features/reports/PurchaseReport"));
const StoreAvaris = lazy(() => import("../features/reports/StoreAvaris"));
const DeliveryAvaris = lazy(() => import("../features/reports/DeliveryAvaris"));
const BrandSalesReport = lazy(() =>
  import("../features/reports/BrandSalesReport")
);

const Reports = () => {
  const [start_date, setStartDate] = useState();
  const [end_date, setEndDate] = useState();
  const [name, setName] = useState();
  const [generate, setGenerate] = useState(false);

  const navigate = useNavigate();

  const onFinish = () => {
    if (name && start_date && end_date) {
      setGenerate(true);
    }
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
          Generer Rapport
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
          label="Rapport"
          rules={[
            {
              required: true,
              message: "rapport",
            },
          ]}
        >
          <Select name="report" onChange={(e) => setName(e)} value={name}>
            <Select.Option value="revenus activités">Ventes</Select.Option>
            <Select.Option value="depenses carburant">
              Depenses carburant
            </Select.Option>
            <Select.Option value="depenses achat">Depenses achat</Select.Option>

            <Select.Option value="avaris livraison">
              Avaris livraison
            </Select.Option>
            <Select.Option value="avaris magasin">Avaris magasin</Select.Option>
            <Select.Option value="ventes par marques">
              Ventes par marques
            </Select.Option>
          </Select>
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
            Generer Pdf
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const report =
    name === "revenus activités" ? (
      <SalesReport start_date={start_date} end_date={end_date} />
    ) : name === "depenses carburant" ? (
      <FuelReport start_date={start_date} end_date={end_date} />
    ) : name === "depenses achat" ? (
      <PurchaseReport start_date={start_date} end_date={end_date} />
    ) : name === "avaris magasin" ? (
      <StoreAvaris start_date={start_date} end_date={end_date} />
    ) : name === "avaris livraison" ? (
      <DeliveryAvaris start_date={start_date} end_date={end_date} />
    ) : name === "ventes par marques" ? (
      <BrandSalesReport start_date={start_date} end_date={end_date} />
    ) : (
      ""
    );

  return !generate ? (
    <div className="min-h-screen py-6 bg-white px-44">
      <Card className="rounded-md ">{content}</Card>
    </div>
  ) : name === "revenus activités" ? (
    <SalesReport start_date={start_date} end_date={end_date} />
  ) : name === "depenses carburant" ? (
    <FuelReport start_date={start_date} end_date={end_date} />
  ) : name === "depenses achat" ? (
    <PurchaseReport start_date={start_date} end_date={end_date} />
  ) : name === "avaris magasin" ? (
    <StoreAvaris start_date={start_date} end_date={end_date} />
  ) : name === "avaris livraison" ? (
    <DeliveryAvaris start_date={start_date} end_date={end_date} />
  ) : name === "ventes par marques" ? (
    <BrandSalesReport start_date={start_date} end_date={end_date} />
  ) : (
    ""
  );
};

export default Reports;
