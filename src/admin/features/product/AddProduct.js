import React, { useState } from "react";
import { Button, Input, Select, Form, Card, message, Typography } from "antd";
import { useDispatch } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import createProductAction from "./actions/createProductAction";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const AddProduct = () => {
  const [componentSize, setComponentSize] = useState("large");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [format, setFormat] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [grossiste, setGrossiste] = useState();
  const [semi, setSemi] = useState();
  const [detaillant, setDetaillant] = useState();

  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const sale_price = [
    {
      grossiste: grossiste,
      Semi_grossiste: semi,
      detaillant: detaillant,
      random: detaillant,
    },
  ];
  const handleAddProduct = async () => {
    try {
      if (
        name &&
        category &&
        format &&
        unitPrice &&
        grossiste &&
        semi &&
        detaillant
      ) {
        console.log(sale_price);
        await dispatch(
          createProductAction(
            format === "Grand format" ? `${name} 1L` : name,
            category,
            format,
            unitPrice,
            sale_price
          )
        );
        iMessage("success", "Success");
        setCategory("");
        setFormat("");
        setUnitPrice("");
        setName("");
        setGrossiste("");
        setSemi("");
        setDetaillant("");
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
          Nouvelle Boisson
        </Title>
      </div>
      <Form
        className="grid gap-6 mx-auto"
        colon={false}
        labelCol={{ span: 6 }}
        initialValues={{
          size: componentSize,
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        style={{
          minWidth: 600,
        }}
      >
        <Form.Item
          label="Nom"
          rules={[
            {
              required: true,
              message: "Entrez le nom du produit ",
            },
          ]}
        >
          <Input
            name="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Form.Item>

        <Form.Item
          label="Category"
          rules={[
            {
              required: true,
              message: "Entrez la category ",
            },
          ]}
        >
          <Select
            name="category"
            onChange={(e) => setCategory(e)}
            value={category}
          >
            <Select.Option value="Casier">Casier</Select.Option>
            <Select.Option value="Plastic">Plastic</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Format"
          rules={[
            {
              required: true,
              message: "Entrez le format ",
            },
          ]}
        >
          <Select name="format" onChange={(e) => setFormat(e)} value={format}>
            <Select.Option value="Grand format">Grand format</Select.Option>
            <Select.Option value="Petit format">Petit format</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Prix d'achat TTC"
          rules={[
            {
              required: true,
              message: "Entrez le prix ",
            },
          ]}
        >
          <Input
            name="price"
            onChange={(e) => setUnitPrice(e.target.value)}
            value={unitPrice}
            addonBefore="CFA"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Prix grossiste"
          rules={[
            {
              required: true,
              message: "Entrez le prix ",
            },
          ]}
        >
          <Input
            onChange={(e) => setGrossiste(e.target.value)}
            value={grossiste}
            addonBefore="CFA"
            min={0}
          />
        </Form.Item>
        <Form.Item
          label="Prix semi-grossiste"
          rules={[
            {
              required: true,
              message: "Entrez le prix ",
            },
          ]}
        >
          <Input
            name="price"
            onChange={(e) => setSemi(e.target.value)}
            value={semi}
            addonBefore="CFA"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Prix detaillant"
          rules={[
            {
              required: true,
              message: "Entrez le prix ",
            },
          ]}
        >
          <Input
            name="price"
            onChange={(e) => setDetaillant(e.target.value)}
            value={detaillant}
            addonBefore="CFA"
            min={0}
          />
        </Form.Item>

        <Form.Item>
          <Button
            className="w-full text-white bg-slate-900"
            onClick={handleAddProduct}
          >
            Sauvegarder
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
  return (
    <div className="min-h-screen bg-white px-44">
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

export default AddProduct;
