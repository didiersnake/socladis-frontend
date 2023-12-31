import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  Form,
  Card,
  Typography,
  AutoComplete,
} from "antd";
import { createUserAction } from "./actions/createUserAction";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { selectAllTeams } from "../../admin/features/teams/teamSlice";
import { selectAllUser } from "./userSlice";

const { Title } = Typography;

export const AddUser = () => {
  const [componentSize, setComponentSize] = useState("large");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const navigate = useNavigate();
  const users = useSelector(selectAllUser);
  const allgroups = useSelector(selectAllTeams);
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
  const [nameOptions, setNameOptions] = useState([]);

  const employee = "EMPLOYEE";
  const customer = "CLIENT";
  const stock = "stock";
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

  const onNameSearch = (val) => {
    let filtered = users.filter(
      (obj) =>
        obj.roles?.toString() === "CLIENT" &&
        obj.name?.toString().toLowerCase().includes(val.toLowerCase())
    );
    setNameOptions(filtered);
  };

  const onNameSelect = (value, option) => {};

  const handleAddUser = async () => {
    try {
      if (roles === employee) {
        if (password.trim().length < 6) {
          iMessage("error", "Mots de passe invalid");
        } else {
          await dispatch(
            createUserAction(
              name.trim(),
              roles,
              category,
              "non attribué",
              phone,
              location,
              "non attribué",
              password.trim(),
              "non attribué"
            )
          );
        }
      } else {
        await dispatch(
          createUserAction(
            name,
            roles,
            category,
            tax_system,
            phone,
            location,
            group,
            "non attribué",
            uniqueId
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
      setUniqueId("");
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
          <AutoComplete
            size="large"
            className="w-full"
            options={nameOptions?.map((name) => ({
              label: name.name,
              value: name.name,
            }))}
            onSearch={onNameSearch}
            onSelect={onNameSelect}
          >
            <Input
              name="name"
              size="large"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </AutoComplete>
          {/* <Input value={name} onChange={(e) => setName(e.target.value)} /> */}
        </Form.Item>

        <Form.Item label="Rôle">
          <Select value={roles} onChange={(e) => setRoles(e)}>
            <Select.Option value={employee}>Employé</Select.Option>
            <Select.Option value={customer}>Client</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="NIU">
          <Input
            disabled={roles === employee}
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
          />
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
          <Select
            disabled={roles === employee}
            value={group}
            onChange={(e) => setGroup(e)}
          >
            {allgroups.map((i, index) => (
              <Select.Option key={index} value={i.name}>
                {i.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Mot_de_passe">
          <Input
            disabled={roles === customer}
            value={password}
            placeholder="6 caractères minimum"
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
    <div className="min-h-screen px-2 mx-auto bg-white">
      <Button
        className="my-4"
        onClick={() => navigate(-1)}
        icon={<ArrowLeftOutlined />}
      ></Button>
      <Card className="rounded-md">{content}</Card>
    </div>
  );
};

export default AddUser;
