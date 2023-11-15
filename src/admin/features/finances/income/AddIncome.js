import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Typography,
  message,
} from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { selectAllTeams } from "../../teams/teamSlice";
import addIncomeAction from "./actions/addIncomeAction";

const AddIncome = () => {
  const [componentSize, setComponentSize] = useState("large");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const navigate = useNavigate();
  const { Title } = Typography;
  const teams = useSelector(selectAllTeams);

  const [income, setIncome] = useState();
  const [date, setDate] = useState();
  const [amount, setAmount] = useState();

  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const handleAddIncome = async () => {
    try {
      if (income && date && amount) {
        await dispatch(addIncomeAction(income, amount, date));
        setIncome("");
        setAmount("");
        setDate("");
        iMessage("success", "Success");
      } else {
        iMessage(
          "error",
          "Veillez remplir tous les champs ou vérifier votre connexion Internet"
        );
      }
    } catch (error) {
      if (error.response.status === 500) {
        iMessage(
          "error",
          "Veillez remplir tous les champs ou vérifier votre connexion Internet"
        );
        console.log(error.response.data);
      }
    }
  };

  // message function
  const iMessage = (type, content) => {
    setTimeout(() => {
      messageApi.open({
        type: type,
        content: content,
      });
    }, 1000);
  };

  let content = (
    <div className="flex flex-col gap-8">
      <div className="py-4 text-center px-14 bg-slate-900 ">
        <Title level={4} style={{ color: "white" }}>
          Caisse Approvisionement
        </Title>
      </div>
      <Form
        onFinish={handleAddIncome}
        className="grid mx-auto"
        layout="horizontal"
        labelCol={{ span: 5 }}
        colon={false}
        initialValues={{
          size: componentSize,
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        style={{
          minWidth: 500,
        }}
      >
        <Form.Item
          label="Source"
          rules={[
            {
              required: true,
              message: "Entrez la source",
            },
          ]}
        >
          <Select name="income" onChange={(e) => setIncome(e)} value={income}>
            <Select.Option value="magasin">Magasin</Select.Option>
            <Select.Option value="autres">Autres</Select.Option>
            {teams.map((item) => (
              <Select.Option key={item._id} value={item.name}>
                {item.name}{" "}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Montant"
          rules={[
            {
              required: true,
              message: "Entrez le prix ",
            },
          ]}
        >
          <Input
            name="amount"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            suffix="FCFA"
          />
        </Form.Item>

        <Form.Item
          label="Date"
          rules={[
            {
              required: true,
              message: "Entrez le date",
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

        <Form.Item className="">
          <Button htmlType="submit" className="w-full text-white bg-slate-900">
            Sauvegarder
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <div className="min-h-screen px-2 mx-auto bg-white">
      {contextHolder}

      <Button
        className="my-4"
        onClick={() => navigate(-1)}
        icon={<ArrowLeftOutlined />}
      ></Button>
      <Card className="rounded-md ">{content}</Card>
    </div>
  );
};

export default AddIncome;
