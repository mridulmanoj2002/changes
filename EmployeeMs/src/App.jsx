import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Components/Others/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Superadmin/Dashboard/Dashboard";
import Home from "./Components/Superadmin/Home/Home";
// import HomeAdmin1 from "./Components/Admin1/Home/Home";

import Employee from "./Components/Superadmin/EmployeeTable/EmployeeTable";
import Category from "./Components/Superadmin/Category/Category";
import Profile from "./Components/Employee/Profile/Profile";
import AddCategory from "./Components/Superadmin/Category/AddCategory";
import AddEmployee from "./Components/Superadmin/AddEmployee/AddEmployee";
import EditEmployee from "./Components/Superadmin/EditEmployee/EditEmployee";
import ViewEmployee from "./Components/Superadmin/ViewEmployee/ViewEmployee";
import Start from "./Components/Login";
// import EmployeeLogin from "./Components/Others/EmployeeLogin";
import EmployeeDetail from "./Components/Employee/EmployeeDetail/EmployeeDetail";
import Admin1Dashboard from "./Components/Admin1/Dashboard/Admin1Dashboard";
import Admin1Approved from "./Components/Admin1/Approved/Admin1Approved";
import Admin1DisApproved from "./Components/Admin1/Disapproved/Admin1Disapproved";
import Admin2Dashboard from "./Components/Admin2/Dashboard/Admin2Dashboard";
import Admin2Approved from "./Components/Admin2/Approved/Admin2Approved";
import Admin2DisApproved from "./Components/Admin2/Disapproved/Admin2Disapproved";
import LeaveApplication from "./Components/Employee/Leaveapplication/LeaveApplication";
import AddAdmin from "./Components/Superadmin/AddAdmin/AddAdmin";
import EditAdmin from "./Components/Superadmin/EditAdmin/EditAdmin";
import EmployeeStatus from "./Components/Employee/EmployeeStatus/EmployeeStatus";
import ProtectedRoute from "./pages/ProtectedRoute";

import { AuthProvider } from "./AuthContext/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />}></Route>
          <Route path="/start" element={<Start />}></Route>
          {/* <Route path="/adminlogin" element={<Login />}></Route> */}
          {/* <Route path="/employee_login" element={<EmployeeLogin />}></Route> */}

          <Route
            path="/employee_detail/:id"
            element={
              <ProtectedRoute>
                <EmployeeDetail />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<Profile />}></Route>
            <Route
              path="/employee_detail/:id/leaveapplication"
              element={<LeaveApplication />}
            ></Route>
            <Route
              path="/employee_detail/:id/employee_status"
              element={<EmployeeStatus />}
            ></Route>
          </Route>
          {/* Admin 1  */}
          <Route
            path="/Admin1Dashboard"
            element={
              <ProtectedRoute>
                <Admin1Dashboard />
              </ProtectedRoute>
            }
          ></Route>

          {/* <Route path="" element={<HomeAdmin1 />}></Route> */}
          <Route
            path="/Admin1Approved"
            element={
              <ProtectedRoute>
                <Admin1Approved />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/Admin1Disapproved"
            element={
              <ProtectedRoute>
                <Admin1DisApproved />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/Admin2Dashboard"
            element={
              <ProtectedRoute>
                <Admin2Dashboard />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/Admin2Approved"
            element={
              <ProtectedRoute>
                <Admin2Approved />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/Admin2Disapproved"
            element={
              <ProtectedRoute>
                <Admin2DisApproved />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<Home />}></Route>
            <Route
              path="/dashboard/edit_admin/:id"
              element={<EditAdmin />}
            ></Route>
            <Route path="/dashboard/add_admin" element={<AddAdmin />}></Route>
            <Route path="/dashboard/employee" element={<Employee />}></Route>
            <Route path="/dashboard/category" element={<Category />}></Route>

            <Route
              path="/dashboard/add_category"
              element={<AddCategory />}
            ></Route>
            <Route
              path="/dashboard/add_employee"
              element={<AddEmployee />}
            ></Route>
            <Route
              path="/dashboard/edit_employee/:id"
              element={<EditEmployee />}
            ></Route>
            <Route
              path="/dashboard/view_employee/:id"
              element={<ViewEmployee />}
            ></Route>

            <Route
              path="/dashboard/add_category"
              element={<AddCategory />}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
