import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Auth/login";
import Register from "./Auth/Register";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/reset-password";
import Dashboard from "./DashBoard/Dashboard";
import EmployeeManagementPage from "./Employee/Employee";
import AttendanceManagementPage from "./Employee/Attendance";
import PayrollPage from "./Employee/Payroll";
import LeaveTrackingPage from "./Employee/LeaveTracking";

function App() {
  const storedAuthToken = localStorage.getItem("authToken");
  const storedUserType = localStorage.getItem("loggedInUserType");

  const isAdminAuthenticated = () => {
    return true;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* employee management */}
        <Route
          path="/employee"
          element={
            isAdminAuthenticated() ? (
              <EmployeeManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/attendance" element={<AttendanceManagementPage />} />
        <Route
          path="/payroll"
          element={
            isAdminAuthenticated() ? <PayrollPage /> : <Navigate to="/" />
          }
        />
        <Route path="/leaveTracking" element={<LeaveTrackingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
