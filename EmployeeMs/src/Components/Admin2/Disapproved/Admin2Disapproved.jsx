import React, { useState, useEffect } from "react";
import { Input, Table,Tag } from "antd";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Admin2Disapproved.css";
import ReactPaginate from "react-paginate";
import Sidebar from '../Sidebar/Sidebar';

const Admin2DisApproved = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Initially

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/getdisapproved1")
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
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = employeeData
    .filter((employee) =>
      Object.values(employee).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

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

  const columns = [
    {
      title: "EmpID",
      dataIndex: "emp_id",
      key: "emp_id",
    },
    {
      title: "Name",
      dataIndex: "employee_name",
      key: "employee_name",
    },
    {
      title: "Number Of Days",
      dataIndex: "number_of_days",
      key: "number_of_days",
    },
    {
      title: "Leaves Remaining",
      dataIndex: "leaves_remaining",
      key: "leaves_remaining",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => formatDate(text),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => formatDate(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Disapprove1" ? "#ff4d4f" : ""}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div  style={{backgroundColor:"#dddddd"}}  className="container-fluid">
      <div className="row flex-nowrap">
        <Sidebar />
        <div className="col p-0 m-0">
          <div
            id="mainheader1"
            className="p-2 d-flex flex-column align-items-center justify-content-center shadow"
          >
            <h4>Employee Management System</h4>
            <hr style={{ width: "50%", margin: "10px 0", color: "black" }} />
            <h4>Admin 2 Disapproved</h4>
          </div>

          <div className="table1">
            <div className="header">
              <div className="searchbar">
                <Input
                  className="search-input"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <i id="searchicon" className="bi bi-search"></i>
              </div>
            </div>
            <div className="table-container">
              {employeeData.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  pagination={false}
                />
              ) : (
                <p>Leaves not yet Disapproved</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin2DisApproved;
