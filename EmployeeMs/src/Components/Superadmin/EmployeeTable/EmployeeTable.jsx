import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Space,Modal,Descriptions   } from "antd";
import axios from "axios";
// import "antd/dist/antd.css";
import "./EmployeeTable.css"; // Create a separate CSS file for styling

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete_employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };

  const handleEdit = (record) => {
    setEditEmployee(record);
    console.log(isEditModalVisible)
    console.log(isViewModalVisible)
    setIsViewModalVisible(false); // Close the view modal if it's open
    setIsEditModalVisible(true);
    console.log(isEditModalVisible)
    console.log(isViewModalVisible)
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditEmployee(null); // Reset the state when the modal is close
  };

  const handleView = (record) => {
    setEditEmployee(record);
    setIsViewModalVisible(true);
    setIsEditModalVisible(false); // Close the edit modal if it's open
  };

  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
    setEditEmployee(null);
  };

  const handleEditSubmit = (editedEmployee) => {
    axios
      .put(`http://localhost:3000/auth/edit_employee/${editedEmployee.id}`, editedEmployee)
      .then((result) => {
        if (result.data.Status) {
          // navigate("/dashboard/employee");
          // setIsEditModalVisible(false);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={`http://localhost:3000/Images/` + image}
          className="employee_image"
          alt=""
        />
      ),
    },
    {
      title: "Email ID",
      dataIndex: "goloka_email",
      key: "goloka_email",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="button-container">
          <Button
            type="primary"
            size="large"
            className="btn btn-info btn-sm"
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Link
            to="#"
            type="primary"
            size="large"
            className="btn btn-info btn-sm"
            style={{height:"6vh"}}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Link>
          <Button
            type="danger"
            size="large"
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
      // responsive: ["md", "lg", "xl"], // Show on medium, large, and extra-large screens
    },
  ];
  return (
    <div  className="employee-container">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <div style={{marginTop:"2vh",marginBottom:"2vh"}}>
      <Link to="/dashboard/add_employee" style={{float:"right"}} className="btn btn-success">
        Add Employee
      </Link>
      </div>
      <div style={{backgroundColor:"#e6e3e3"}}className="mt-3">
        <Table  dataSource={employee} columns={columns} scroll={{ x: 768 }} />
      </div>
      
      {/* Edit Employee Modal */}
      {editEmployee && (
        <Modal
          title="Edit Employee"
          visible={isEditModalVisible}  // Corrected prop name
          onCancel={handleEditModalCancel}
          footer={null}
        >
          {/* Render your edit form inside the modal */}
          <EditEmployeeForm
            employee={editEmployee}
            onCancel={handleEditModalCancel}
            onSubmit={handleEditSubmit}
          />
        </Modal>
      )}
      {editEmployee && (
        <Modal
        title="view Employee"
          visible={isViewModalVisible}  // Corrected prop name
          onCancel={handleEditModalCancel}
          footer={null}
        >
        <ViewEmployeeModal
        visible={isViewModalVisible}
        employee={editEmployee}
          onCancel={handleViewModalCancel}
        />
        </Modal>

      )}
    </div>

  );
};

const ViewEmployeeModal = ({ employee, onCancel }) => {
  // Helper function to render category names
  // const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   // Fetch categories based on category IDs from employee data
  //   if (employee.categories) {
  //     const categoryIds = JSON.parse(employee.categories);
  //     axios
  //       .get("http://localhost:3000/auth/categories", {
  //         params: {
  //           ids: categoryIds.join(","),
  //         },
  //       })
  //       .then((result) => {
  //         if (result.data.Status) {
  //           setCategories(result.data.Result);
  //         } else {
  //           console.error(result.data.Error);
  //         }
  //       })
  //       .catch((err) => console.error(err));
  //   }
  // }, [employee.categories]);

  return (
    <Modal
    title="View Employee"
    visible={true}
    onCancel={onCancel}
    footer={null}
    className="custom-view-modal"
  >
    <div className="employee-profile">
      <img src={`http://localhost:3000/Images/${employee.image}`} alt="Employee" className="profile-image" />
      <Descriptions column={1} className="custom-descriptions">
        <Descriptions.Item label="Name">{employee.name}</Descriptions.Item>
        <Descriptions.Item label="Address">{employee.address}</Descriptions.Item>
        <Descriptions.Item label="Email">{employee.goloka_email}</Descriptions.Item>
        <Descriptions.Item label="Mobile Number">{employee.mobile_no}</Descriptions.Item>
        <Descriptions.Item label="Salary">{employee.salary}</Descriptions.Item>
        <Descriptions.Item label="Job Type">{employee.jobtype}</Descriptions.Item>
        <Descriptions.Item label="Shift Timing">{employee.shift_timing}</Descriptions.Item>
        <Descriptions.Item label="Employee Designation">{employee.employee_designation}</Descriptions.Item>
        <Descriptions.Item label="Categories">
            {Array.isArray(employee.categories)
              ? employee.categories.join(', ')
              : employee.categories
            }
          </Descriptions.Item>     {/* <Descriptions.Item label="Categories">
            {categories.map((category) => category.name).join(', ')}
          </Descriptions.Item>   */}   
          </Descriptions> 
    </div>
  </Modal>
  );
};

