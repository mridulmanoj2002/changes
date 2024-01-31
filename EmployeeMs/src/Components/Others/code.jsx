EmployeeRouter.post("/leaveapplication", (req, res) => {
    const sql = `INSERT INTO leave_application
    (emp_id, employee_name, goloka_email, number_of_days, type_of_leave, reason, start_date, end_date, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
      req.body.emp_id,
      req.body.employee_name,
      req.body.goloka_email,
      req.body.number_of_days,
      req.body.type_of_leave,
      req.body.reason,
      req.body.start_date,
      req.body.end_date,
      req.body.status,
    ];
  
    con.query(sql, values, async (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
  
      const insertedId = result.insertId; // Get the last inserted ID
      const employeeName = req.body.employee_name; // Get the employee name
  
      // Send Email to Admin1
<<<<<<< HEAD
      const getAdmin1 = "SELECT email FROM admin WHERE roles='admin1'";
=======
      const getAdmin1 = "SELECT email FROM admindetails WHERE roles='admin1'";
>>>>>>> b1e9b61bb2bd06cf0ca55c47529d4a9c2d54128a
      con.query(getAdmin1, async (err, res) => {
        if (err) {
          return res.json({ Status: false, Error: "Failed to fetch Admin1" });
        }
  
        const Admin1email = res[0].email;
  
        const mailOptions = {
          from: "dhananjay@golokait.com", // your Gmail email address
          to: Admin1email, // recipient's email address
          subject: "Admin1 Email",
          text: `This is a test email sent from your application. ${employeeName} has requested leave, and Admin1 has been notified.`,
        };
  
        try {
          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully");
        } catch (error) {
          console.error("Error sending email:", error);
          return res.json({ Status: false, Error: "Failed to send email" });
        }
      });
  
      // Return the last inserted ID and employee name
      return res.json({ Status: true, insertedId, employeeName });
    });
  });
  