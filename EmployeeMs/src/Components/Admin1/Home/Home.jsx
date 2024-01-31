// import React, { useState, useEffect } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { Table, Input, Button, Space, Pagination } from "antd";
// import axios from "axios";
// import moment from "moment";  // Import moment
// import "./Home.css";

// const Home = () => {
//   const [employeeData, setEmployeeData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [pageNumber, setPageNumber] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/auth/getleaves1")
//       .then((response) => {
//         if (response.data.Status) {
//           const formattedData = response.data.Result.map((employee) => ({
//             ...employee,
//             start_date: moment(employee.start_date).format("YYYY-MM-DD"),
//             end_date: moment(employee.end_date).format("YYYY-MM-DD"),
//           }));
//           setEmployeeData(formattedData);
//         } else {
//           alert(response.data.Error);
//         }
//       })
//       .catch((error) => {
//         console.error("Error while retrieving data:", error);
//       });
//   }, []);

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPageNumber(1);
//   };

//   const filteredData = employeeData
//     .filter((employee) =>
//       Object.values(employee).some((value) =>
//         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     )
//     .slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);

//   const columns = [
//     {
//       title: "EmpID",
//       dataIndex: "emp_id",
//       key: "emp_id",
//       align: "center",
//       width: 10, // Set a specific width for the EmpID column

//     },
//     {
//       title: "Name",
//       dataIndex: "employee_name",
//       key: "employee_name",
//       align: "center",
//     },
//     {
//       title: "Sick Leaves Remaining",
//       dataIndex: "sick_leaves_remaining",
//       key: "sick_leaves_remaining",
//       align: "center",
//       width: 20, // Set a specific width for the EmpID column

//     },
//     {
//       title: "Paid Leaves Remaining",
//       dataIndex: "paid_leaves_remaining",
//       key: "paid_leaves_remaining",
//       align: "center",
//       width: 70, // Set a specific width for the EmpID column


//     },
//     {
//       title: "Number Of Days",
//       dataIndex: "number_of_days",
//       key: "number_of_days",
//       align: "center",
//       width: 70, // Set a specific width for the EmpID column

//     },
//     {
//       title: "Start Date",
//       dataIndex: "start_date",
//       key: "start_date",
//       align: "center",
//       width: 100, // Set a specific width for the EmpID column

//     },
//     {
//       title: "End Date",
//       dataIndex: "end_date",
//       key: "end_date",
//       align: "center",
//       width: 100, // Set a specific width for the EmpID column

//     },
//     {
//       title: "Actions",
//       key: "actions",
//       align: "center",
//       render: (text, record) => (
//         <Space size="middle">
//           <Button
//             type="primary"
//             onClick={() => approveleave(record.EmpLeaveID)}
//           >
//             Approve
//           </Button>
//           <Button
//             style={{ backgroundColor: "red", color: "white" }}
//             type="danger"
//             onClick={() => disapproveleave(record.EmpLeaveID)}
//           >
//             Disapprove
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   const handlePageChange = (page) => {
//     setPageNumber(page);
//   };

//   return (
//     <div style={{ backgroundColor: "#dddddd",height:"100%" }}className="container-fluid">
//       <div className="col p-0 m-0">
//         <h4 style={{ textAlign: "center", marginBottom: "20px" }}>
//           Admin1 Dashboard
//         </h4>
//         <div className="table1">
//           <div className="header" style={{ marginBottom: "10px" }}>
//             <Input.Search
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//           </div>
//           <div  style={{marginLeft:"6vw" ,width:"82vw"}} className="table-container">
//             <Table
//               dataSource={filteredData}
//               columns={columns}
//               pagination={false}
//               bordered
//               size="middle"
//             />
//           </div>
//           {employeeData.length > 0 && (
//             <div className="paginate" style={{ marginTop: "20px" }}>
//               <Pagination
//                 current={pageNumber}
//                 total={employeeData.length}
//                 pageSize={itemsPerPage}
//                 onChange={handlePageChange}
//                 showSizeChanger={false}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
