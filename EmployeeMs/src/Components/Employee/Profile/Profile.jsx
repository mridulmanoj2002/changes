import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Profile() {
  const [employee, setEmployee] = useState({});
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    // setLoading(true);
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);

          const emp = result.data.Result.find((e) => e.id === id);
          console.log(emp);
          setEmployee(emp);
          //   setLoading(false);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return !loading ? (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border ">
        <h3 className="text-center">PROFILE</h3>
        <form className="row g-1">
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputGroupFile01">
              Image:
            </label>
            <br />
            <img
              src={`http://localhost:3000/Images/` + employee.image}
              className="employee_image"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Employee ID:
            </label>
            <p className="form-control rounded-0">{employee.id}</p>
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name:
            </label>
            <p className="form-control rounded-0">{employee.name}</p>
          </div>
          <div className="col-12">
            <label htmlFor="mobilenumber" className="form-label">
              Mobile No.:
            </label>
            <p className="form-control rounded-0">{employee.mobile_no}</p>
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail14" className="form-label">
              Personal Email:
            </label>
            <p className="form-control rounded-0">{employee.personal_email}</p>
          </div>
          <div className="col-12">
            <label htmlFor="golokaemail" className="form-label">
              Golaka Mail ID:
            </label>
            <p className="form-control rounded-0">{employee.goloka_email}</p>
          </div>
          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">
              Salary:
            </label>
            <p className="form-control rounded-0">{employee.salary}</p>
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address:
            </label>
            <p className="form-control rounded-0">{employee.address}</p>
          </div>
          <div className="col-12">
            <label htmlFor="inputjob type" className="form-label">
              Job Type:
            </label>
            <p className="form-control rounded-0">{employee.jobtype}</p>
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Shift Timing:
            </label>
            <p className="form-control rounded-0">{employee.shift_timing}</p>
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Employee Designation:
            </label>
            <p className="form-control rounded-0">
              {employee.employee_designation}
            </p>
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Paid Leaves:
            </label>
            <p className="form-control rounded-0">{employee.paid_leave}</p>
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Sick Leaves:
            </label>
            <p className="form-control rounded-0">{employee.sick_leave}</p>
          </div>
          {/* <div className="col-12">
            <label htmlFor="category" className="form-label">
              Category:
            </label>
            <p className="form-control rounded-0">{employee.category_id}</p>
            {category.map((c) => {
              return <option value={c.id}>{c.name}</option>;
            })}
          </div> */}

          <div className="col-12"></div>
        </form>
      </div>
    </div>
  ) : (
    <p>Loading</p>
  );
}

export default Profile;
