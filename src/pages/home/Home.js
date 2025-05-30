// src/pages/Home.js
import React, { useState } from "react";
import Slider from "react-slick";

import Room from "../room/Room";
import Service from "../service/Service";
import About from "../about/About";
import ContactUs from "../contact/ContactUs";
import Footer from "../footer/Footer";
import room1 from "./../pic/home/room1.PNG";
import food from "./../pic/home/food.PNG";
import freeWifi from "./../pic/home/freeWifi.PNG";
import security from "./../pic/home/security.PNG";
import zero from "./../pic/home/zero.png";
import hostelroompic from "./../pic/home/hostelroompic.PNG";
import hostelroompc from "./../pic/home/hostelroompc.PNG";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from "react-router-dom";
export default function Home() {

    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        appendDots: dots => (
            <div>
                <ul style={{
                    margin: "0px", padding: "0px"
                }}> {dots} </ul>
            </div>
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            }
        ]
    };
    return (
        <>
            <div style={{ overflowY: "auto", height: '100vh' }}>
                <nav className="navbar">
                    <div className="logo">🏠 Hostel</div>
                    <ul className={isOpen ? "nav-links open" : "nav-links"}>
                        <li onClick={() => scrollToSection("home")}>Home</li>
                        <li onClick={() => scrollToSection("room")}>Room</li>
                        <li onClick={() => scrollToSection("service")}>Services</li>
                        <li onClick={() => scrollToSection("about")}>About</li>
                        <li onClick={() => scrollToSection("contact")}>Contact Us</li>
                    </ul>
                    <div className="auth-links">
                        <button className="login-btn">
                            <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>
                                Sign in</Link></button>
                        <button className="signup-btn">
                            <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>
                                Sign Up</Link></button>
                    </div>
                </nav>

                <div className="home">
                    <div className="full-width-carousel">
                        <Slider {...settings}>
                            <div className="full-width-slide">
                                <img src={zero}
                                    alt="Slide 1"
                                    className="slide-image" />
                            </div>
                            <div className="full-width-slide">
                                <img src={hostelroompic}
                                    alt="Slide 2"
                                    className="slide-image" />
                            </div>
                            <div className="full-width-slide">
                                <img src={hostelroompc}
                                    alt="Slide 3"
                                    className="slide-image" />
                            </div>
                        </Slider>
                    </div>

                    {/* Text Section */}
                    <div className="hero-text">
                        <p>Safe, Comfortable, and Affordable Living for Students.</p>
                        <button className="cta-button">Book Now</button>
                    </div>
                </div>
                {/* Features Section */}
                <section id="features" className="features">
                    <div className="feature">
                        <img src={room1} alt="Room" />
                        <h3> Spacious Rooms</h3>
                        <p>Well-furnished rooms with all necessary amenities.</p>
                    </div>
                    <div className="feature">
                        <img src={security} alt="Security" />
                        <h3>  Security</h3>
                        <p>Safe environment with CCTV surveillance.</p>
                    </div>
                    <div className="feature">
                        <img src={food} alt="Food" />
                        <h3> Healthy Food</h3>
                        <p>Nutritious meals served daily.</p>
                    </div>
                    <div className="feature">
                        <img src={freeWifi} alt="WiFi" />
                        <h3> Free WiFi</h3>
                        <p>High-speed internet available throughout the hostel.</p>
                    </div>
                </section>
                <div id="room">
                    <Room />
                </div>
                <div id="service">
                    <Service />
                </div>
                <div id="about">
                    <About />
                </div>
                <div id="contact">
                    <ContactUs />
                </div>
                <Footer />
            </div>

        </>
    );
};


