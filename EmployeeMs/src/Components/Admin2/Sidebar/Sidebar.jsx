import React from 'react'
import { Link, Outlet } from "react-router-dom";
import logoImage from "../../../assets/goloka.png"

export default function Sidebar() {
  return (
    <div className="admin1sidebar col-auto col-md-3 col-xl-2 px-sm-2 px-0">
    <div className="admin1sidebar d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
    <Link to="/Admin1Dashboard" style={{marginBottom:"10vh"}} className="logo-link">
              <img
                // height="70rem"
                src={logoImage}
                alt="GolokaIT Logo"
                className="logo-image"
              />
            </Link>
      <ul
        className=" nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
        id="menu"
      >
        <li className="w-100">
          <Link
            to="/Admin2dashboard"
            className="nav-link text-white px-0 align-middle
                       "
          >
            <i className="fs-4 bi-speedometer2 ms-2"></i>
            <span className="ms-1 d-none d-sm-inline">Dashboard</span>
          </Link>
        </li>
        <li className="w-100">
          <Link
            to="/Admin2Approved"
            className="nav-link px-0 align-middle text-white"
          >
            <i className="fs-4 bi-people ms-2"></i>
            <span className="ms-2 d-none d-sm-inline">Approved</span>
          </Link>
        </li>
        <li className="w-100">
          <Link
            to="/Admin2Disapproved"
            className="nav-link px-0 align-middle text-white"
          >
            <i className="fs-4 bi-people ms-2"></i>
            <span className="ms-2 d-none d-sm-inline">Disapproved</span>
          </Link>
        </li>

        <li className="w-100">
          <Link className="nav-link px-0 align-middle text-white">
            <i className="fs-4 bi-power ms-2"></i>
            <span className="ms-2 d-none d-sm-inline">logout</span>
          </Link>
        </li>
      </ul>
    </div>
  </div>
  )
}
