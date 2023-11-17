import { Button, Card, DatePicker, Form } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import Reconciliation1 from "./Reconciliation1";
import api from "../../../app/api/axios";

const Reconciliation = () => {
  const [date, setDate] = useState();
  const [charge, setCharge] = useState([]);
  const [load_return, setLoadReturn] = useState([]);
  const [generate, setGenerate] = useState(false);

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const onFinish = () => {
    if (date) {
      setGenerate(true);
    }
  };

  let content = (
    <div className="flex flex-col gap-8">
      <div className="py-4 text-center px-14 bg-slate-900 ">
        <Title level={4} style={{ color: "white" }}>
          Generer Reconciliation
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
            onChange={(dateString) => setDate(dateString)}
            value={date}
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
            Generer Reconciliation
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  useEffect(() => {
    readCharge();
    readReturn();
  }, []);

  const readCharge = async () => {
    const response = await api.get("/api/all/charge/", {});
    const res = response.data;
    setCharge(res);
  };
  const readReturn = async () => {
    const response = await api.get("/api/all/retours/", {});
    const res = response.data;
    setLoadReturn(res);
  };

  return !generate ? (
    <div className="min-h-screen px-2 py-6 mx-auto bg-white">
      <Card className="rounded-md ">{content}</Card>
    </div>
  ) : (
    <Reconciliation1 date={date} charge={charge} load_return={load_return} />
  );
};

export default Reconciliation;
