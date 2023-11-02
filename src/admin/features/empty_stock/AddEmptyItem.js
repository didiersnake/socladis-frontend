import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import Title from "antd/es/typography/Title";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { selectAllTeams } from "../teams/teamSlice";
import createEmptyStockAction from "./actions/createEmptyStockAction";

const AddEmptyItem = () => {
  const [team, setTeam] = useState("");
  const [plastic, setPlastic] = useState(0);
  const [bouteille, setBouteille] = useState(0);
  const [casiers, setCasiers] = useState(0);
  const [format, setFormat] = useState("");
  const [date, setDate] = useState("");

  const allTeams = useSelector(selectAllTeams);

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

  const handleAdditem = async () => {
    try {
      if (team && date && format) {
        await dispatch(
          createEmptyStockAction(
            team,
            plastic.toString(),
            bouteille.toString(),
            casiers.toString(),
            date,
            format
          )
        );
        setBouteille("");
        setCasiers("");
        setDate("");
        setPlastic("");
        setFormat("");
        setTeam("");
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
          "Veillez remplir tous les champs ou vérifier votre connexion Internet "
        );
      }
      console.log(error.response.data);
    }
  };

  let content = (
    <div className="flex flex-col gap-8 ">
      {contextHolder}
      <div className="py-6 text-center px-14 bg-slate-900">
        <Title level={4} style={{ color: "white" }}>
          Magasin Vide
        </Title>
      </div>
      <Form
        className="grid gap-6 mx-auto"
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
          label="Equipe"
          rules={[
            {
              required: true,
              message: "Remplissez le champ ",
            },
          ]}
        >
          <Select onChange={(e) => setTeam(e)} value={team}>
            <Select.Option value="magasin"> Magasin</Select.Option>
            {allTeams.map((team) => (
              <Select.Option key={team._id} value={team.name}>
                {team.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="flex items-center justify-between w-full ">
          <Form.Item
            label="Plastic"
            rules={[
              {
                required: true,
                message: "Entrez le nombre de plastic",
              },
            ]}
          >
            <InputNumber
              id="plastic"
              value={plastic}
              onChange={(e) => setPlastic(e)}
            />
          </Form.Item>

          <Form.Item
            label="Bouteille"
            rules={[
              {
                required: true,
                message: "Entrez le nombre de bouteille",
              },
            ]}
          >
            <InputNumber
              id="bouteille"
              value={bouteille}
              onChange={(e) => setBouteille(e)}
            />
          </Form.Item>

          <Form.Item
            label="Casiers"
            rules={[
              {
                required: true,
                message: "Entrez le nombre de casiers",
              },
            ]}
          >
            <InputNumber
              id="casiers"
              value={casiers}
              onChange={(e) => setCasiers(e)}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Date"
          labelCol={{ span: 2 }}
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
          <Button
            className="w-full text-white bg-slate-900"
            onClick={handleAdditem}
          >
            Sauvegarder
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <div>
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
    </div>
  );
};

export default AddEmptyItem;
