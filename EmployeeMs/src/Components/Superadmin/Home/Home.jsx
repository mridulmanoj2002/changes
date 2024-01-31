// Import necessary libraries and icons
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Space,Modal } from "antd";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AddAdminForm from "../AddAdmin/AddAdmin"; // Import the AddAdminForm component
import "./Home.css"; // Import the CSS file for styles

const Home = () => {
  const [adminTotal, setAdminTotal] = useState();
  const [employeeTotal, setEmployeeTotal] = useState();
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [admin1s, setAdmin1s] = useState([]);
  const [admin2s, setAdmin2s] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    adminCount();
    employeeCount();
    salaryCount();
    AdminRecords();
  }, []);

  const AdminRecords = () => {
    axios.get("http://localhost:3000/auth/admin_records").then((result) => {
      if (result.data.Status) {
        // Filter data based on roles
        const superAdminData = result.data.Result.filter(
          (admin) => admin.roles === "superadmin"
        );
        const admin1Data = result.data.Result.filter(
          (admin) => admin.roles === "admin1"
        );
        const admin2Data = result.data.Result.filter(
          (admin) => admin.roles === "admin2"
        );

        setAdmins(result.data.Result);
        setSuperAdmins(superAdminData);
        setAdmin1s(admin1Data);
        setAdmin2s(admin2Data);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const adminCount = () => {
    axios.get("http://localhost:3000/auth/admin_count").then((result) => {
      if (result.data.Status) {
        setAdminTotal(result.data.Result[0].admin);
      }
    });
  };

  const employeeCount = () => {
    axios.get("http://localhost:3000/auth/employee_count").then((result) => {
      if (result.data.Status) {
        setEmployeeTotal(result.data.Result[0].employee);
      }
    });
  };

  const salaryCount = () => {
    axios.get("http://localhost:3000/auth/salary_count").then((result) => {
      if (result.data.Status) {
        setSalaryTotal(result.data.Result[0].salary);
      }
    });
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete_admin/" + id)
      .then((result) => {
        if (result.data.Status) {
          AdminRecords(); // Refresh the admin records after deletion
        } else {
          alert(result.data.Error);
        }
      });
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/dashboard/edit_admin/${record.id}`}>
            <button className="btn btn-primary btn-sm">
              <FaEdit /> Edit
            </button>
          </Link>
          <button
            onClick={() => handleDelete(record.id)}
            className="btn btn-danger btn-sm"
            style={{backgroundColor:"#D11A2A"}}
          >
            <FaTrash /> Delete
          </button>
        </Space>
      ),
    },
  ];
  
  // Toggle modal visibility
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container w-100">
      <div className="row w-100 mt-3">
        {/* Admin, Employee, and Salary Cards */}
        <div className="col-md-4">
          <div className="card">
            <h4 className="text-center pb-1">Admin</h4>
            <hr />
            <div className="d-flex justify-content-between">
              <h5>Total:</h5>
              <h5>{adminTotal}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <h4 className="text-center pb-1">Employee</h4>
            <hr />
            <div className="d-flex justify-content-between">
              <h5>Total: </h5>
              <h5>{employeeTotal}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <h4 className="text-center pb-1">Salary</h4>
            <hr />
            <div className="d-flex justify-content-between">
              <h5>Total: </h5>
              <h5>Rs.{salaryTotal}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* List of Admins */}
       {/* Super Admin Table */}
             {/* Add Admin Button */}
             <div className="text-end mt-3">
              <button onClick={showModal} className="btn btn-success">
                <FaPlus /> Add Admin
              </button>
            </div>
             <Modal
        title="Add Admin"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <AddAdminForm onClose={handleCancel} />
      </Modal>
       <div className="row w-100 mt-4">
        <div className="col-md-12">
          <h3>List of Super Admins</h3>
          <Table dataSource={superAdmins} columns={columns} />
        </div>
      </div>

      {/* Admin1 and Admin2 Tables */}
      <div className="row w-100 mt-4">
        <div className="col-md-6">
          <h3>List of Admin1</h3>
          <Table dataSource={admin1s} columns={columns} />
        </div>
        <div className="col-md-6">
          <h3>List of Admin2</h3>
          <Table dataSource={admin2s} columns={columns} />
        </div>
      </div>


    </div>
  );
};

export default Home;
