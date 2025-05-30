import React from "react";
import about from "./../pic/about/about.PNG";


export default function About() {
    return (
        <div className="about-page">
            <h2 className="text-center mt-2" style={{ marginLeft:'2rem', marginTop:'10px',}}>About Our Hostel</h2>
            <div className="about-container">
                <img src={about} alt="Hostel Building" className="about-image" />

                <div className="about-text">
                    <p>
                        Welcome to <strong>Sunrise Hostel</strong>, a premium accommodation facility for students and working professionals.
                        We provide a safe, comfortable, and friendly environment with modern amenities.
                    </p>

                    <h3>Our Facilities:</h3>
                    <ul>
                        <li>✅ Spacious and Well-Furnished Rooms</li>
                        <li>✅ High-Speed WiFi</li>
                        <li>✅ 24/7 Security with CCTV</li>
                        <li>✅ Healthy & Hygienic Food</li>
                        <li>✅ Laundry & Housekeeping Services</li>
                        <li>✅ Recreational & Study Areas</li>
                    </ul>

                    <h3>Our Mission</h3>
                    <p>
                        Our mission is to create a **home away from home** for students, providing them with a supportive and
                        conducive environment for academic and personal growth.
                    </p>
                </div>
            </div>
        </div>
    );
};


