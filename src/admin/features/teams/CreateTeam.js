import React from "react";
import { Button, Input, Form, Space, message, Select } from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import addTeamAction from "./actions/addTeamAction";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAllUser } from "../../../features/users/userSlice";
import Title from "antd/es/typography/Title";

const CreateTeam = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector(selectAllUser);
  const [messageApi, contextHolder] = message.useMessage();

  // message function
  const iMessage = (type, content) => {
    setTimeout(() => {
      messageApi.open({
        type: type,
        content: content,
      });
    }, 1000);
  };

  const handleCreateTeam = async (data) => {
    console.log(data);
    let members = data.users.map((user) => {
      return {
        userName: user.userName,
        userId: users.find((i) => i.name === user.userName)._id,
      };
    });
    console.log(members);
    try {
      await dispatch(addTeamAction(data.team, members, ""));
      iMessage("success", "Success");
    } catch (error) {
      if (error.response.status === 500) {
        iMessage("error", "Veillez remplir tous les champs ");
      }
      console.log(error.response.data);
    }
  };

  let content = (
    <div className="flex flex-col gap-8 ">
      <div className="py-6 text-center px-36 bg-slate-900">
        <Title level={4} style={{ color: "white" }}>
          Nouvelle Equipe
        </Title>
      </div>
      <Form
        name="dynamic_form_nest_item"
        onFinish={handleCreateTeam}
        className="w-full mx-auto"
        layout="vertical"
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item
          name={"team"}
          label="Nom d'equipe"
          rules={[
            {
              required: true,
              message: "Nom de l'equipe",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.List name="users">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Form.Item
                    className="px-4"
                    {...restField}
                    name={[name, "userName"]}
                    rules={[
                      {
                        required: true,
                        message: "Ajoutez un membre",
                      },
                    ]}
                  >
                    <Select placeholder="selectioner le nom de l'employé">
                      {users.map(
                        (user) =>
                          user.category === "commercial" && (
                            <Select.Option value={user.name} key={user._id}>
                              {user.name}
                            </Select.Option>
                          )
                      )}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    className="hidden"
                    initialValue={""}
                    {...restField}
                    name={[name, "userId"]}
                  >
                    <Input placeholder="" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Ajouter un membre
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sauvegarder
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <div className="px-44">
      {contextHolder}
      <Button
        className="my-4 "
        onClick={() => navigate(-1)}
        icon={<ArrowLeftOutlined />}
      ></Button>
      <div className="border border-gray-700 border-solid rounded-md ">
        {content}
      </div>
    </div>
  );
};

export default CreateTeam;
