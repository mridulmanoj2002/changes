import Express, { json } from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

//Sender Email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dhananjay@golokait.com",
    pass: "rkaqxuocemurivul",
  },
});
//Sender Email
const jwtSecretKey = "hello";
const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "Access denied. Token missing." });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
    req.user = decoded;
    next();
  });
};


const EmployeeRouter = Express.Router();
EmployeeRouter.post("/employee_login", (req, res) => {
  const sql = "SELECT * from employee where goloka_email = ? ";
  console.log(req.body.email);
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    console.log(req.body.password, result);
    if (result.length > 0) {
      console.log(req.body.password, result[0].password);
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err)
          return res.json({ loginStatus: false, Error: "Wrong Password" });

        const email = result[0].goloka_email;
        const token = jwt.sign(
          { role: "employee", email: email },
          jwtSecretKey,
          { expiresIn: "1d" }
        );
        res.cookie("token", token);
        
        return res.json({ loginStatus: true, id: result[0].id });
      });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});
EmployeeRouter.get("/detail/:id",verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee where id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false });
    return res.json(result);
  });
});

//Automate Data Filling
EmployeeRouter.get("/:id/leavedetails",verifyToken,(req,res)=>{
  const id =req.params.id;
  const sql="SELECT *FROM employee WHERE id=?";
  con.query(sql,[id],(err,result)=>{
    if(err){
      return res.json({Status:false,Error:"Error while fetching the data"});
    }
    return res.json({Status:true,Result:result});
  });
});
//Automate Data Filling
//Handle paid Leave
EmployeeRouter.post("/leaveapplication",verifyToken, (req, response) => {
  const sql = `INSERT INTO leave_application
  (emp_id,employee_name,goloka_email,number_of_days,type_of_leave,reason,start_date,end_date,status) 
  VALUES (?,?,?,?,?,?,?,?,?)`;
  const values = [
    req.body.emp_id,
    req.body.employee_name,
    req.body.goloka_email,
    req.body.number_of_days,
    req.body.type_of_leave,
    req.body.reason,
    req.body.start_date,
    req.body.end_date,
    req.body.type_of_leave,
  ];

  con.query(sql, values, (err,res, result) => {
    console.log(result)
    if (err) return response.json({ Status: false, Error: err });
    const leave = result && result.insertId ? result.insertId : null;
    const employeeName = req.body.employee_name;
    const employeeID= req.body.emp_id;
    //Send Email to Admin2
    const getAdmin2 = "SELECT email from admin WHERE roles='admin1'";
    con.query(getAdmin2, async (err, res) => {
      if (err) {
        return response.json({
          Status: false,
          Error: "Failed to fetch Admin2 email",
        });
      }
      const Admin2email = res[0].email;
      const mailOptions = {
        from: "dhananjay@golokait.com",
        to: Admin2email,
        subject: "Hello Admin 2 A leave have been requested",
        text:
          `This email is sent by your appplication.To let you know that a leave has been requested by: `+
          employeeName+` with Employee ID: `+employeeID,
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent Sucessfully");
      } catch (error) {
        console.error("Error sending email:", error);
        return response.json({ Status: false, Error: "Failed to send email" });
      }
    });
    return response.json({ Status: true, leave, employeeName, id: employeeID });
  });
});
//Handle Paid Leave
//Handle Sick Leave
EmployeeRouter.post("/sickleaveapplication",verifyToken, (req, res) => {
  const sql = `INSERT INTO leave_application
  (emp_id,employee_name,goloka_email,number_of_days,type_of_leave,reason,start_date,end_date,status) 
  VALUES (?,?,?,?,?,?,?,?,?)`;
  const values = [
    req.body.emp_id,
    req.body.employee_name,
    req.body.goloka_email,
    req.body.number_of_days,
    req.body.type_of_leave,
    req.body.reason,
    req.body.start_date,
    req.body.end_date,
    req.body.type_of_leave,
  ];


  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    const leave=result.insertId;
    const employeeName=req.body.employee_name;
    const employeeID= req.body.emp_id;
    const startDate=req.body.start_date;
    const endDate=req.body.end_date;
    const numberofdays=req.body.number_of_days;
    const values=[numberofdays,employeeID]
    const sqlUpdatePaidLeave = "UPDATE employee SET sick_leave = sick_leave - ? WHERE id = ?";
      con.query(sqlUpdatePaidLeave, values, (err, result) => {
        if (err) {
          console.error("Error while Deducting Sick Leave: ", err);
          return res.json({ Status: false, Error: "Failed to Deduct Sick Leave" });
        }
       
      })
    //Send Email to Admin2
    const getAdmin2="SELECT email from admin WHERE roles='admin1'";
    con.query(getAdmin2,async (err,res)=>{
      if(err){
        return res.json({Status:false,Error:"Failed to fetch Admin1 email"});
      }
      const Admin1email=res[0].email;
      const mailOptions ={
        from:"dhananjay@golokait.com",
        to:Admin1email,
        subject:"Hello Admin 1 A Sick leave have been taken",
        text:`This email is sent by your appplication.To let you know that a Sick leave has been 
        taken by: `+employeeName+` with Employee ID: `+employeeID+` From: `+startDate+` To: `+endDate,
      }
      try{
        await transporter.sendMail(mailOptions)
        console.log("Email sent Sucessfully");
      }
      catch (error) {
        console.error("Error sending email:", error);
        return res.json({ Status: false, Error: "Failed to send email" });
      }
    });
    return res.json({ Status: true,leave,employeeName, id:employeeID });
  });
});
//Handle Sick Leave
//Handle Half Leave
EmployeeRouter.post("/halfleaveapplication",verifyToken, (req, res) => {
  const sql = `INSERT INTO leave_application
  (emp_id,employee_name,goloka_email,number_of_days,type_of_leave,reason,start_date,end_date,status) 
  VALUES (?,?,?,?,?,?,?,?,?)`;
  const values = [
    req.body.emp_id,
    req.body.employee_name,
    req.body.goloka_email,
    req.body.number_of_days,
    req.body.type_of_leave,
    req.body.reason,
    req.body.start_date,
    req.body.end_date,
    req.body.type_of_leave,
  ];


  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    const leave=result.insertId;
    const employeeName=req.body.employee_name;
    const employeeID= req.body.emp_id;
    const startDate=req.body.start_date;
    //Send Email to Admin2
    const getAdmin2="SELECT email from admin WHERE roles='admin1'";
    con.query(getAdmin2,async (err,res)=>{
      if(err){
        return res.json({Status:false,Error:"Failed to fetch Admin1 email"});
      }
      const Admin1email=res[0].email;
      const mailOptions ={
        from:"dhananjay@golokait.com",
        to:Admin1email,
        subject:"Hello Admin 1 A Half leave have been taken",
        text:`This email is sent by your appplication.To let you know that a 
        Half leave has been taken by: `+employeeName+ `with Employee ID: `+employeeID+` For the day: `+startDate,
      }
      try{
        await transporter.sendMail(mailOptions)
        console.log("Email sent Sucessfully");
      }
      catch (error) {
        console.error("Error sending email:", error);
        return res.json({ Status: false, Error: "Failed to send email" });
      }
    });
    return res.json({ Status: true,leave,employeeName, id:employeeID });
  });
});
//Handle Half Leave

EmployeeRouter.get("/status/:id",verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM leave_application WHERE emp_id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});
EmployeeRouter.get("/employee/:id",verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM leave_application WHERE emp_id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Status: false, Error: "Query Error" });
    }

    if (result.length > 0) {
      return res.json({ Status: true, Result: result });
    } else {
      return res.json({ Status: false, Error: "User not found" });
    }
  });
});
export default EmployeeRouter;
