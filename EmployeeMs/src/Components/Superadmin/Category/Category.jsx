import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Space, Modal, Form, Input } from "antd";
// import "antd/dist/antd.css";
import './Category.css'
const Category = () => {
  const [category, setCategory] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
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
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/auth/delete_category/${id}`)
      .then((result) => {
        if (result.data.Status) {
          console.log(result);
          // Update the category list after successful deletion
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
      .validateFields()
      .then((values) => {
        form.resetFields();
        setIsModalVisible(false);
        // Add new category using API call
        axios
          .post("http://localhost:3000/auth/add_category", values)
          .then((result) => {
            console.log(result);
            if (result.data.Status) {
              // Update the category list after successful addition
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
    <div style={{ backgroundColor: "#dddddd" }} className="px-5 ">
      <div className="d-flex align-items-center">
        <h3>Category List</h3>
      </div>
      <Button
        type="primary"
        style={{ height: "6vh" }}
        onClick={showModal}
        className="btn btn-success  add-category-btn"
      >
        Add Category
      </Button>
      <Modal
        title="Add Category"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
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
