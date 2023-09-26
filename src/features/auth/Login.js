import React from "react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";

import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

const Login = () => {
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const errRef = useRef();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setErrMsg("");
  }, [name, password]);

  const handleSubmit = async (e) => {
    try {
      const userData = await login({ name, password }).unwrap();
      dispatch(setCredentials({ ...userData, name }));
      setName("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      if (!err?.originalStatus) {
        // isLoading: true until timeout occurs
        setErrMsg("No Server Response");
      } else if (err.originalStatus === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.originalStatus === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      console.log(errMsg);
    }
  };

  const content = isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 500,
      }}
      initialValues={{
        remember: false,
      }}
      onFinish={handleSubmit}
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
        <Input />
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
        <Input.Password />
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
  );
  return <div>{content}</div>;
};

export default Login;
