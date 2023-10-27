import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import React, { useState } from "react";
import { selectAllProducts } from "../product/productSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Title from "antd/es/typography/Title";

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

  const handleAddStockItem = () => {};

  const getAllProducts = allProducts.map((item) => (
    <Select.Option key={item.id} value={item.name}>
      {item.name}
    </Select.Option>
  ));

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
    console.log(option);
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
        className="grid gap-4 mx-auto"
        layout="horizontal"
        colon={false}
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
          labelCol={{ span: 3 }}
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

        <Form.Item label="Category" labelCol={{ span: 3 }}>
          <Input id="category" value={category}></Input>
        </Form.Item>

        <Form.Item label="Format" labelCol={{ span: 3 }}>
          <Input id="format" value={format} />
        </Form.Item>

        <Form.Item
          label="Prix "
          labelCol={{ span: 3 }}
          rules={[
            {
              required: true,
              message: "Entrez la quantité en stock",
            },
          ]}
        >
          <Input
            id="costPrice"
            value={cost_price}
            onChange={(e) => setCostPrice(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Quantité"
          labelCol={{ span: 3 }}
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
          labelCol={{ span: 3 }}
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

        <Form.Item labelCol={{ span: 3 }}>
          <Button
            className="w-full text-white bg-slate-900 "
            onClick={handleAddStockItem}
          >
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

export default CreatePurchase;
