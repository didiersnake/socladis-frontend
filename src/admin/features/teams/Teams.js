import React, { useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, List, Typography } from "antd";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteTeams, selectAllTeams } from "./teamSlice";
import readTeamAction from "./actions/readTeamAction";
import api from "../../../app/api/axios";

const Teams = () => {
  const navigate = useNavigate();
  const allTeams = useSelector(selectAllTeams);
  const { Title, Text } = Typography;
  const dispatch = useDispatch();

  const readTeams = async () => {
    try {
      await dispatch(readTeamAction);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    readTeams();
  }, []);

  const handleDelete = async (item) => {
    try {
      await api.delete(`/api/current/group/${item._id}`, {});
      dispatch(deleteTeams(item));
    } catch (error) {
      console.log(error.response);
    }
  };

  let content = (
    <>
      <div className="flex mb-2 ">
        <Button type="primary" onClick={() => navigate("create")}>
          Ajouter une Equipe
        </Button>
      </div>

      <Title className="text-center" level={3}>
        Liste d'equipe
      </Title>

      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={allTeams}
        renderItem={(item, index) => (
          <List.Item key={index + 1}>
            <div className="flex items-center justify-between px-[100px]">
              <div className="w-20 font-semibold">
                <Text className="">{item.name}</Text>
              </div>
              <div>
                {item.members.map((i) => (
                  <Text key={i._id} className="p-1 mx-2 bg-blue-200 rounded">
                    {i.userName}
                  </Text>
                ))}
              </div>
              <div>
                <Button
                  danger
                  onClick={() => handleDelete(item)}
                  icon={<DeleteOutlined />}
                ></Button>
              </div>
            </div>
          </List.Item>
        )}
      />
    </>
  );

  return (
    <Container content={content} iconName={"grid_4-1"} contentName={"Equipe"} />
  );
};

export default Teams;
