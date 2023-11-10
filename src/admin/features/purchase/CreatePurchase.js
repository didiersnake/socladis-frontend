import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";
import React, { useState } from "react";
import { selectAllProducts } from "../product/productSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Title from "antd/es/typography/Title";
import addPurchase from "./actions/addPurchase";

const CreatePurchase = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const [productOptions, setProductOptions] = useState([]);

  const [name, setName] = useState();
  const [date, setDate] = useState();
  const [format, setFormat] = useState();
  const [category, setCategory] = useState();
  const [cost_price, setCostPrice] = useState();
  const [quantity, setQuantity] = useState();

  const [componentSize, setComponentSize] = useState("large");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
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

  const handleAddPurchase = async () => {
    try {
      console.log(name);
      if (name && date && quantity) {
        await dispatch(
          addPurchase(
            name,
            cost_price,
            format,
            quantity.toString(),
            category,
            date
          )
        );
        setName("");
        setCategory("");
        setCostPrice("");
        setDate("");
        setFormat("");
        setQuantity("");
        iMessage("success", "Success");
      }
    } catch (error) {
      if (error.response.status === 500) {
        iMessage(
          "error",
          "Veillez remplir tous les champs ou vérifier votre connexion Internet"
        );
      }
      console.log(error);
    }
  };

  const onProductSearch = (val) => {
    let filtered = allProducts.filter(
      (obj) =>
        obj._id !== 0 &&
        obj.name.toString().toLowerCase().includes(val.toLowerCase())
    );
    setProductOptions(filtered);
  };

  const onProductSelect = (value, option) => {
    setName(option.value);
    setCategory(option.category);
    setFormat(option.format);
    setCostPrice(option.unitPrice);
  };

  let content = (
    <div className="flex flex-col gap-8">
      {contextHolder}
      <div className="py-6 text-center px-14 bg-slate-900">
        <Title level={4} style={{ color: "white" }}>
          Achats de boissons
        </Title>
      </div>
      <Form
        className="grid mx-auto"
        layout="horizontal"
        colon={false}
        labelCol={{ span: 5 }}
        initialValues={{
          size: componentSize,
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        style={{
          minWidth: 500,
        }}
        onFinish={handleAddPurchase}
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
          <AutoComplete
            size="large"
            options={productOptions.map((product) => {
              return {
                label: product.name,
                value: product.name,
                id: product._id,
                format: product.format,
                category: product.category,
                unitPrice: product.unitPrice,
              };
            })}
            onSearch={onProductSearch}
            onSelect={onProductSelect}
          >
            <Input
              name="name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
              type="text"
            />
          </AutoComplete>
        </Form.Item>

        <Form.Item label="Category">
          <Input id="category" value={category}></Input>
        </Form.Item>

        <Form.Item label="Format">
          <Input id="format" value={format} />
        </Form.Item>

        <Form.Item
          label="Prix "
          rules={[
            {
              required: true,
              message: "Entrez la quantité en stock",
            },
          ]}
        >
          <Input id="costPrice" value={cost_price} />
        </Form.Item>

        <Form.Item
          label="Quantité"
          rules={[
            {
              required: true,
              message: "Entrez la quantité en stock",
            },
          ]}
        >
          <InputNumber
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e)}
          />
        </Form.Item>

        <Form.Item
          label="Date"
          rules={[
            {
              required: true,
              message: "Entrez la date ",
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
          <Button htmlType="submit" className="w-full text-white bg-slate-900 ">
            Sauvegarder
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
  return (
    <div className="min-h-screen px-2 mx-auto bg-white">
      <Button
        className="my-4"
        onClick={() => navigate(-1)}
        icon={<ArrowLeftOutlined />}
      ></Button>
      <Card className="rounded-md ">{content}</Card>
    </div>
  );
};

export default CreatePurchase;
