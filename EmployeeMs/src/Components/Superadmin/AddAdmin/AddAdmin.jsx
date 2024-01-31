import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddAdmin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("roles", values.roles);

      // Log formData for debugging purposes.
      console.log(Object.fromEntries(formData)); // Add this for debugging

      const result = await axios.post(
        "http://localhost:3000/auth/add_admin",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Make sure the Content-Type is set correctly
          },
        }
      );
      console.log("Server Response:", result);
      if (result.data.Status) {
        form.resetFields();
        // setIsModalVisible(false); // Close the modal
      } else {
        alert(result.data.Error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding admin.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email!",
            },
          ]}
        >
          <Input
            size="large" // Adjust size here
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password!",
            },
          ]}
        >
          <Input
            size="large" // Adjust size here
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="roles"
          rules={[
            {
              required: true,
              message: "Please select a role!",
            },
          ]}
        >
          <Select
            size="large" // Adjust size here
            placeholder="Select a role"
          >
            <Option value="superadmin">Super Admin</Option>
            <Option value="admin1">Admin 1</Option>
            <Option value="admin2">Admin 2</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit">
              Add Admin
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddAdmin;
