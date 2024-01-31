import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Table, Input, Button, Space } from "antd";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./Admin2Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";
const { Search } = Input;

function Admin2Dashboard() {
  const [employeeData, setEmployeeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/getleaves")
      .then((response) => {
        if (response.data.Status) {
          setEmployeeData(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => {
        console.error("Error while retrieving data:", error);
      });
  }, []);

  const pageCount = Math.ceil(employeeData.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  //SearchBar
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredData = employeeData
    .filter((employee) =>
      Object.values(employee).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

  //Approve Button
  const approveleave = (EmpLeaveID) => {
    axios
      .post(`http://localhost:3000/auth/approveleave/${EmpLeaveID}`)
      .then((response) => {
        if (response.data.Status) {
          const updatedEmployeeData = employeeData.map((employee) =>
            employee.EmpLeaveID === EmpLeaveID
              ? { ...employee, status: "Approve1" }
              : employee
          );
          axios
            .get("http://localhost:3000/auth/getleaves")
            .then((response) => {
              if (response.data.Status) {
                setEmployeeData(response.data.Result);
              } else {
                alert(response.data.Error);
              }
            })
            .catch((error) => {
              console.error("Error while retrieving data:", error);
            });
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => {
        console.error("Error while approving leave:", error);
      });
  };
  //Approve Button

  //Disapprove Button
  const disapproveleave = (EmpLeaveID) => {
    axios
      .post(`http://localhost:3000/auth/disapproveleave/${EmpLeaveID}`)
      .then((response) => {
        if (response.data.Status) {
          const updatedEmployeeData = employeeData.map((employee) =>
            employee.EmpLeaveID === EmpLeaveID
              ? { ...employee, status: "Approve" }
              : employee
          );
          axios
            .get("http://localhost:3000/auth/getleaves")
            .then((response) => {
              if (response.data.Status) {
                setEmployeeData(response.data.Result);
              } else {
                alert(response.data.Error);
              }
            })
            .catch((error) => {
              console.error("Error while retrieving data:", error);
            });
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => {
        console.error("Error while approving leave:", error);
      });
  };

  const columns = [
    { title: "EmpID", dataIndex: "emp_id", key: "emp_id" },
    { title: "Name", dataIndex: "employee_name", key: "employee_name" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { title: "Paid Leaves Remaining", dataIndex: "paid_leaves_remaining", key: "paid_leaves_remaining" },
    { title: "Number Of Days", dataIndex: "number_of_days", key: "number_of_days" },
    { title: "Start Date", dataIndex: "start_date", key: "start_date", width: 120, render: formatDate },
    { title: "End Date", dataIndex: "end_date", key: "end_date", width: 120, render: formatDate },
    {
      title: "Actions",
      dataIndex: "EmpLeaveID",
      key: "actions",
      render: (EmpLeaveID) => (
        <Space>
          <Button type="primary" onClick={() => approveleave(EmpLeaveID)}>
            Approve
          </Button>
          <Button type="danger" onClick={() => disapproveleave(EmpLeaveID)}>
            Disapprove
          </Button>
        </Space>
      ),
    },
  ];

  //Convert the Date JSON to DD/MM/YY format
  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }

  //Convert the Date from JSON to DD/MM/YY format
  const handlelogout = () => {
    axios.get("http://localhost:3000/auth/logout").then((result) => {
      if (result.data.Status) {
        navigate("/start");
      }
    });
  };

  return (
    <div style={{ backgroundColor: "#dddddd" }} className="container-fluid">
      <div className="row flex-nowrap">
        <Sidebar />
        <div className="col p-0 m-0">
          <div
            id="mainheader1"
            className="p-2 d-flex flex-column align-items-center justify-content-center shadow"
          >
            <h4>Employee Management System</h4>
            <hr style={{ width: "50%", margin: "10px 0", color: "black" }} />
            <h4>Admin2 Dashboard</h4>
          </div>
          <div className="table1">
            <div className="header">
              <div className="searchbar">
                <Search
                  className="search-input"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <i id="searchicon" className="bi bi-search"></i>
              </div>
            </div>
            <div className="table-container">
              {employeeData.length > 0 ? (
                <Table
                  dataSource={filteredData}
                  columns={columns}
                  pagination={false}
                  bordered
                  size="middle"
                />
              ) : (
                <p>No leaves pending</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin2Dashboard;
