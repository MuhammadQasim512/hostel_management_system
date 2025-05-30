import React, { useState } from "react";

export default function ContactUs() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Message Sent by ${formData.name}`);
        setFormData({ name: "", email: "", message: "" }); // Reset form after submission
    };

    return (
        <div className="contact-page">
            <h2 style={{color:'black'}}>Contact Us</h2>
            <div className="contact-container">
                <div className="contact-info">
                    <h3>Get in Touch</h3>
                    <p>📍 Chowk Churtta, Board Office Road, Near Zainab Hospital, Dera Ghazi Khan, Pakistan</p>
                    <p>📞 +92 3285 459 661 </p>
                    <p>📧 contact@Wadanihostel.com</p>
                    {/* Google Map Embed */}
                    <iframe
                        src="https://www.google.com/maps?q=30.0505,70.6332&z=15&output=embed"
                        width="100%"
                        height="200"
                        style={{ border: "0" }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>


                {/* Contact Form */}
                <div className="contact-form">
                    <h3>Send us a Message</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
};


