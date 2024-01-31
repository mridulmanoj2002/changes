import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: "",
    mobile_no: "",
    personal_email: "",
    goloka_email: "",
    salary: "",
    address: "",
    category_id: "",
    job_type: "",
    shift_timing: "",
    employee_designation: "",
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/auth/employee/" + id)
      .then((result) => {
        setEmployee({
          ...employee,
          name: result.data.Result[0].name,
          mobile_no: result.data.Result[0].mobile_no,
          personal_email: result.data.Result[0].personal_email,
          goloka_email: result.data.Result[0].goloka_email,
          salary: result.data.Result[0].salary,
          address: result.data.Result[0].address,
          category_id: result.data.Result[0].category_id,
          job_type: result.data.Result[0].job_type,
          shift_timing: result.data.Result[0].shift_timing,
          employee_designation: result.data.Result[0].employee_designation,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3000/auth/edit_employee/" + id, employee)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="mobilenumber" className="form-label">
              Mobile No.:
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Edit Mobile no."
              value={employee.mobile_no}
              onChange={(e) =>
                setEmployee({ ...employee, mobile_no: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              value={employee.address}
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Personal Email:
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail14"
              placeholder="Enter Email"
              autoComplete="off"
              value={employee.personal_email}
              onChange={(e) =>
                setEmployee({ ...employee, personal_email: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Goloka Mail ID:
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="golokaemail"
              placeholder="Enter Name"
              value={employee.goloka_email}
              onChange={(e) =>
                setEmployee({ ...employee, goloka_email: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              value={employee.salary}
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              onChange={(e) =>
                setEmployee({ ...employee, category_id: e.target.value })
              }
            >
              {category.map((c) => {
                return <option value={c.id}>{c.name}</option>;
              })}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Job Type:
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputjobtype"
              placeholder="Enter Title"
              value={employee.job_type}
              onChange={(e) =>
                setEmployee({ ...employee, job_type: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Shift Timing:
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputshiftiming"
              placeholder="Enter Shift Time"
              value={employee.shift_timing}
              onChange={(e) =>
                setEmployee({ ...employee, shift_timing: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Employee Designation:
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="golokaemail"
              placeholder="Enter Employee Designation"
              value={employee.employee_designation}
              onChange={(e) =>
                setEmployee({
                  ...employee,
                  employee_designation: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
