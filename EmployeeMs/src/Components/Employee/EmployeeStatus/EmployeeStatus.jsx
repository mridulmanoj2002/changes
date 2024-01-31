import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckSquare } from "react-icons/fa";
import { MdDisabledByDefault } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import { AiFillCloseSquare } from "react-icons/ai";
import { MdOutlinePendingActions } from "react-icons/md";
import { Table } from "antd"; // Import Table component from Ant Design
import "./EmployeeStatus.css"

const EmployeeStatus = () => {
  const [status, setStatus] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:3000/employee/status/${id}`)
      .then((result) => {
        if (result.data.Status) {
          // Assuming result.data.Result contains the array you want
          setStatus(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);
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
    const getStatusDisplay = (statusValue) => {
      switch (statusValue) {
        case "PaidLeave":
          return (
            <div className="status-container pending">
              <div className="admins">
                ADMIN 1 <br />
                ADMIN 2
              </div>
              <div className="status-icon">
                <MdOutlinePendingActions color="blue" />
                <span>PENDING</span>
              </div>
            </div>
          );
        case "Approve1":
          return (
            <div className="status-container pending">
              <div className="admins">
                ADMIN 1 <br />
                ADMIN 2 <FaCheckSquare color="green" className="check-icon" />
              </div>
              <div className="status-icon">
                <MdOutlinePendingActions color="blue" />
                <span>PENDING</span>
              </div>
            </div>
          );
        case "Approve":
          return (
            <div className="status-container approved">
              <div className="admins">
                ADMIN 1 <FaCheckSquare color="green" className="check-icon" />
                <br />
                ADMIN 2 <FaCheckSquare color="green" className="check-icon" />
              </div>
              <div className="status-icon">
                <AiFillCheckCircle color="green" />
                <span>APPROVED</span>
              </div>
            </div>
          );
        case "Disapprove1":
          return (
            <div className="status-container disapproved">
              <div className="admins">
                ADMIN 1 <MdDisabledByDefault color="red" />
                <br />
                ADMIN 2 <MdDisabledByDefault color="red" />
              </div>
              <div className="status-icon">
                <AiFillCloseSquare color="red" />
                <span>DISAPPROVED</span>
              </div>
            </div>
          );
        case "Disapprove":
          return (
            <div className="status-container disapproved">
              <div className="admins">
                ADMIN 1 <MdDisabledByDefault color="red" />
                <br />
                ADMIN 2 <MdDisabledByDefault color="red" />
              </div>
              <div className="status-icon">
                <AiFillCloseSquare color="red" />
                <span>DISAPPROVED</span>
              </div>
            </div>
          );
        case "SickLeave":
        case "HalfLeave":
          return (
            <div className="status-container approved">
              <div className="admins">
                ADMIN 1 <FaCheckSquare color="green" className="check-icon" />
                <br />
                ADMIN 2 <FaCheckSquare color="green" className="check-icon" />
              </div>
              <div className="status-icon">
                <AiFillCheckCircle color="green" />
                <span>APPROVED</span>
              </div>
            </div>
          );
        default:
          return "Invalid Status";
      }
    };
    
  
  const columns = [
    {
      title: "Number of Days",
      dataIndex: "number_of_days",
      key: "number_of_days",
    },
    {
      title: "Type of Leave",
      dataIndex: "type_of_leave",
      key: "type_of_leave",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date) => formatDate(start_date),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (end_date) => formatDate(end_date),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusDisplay(status),
    },
  ];

  return (
    <div className="px-5 mt-3">
    <div className="d-flex justify-content-center">
      <h3>Leave Records</h3>
    </div>
    <div className="mt-3">
      <Table dataSource={status} columns={columns} />
    </div>
  </div>
  );
};

export default EmployeeStatus;
