import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import "./sass/Main.scss";
import SideMenu from "./side-menu/SideMenu";
import Setting from "./pages/setting/Setting";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import ResetForm from "./pages/reset-form/ResetForm";
import UpdateForm from "./pages/update-form/UpdateForm";
import ManageRoom from "./pages/manage-room/ManageRoom";
import ManageStudents from "./pages/manage-students/ManageStudents";
import Complaints from "./pages/complaints/Complaints";
import Feedback from "./pages/feedback/Feedback";
import UserManagement from "./pages/user-management/UserManagement";
import BookHostel from "./pages/bookhostel/BookHostel";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Website from "./pages/website/Website";
import NotFound from "./pages/404/Notfound";
import Home from "./pages/home/Home";

export default function App() {

  const [isAdmin, setIsAdmin] = useState(() => {
    return JSON.parse(localStorage.getItem("isAdminLoggedIn"));
  });


  useEffect(() => {
    console.log("isAdmin", isAdmin)
  }, []);

  const location = useLocation();
  const url = location.pathname.split("/")[1];
  console.log("User is on:", location.pathname);
  const isLoggedIn = localStorage.getItem("user_data") !== null;

  const protectedRoutes = [
    "manage-room",
    "manage-students",
    "complaints",
    "feedback",
    "user-management",
    "bookhostel",
    "setting",
    "dashboard"
  ];

  if (!isLoggedIn && protectedRoutes.includes(url)) {
    return <Navigate to="/404" />;
  }

  /* 
  yahan pay check karna hay if else laga kar ager localstorage main jo value hum login pay set karwa rahay hain wo 
  hay to us route pay jaey nahi to 404 ka page laey ay
  */


  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-form" element={<ResetForm />} />
        <Route path="/update-form" element={<UpdateForm />} />
        <Route path="/404" element={<NotFound />} />

        {/* Sirf admin login hone par SideMenu show hoga */}
        {/* {isAdmin && ( */}
        <Route
          path="/*"
          element={
            <div className="main-content" style={{ display: "flex" }}>
              {/* Left Side - Side Menu */}
              <div className="left-side" style={{ width: "18%" }}>
                <SideMenu />
              </div>

              {/* Right Side - Pages */}
              <div className="right-side" style={{ width: "82%" }}>
                <h3
                  style={{
                    textAlign: "center",
                    backgroundColor: "#299d92",
                    color: "#fff",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Hostel Management System
                </h3>
                <div style={{ maxHeight: "550px", overflowY: "auto" }}>
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/manage-room" element={<ManageRoom />} />
                    <Route path="/manage-students" element={<ManageStudents />} />
                    <Route path="/complaints" element={<Complaints />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/user-management" element={<UserManagement />} />
                    <Route path="/bookhostel" element={<BookHostel />} />
                    <Route path="/setting" element={<Setting />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </div>
          }
        />
        
      </Routes>
    </>
  );
}
