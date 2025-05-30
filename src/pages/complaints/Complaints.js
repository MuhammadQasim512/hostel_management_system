import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Dropdown, Button, Table, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify'

export default function Complaints() {
    const [complaints, setComplaints] = useState([]);
    const [selectedcomplaint, setseletedComplaints] = useState(null);
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState("In Process");
    const [searchTerm, setSearchTerm] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [newComplaint, setNewComplaint] = useState({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: ""
    });

    const fetchComplaints = async () => {
        let url;
        let isAdminLoggedIn = JSON.parse(localStorage.getItem("isAdminLoggedIn"));
        if (isAdminLoggedIn) {

            url = `http://127.0.0.1:5000/api/all_complaints`;
        } else {
            const user_id = JSON.parse(localStorage.getItem("user_data")).id;
            url = `http://127.0.0.1:5000/api/complaints?user_id=${user_id}`;
        }
        localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn);
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("response", response)
            setComplaints(response.data.data);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        let url;
        let isAdminLoggedIn = JSON.parse(localStorage.getItem("isAdminLoggedIn"));
        if (isAdminLoggedIn) {

            url = `http://127.0.0.1:5000/api/all_complaints`;
        } else {
            url = `http://127.0.0.1:5000/api/user_complaints`;
        }
        localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn);

        try {
            const token = localStorage.getItem("token")
            newComplaint["user_id"] = JSON.parse(localStorage.getItem("user_data")).id;
            const response = await axios.post(url, newComplaint, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response.data);
            // alert("Complaint added successfully!");
            toast(response.data.message);
            fetchComplaints();
            setShow(false);
            setNewComplaint({ name: "", email: "", subject: "", category: "", message: "" });
        } catch (error) {
            console.error("Error adding complaint:", error);
            alert("Error adding complaint. Please try again.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        let url;
        let isAdminLoggedIn = JSON.parse(localStorage.getItem("isAdminLoggedIn"));
        if (isAdminLoggedIn) {

            url = `http://127.0.0.1:5000/api/complaints`;
        } else {
            url = `http://127.0.0.1:5000/api/complaints`;
        }
        localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn);


        if (!selectedcomplaint) {
            alert("No complaint selected for update.");
            // toast(response.data.message);
            return;
        }
        const updatedData = {
            ...selectedcomplaint,
            status: status,
        };

        try {
            const token = localStorage.getItem("token")
            const res = await axios.put(`${url}/${selectedcomplaint.id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // alert("Complaint updated successfully!");
            toast(res.data.message);
            fetchComplaints();
            setShow(false);
        } catch (error) {
            console.error("Error updating complaint:", error);
            alert("Error updating complaint. Please check the data.");
        }
    };
    const handleDelete = async (complaintId) => {
        let url;
        let isAdminLoggedIn = JSON.parse(localStorage.getItem("isAdminLoggedIn"));
        if (isAdminLoggedIn) {
            url = `http://127.0.0.1:5000/api/complaints`;
        } else {
            url = `http://127.0.0.1:5000/api/complaints`;
        }
        localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn);

        if (!window.confirm("Are you sure you want to delete this complaint?")) return;
        try {
            const token = localStorage.getItem("token")
            const res = await axios.delete(`${url}/${complaintId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast(res.data.message);
            fetchComplaints();
        } catch (error) {
            console.error("Error deleting complaint:", error);
            alert("Error deleting complaint. Please try again.");

        }
    };
    const searchFun = async (event) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/complaints?name=${searchTerm}`);
            setComplaints(Array.isArray(response.data) ? response.data : response.data.data);
            localStorage.setItem("complaints", JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching complaints:", error);
        }
    }
    return (
        <>
            <div style={{ marginTop: '100px', marginLeft: '10px', marginRight: '10px' }}>
                <header className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="m-1 mb-4">Complaints </h4>
                    <div className="d-flex justify-content-end mb-2">
                        <input
                            className="form-control"
                            style={{ marginRight: '5px', width: '300px' }}
                            type="text"
                            placeholder="Search complaint by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={searchFun}

                        />
                        <button className="modal-btn" onClick={() => {
                            setseletedComplaints(null);
                            setNewComplaint({ name: "", email: "", subject: "", category: "", message: "" });
                            setShow(true);
                        }}>
                            Add Complaint
                        </button>
                    </div>
                </header>
                <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
                    <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
                        <Modal.Title>{selectedcomplaint ? "Update Complaint" : "Add Complaint"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={selectedcomplaint ? handleUpdate : handleCreate}>
                            <Form.Group>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter full name"
                                    value={selectedcomplaint ? selectedcomplaint.name : newComplaint.name}
                                    onChange={(e) => selectedcomplaint
                                        ? setseletedComplaints({ ...selectedcomplaint, name: e.target.value })
                                        : setNewComplaint({ ...newComplaint, name: e.target.value })}
                                    required
                                    readOnly={isAdmin}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={selectedcomplaint ? selectedcomplaint.email : newComplaint.email}
                                    onChange={(e) => selectedcomplaint
                                        ? setseletedComplaints({ ...selectedcomplaint, email: e.target.value })
                                        : setNewComplaint({ ...newComplaint, email: e.target.value })}
                                    required
                                    readOnly={isAdmin}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Subject</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter subject"
                                    value={selectedcomplaint ? selectedcomplaint.subject : newComplaint.subject}
                                    onChange={(e) => selectedcomplaint
                                        ? setseletedComplaints({ ...selectedcomplaint, subject: e.target.value })
                                        : setNewComplaint({ ...newComplaint, subject: e.target.value })}
                                    required

                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    value={selectedcomplaint ? selectedcomplaint.category : newComplaint.category}
                                    onChange={(e) =>
                                        selectedcomplaint
                                            ? setseletedComplaints({ ...selectedcomplaint, category: e.target.value })
                                            : setNewComplaint({ ...newComplaint, category: e.target.value })
                                    }
                                >
                                    <option value="">Select Category</option>
                                    <option value="General">General</option>
                                    <option value="Service">Service</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Billing">Billing</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter message"
                                    value={selectedcomplaint ? selectedcomplaint.message : newComplaint.message}
                                    onChange={(e) => selectedcomplaint
                                        ? setseletedComplaints({ ...selectedcomplaint, message: e.target.value })
                                        : setNewComplaint({ ...newComplaint, message: e.target.value })}
                                    required
                                    readOnly={isAdmin}
                                />
                            </Form.Group>
                            {!isAdmin && (
                                <>
                                    {selectedcomplaint && (
                                        <Form.Group>
                                            <Form.Label>Status</Form.Label>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="secondary">{status}</Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {["pending", "resolved", "in-progress", "closed"].map((s) => (
                                                        <Dropdown.Item key={s} onClick={() => setStatus(s)}>{s}</Dropdown.Item>
                                                    ))}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Form.Group>
                                    )}
                                </>
                            )}

                            <Modal.Footer>
                                <Button style={{ backgroundColor: "#ae0000", border: 'none' }} onClick={() => setShow(false)}>Cancel</Button>
                                <Button style={{ backgroundColor: '#299d92', border: 'none' }} type="submit" variant="primary">{selectedcomplaint ? "Update" : "Save"}</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Table striped bordered>
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>#</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Full Name</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Email</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Message</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Status</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Actions</th>


                        </tr>
                    </thead>
                    <tbody>
                        {complaints.length > 0 ? (
                            complaints.map((complaint, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{complaint.name}</td>
                                    <td>{complaint.email}</td>
                                    <td>{complaint.message}</td>
                                    <td>{complaint.status}</td>
                                    <td>
                                        <button className="edit" onClick={() => { setseletedComplaints(complaint); setShow(true); }}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="delete" onClick={() => handleDelete(complaint.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No complaint available</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <ToastContainer />

        </>
    );
}