const EditEmployeeForm = ({ employee, onCancel, onSubmit }) => {
  const [editedEmployee, setEditedEmployee] = useState(employee);
  useEffect(() => {
    setEditedEmployee(employee); // Update state when the employee prop changes
  }, [employee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editedEmployee);
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label htmlFor="inputName" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control rounded-0"
          id="inputName"
          placeholder="Enter Name"
          value={editedEmployee.name}
          onChange={(e) =>
            setEditedEmployee({ ...editedEmployee, name: e.target.value })
          }
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="mobilenumber" className="form-label">
          Mobile No.:
        </label>
        <input
          type="text"
          className="form-control rounded-0"
          id="inputName"
          placeholder="Edit Mobile no."
          value={editedEmployee.mobile_no}
          onChange={(e) =>
            setEditedEmployee({ ...editedEmployee, mobile_no: e.target.value })
          }
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputAddress" className="form-label">
          Address
        </label>
        <input
          type="text"
          className="form-control rounded-0"
          id="inputAddress"
          placeholder="1234 Main St"
          autoComplete="off"
          value={editedEmployee.address}
          onChange={(e) =>
            setEditedEmployee({ ...editedEmployee, address: e.target.value })
          }
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputEmail4" className="form-label">
          Personal Email:
        </label>
        <input
          type="email"
          className="form-control rounded-0"
          id="inputEmail14"
          placeholder="Enter Email"
          autoComplete="off"
          value={editedEmployee.personal_email}
          onChange={(e) =>
            setEditedEmployee({
              ...editedEmployee,
              personal_email: e.target.value,
            })
          }
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputName" className="form-label">
          Goloka Mail ID:
        </label>
        <input
          type="text"
          className="form-control rounded-0"
          id="golokaemail"
          placeholder="Enter Name"
          value={editedEmployee.goloka_email}
          onChange={(e) =>
            setEditedEmployee({
              ...editedEmployee,
              goloka_email: e.target.value,
            })
          }
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputSalary" className="form-label">
          Salary
        </label>
        <input
          type="text"
          className="form-control rounded-0"
          id="inputSalary"
          placeholder="Enter Salary"
          autoComplete="off"
          value={editedEmployee.salary}
          onChange={(e) =>
            setEditedEmployee({ ...editedEmployee, salary: e.target.value })
          }
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputjobtype" className="form-label">
          Job Type:
        </label>
        <input
          type="text"
          className="form-control rounded-0"
          id="inputjobtype"
          placeholder="Enter Title"
          value={editedEmployee.jobtype}
          onChange={(e) =>
            setEditedEmployee({ ...editedEmployee, jobtype: e.target.value })
          }
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputshiftiming" className="form-label">
          Shift Timing:
        </label>
        <input
          type="text"
          className="form-control rounded-0"
          id="inputshiftiming"
          placeholder="Enter Shift Time"
          value={editedEmployee.shift_timing}
          onChange={(e) =>
            setEditedEmployee({
              ...editedEmployee,
              shift_timing: e.target.value,
            })
          }
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="golokaemail" className="form-label">
          Employee Designation:
        </label>
        <input
          type="text"
          className="form-control rounded-0"
          id="golokaemail"
          placeholder="Enter Employee Designation"
          value={editedEmployee.employee_designation}
          onChange={(e) =>
            setEditedEmployee({
              ...editedEmployee,
              employee_designation: e.target.value,
            })
          }
        />
      </div>
      <div className="col-12 mt-3">
        <button type="submit" className="btn btn-primary w-100">
          Edit Employee
        </button>
      </div>
    </form>
  );
};

export default Employee;






   {/* <div className="col-12">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              onChange={(e) =>
                setEditedEmployee({ ...editedEmployee, category_id: e.target.value })
              }
            >
              {category.map((c) => {
                return <option value={c.id}>{c.name}</option>;
              })}
            </select>
          </div> */}