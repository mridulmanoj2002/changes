import { Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { Form, Input, Select, Button, DatePicker, TextArea } from "antd";
import "./LeaveApplication.css"
// const { Option } = Select;
const LeaveApplication = () => {
  const [employee, setEmployee] = useState({
    emp_id: "",
    employee_name: "",
    goloka_email: "",
    number_of_days: "",
    type_of_leave: "",
    reason: "",
    start_date: "",
    end_date: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    //Automated data filling
    if (!employee.goloka_email) {
      axios
        .get("http://localhost:3000/employee/"+ id+"/leavedetails")
        .then((response) => {
          setEmployee((prevEmployee) => ({
            ...prevEmployee,
            emp_id: response.data.Result[0].id,
            employee_name: response.data.Result[0].name,
            goloka_email: response.data.Result[0].goloka_email,
          }));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching employee details:", error);
          setLoading(false);
        })
    } else {
      setLoading(false);
    }
  }, [id, employee]);
  //PaidLeave
  //PaidLeave
  const handlePaidLeave = async () => {
    console.log(employee.type_of_leave);
    const formData = new FormData();
    formData.append("emp_id", employee?.emp_id);
    formData.append("employee_name", employee.employee_name);
    formData.append("goloka_email", employee.goloka_email);
    formData.append("number_of_days", employee.number_of_days);
    formData.append("type_of_leave", employee.type_of_leave);
    formData.append("reason", employee.reason);
    formData.append("start_date", employee.start_date);
    formData.append("end_date", employee.end_date);
    formData.append("status", employee.type_of_leave);

    await axios
      .post("http://localhost:3000/employee/leaveapplication", employee)
      .then((result) => {
        if (result.data.Status) {
          navigate("/employee_detail/" + result.data.id)
          alert("Leave applied successfully");

        } else {
          alert(result.data.Error);
        }
        console.log(result.data);
      })
      .catch((err) => console.log(err))
  }
  //PaidLeave
  //SickLeave
  const handleSickLeave = () => {
    console.log(employee.type_of_leave);
    const formData = new FormData();
    formData.append("emp_id", employee.emp_id);
    formData.append("employee_name", employee.employee_name);
    formData.append("goloka_email", employee.goloka_email);
    formData.append("number_of_days", employee.number_of_days);
    formData.append("type_of_leave", employee.type_of_leave);
    formData.append("reason", employee.reason);
    formData.append("start_date", employee.start_date);
    formData.append("end_date", employee.end_date);
    formData.append("status", employee.type_of_leave);
    axios
      .post("http://localhost:3000/employee/sickleaveapplication", employee)
      .then((result) => {
        if (result.data.Status) {
          navigate("/employee_detail/"+result.data.id)
          alert("Leave applied successfully");
        } else {
          alert(result.data.Error);
        }
        console.log(result.data);
      })
      .catch((err) => console.log(err))
  }
  //SickLeave
  //HalfDayLeave
  const handleHalfDay = () => {
    console.log(employee.type_of_leave);
    const formData = new FormData();
    formData.append("emp_id", employee.emp_id);
    formData.append("employee_name", employee.employee_name);
    formData.append("goloka_email", employee.goloka_email);
    formData.append("number_of_days", employee.number_of_days);
    formData.append("type_of_leave", employee.type_of_leave);
    formData.append("reason", employee.reason);
    formData.append("start_date", employee.start_date);
    formData.append("end_date", employee.end_date);
    formData.append("status", employee.type_of_leave);
    axios
      .post("http://localhost:3000/employee/halfleaveapplication", employee)
      .then((result) => {
        if (result.data.Status) {
          navigate("/employee_detail/"+result.data.id)
          alert("Leave applied successfully");
        } else {
          alert(result.data.Error);
        }
        console.log(result.data);
      })
      .catch((err) => console.log(err))
  };
  //halfDayLeave



  //Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const leaveType = employee.type_of_leave.toLowerCase();
    if (leaveType === "sickleave") {
      handleSickLeave();
    }
    else if (leaveType === "halfleave") {
      handleHalfDay();
    }
    else if (leaveType === "paidleave") {
      handlePaidLeave();
    }
  };
  //Submit

  if (loading) {
    return <div>Loding....</div>
  }
  return (
    <div className="leave-application-container">
      <div className="leave-application-form">
      <h4 style={{marginBottom:"5vh"}}>EmployeeLeaveForm</h4>
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Employee ID</label>
            <input type="text" className="form-control" readOnly id="exampleInputPassword1" value={employee.emp_id} placeholder="Enter your Employee ID" onChange={(e) => setEmployee({ ...employee, emp_id: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Name</label>
            <input type="text" className="form-control" readOnly id="exampleInputPassword1" value={employee.employee_name} placeholder="Enter your Name" onChange={(e) => setEmployee({ ...employee, employee_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">
              Email address<span style={{ color: "red" }}> *</span>
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              required
              readOnly
              value={employee.goloka_email}
              onChange={(e) =>
                setEmployee({ ...employee, goloka_email: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="leaveType">
              Type Of Leave<span style={{ color: "red" }}> *</span>
            </label>
            <select
              className="form-control"
              id="leaveType"
              defaultValue=""
              required
              onChange={(e) =>
                setEmployee({ ...employee, type_of_leave: e.target.value })
              }
            >
              <option value="" disabled>
                --Select Type--
              </option>
              <option value="SickLeave">Sick Leave</option>
              <option value="PaidLeave">Paid Leave</option>
              <option value="HalfLeave">Half Leave</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="reason">
              Reason<span style={{ color: "red" }}> *</span>
            </label>
            <textarea
              className="form-control"
              id="reason"
              placeholder="Enter your reason (up to 300 words)"
              rows="5"
              maxLength="300"
              required
              onChange={(e) =>
                setEmployee({ ...employee, reason: e.target.value })
              }
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputdate">
              Number Of Days<span style={{ color: "red" }}> *</span>
            </label>
            <input
              type="number"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Number Of Days"
              required
              onChange={(e) =>
                setEmployee({ ...employee, number_of_days: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputdate">
              Start Date<span style={{ color: "red" }}> *</span>
            </label>
            <input
              type="date"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              required
              onChange={(e) =>
                setEmployee({ ...employee, start_date: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputdate">
              End Date<span style={{ color: "red" }}> *</span>
            </label>
            <input
              type="date"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              required
              onChange={(e) =>
                setEmployee({ ...employee, end_date: e.target.value })
              }
            />
          </div>
          <div className="form-group" style={{ display: 'none' }}>
            <label htmlFor="exampleInputPassword1">StATUS</label>
            <input type="text" className="form-control" readOnly id="exampleInputPassword1" value={employee.type_of_leave} placeholder="Enter your Employee ID" onChange={(e) => setEmployee({ ...employee, emp_id: e.target.value })} />
          </div>
          <hr style={{ width: "100%", margin: "10px 0", color: "black" }} />
          <div className="form-buttons">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Apply
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;


