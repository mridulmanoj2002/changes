import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineSolution } from "react-icons/ai";
import logoImage from "../../../assets/goloka.png";
// import "./Dashboard.css"; // Import your CSS file for styling

const Dashboard = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState([]);
  const { id } = useParams();
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios.get("http://localhost:3000/auth/logout").then((result) => {
      if (result.data.Status) {
        navigate("/start");
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div
          style={{ backgroundColor: "#343a40" }}
          className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 "
        >
          <div className="sidebar">
            <Link
              to="/dashboard"
              style={{ marginBottom: "10vh" }}
              className="logo-link"
            >
              <img
                // height="70rem"
                src={logoImage}
                alt="GolokaIT Logo"
                className="logo-image"
              />
            </Link>
            <ul className="nav nav-pills flex-column">
              <li>
                <Link
                  to={`/employee_detail/${id}/leaveapplication`}
                  className="nav-link"
                >
                  <i className="bi-speedometer2"></i>
                  <span>Leave Application</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/employee_detail/${id}/employee_status`}
                  className="nav-link"
                >
                  <i className="bi-people"></i>
                  <span>Employee Status</span>
                </Link>
              </li>
              <li>
                <Link to={`/employee_detail/${id}`} className="nav-link">
                  <AiOutlineSolution className="ai-columns" />
                  <span>Profile</span>
                </Link>
              </li>
              {/* Add more links as needed */}
              <li onClick={handleLogout}>
                <Link className="nav-link">
                  <i className="bi-power"></i>
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div style={{}} className="col p-0 m-0">
          <div
            style={{ backgroundColor: "#343a40", color: "white" }}
            className="p-2 d-flex justify-content-center shadow"
          >
            <h4>Employee Management System</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
