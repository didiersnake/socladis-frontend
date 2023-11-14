import { ArrowLeftOutlined, DeleteFilled } from "@ant-design/icons";
import {
  AutoComplete,
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
import { selectAllTeams } from "../teams/teamSlice";
import { selectAllProducts } from "../product/productSlice";
import addStockReturn from "./actions/addStockReturn";

const { Title } = Typography;
const AddItem = ({ itemDetails, handelOnChange, setItem, onDelete }) => {
  const allProducts = useSelector(selectAllProducts);
  const [productOptions, setProductOptions] = useState([]);
  const [name, setName] = useState();
  const [format, setFormat] = useState();

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
    setFormat(option.format);
    console.log(option);
  };

  return (
    <div>
      <div className="flex items-center justify-between ">
        <div className="flex flex-wrap ">
          <div className="flex flex-col items-start px-2 py-2 ">
            <h4>Nom du produit</h4>
            <AutoComplete
              size="large"
              options={productOptions.map((product) => {
                return {
                  label: product.name,
                  value: product.name,
                  id: product._id,
                  prices: product.sale_price,
                  format: product.format,
                };
              })}
              onSearch={onProductSearch}
              onSelect={onProductSelect}
            >
              <Input
                name="name"
                onChange={(e) => {
                  handelOnChange(itemDetails.name, e);
                }}
                value={(itemDetails.name = name)}
                type="text"
              />
            </AutoComplete>
          </div>

          <div className="flex flex-col items-start px-2 py-2 ">
            <h4>Quantité</h4>
            <Input
              name="quantity"
              type="number"
              onChange={(e) => {
                handelOnChange(itemDetails.name, e);
              }}
              value={itemDetails.quantity}
              min={0}
            />
          </div>

          <div className="flex flex-col items-start px-2 py-2">
            <h4>Format </h4>
            <Input
              name="format"
              type="text"
              value={(itemDetails.format = format)}
              min={0}
            />
          </div>
        </div>
        <Button
          onClick={() => {
            onDelete(itemDetails.name);
          }}
        >
          <DeleteFilled className="w-6 h-6 text-gray-500 cursor-pointer hover:text-red-500" />
        </Button>
      </div>
    </div>
  );
};

const ReturnLoad = () => {
  const [team, setTeam] = useState();
  const [date, setDate] = useState();
  const [item, setItem] = useState([
    {
      name: "",
      quantity: 1,
    },
  ]);
  const teams = useSelector(selectAllTeams);
  const [componentSize, setComponentSize] = useState("large");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const iMessage = (type, content) => {
    setTimeout(() => {
      messageApi.open({
        type: type,
        content: content,
      });
    }, 1000);
  };

  const onDelete = (name) => {
    setItem((pervState) => pervState.filter((el) => el.name !== name));
  };

  const handelOnChange = (name, e) => {
    let data = [...item];

    let foundData = data.find((el) => el.name === name);
    if (e.target.name === "quantity" || "price") {
      foundData[e.target.name] = e.target.value;
    } else {
      foundData[e.target.name] = e.target.value;
    }

    setItem(data);
  };

  const handleAddStockLoad = async () => {
    try {
      if (team && item && date) {
        await dispatch(
          addStockReturn(
            team,
            item.map((obj) =>
              Object.fromEntries(
                Object.entries(obj).map(([key, val]) => [key, String(val)])
              )
            ),
            date
          )
        );
        iMessage("success", "Success");
      } else {
        iMessage(
          "error",
          "Veillez remplir tous les champs ou vérifier votre connexion Internet "
        );
      }
    } catch (error) {
      if (error.response.status === 500) {
        iMessage("error", "Veillez remplir tous les champs ");
      }
      console.log(error.response.data);
    }
  };

  let content = (
    <div className="flex flex-col gap-8">
      <div className="py-4 text-center px-14 bg-slate-900 ">
        <Title level={4} style={{ color: "white" }}>
          Retour
        </Title>
      </div>
      <Form
        className="grid mx-auto"
        colon={false}
        labelCol={{ span: 8 }}
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
          label="Equipe"
          rules={[
            {
              required: true,
              message: "Entrez le nom du produit ",
            },
          ]}
        >
          <Select onChange={(e) => setTeam(e)} value={team}>
            {teams.map((item) => (
              <Select.Option key={item._id} value={item.name}>
                {item.name}{" "}
              </Select.Option>
            ))}
          </Select>
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

        <div>
          {item.map((itemDetails, index) => (
            <AddItem
              key={index}
              handelOnChange={handelOnChange}
              setItem={setItem}
              itemDetails={itemDetails}
              onDelete={onDelete}
            />
          ))}
          <Button
            type="dashed"
            onClick={() => {
              setItem((state) => [
                ...state,
                {
                  name: "",
                  quantity: 1,
                },
              ]);
            }}
            className="w-full mx-auto my-5 "
          >
            + Ajouter un champ
          </Button>
        </div>

        <Form.Item>
          <Button
            className="w-full text-white bg-slate-900"
            onClick={handleAddStockLoad}
          >
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
export default ReturnLoad;
