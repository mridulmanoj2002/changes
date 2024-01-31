import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    status:"Pending",
  });
  const [validationError, setValidationError] = useState("");
  const [leave_type, setleave_type]=useState("")

  const navigate = useNavigate();

  const holidays = [
    "2024-01-01",
    "2024-01-26",
    "2024-03-26",
    "2024-03-29",
    "2024-04-09",
    "2024-04-11",
    "2024-05-01",
    "2024-08-15",
    "2024-08-19",
    "2024-08-26",
    "2024-09-07",
    "2024-10-02",
    "2024-10-12",
    "2024-10-30",
    "2024-12-25",
  ];

  const isHoliday = (date) => holidays.includes(date);


  const handleSubmit = (e) => {
    e.preventDefault();
    

    if (new Date(employee.end_date) < new Date(employee.start_date)) {
        setValidationError("❗End Date should be greater than Start Date");
        // console.log("Error1111");
        return;
      }

      if (isHoliday(employee.start_date) || isHoliday(employee.end_date)) {
          if(isHoliday(employee.start_date)===true){
            setValidationError("❗Start date is a holiday");
            console.log("setValidationError (Start date)");
          }
          else{
            setValidationError("❗End date is a holiday");
            console.log("setValidationError (End date)");
          }
        // setValidationError("Selected date is a holiday");
        return;
      }
     
     

       else {
        const startDate = new Date(employee.start_date);
        const endDate = new Date(employee.end_date);
  
        if (startDate.getDay() === 5 && endDate.getDay() === 1) {
          // Friday === 5 and Monday === 1 in 
          setleave_type("Leave is considered as 4 days (Sandwich Leave)");
          console.log("setleave_type")
          
        }
        else if(startDate.getDay() === 5 || startDate.getDay() === 1 || startDate.getDay() === isHoliday ||endDate.getDay() === 5 || endDate.getDay() === 1 || endDate.getDay() === isHoliday ){
          setleave_type("Leave is considered as 2 days");
          console.log("setleave_type")
        }
        // else{
          const status = employee.type_of_leave === "sickLeave" ? "SickLeave":"Pending";
          const formData = new FormData();
          formData.append("emp_id", employee.emp_id);
          formData.append("employee_name", employee.employee_name);
          formData.append("goloka_email", employee.goloka_email);
          formData.append("number_of_days", employee.number_of_days);
          formData.append("type_of_leave", employee.type_of_leave);
          formData.append("reason", employee.reason);
          formData.append("start_date", employee.start_date);
          formData.append("end_date", employee.end_date);
          formData.append("status",status);
      
          axios
            .post("http://localhost:3000/employee/leaveapplication", employee)
            .then((result) => {
              if (result.data.Status) {
                navigate("/leaveapplication");
              } else {
                alert(result.data.Error);
              }
              console.log(result.data);
            })
            .catch((err) => console.log(err));

        }

  
  // };
}

  const handleEndDateChange = (e) => {
    setEmployee({ ...employee, end_date: e.target.value });
    setValidationError(""); // Clear validation error when the user changes the end date
  };
  return (
    <div>
      <h4>EmployeeLeaveForm</h4>
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="exampleInputPassword1">Employee ID</label>
            <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Enter your Employee ID" onChange={(e) => setEmployee({ ...employee, emp_id: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Name</label>
            <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Enter your Name" onChange={(e) => setEmployee({ ...employee, employee_name: e.target.value })} />
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
              <option value="sickLeave">Sick Leave</option>
              <option value="paidLeave">Paid Leave</option>
              <option value="halfLeave">Half Leave</option>
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
              value={employee.end_date}
              onChange={handleEndDateChange}
            />
            <div>
            </div>
           
            <div className="form-group" style={{ color: "red", marginTop: "5px", boxSizing:"border-box", backgroundColor:"yellow"}}>
              {validationError}
            </div>
           
            <div style={{ color: "black", marginTop: "5px",backgroundColor:"#90EE90" }}>{leave_type}</div>
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
          {/* <div className="form-group" style={{ color: "green", marginTop: "5px" }}>
            {leave_type}
            </div> */}
        </form>
      </div>
    </div>
  );
};

export default LeaveApplication;

  
 
