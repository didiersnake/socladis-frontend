import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import addItemAction from "./actions/addItemAction";
import Title from "antd/es/typography/Title";
import { selectAllProducts } from "../product/productSlice";

const AddStockItem = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [format, setFormat] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [date, setDate] = useState("");
  const allProducts = useSelector(selectAllProducts);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

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

  const handleAddStockItem = async () => {
    try {
      await dispatch(
        addItemAction(
          name,
          category,
          format,
          quantity.toString(),
          unitPrice.toString(),
          "",
          date,
          ""
        )
      );
      iMessage("success", "Success");
      setName("");
      setCategory("");
      setDate("");
      setUnitPrice("");
      setQuantity("");
      setFormat("");
    } catch (error) {
      if (error.response.status === 500) {
        iMessage("error", "Veillez remplir tous les champs ");
      }
      console.log(error.response.data);
    }
  };

  const getAllProducts = allProducts.map((item) => (
    <Select.Option key={item.id} value={item.name}>
      {item.name}
    </Select.Option>
  ));

  let content = (
    <div className="flex flex-col gap-8">
      {contextHolder}
      <div className="py-6 text-center px-14 bg-slate-900 ">
        <Title level={4} style={{ color: "white" }}>
          Nouveau stock de produit
        </Title>
      </div>
      <Form
        className="grid gap-4 mx-auto"
        layout="horizontal"
        labelCol={{ span: 4 }}
        initialValues={{
          size: componentSize,
        }}
        colon={false}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        style={{
          minWidth: 600,
        }}
        onFinish={handleAddStockItem}
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
          <Select id="name" value={name} onChange={(e) => setName(e)}>
            {getAllProducts}
          </Select>
        </Form.Item>

        <Form.Item
          label="Category"
          rules={[
            {
              required: true,
              message: "Entrez la category",
            },
          ]}
        >
          <Select
            id="category"
            value={category}
            onChange={(e) => setCategory(e)}
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
          <Select id="format" value={format} onChange={(e) => setFormat(e)}>
            <Select.Option value="Grand format">Grand format</Select.Option>
            <Select.Option value="Petit format">Petit format</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Quantité reçu"
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
          label="Seuil de Stock"
          rules={[
            {
              required: true,
              message: "Entrez la quantité en stock",
            },
          ]}
        >
          <InputNumber
            id="unitPrice"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e)}
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
          <Button className="w-full text-white bg-slate-900 " htmlType="submit">
            Sauvegarder
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
  return (
    <div className="mb-16 mx-44">
      <Button
        className="my-4"
        onClick={() => navigate(-1)}
        icon={<ArrowLeftOutlined />}
      ></Button>
      <div className="border border-gray-700 border-solid rounded-md ">
        {content}
      </div>
    </div>
  );
};

export default AddStockItem;
