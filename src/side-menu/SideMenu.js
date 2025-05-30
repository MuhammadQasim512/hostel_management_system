import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt } from "react-icons/fa";
import { FaBuilding, FaUserGraduate, FaExclamationTriangle, FaCommentDots, FaUsersCog, FaHotel, FaSignOutAlt } from "react-icons/fa";
import avatar from "../avatar.png";
import axios from "axios"; 

export default function SideMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const token = localStorage.getItem("token");
  const [isAdmin, setIsAdmin] = useState(false);
  const user_data = JSON.parse(localStorage.getItem("user_data")) || {};


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1. Call backend logout API
      await axios.post("http://127.0.0.1:5000/api/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 2. Clear localStorage & redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("isAdminLoggedIn");

      navigate("/"); // redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };




  // const handleLogout = () => {
  //   localStorage.removeItem("user_data");
  //   localStorage.removeItem("isAdminLoggedIn");
  //   navigate("/");
  // };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    const adminStatus = JSON.parse(localStorage.getItem("isAdminLoggedIn"))
    setIsAdmin(adminStatus);
  }, [token, navigate]);

  const menuItems = [
    isAdmin && { path: "/dashboard", icon: <FaTachometerAlt />, label: " Dashboard" },
    { path: "/manage-room", icon: <FaBuilding />, label: "Room Allocation" },
    !isAdmin && { path: "/bookhostel", icon: <FaHotel />, label: "Book Hostel" },
    isAdmin && { path: "/manage-students", icon: <FaUserGraduate />, label: "Customer Management" },
    { path: "/complaints", icon: <FaExclamationTriangle />, label: "Complaint " },
    { path: "/feedback", icon: <FaCommentDots />, label: " Feedback" },
    isAdmin && { path: "/user-management", icon: <FaUsersCog />, label: "User Management" },
  ].filter(Boolean);

  return (
    <div className="side-menu">
      <div className="profile-section">
        <img src={avatar} alt="User Avatar" className="profile-image" />
        {isOpen && (
          <div className="profile-text">
            <h6 className="profile-name">{user_data.last_name || "Guest"}</h6>
            <span className="profile-email">{user_data.email || "guest@example.com"}</span>
          </div>
        )}
      </div>
      <hr className="separator" />
      <nav className="menu-list">
        {menuItems.map(({ path, icon, label }) => (
          <Link
            key={path}
            to={token ? path : "/login"}
            className={`menu-item ${location.pathname === path ? "active" : ""}`}
          >
            <div className="menu-icon">
              {icon}
              {!isOpen && <span className="tooltip">{label}</span>}
            </div>
            {isOpen && <span>{label}</span>}
          </Link>
        ))}
      </nav>
      <button className="logout" onClick={handleLogout}>
        <div className="menu-icon">
          <FaSignOutAlt />
        </div>
        <span>Logout</span>
      </button>
    </div>
  );
}

