import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./Login.css";
const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [loginType, setLoginType] = useState("Admin");
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();

  const { setIsLoggedIn } = useAuth();

  // axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginEndpoint =
      loginType === "Admin"
        ? "http://localhost:3000/auth/adminlogin"
        : "http://localhost:3000/employee/employee_login";

    axios
      .post(loginEndpoint, values)
      .then((result) => {
        console.log(result);
        if (result.data.loginStatus) {
          console.log(result.data.id, result.data.role);
          setIsLoggedIn(true);
          handleSuccessfulLogin(result.data.id, result.data.role); // Pass the id
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error during login request:", err);
        setError("Network Error. Please try again.");
      });
  };

  const handleSuccessfulLogin = (id, role) => {
    console.log("hello");
    setSelectedType(loginType);
    console.log(loginType);
    console.log(role);
    if (loginType === "Admin") {
      if (role === "superadmin") {
        navigate("/dashboard");
      } else if (role === "admin1") {
        navigate("/Admin1Dashboard");
      } else if (role === "admin2") {
        navigate("/Admin2Dashboard");
      }
    } else if (loginType === "Employee") {
      navigate(`/employee_detail/${id}`);
    }
    // Add more conditions for other roles if needed
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100 loginPage">
      <div className="p-3 rounded border loginForm">
        <div className="text-danger">{error && error}</div>
        <h2>Login</h2>
        <div className="radio-box-container">
          <div className="radio1">
            <label className="radio-box">
              <input
                type="radio"
                name="radio-box"
                value="Admin"
                checked={loginType === "Admin"}
                onChange={() => {
                  setSelectedType("Admin");
                  setLoginType("Admin");
                }}
              />
              <div className="box-content" style={{ color: "black" }}>
                Admin
              </div>
            </label>
          </div>
          <div className="radio1">
            <label className="radio-box">
              <input
                type="radio"
                name="radio-box"
                value="Employee"
                checked={loginType === "Employee"}
                onChange={() => {
                  setLoginType("Employee");
                  setSelectedType("Employee");
                }}
              />
              <div className="box-content" style={{ color: "black" }}>
                Employee
              </div>
            </label>
          </div>
        </div>
        {selectedType && (
          <div className="mt-3">
            Login as <strong style={{ color: "red" }}>{selectedType}</strong>
          </div>
        )}
        <br />
        <form>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="btn btn-success w-100 rounded-0 mb-2"
          >
            Log in
          </button>
          {/* <div className="mb-1">
            <input type="checkbox" name="tick" id="tick" className="me-2" />
            <label htmlFor="password">
              You Agree with terms and conditions
            </label>
          </div> */}
        </form>
      </div>
    </div>
  );
};
export default Login;
