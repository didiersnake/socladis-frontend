import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  message,
  Typography,
  Card,
} from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import addExpenseAction from "./actions/addExpenseAction";

const AddExpense = () => {
  const [componentSize, setComponentSize] = useState("large");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const navigate = useNavigate();
  const { Title } = Typography;

  const [modif, setModif] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const handleAddExpense = async () => {
    try {
      if (modif && date && amount) {
        await dispatch(
          addExpenseAction(
            modif,
            amount,
            modif === "carburant" ? "Achat de carburant" : bank,
            date
          )
        );
        setModif("");
        setAmount("");
        setDate("");
        setBank("");
        iMessage("success", "Success");
      } else {
        iMessage(
          "error",
          "Veillez remplir tous les champs ou vérifier votre connexion Internet"
        );
      }
    } catch (error) {
      if (error.response.status === 500) {
        iMessage("error", "Veillez remplir tous les champs");
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
          Caisse Depenses
        </Title>
      </div>
      <Form
        onFinish={handleAddExpense}
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
          label="Sortie"
          rules={[
            {
              required: true,
              message: "Entrez le Motif",
            },
          ]}
        >
          <Select onChange={(e) => setModif(e)} value={modif}>
            <Select.Option value="versement a la banque">
              Versement a la banque
            </Select.Option>
            <Select.Option value="carburant">Carburant</Select.Option>
            <Select.Option value="depense courante">
              Depense courante
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Montant"
          rules={[
            {
              required: true,
              message: "Entrez le prix",
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
          label={modif === "versement a la banque" ? "Banque" : "Motif"}
          rules={[
            {
              required: true,
              message: "Entrez la banque",
            },
          ]}
        >
          {modif === "versement a la banque" ? (
            <Select onChange={(e) => setBank(e)} value={bank}>
              <Select.Option value="Afriland First Bank">
                Afriland First Bank
              </Select.Option>
              <Select.Option value="BGFI Bank">BGFI Bank</Select.Option>
            </Select>
          ) : modif === "carburant" ? (
            <Input name="motif" disabled value={bank} />
          ) : (
            <Input
              name="motif"
              onChange={(e) => setBank(e.target.value)}
              value={bank}
            />
          )}
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

        <Form.Item>
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

export default AddExpense;
