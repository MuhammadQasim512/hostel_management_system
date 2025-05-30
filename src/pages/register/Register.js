import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Spinner, Alert, Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import backgroundimage from "./../pic/about/backgroundimage.PNG";

export default function Register() {
    const API_URL = "http://127.0.0.1:5000/api/register"; // Backend API URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        gender: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const validateForm = () => {
        const { first_name, last_name, gender, contact_number, email, password } = formData;
        if (!first_name || !last_name || !gender || !contact_number || !email || !password) {
            setError("All fields are required (Middle name is optional)!");
            return false;
        }
        if (!email.includes("@")) {
            setError("Invalid email format!");
            return false;
        }
        if (contact_number.length !== 11 || isNaN(contact_number)) {
            setError("Contact number must be 11 digits!");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters!");
            return false;
        }
        setError("");
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            formData.contact_number = parseInt(formData.contact_number);
            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage("Registration successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 800);
            } else {
                setError(response.data.message || "Registration failed!");
            }
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page d-flex align-items-center justify-content-center"
            style={{ backgroundImage: `url(${backgroundimage})`, minHeight: "100vh", backgroundSize: "cover" }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="p-4 shadow-lg bg-light">
                            <Card.Body>
                                <h3 className="text-center mb-4">Register</h3>
                                <Form onSubmit={handleRegister}>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control type="text"
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    placeholder="Enter your first name"
                                                    onChange={handleChange} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Middle Name (Optional)</Form.Label>
                                                <Form.Control type="text"
                                                    name="middle_name"
                                                    value={formData.middle_name}
                                                    placeholder="Enter your middle name"
                                                    onChange={handleChange} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control type="text"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    placeholder="Enter your last name"
                                                    onChange={handleChange} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Gender</Form.Label>
                                                <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </Form.Select>
                                            </Form.Group>

                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Contact Number</Form.Label>
                                                <Form.Control type="tel" name="contact_number" value={formData.contact_number} placeholder="Enter your contact number" onChange={handleChange} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" name="email" value={formData.email} placeholder="Enter your email" onChange={handleChange} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" name="password" value={formData.password} placeholder="Enter your password" onChange={handleChange} />
                                    </Form.Group>
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                                    
                                    <Button style={{ backgroundColor: "#299d92" , border:'none' }}  className="w-100" type="submit" disabled={loading}>
                                        {loading ? <Spinner animation="border" size="sm" /> : "Register"}
                                    </Button>
                                </Form>
                                <p className="text-center mt-3">Already have an account? <Link to="/login" style={{ color: "#299d92", fontWeight:'bold'  }} >Login</Link></p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}















// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// export default function Register() {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phoneNumber, setPhoneNumber] = useState("");
//     const [password, setPassword] = useState("");

//     return (
//         <div className="register">
//             <div className="register-content">
//                 <h3>Register</h3>

//                 <label>Name:</label>
//                 <input
//                     type="text"
//                     value={name}
//                     placeholder="Enter your name"
//                     onChange={(e) => setName(e.target.value)}
//                 />

//                 <label>Email:</label>
//                 <input
//                     type="email"
//                     value={email}
//                     placeholder="Enter your email"
//                     onChange={(e) => setEmail(e.target.value)}
//                 />

//                 <label>Phone Number:</label>
//                 <input
//                     type="tel"
//                     value={phoneNumber}
//                     placeholder="Enter your phone number"
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                 />

//                 <label>Password:</label>
//                 <input
//                     type="password"
//                     value={password}
//                     placeholder="Enter your password"
//                     onChange={(e) => setPassword(e.target.value)}
//                 />

//                 <button className="register-btn">Register</button>

//                 <p className="login-link">
//                     Already have an account? <Link to="/login">Login</Link>
//                 </p>
//             </div>
//         </div>
//     );
// }



