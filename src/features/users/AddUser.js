import React, { useState } from "react";
import { Button, Input, Select, Form } from "antd";
import { createUserAction } from "./actions/createUserAction";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";

export const AddUser = () => {
  const [componentSize, setComponentSize] = useState("large");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [roles, setRoles] = useState("");
  const [category, setCategory] = useState("");
  const [uniqueId, setUniqueId] = useState();
  const [tax_system, setTaxSystem] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [group, setGroup] = useState("");
  const [password, setPassword] = useState("");

  const employee = "EMPLOYEE";
  const customer = "CLIENT";
  const stock = "Stock";
  const finance = "ventes";
  const commercial = "commercial";

  // message function
  const iMessage = (type, content) => {
    setTimeout(() => {
      messageApi.open({
        type: type,
        content: content,
      });
    }, 1000);
  };

  const handleAddUser = async () => {
    try {
      if (roles === employee) {
        await dispatch(
          createUserAction(
            name,
            roles,
            category,
            "non attribué",
            "non attribué",
            phone,
            location,
            "non attribué",
            password
          )
        );
      } else {
        await dispatch(
          createUserAction(
            name,
            roles,
            category,
            uniqueId,
            tax_system,
            phone,
            location,
            group,
            ""
          )
        );
      }
      iMessage("success", "Nouvel Utilisateur ajouté");
      setName("");
      setCategory("");
      setGroup("");
      setLocation("");
      setPhone("");
      setRoles("");
      setPassword("");
      setTaxSystem("");
    } catch (error) {
      if (error.response.status === 500) {
        iMessage(
          "error",
          "Remplissez toutes les informations requises et réessayez"
        );
      }
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      +237
    </Form.Item>
  );

  let content = (
    <div className="flex flex-col gap-8 ">
      {contextHolder}
      <div className="py-6 text-center px-36 bg-slate-900">
        <Title level={4} style={{ color: "white" }}>
          Nouvel utilisateur
        </Title>
      </div>

      <Form
        className="grid gap-4 mx-auto"
        colon={false}
        layout="horizontal"
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
              message: "Entrez le nom ",
            },
          ]}
        >
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>

        <Form.Item label="Rôle">
          <Select value={roles} onChange={(e) => setRoles(e)}>
            <Select.Option value={employee}>Employé</Select.Option>
            <Select.Option value={customer}>Client</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Category">
          {roles === employee ? (
            <Select value={category} onChange={(e) => setCategory(e)}>
              <Select.Option value={stock}>Magasin</Select.Option>
              <Select.Option value={finance}>Ventes</Select.Option>
              <Select.Option value={commercial}>Commercial</Select.Option>
            </Select>
          ) : roles === customer ? (
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e);
              }}
            >
              <Select.Option value="grossiste">Grossiste</Select.Option>
              <Select.Option value="semi-grossiste">
                Semi Grossiste
              </Select.Option>
              <Select.Option value="detaillant">Detaillant</Select.Option>
              <Select.Option value="random">Random</Select.Option>
            </Select>
          ) : (
            ""
          )}
        </Form.Item>

        <Form.Item label="Numero ID">
          <Input
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Regime_Fiscale">
          <Select
            disabled={roles === employee}
            value={tax_system}
            onChange={(e) => {
              setTaxSystem(e);
            }}
          >
            <Select.Option value=""></Select.Option>
            <Select.Option value="réel">Reel</Select.Option>
            <Select.Option value="simplifié">Simplifié</Select.Option>
            <Select.Option value="liberatoir">liberatoir</Select.Option>
            <Select.Option value="random">Random</Select.Option>
            <Select.Option value="réel CGA">Reel CGA</Select.Option>
            <Select.Option value="simplifié CGA">Simplifié CGA</Select.Option>
            <Select.Option value="liberatoir CGA">liberatoir CGA</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Telephone">
          <Input
            addonBefore={prefixSelector}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item
          label="Localistion"
          rules={[
            {
              required: true,
              message: "Entrez la localisation",
            },
          ]}
        >
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Equipe">
          <Input
            disabled={roles === employee}
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Mot_de_passe">
          <Input
            disabled={roles === customer}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item className="">
          <Button
            className="w-full text-white bg-slate-900 "
            onClick={handleAddUser}
          >
            Sauvegarder
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
  return (
    <div className="mb-16  mx-44">
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
