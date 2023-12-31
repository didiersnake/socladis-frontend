import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { loginAction, redirect } from "./actions/loginAction";
import { loadData } from "../../utils/loadData";

const Login = () => {
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
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

  /* const loginB = () => {
    let data = JSON.stringify({
      name: "admin",
      password: "admin1234",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://13.51.150.101:5000/api/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        alert(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
        alert(JSON.stringify(error.response.data[0]));
      });
  }; */
  const handleLogin = async () => {
    console.log(name, password);
    try {
      await dispatch(loginAction(name, password));

      loadData();
      //redirect to respective page
      const userRole = redirect();
      userRole === "admin"
        ? navigate("/admin")
        : userRole === "stock"
        ? navigate("/products")
        : userRole === "ventes"
        ? navigate("/sales")
        : iMessage("error", "Access non authorisé");
    } catch (error) {
      if (error.response?.status === 400) {
        iMessage("error", "Nom d'utilisateur ou mot de passe incorrecte");
        console.log(error.response);
      } else if (error.response?.status === 401) {
        console.log("Unauthorized");
      } else {
        console.log("Login failed");
        iMessage("error", "Verifiez votre connexion internet");
      }
    }
  };

  const content = (
    <>
      {contextHolder}
      <div className="flex items-center justify-center py-3 my-44 ">
        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          layout="vertical"
          style={{
            minWidth: 500,
          }}
          initialValues={{
            remember: false,
          }}
          onFinish={handleLogin}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Nom d'utilisateur"
            name="username"
            rules={[
              {
                required: true,
                message: "Entrez votre nom d'utilisateur",
              },
            ]}
          >
            <Input onChange={(e) => setName(e.target.value)} value={name} />
          </Form.Item>

          <Form.Item
            label="Mot de passe"
            name="password"
            rules={[
              {
                required: true,
                message: "Entrez votre mot de passe",
              },
            ]}
          >
            <Input.Password
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Se connecter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
  return <div>{content}</div>;
};

export default Login;
