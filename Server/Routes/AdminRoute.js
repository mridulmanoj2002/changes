import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Provide your destination folder
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";

const router = express.Router();

router.use(fileUpload());

const jwtSecretKey = "hello"; // Replace with your actual secret key

const uploadData = multer();

router.use(express.urlencoded({ extended: true }));

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

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin where email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.json({ loginStatus: false, Error: "Query error" });
    }

    if (result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err)
          return res.json({ loginStatus: false, Error: "Wrong Password" });
        const email = result[0].email;
        const role = result[0].roles;
        console.log(email, role);
        const token = jwt.sign({ role: role, email: email }, jwtSecretKey, {
          expiresIn: "1d",
        });

        // remove this later;
        console.log("Here is the token for postman =", token);

        res.cookie("token", token);
        return res.json({ loginStatus: true, role });
      });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

router.get("/category", verifyToken, (req, res) => {
  const sql = "SELECT * FROM category";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_category", verifyToken, (req, res) => {
  const sql = "INSERT INTO category (name) VALUES (?)";
  console.log(req.body.name); // This should match the "name" attribute in your form data
  con.query(sql, [req.body.name], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});
// image upload
// Multer middleware setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

router.post("/employee", verifyToken, (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.json({ Status: false, Error: "No file uploaded" });
  }
  const categoryNames = JSON.parse(req.body.categories);

  const image = req.files.image;
  const fileName = `${image.name}_${Date.now()}${path.extname(image.name)}`;

  image.mv(`Public/Images/${fileName}`, (err) => {
    if (err) {
      return res.json({ Status: false, Error: "Failed to upload file" });
    }

    try {
      const categoryNames = JSON.parse(req.body.categories);
    } catch (error) {
      return res.json({
        Status: false,
        Error: "Invalid JSON format for categories",
      });
    }

    const sql = `INSERT INTO employee
      (id, name, mobile_no, personal_email, goloka_email, password, salary, address, image, categories, jobtype, shift_timing, employee_designation,paid_leave,sick_leave)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`;

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) return res.json({ Status: false, Error: "Hashing error" });

      let sickLeaveDays = 0;
      let paidLeaveDays = 0;

      // Check job_type and set leave values accordingly
      if (req.body.job_type === "intern") {
        sickLeaveDays = 6;
        paidLeaveDays = 4;
      } else if (req.body.job_type === "full_time") {
        sickLeaveDays = 12;
        paidLeaveDays = 12;
      }
      console.log(sickLeaveDays, paidLeaveDays);
      const values = [
        req.body.id,
        req.body.name,
        req.body.mobile_no,
        req.body.personal_email,
        req.body.goloka_email,
        hash,
        req.body.salary,
        req.body.address,
        fileName,
        JSON.stringify(categoryNames), // Convert the array back to a JSON string
        req.body.job_type,
        req.body.shift_timing,
        req.body.employee_designation,
        sickLeaveDays,
        paidLeaveDays,
      ];

      con.query(sql, values, (err, result) => {
        if (err) {
          console.log(err);
          return res.json({ Status: false, Error: "Query Error" + err });
        }
        return res.json({ Status: true });
      });
    });
  });
});

