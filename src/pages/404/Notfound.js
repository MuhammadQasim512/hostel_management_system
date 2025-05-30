import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! You tried to access a restricted page. Please login first.</p>
      <Link to="/login" style={{ fontSize: "18px", color: "blue", textDecoration: "underline" }}>
        Go to Login
      </Link>
    </div>
  );
}
