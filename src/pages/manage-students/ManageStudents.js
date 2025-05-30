import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';

export default function ManageStudents() {
    const API_URL = "http://127.0.0.1:5000/get_students";
    const CREATE_API_URL = "http://127.0.0.1:5000/register_student";
    const UPDATE_API_URL = "http://127.0.0.1:5000/update_student";
    const DE_API_URL = "http://127.0.0.1:5000/delete_student";

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [show, setShow] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // States for modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`  // 🔐 Send token in Authorization header
                }
            });
            setStudents(Array.isArray(response.data) ? response.data : response.data.student_list);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };


    // Form State
    const [studentData, setStudentData] = useState({
        full_name: "",
        room_number: "",
        email: "",
    });

    const handleChange = (e) => {
        setStudentData({ ...studentData, [e.target.name]: e.target.value });
    };

    // Show Add Modal
    const handleShowAddModal = () => {
        setStudentData({ full_name: "", room_number: "", status: "" });
        setShowAddModal(true);
    };

    // Show Edit Modal
    const handleShowEditModal = (student) => {
        console.log("student", student)
        setSelectedStudent(student);
        setStudentData(pre => ({
            ...pre,
            full_name: student.full_name || "",
            room_number: student.room_number || "N/A",
            email: student.
                status || "N/A",
        }))
        setShowEditModal(true)
    };
    // Create (POST)
    const handleCreate = async (e) => {
        e.preventDefault();
        studentData.room_number = parseInt(studentData.room_number);
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post(CREATE_API_URL, studentData, {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            // alert("Student added successfully!");
            toast(res.data.message)
            fetchStudents();
            setShowAddModal(false);
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Error adding student.");
        }
    };
    const handleShow = (student = null) => {
        if (student) {
            setSelectedStudent(student); // Set student for editing
            setStudentData({
                room_number: student.room_number || "",
                seater: student.seater || "",
                fees: student.fees || "",
                food_status: student.food_status || "",
                stay_from: student.stay_from || "",
                duration: student.duration || "",
                room_type: student.room_type || "",
                first_name: student.first_name || "",
                middle_name: student.middle_name || "",
                last_name: student.last_name || "",
                gender: student.gender || "",
                contact_no: student.contact_no || "",
                email: student.email || "",
                address: student.address || "",
                city: student.city || "",
                state: student.state || "",
                zip: student.zip || "",
            });
        } else {
            setSelectedStudent(null); // Reset for adding new student
            setStudentData({
                room_number: "",
                seater: "",
                fees: "",
                food_status: "",
                stay_from: "",
                duration: "",
                room_type: "",
                first_name: "",
                middle_name: "",
                last_name: "",
                gender: "",
                contact_no: "",
                email: "",
                address: "",
                city: "",
                state: "",
                zip: "",
            });
        }
        setShow(true);
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token")
            const res = await axios.put(`${UPDATE_API_URL}/${selectedStudent.student_id}`, studentData, {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            toast(res.data.message)
            fetchStudents();
            setShowEditModal(false);
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Error updating student.");
        }
    };
    const handleDelete = async (student_id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;

        try {
            const token = localStorage.getItem("token")
            const res = await axios.delete(`${DE_API_URL}/${student_id}`, {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            toast(res.data.message)
            fetchStudents(); // Refresh list after delete
        } catch (error) {
            console.error("Error deleting customer:", error);
            alert("Error deleting customer. Please try again.");
        }
    };
    const searchFun = async () => {
        try {
            const response = await axios.get(`${API_URL}?type=${searchTerm}`);
            setStudents(Array.isArray(response.data) ? response.data : response.data.data);
        } catch (error) {
            console.error("Error searching feedbacks:", error);
        }
    };

    return (
        <>
            <div style={{ marginTop: '100px', marginLeft: '10px', marginRight: '10px' }}>
                <header className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="m-1 mb-4">Customer Management</h4>
                    <div className="d-flex justify-content-end mb-2">
                        <input className="form-control " style={{ marginRight: '5px', width: '300px' }}
                            type="text" placeholder="Search customer by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') searchFun(); }}
                        />
                        <button className="modal-btn" onClick={handleShowAddModal}>Add Customer</button>
                    </div>
                </header>

                {/* Add Customer Modal */}
                <Modal show={showAddModal} onHide={() => setShowAddModal(false)} backdrop="static" keyboard={false} className="modal-lg">
                    <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
                        <Modal.Title>Add Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {/* Room Information */}
                            <Form.Group><Form.Label>Room Number</Form.Label><Form.Control type="text" name="room_number" value={studentData.room_number} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>Seater</Form.Label><Form.Control type="text" name="seater" value={studentData.seater} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>Fees</Form.Label><Form.Control type="text" name="fees" value={studentData.fees} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>Food Status</Form.Label><Form.Control type="text" name="food_status" value={studentData.food_status} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>Stay From</Form.Label><Form.Control type="date" name="stay_from" value={studentData.stay_from} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>Duration</Form.Label><Form.Control type="text" name="duration" value={studentData.duration} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>Room Type</Form.Label><Form.Control type="text" name="room_type" value={studentData.room_type} onChange={handleChange} /></Form.Group>

                            {/* Personal Information */}
                            <Form.Group><Form.Label>First Name</Form.Label><Form.Control type="text" name="first_name" value={studentData.first_name} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>Middle Name</Form.Label><Form.Control type="text" name="middle_name" value={studentData.middle_name} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>Last Name</Form.Label><Form.Control type="text" name="last_name" value={studentData.last_name} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>Gender</Form.Label><Form.Control type="text" name="gender" value={studentData.gender} onChange={handleChange} /></Form.Group>

                            {/* Contact Information */}
                            <Form.Group><Form.Label>Contact No</Form.Label><Form.Control type="text" name="contact_no" value={studentData.contact_no} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={studentData.email} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>Address</Form.Label><Form.Control type="text" name="address" value={studentData.address} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>City</Form.Label><Form.Control type="text" name="city" value={studentData.city} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>State</Form.Label><Form.Control type="text" name="state" value={studentData.state} onChange={handleChange} /></Form.Group>
                            <Form.Group><Form.Label>ZIP Code</Form.Label><Form.Control type="text" name="zip" value={studentData.zip} onChange={handleChange} /></Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: "#ae0000", border: 'none' }} onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button style={{ backgroundColor: "#299d92", border: 'none' }} onClick={handleCreate}>Save</Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Student Modal (Small) */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                    <Modal.Header >
                        <Modal.Title>Edit Student</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" name="full_name" value={studentData.full_name} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Room Number</Form.Label>
                                <Form.Control type="text" name="room_number" value={studentData.room_number} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="text" name="email" value={studentData.email} onChange={handleChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: "#ae0000", border: 'none' }} onClick={() => setShowEditModal(false)}>Close</Button>
                        <Button style={{ backgroundColor: '#299d92', border: 'none' }} onClick={handleUpdate}>update</Button>
                    </Modal.Footer>
                </Modal>

                {/* Student List */}
                <table className="table table-striped table-bordered justify-content-center align-items-center">
                    <thead className="table-header">
                        <tr className="heading">
                            <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>#</th>
                            <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Full Name</th>
                            <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Room No.</th>
                            <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>email</th>
                            <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students && students.length > 0 ? (
                            students.map((student, index) => (
                                <tr key={student.student_id}>
                                    <td>{index + 1}</td>
                                    <td>{student.full_name}</td>
                                    <td>{student.room_number}</td>
                                    <td>{student.status}</td>
                                    <td>
                                        <button className="edit" onClick={() => handleShowEditModal(student)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="delete" onClick={() => handleDelete(student.student_id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No customer available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <ToastContainer />
            </div>
        </>
    );
}

