import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
const EmployeeDetail = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState([]);
  const { id } = useParams();
  const handleLogout = () => {
    axios.get("http://localhost:3000/auth/logout").then((result) => {
      if (result.data.Status) {
        navigate("/start");
      }
    });
  };
  useEffect(() => {
    axios
      .get("http://localhost:3000/employee/detail/" + id)
      .then((result) => {
        setEmployee(result.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <span className="fs-5 fw-bolder d-none d-sm-inline">GolokaIT</span>

            <ul
              className=" nav nav-pills flex-column mb-sm-auto mb-2 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to={`/employee_detail/${id}/leaveapplication`}
                  className="d-flex nav-link px-0 align-middle text-white"
                >
                  <IoPersonSharp className="fs-4 io5 person ms-2" />
                  <span className="ms-2 d-none d-sm-inline">Apply Leave</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to={`/employee_detail/${id}/employee_status`}
                  className="d-flex nav-link px-0 align-middle text-white"
                >
                  <IoPersonSharp className="fs-4 io5 person ms-2" />
                  <span className="ms-2 d-none d-sm-inline">Leave Status</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to={`/employee_detail/${id}`}
                  className="d-flex nav-link px-0 align-middle text-white"
                >
                  <IoPersonSharp className="fs-4 io5 person ms-2" />
                  <span className="ms-2 d-none d-sm-inline">Profile</span>
                </Link>
              </li>
              <li className="w-100" onClick={handleLogout}>
                <Link className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Employee Management System</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
