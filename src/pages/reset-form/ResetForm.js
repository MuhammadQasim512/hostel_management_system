
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ResetForm() {
    const [email, setEmail] = useState(""); // Default is password

    const handleEmailChange = (e) => {
        setEmail(e.target.value); // Update the reset type
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        if (email) {
            // Handle the reset logic here (e.g., call an API)
            console.log("Email for reset:", email);
        } else {
            console.log("Please enter a valid email.");
        }

    };

    return (
        <div className="reset-form">
            <div className="reset-content">
                <h3>Reset Email</h3>
                <div className="reset-options">
                    <span>Email:</span>
                    <input
                        type="text"
                        value={email}
                        placeholder="Enter your email"
                        onChange={handleEmailChange}
                    />

                </div>
                <button className="reset" onClick={handleSubmit}>Reset</button>
                <button className="login"> <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>login </Link></button>
            </div>
        </div>
    );
}
