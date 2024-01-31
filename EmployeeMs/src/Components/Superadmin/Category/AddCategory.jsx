import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Space, Modal, Form, Input } from "antd";
// import "antd/dist/antd.css";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData(); // Use fetchData instead of fetch to avoid conflicts with the built-in fetch function
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/auth/delete_category/${id}`)
      .then((result) => {
        if (result.data.Status) {
          fetchData(); // Use fetchData to update the category list
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields() // Ant Design Form function to validate and get field values
      .then((values) => {
        // 'values' contains the form field values
        form.resetFields(); // Reset form fields
        setIsModalVisible(false);

        // Add new category using API call
        axios

          .post("http://localhost:3000/auth/add_category", values) // 'values' is passed as the data
          .then((result) => {
            if (result.data.Status) {
              fetchData(); // Use fetchData to update the category list
            } else {
              alert(result.data.Error);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="danger"
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(record.id)}
            style={{ height: "6vh" }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="px-5 mt-5">
      <div className="d-flex justify-content-center">
        <h3>Category List</h3>
      </div>
      <Button
        type="primary"
        style={{ height: "6vh" }}
        onClick={showModal}
        className="btn btn-success"
      >
        Add Category
      </Button>
      <Modal
        title="Add Category"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onSubmit={handleOk} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the category name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <div className="mt-3">
        <Table dataSource={category} columns={columns} />
      </div>
    </div>
  );
};

export default Category;
