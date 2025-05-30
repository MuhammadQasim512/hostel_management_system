import React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS (Optional, for styling)

export default function Header() {
    return (
        <>
            <nav className="navbar">
                <div className="container"
                    style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#299d92', color: '#fff' }} >
                    <h4>Hostel Management System</h4>
                </div>
            </nav>
        </>
    )
}