router.get("/employee", verifyToken, (req, res) => {
  const sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
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

router.put("/edit_employee/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE employee 
        set name = ?, mobile_no = ?, personal_email = ?, goloka_email = ?, salary = ?, address = ?, category_id = ?, jobtype = ?, shift_timing = ?, employee_designation = ?
        Where id = ?`;
  const values = [
    req.body.name,
    req.body.mobile_no,
    req.body.personal_email,
    req.body.goloka_email,
    req.body.salary,
    req.body.address,
    req.body.category_id,
    req.body.jobtype,
    req.body.shift_timing,
    req.body.employee_designation,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_employee/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "delete from employee where id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/view_employee/:id", verifyToken, (req, res) => {
  const sql = "SELECT*FROM employee WHERE id = ?";
  const id = req.params.id;

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/logout", verifyToken, (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

//Admin2Dashboard
// //Pending List Admin2
// router.get("/getleaves", (req, res) => {
//   const sql = "SELECT * FROM leave_application WHERE status='PaidLeave'";
//   con.query(sql, (err, result) => {
//     if (err) return res.json({ Status: false, error: "Internal Server Error" });
//     return res.json({ Status: true, Result: result });
//   });
// });
// //Pending List Admin2
//Admin2Dashboard
//Pending List Admin2

router.get("/getleaves", verifyToken, (req, res) => {
  const sql = `
  SELECT la.*, e.sick_leave, e.paid_leave
  FROM leave_application la
  JOIN employee e ON la.emp_id = e.id
  WHERE la.status = 'PaidLeave';
`;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, error: "Internal Server Error" });
    return res.json({ Status: true, Result: result });
  });
});

//Approved List Admin2
router.get("/getapproved1", verifyToken, (req, res) => {
  const sql = "SELECT * FROM leave_application WHERE status='Approve1'";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, error: "Internal Server Error" });
    return res.json({ Status: true, Result: result });
  });
});
//Approved List Admin2

//Approve1 Button
// router.post("/approveleave/:EmpLeaveID", (req, res) => {
//   const EmpLeaveID = req.params.EmpLeaveID;
//   const sql =
//     "UPDATE leave_application SET status = 'Approve1' WHERE EmpLeaveID = ?";
//   con.query(sql, [EmpLeaveID], (err, result) => {
//     if (err) {
//       return res.json({ Status: false, Error: "Failed to approve leave" });
//     }

//     return res.json({ Status: true, Message: "Leave approved successfully" });
//   });
// });
// //Approve1 Button
// Approve1 Button

router.post("/approveleave/:EmpLeaveID", verifyToken, async (req, res) => {
  const EmpLeaveID = req.params.EmpLeaveID;
  const getEmailQuery = "SELECT * FROM leave_application WHERE EmpLeaveID = ?";
  con.query(getEmailQuery, [EmpLeaveID], async (err, result) => {
    if (err || result.length === 0) {
      return res.json({
        Status: false,
        Error: "Failed to fetch employee email",
      });
    }
    console.log(result);
    const employeeName = result[0].employee_name;
    const employeeID = result[0].emp_id;
    // Send Email to Admin1
    const getAdmin1 = "SELECT email FROM admin WHERE roles='admin1'";
    con.query(getAdmin1, async (err, admin1Result) => {
      if (err) {
        return res.json({
          Status: false,
          Error: "Failed to fetch Admin2 email",
        });
      }
      const Admin1email = admin1Result[0].email;
      const mailOptions = {
        from: "dhananjay@golokait.com",
        to: Admin1email,
        subject: "Hello Admin 1 A leave has been requested",
        text:
          `This email is sent by your application. To let you know that a leave has been requested by: ` +
          employeeName +
          ` with Employee ID: ` +
          employeeID,
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent Successfully");

        const sql =
          "UPDATE leave_application SET status = 'Approve1' WHERE EmpLeaveID = ?";
        con.query(sql, [EmpLeaveID], (err, updateResult) => {
          if (err) {
            return res.json({
              Status: false,
              Error: "Failed to approve leave",
            });
          }

          return res.json({
            Status: true,
            Message: "Leave approved successfully",
          });
        });
      } catch (error) {
        console.error("Error sending email:", error);
        return res.json({ Status: false, Error: "Failed to send email" });
      }
    });
  });
});

//Approve1 Button

// //Disapprove Button
// router.post("/disapproveleave/:EmpLeaveID", (req, res) => {
//   const EmpLeaveID = req.params.EmpLeaveID;

//   // Assuming your database table has a column named 'status'
//   const sql =
//     "UPDATE leave_application SET status = 'Disapprove1' WHERE EmpLeaveID = ?";
//   con.query(sql, [EmpLeaveID], (err, result) => {
//     if (err) {
//       return res.json({ Status: false, Error: "Failed to approve leave" });
//     }

//     return res.json({ Status: true, Message: "Leave approved successfully" });
//   });
// });
// //Disapprove Button
//Disapprove1 Button

router.post("/disapproveleave/:EmpLeaveID", verifyToken, (req, res) => {
  const EmpLeaveID = req.params.EmpLeaveID;
  const getEmailQuery =
    "SELECT goloka_email FROM leave_application WHERE EmpLeaveID = ?";

  con.query(getEmailQuery, [EmpLeaveID], async (err, result) => {
    if (err || result.length === 0) {
      return res.json({
        Status: false,
        Error: "Failed to fetch employee email",
      });
    }
    const golokaEmail = result[0].goloka_email;
    //Send Email to Employee
    const mailOptions = {
      from: "dhananjay@golokait.com", // your Gmail email address
      to: golokaEmail, // recipient's email address
      subject: "Test Email",
      text: "This is a test email sent from your application To let you know your leave has been Disapproved by Admin 2.",
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      return res.json({ Status: false, Error: "Failed to send email" });
    }

    const sql =
      "UPDATE leave_application SET status = 'Disapprove1' WHERE EmpLeaveID = ?";
    con.query(sql, [EmpLeaveID], (err, result) => {
      if (err) {
        return res.json({ Status: false, Error: "Failed to approve leave" });
      }
    });
    return res.json({ Status: true, Message: "Leave approved successfully" });
  });
});

//DisapprovedList
router.get("/getdisapproved1", verifyToken, (req, res) => {
  const sql = "SELECT * FROM leave_application WHERE status='Disapprove1'";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, error: "Internal Server Error" });
    return res.json({ Status: true, Result: result });
  });
});
//DisapprovedList

//Admin2Dashboard

//Pending List Admin1
router.get("/getleaves1", verifyToken, (req, res) => {
  const sql = `
  SELECT la.*, e.sick_leave, e.paid_leave
  FROM leave_application la
  JOIN employee e ON la.emp_id = e.id
  WHERE la.status = 'Approve1';
`;
  console.log("SQL Query:", sql);
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, error: "Internal Server Error" });
    return res.json({ Status: true, Result: result });
  });
});
//Pending

//Pending List Admin1
router.get("/getleaves1", verifyToken, (req, res) => {
  const sql = "SELECT * FROM leave_application WHERE status='Approve1'";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, error: "Internal Server Error" });
    return res.json({ Status: true, Result: result });
  });
});

//Pending List Admin1
//Approve Button
// router.post("/approveleave2/:EmpLeaveID", async (req, res) => {
//   const EmpLeaveID = req.params.EmpLeaveID;
//   //Getting the goloka email
//   const getEmailQuery =
//     "SELECT goloka_email FROM leave_application WHERE EmpLeaveID = ?";
//   con.query(getEmailQuery, [EmpLeaveID], async (err, result) => {
//     if (err || result.length === 0) {
//       return res.json({
//         Status: false,
//         Error: "Failed to fetch employee email",
//       });
//     }
//     const golokaEmail = result[0].goloka_email;
//     const numberofdays = result[0].number_of_days;
//     const EmployeeID = result[0].emp_id;
//     const values = [numberofdays, EmployeeID];
//     //Send Email to Employee
//     const mailOptions = {
//       from: "dhananjay@golokait.com", // your Gmail email address
//       to: golokaEmail, // recipient's email address
//       subject: "Test Email",
//       text: "This is a test email sent from your application To let you know your leave has been approved.",
//     };
//     try {
//       await transporter.sendMail(mailOptions);
//       console.log("Email sent successfully");
//     } catch (error) {
//       console.error("Error sending email:", error);
//       return res.json({ Status: false, Error: "Failed to send email" });
//     }
//     //Send Email to Admin2
//     const getAdmin2 = "SELECT email FROM admin WHERE roles='admin2'";
//     con.query(getAdmin2, async (err, res) => {
//       if (err) {
//         return res.json({ Status: false, Error: "Failed to fetch Admin2" });
//       }
//       // return res.json({ Status: true, Message: "Leave approved successfully of "+golokaEmail });

//       const Admin2email = res[0].email;
//       const mailOptions = {
//         from: "dhananjay@golokait.com", // your Gmail email address
//         to: Admin2email, // recipient's email address
//         subject: "Admin2 Email",
//         text:
//           "This is a test email sent from your application To let you know that you Admin2 have approved the  leave of " +
//           golokaEmail,
//       };
//       try {
//         await transporter.sendMail(mailOptions);
//         console.log("Email sent successfully");
//       } catch (error) {
//         console.error("Error sending email:", error);
//         return res.json({ Status: false, Error: "Failed to send email" });
//       }
//     });

//     //Send Email to Admin1
//     const getAdmin1 = "SELECT email FROM admin WHERE roles='admin1'";
//     con.query(getAdmin1, async (err, res) => {
//       if (err) {
//         return res.json({ Status: false, Error: "Failed to fetch Admin1" });
//       }
//       // return res.json({ Status: true, Message: "Leave approved successfully of "+golokaEmail });

//       const Admin1email = res[0].email;
//       const mailOptions = {
//         from: "dhananjay@golokait.com", // your Gmail email address
//         to: Admin1email, // recipient's email address
//         subject: "Admin1 Email",
//         text:
//           "This is a test email sent from your application To let you know that you Admin1 have approved the  leave of " +
//           golokaEmail,
//       };
//       try {
//         await transporter.sendMail(mailOptions);
//         console.log("Email sent successfully");
//       } catch (error) {
//         console.error("Error sending email:", error);
//         return res.json({ Status: false, Error: "Failed to send email" });
//       }
//     });

//     // Update leave status
//     const updateQuery =
//       "UPDATE leave_application SET status = 'Approve' WHERE EmpLeaveID = ?";
//     con.query(updateQuery, [EmpLeaveID], async (err, result) => {
//       if (err) {
//         return res.json({ Status: false, Error: "Failed to approve leave" });
//       }
//       // return res.json({ Status: true, Message: "Leave approved successfully of "+golokaEmail });
//     });
//     return res.json({ Status: true, Message: "sent email to" + golokaEmail });
//   });
// });

//Approve Button
router.post("/approveleave2/:EmpLeaveID", verifyToken, async (req, res) => {
  const EmpLeaveID = req.params.EmpLeaveID;
  //Getting the goloka email
  const getEmailQuery = "SELECT * FROM leave_application WHERE EmpLeaveID = ?";
  con.query(getEmailQuery, [EmpLeaveID], async (err, result) => {
    if (err || result.length === 0) {
      return res.json({
        Status: false,
        Error: "Failed to fetch employee email",
      });
    }
    const golokaEmail = result[0].goloka_email;
    const numberofdays = result[0].number_of_days;
    const EmployeeID = result[0].emp_id;
    const values = [numberofdays, EmployeeID];
    //Send Email to Employee
    const mailOptions = {
      from: "dhananjay@golokait.com", // your Gmail email address
      to: golokaEmail, // recipient's email address
      subject: "Test Email",
      text: "This is a test email sent from your application To let you know your leave has been approved.",
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      return res.json({ Status: false, Error: "Failed to send email" });
    }
    // Update leave status
    const updateQuery =
      "UPDATE leave_application SET status = 'Approve' WHERE EmpLeaveID = ?";
    con.query(updateQuery, [EmpLeaveID], async (err, result) => {
      if (err) {
        return res.json({ Status: false, Error: "Failed to approve leave" });
      }
      // return res.json({ Status: true, Message: "Leave approved successfully of "+golokaEmail });

      const sqlUpdatePaidLeave =
        "UPDATE employee SET paid_leave = paid_leave - ? WHERE id = ?";
      con.query(sqlUpdatePaidLeave, values, (err, result) => {
        if (err) {
          console.error("Error while Deducting Paid Leave: ", err);
          return res.json({
            Status: false,
            Error: "Failed to Deduct Paid Leave",
          });
        }
        return res.json({
          Status: true,
          Error: "Sucessfully Deducted Paid Leave",
        });
      });
    });
  });
});
//Approve Button

//Approved List Admin
router.get("/getapproved", verifyToken, (req, res) => {
  const sql = "SELECT * FROM leave_application WHERE status='Approve'";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, error: "Internal Server Error" });
    return res.json({ Status: true, Result: result });
  });
});
//Approved List Admin

//Disapprove Button
router.post("/disapproveleave2/:EmpLeaveID", verifyToken, (req, res) => {
  const EmpLeaveID = req.params.EmpLeaveID;
  const getEmailQuery =
    "SELECT goloka_email FROM leave_application WHERE EmpLeaveID = ?";

  con.query(getEmailQuery, [EmpLeaveID], async (err, result) => {
    if (err || result.length === 0) {
      return res.json({
        Status: false,
        Error: "Failed to fetch employee email",
      });
    }
    const golokaEmail = result[0].goloka_email;
    //Send Email to Employee
    const mailOptions = {
      from: "dhananjay@golokait.com", // your Gmail email address
      to: golokaEmail, // recipient's email address
      subject: "Test Email",
      text: "This is a test email sent from your application To let you know your leave has been Disapproved.",
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      return res.json({ Status: false, Error: "Failed to send email" });
    }
    //Send Email to Admin2
    const getAdmin2 = "SELECT email FROM admin WHERE roles='admin2'";
    con.query(getAdmin2, async (err, res) => {
      if (err) {
        return res.json({ Status: false, Error: "Failed to fetch Admin2" });
      }
      // return res.json({ Status: true, Message: "Leave approved successfully of "+golokaEmail });

      const Admin2email = res[0].email;
      const mailOptions = {
        from: "dhananjay@golokait.com", // your Gmail email address
        to: Admin2email, // recipient's email address
        subject: "Admin2 Email",
        text:
          "This is a test email sent from your application To let you know that you Admin2 have Disapproved the  leave of " +
          golokaEmail,
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error);
        return res.json({ Status: false, Error: "Failed to send email" });
      }
    });

    //Send Email to Admin1
    const getAdmin1 = "SELECT email FROM admin WHERE roles='admin1'";
    con.query(getAdmin1, async (err, res) => {
      if (err) {
        return res.json({ Status: false, Error: "Failed to fetch Admin1" });
      }
      // return res.json({ Status: true, Message: "Leave approved successfully of "+golokaEmail });

      const Admin1email = res[0].email;
      const mailOptions = {
        from: "dhananjay@golokait.com", // your Gmail email address
        to: Admin1email, // recipient's email address
        subject: "Admin1 Email",
        text:
          "This is a test email sent from your application To let you know that you Admin1 have Disapproved the  leave of " +
          golokaEmail,
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error);
        return res.json({ Status: false, Error: "Failed to send email" });
      }
    });

    // Update leave status
    const updateQuery =
      "UPDATE leave_application SET status = 'Dispprove' WHERE EmpLeaveID = ?";
    con.query(updateQuery, [EmpLeaveID], async (err, result) => {
      if (err) {
        return res.json({ Status: false, Error: "Failed to approve leave" });
      }
      // return res.json({ Status: true, Message: "Leave approved successfully of "+golokaEmail });
    });
    return res.json({ Status: true, Message: "sent email to" + golokaEmail });
  });
});
//Disapprove Button

//DisapprovedList
router.get("/getdisapproved", verifyToken, (req, res) => {
  const sql = "SELECT * FROM leave_application WHERE status='Disapprove'";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, error: "Internal Server Error" });
    return res.json({ Status: true, Result: result });
  });
});
//DisapprovedList

//Admin1Dashboard

//TRY
//Sender Email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dhananjay@golokait.com",
    pass: "rkaqxuocemurivul",
  },
});
//Sender Email

router.get("/admin_count", verifyToken, (req, res) => {
  const sql = "select count(id) as admin from admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee_count", verifyToken, (req, res) => {
  const sql = "select count(id) as employee from employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/salary_count", verifyToken, (req, res) => {
  const sql = "select sum(salary) as salary from employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin_records", verifyToken, (req, res) => {
  const sql = "select * from admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM admin WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Status: false, Error: "Query Error" });
    }

    if (result.length > 0) {
      return res.json({ Status: true, Result: result });
    } else {
      return res.json({ Status: false, Error: "Admin not found" });
    }
  });
});

router.put("/edit_admins/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE admin SET roles = ? WHERE id = ?";
  const values = [req.body.roles, id];

  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_admin/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "delete from admin where id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_admin", verifyToken, uploadData.any(), (req, res) => {
  const sql = `INSERT INTO admin 
    (email,password,roles) 
    VALUES (?)`;
  console.log(req.body.email);
  bcrypt.hash(req.body.password, 14, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    const values = [req.body.email, hash, req.body.roles];
    con.query(sql, [values], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ Status: false, Error: err });
      }
      return res.json({ Status: true });
    });
  });
});
export default router;
