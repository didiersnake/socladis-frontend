import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import addAvarisAction from "./actions/addAvarisAction";

import Title from "antd/es/typography/Title";
import { selectAllProducts } from "../product/productSlice";
import {
  AutoComplete,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from "antd";

const AddAvarisItem = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [format, setFormat] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const allProducts = useSelector(selectAllProducts);
  const [productOptions, setProductOptions] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const [componentSize, setComponentSize] = useState("large");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
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
    console.log(option);
  };

  const handleAddAvaris = async () => {
    try {
      if (name && quantity && type && date) {
        await dispatch(
          addAvarisAction(
            name,
            category,
            format,
            quantity.toString(),
            type,
            "",
            date
          )
        );
        iMessage("success", "Success");
        setName("");
        setCategory("");
        setDate("");
        setType("");
        setQuantity("");
        setFormat("");
      } else {
        iMessage(
          "error",
          "Veillez remplir tous les champs ou vérifier votre connexion Internet "
        );
      }
    } catch (error) {
      if (error.response.status === 500) {
        iMessage(
          "error",
          "Veillez remplir tous les champs ou vérifier votre connexion Internet"
        );
      }
      console.log(error.response.data);
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

  const getAllProducts = allProducts.map((item) => (
    <Select.Option key={item.id} value={item.name}>
      {item.name}
    </Select.Option>
  ));

  let content = (
    <div className="flex flex-col gap-8 ">
      {contextHolder}
      <div className="py-6 text-center px-14 bg-slate-900">
        <Title level={4} style={{ color: "white" }}>
          Nouvel Avari
        </Title>
      </div>
      <Form
        className="grid gap-6 mx-auto"
        colon={false}
        layout="horizontal"
        labelCol={{ span: 4 }}
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
          {/*  <Select id="name" value={name} onChange={(e) => setName(e)}>
            {getAllProducts}
          </Select> */}

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

        <Form.Item
          label="Category"
          rules={[
            {
              required: true,
              message: "Entrez la category",
            },
          ]}
        >
          <Input name="category" value={category} type="text" />
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
          <Input name="format" value={format} type="text" />
        </Form.Item>
        <Form.Item
          label="Type_d'Avaris"
          rules={[
            {
              required: true,
              message: "Entrez le type ",
            },
          ]}
        >
          <Select id="type" value={type} onChange={(e) => setType(e)}>
            <Select.Option value="livraison">Livraison</Select.Option>
            <Select.Option value="magasin">Magasin</Select.Option>
          </Select>
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

        <Form.Item className="">
          <Button
            className="w-full text-white bg-slate-900 "
            onClick={handleAddAvaris}
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

export default AddAvarisItem;
