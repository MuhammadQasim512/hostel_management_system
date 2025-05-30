import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';

export default function UserManagement() {
    const API_URL = "http://127.0.0.1:5000/api/user_management";

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const LOCAL_STORAGE_KEY = "users";
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        console.log(" [LocalStorage Raw Data]:", storedUsers);

        if (storedUsers.length > 0) {
            setUsers(storedUsers);
        } else {
            fetchUsers();
        }
    }, []);
    //  Fetch Users
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`  // 🔐 Send token in Authorization header
                }
            });
            setUsers(Array.isArray(response.data) ? response.data : response.data.data);
            const fetchedUsers = Array.isArray(response.data) ? response.data : response.data.data;
            if (fetchedUsers.length > 0) {
                setUsers(fetchedUsers);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        console.log("LocalStorage Data:", localStorage.getItem(LOCAL_STORAGE_KEY));
        setUsers(storedUsers);
        fetchUsers();
    }, []);
    //  Edit User Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };
    const handleChange = (e) => {
        setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const updatedUsers = users.map(user => user.id === selectedUser.id ? selectedUser : user);
        try {
            const token = localStorage.getItem("token")
            const res = await axios.put(`${API_URL}/${selectedUser.id}`, selectedUser, {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            toast(res.data.message);
            fetchUsers();
            setShowModal(false);
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Error updating user. Please try again.");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        const updatedUsers = users.filter(user => user.id !== userId);
        try {
            const token = localStorage.getItem("token")
            const res = await axios.delete(`${API_URL}/${userId}`, {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            toast(res.data.message);
            // setShowDeleteModal(false)
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error deleting user. Please try again.");
        }
    };
    const searchFun = async (event) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/user_management?email=${searchTerm}`);
            setUsers(Array.isArray(response.data) ? response.data : response.data.data);
            localStorage.setItem("setUsers", JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching Users:", error);
        }
    }

    return (
        <>
            <div style={{ marginTop: '100px', marginLeft: '10px', marginRight: '10px' }}>
                <header className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className=" m-1 mb-4">User Management</h4>
                    <div className="d-flex justify-content-end mb-2">
                        <input
                            className="form-control"
                            style={{ width: '300px' }}
                            type="text"
                            placeholder="Search user by email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={searchFun}
                        />                    </div>
                </header>
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>#</th>
                            <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Email</th>
                            {/* <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Password</th> */}
                            <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Login time</th>
                            <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Status</th>
                            <th scope="col" style={{ backgroundColor: '#299d92', color: '#fff' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.email}</td>
                                    {/* <td>{user.password}</td> */}
                                    <td>{user.login_time}</td>
                                    <td>{user.status}</td>
                                    <td>
                                        <button className="edit" onClick={() => handleEdit(user)}><i className="fas fa-edit"></i></button>
                                        <button className="delete" onClick={() => handleDelete(user.id)}>
                                            <i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
                        <Modal.Title>Edit User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedUser && (
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" value={selectedUser.email} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="text" name="password" value={selectedUser.password} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Login Time</Form.Label>
                                    <Form.Control type="text" name="login_time" value={selectedUser.login_time} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select name="status" value={selectedUser.status} onChange={handleChange}>
                                        <option value="">Select Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="banned">Banned</option>
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: "#ae0000", border: 'none' }} onClick={() => setShowModal(false)}>Close</Button>
                        <Button style={{ backgroundColor: '#299d92', border: 'none' }} onClick={handleUpdate}>Update</Button>
                    </Modal.Footer>
                </Modal>
                {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} backdrop="static" keyboard={false}>
                    <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this user?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: '#299d92', color: '#fff' }} onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button style={{ backgroundColor: '#ae0000', color: '#fff' }} onClick={handleDelete}>Delete</Button>
                    </Modal.Footer>
                </Modal> */}

            </div>
            <ToastContainer />
        </>
    );
}

