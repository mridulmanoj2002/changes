import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Upload, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./AddEmployee.css";

const { Option } = Select;
axios.defaults.withCredentials = true;

const AddEmployee = () => {
  const [form] = Form.useForm();
  const [category, setCategory] = useState([]);
  const [selectedShiftTiming, setSelectedShiftTiming] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);

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

  const handleSubmit = (values) => {
    const formData = new FormData();
    console.log(values);
    formData.append("id", values.id);
    formData.append("name", values.name);
    formData.append("mobile_no", values.mobile_no);
    formData.append("personal_email", values.personal_email);
    formData.append("goloka_email", values.goloka_email);
    formData.append("password", values.password);
    formData.append("address", values.address);
    formData.append("salary", values.salary);
    console.log(values.image && values.image[0]);
    formData.append("image", values.image && values.image[0]?.originFileObj); // Adjusted this line
    formData.append("job_type", selectedJobType);
    formData.append("shift_timing", selectedShiftTiming);
    formData.append("employee_designation", values.employee_designation);
    // formData.append("category_id", values.category_id);
    formData.append("categories", JSON.stringify(values.categories));

    console.log(formData);
    axios
      .post("http://localhost:3000/auth/employee", formData) // Adjusted this line
      .then((result) => {
        console.log(result);
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="elevated-box">
        <div className="p-3 rounded w-60 border ">
          <h3 className="text-center">Add Employee</h3>
          <Form
            form={form}
            onFinish={handleSubmit}
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Employee ID"
                  name="id"
                  rules={[
                    { required: true, message: "Please enter Employee ID!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter Name!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Mobile No."
                  name="mobile_no"
                  rules={[
                    { required: true, message: "Please enter Mobile No.!" },
                    {
                      pattern: /^[0-9]*$/,
                      message: "Please enter valid Mobile No.!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Address" name="address">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Personal Email ID"
                  name="personal_email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Personal Email ID!",
                    },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Goloka Mail ID"
                  name="goloka_email"
                  rules={[
                    { required: true, message: "Please enter Goloka Mail ID!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter Password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Salary"
                  name="salary"
                  rules={[{ required: true, message: "Please enter Salary!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Job Type"
                  name="job_type"
                  rules={[
                    { required: true, message: "Please select Job Type!" },
                  ]}
                >
                  <Select
                    placeholder="Select Job Type"
                    onChange={(value) => setSelectedJobType(value)}
                  >
                    <Option value="intern">Intern</Option>
                    <Option value="full_time">Full Time</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Shift Timing"
                  name="shift_timing"
                  rules={[
                    { required: true, message: "Please select Shift Timing!" },
                  ]}
                >
                  <Select
                    placeholder="Select Shift Timing"
                    onChange={(value) => setSelectedShiftTiming(value)}
                  >
                    <Option value="morning">Morning</Option>
                    <Option value="night">Night</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Designation"
                  name="employee_designation"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Employee Designation!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Categories"
                  name="categories"
                  rules={[
                    { required: true, message: "Please select Categories!" },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select Categories"
                    onChange={(values) => setSelectedCategories(values)}
                  >
                    {category.map((c) => (
                      <Option key={c.id} value={c.name}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            
            <Form.Item
              label="Image"
              name="image"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              // extra="Please upload a passport-sized photo"
              rules={[
                {
                  required: true,
                  message: "Please upload an image!",
                },
              ]}
            >
              <Upload
                beforeUpload={beforeUpload}
                maxCount={1}
                listType="picture"
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
              <Button type="primary" htmlType="submit">
                Add Employee
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
