import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify'

export default function ManageRoom() {
    const API_URL = "http://127.0.0.1:5000/api/room";

    const [show, setShow] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [selectedRoomnumber, setSelectedRoomnumber] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);

    const [roomData, setRoomData] = useState({
        capacity: "",
        per_day: "",
        per_week: "",
        per_month: "",
        room_number: "",
        room_type: "",
        status: "",
        available_seats: "",
    });
    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(API_URL
                , {
                    headers: {
                        Authorization: `Bearer ${token}`  // 🔐 Send token in Authorization header
                    }
                }
            );
            setRooms(Array.isArray(response.data) ? response.data : response.data.data);
            localStorage.setItem("rooms", JSON.stringify(roomData));
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };
    useEffect(() => {
        fetchRooms();
        const adminStatus = JSON.parse(localStorage.getItem("isAdminLoggedIn"));
        setIsAdmin(adminStatus);
    }, []);

    const handleChange = (e) => {
        setRoomData({ ...roomData, [e.target.name]: e.target.value });
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            roomData.capacity = parseInt(roomData.capacity);
            roomData.per_day = parseInt(roomData.per_day);
            roomData.per_week = parseInt(roomData.per_week);
            roomData.per_month = parseInt(roomData.per_month);
            const token = localStorage.getItem("token")
            const response = await axios.put(`${API_URL}/${selectedRoomnumber}`, roomData, {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            console.log(response.data)
            
            toast(response.data.message);
            fetchRooms();
            setShow(false);
            resetForm();
        } catch (error) {
            const respo = console.error("Error updating room:", error);
            toast(respo.data.message);
            const res = alert("Error updating room. Please check the data.");
            toast(res.data.message);
        }
    };
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(API_URL, roomData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast(response.data.message);
            fetchRooms();
            setShow(false);
            resetForm();
        } catch (error) {
            console.error("Error adding room:", error);
            alert("Error adding room. Please check the data.");
        }
    };
    const resetForm = () => {
        setSelectedRoomnumber(null);
        setRoomData({
            capacity: "",
            per_day: "",
            per_week: "",
            per_month: "",
            room_number: "",
            room_type: "",
            available_seats: "",
            status: "available",
        });
    };
    const handleEdit = (room) => {
        setSelectedRoomnumber(room.room_number);
        setRoomData({
            ...room,
            status: room.status || "available",
        });
        setTimeout(() => setShow(true), 0);
    };

    const handleDelete = async (room_number) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            const token = localStorage.getItem("token")
            const res = await axios.delete(`${API_URL}/${room_number}`, {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            toast(res.data.message);
            setShowDeleteModal(false);
            fetchRooms();
        } catch (error) {
            const resp = console.error("Error deleting room:", error);
            toast(resp.data.message);
            const res = alert("Error deleting room. Please try again.");
            toast(res.data.message);

        }
    };

    const searchFun = async (event) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/room?search=${searchTerm}`);
            setRooms(Array.isArray(response.data) ? response.data : response.data.data);
            localStorage.setItem("rooms", JSON.stringify(roomData));
        } catch (error) {
            const res = console.error("Error fetching rooms:", error);
            toast(res.data.message);

        }
    }

    return (
        <>

            <div style={{ marginTop: '100px', marginLeft: '10px', marginRight: '10px' }}>
                <header className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="m-1 mb-4">Room Allocation</h4>
                    <div className="d-flex justify-content-end mb-2">
                        <input className="form-control" style={{ marginRight: '5px', width: '300px' }} type="text"
                            placeholder="Search room by number"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={searchFun}
                        />

                        {isAdmin && (
                            <button className="modal-btn" onClick={() => setShow(true)}>
                                Add Room
                            </button>
                        )}
                    </div>
                </header>

                {/* Room Add/Edit Modal */}
                <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
                    <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
                        <Modal.Title>{selectedRoomnumber ? "Update Room" : "Add Room"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={selectedRoomnumber ? handleUpdate : handleCreate}>
                            <Form.Group>
                                <Form.Label>Room Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="room_number"
                                    value={roomData.room_number}
                                    onChange={handleChange}
                                    placeholder="Enter room number" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Type</Form.Label>
                                <Form.Control
                                    type="text" name="room_type"
                                    value={roomData.room_type}
                                    onChange={handleChange}
                                    placeholder="Enter room type" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Capacity</Form.Label>
                                <Form.Control
                                    type="number" name="capacity"
                                    value={roomData.capacity}
                                    onChange={handleChange}
                                    placeholder="Enter room capacity" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Daily Rate</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="per_day"
                                    value={roomData.per_day}
                                    onChange={handleChange}
                                    placeholder="Enter daily fee" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Weekly Rate</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="per_week"
                                    value={roomData.per_week}
                                    onChange={handleChange}
                                    placeholder="Enter weekly fee" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Monthly Rate</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="per_month"
                                    value={roomData.per_month}
                                    onChange={handleChange}
                                    placeholder="Enter monthly fee" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select name="status" value={roomData.status} onChange={handleChange}>
                                    <option value="" disabled selected>Select Status</option>                                    <option value="available">available</option>
                                    <option value="booked">booked</option>
                                    <option value="occupied">occupied</option>
                                    <option value="maintenance">maintenance</option>
                                </Form.Select>
                            </Form.Group>
                            {/* <Form.Group>
                                <Form.Label>Available seats</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="available_seats"
                                    value={roomData.available_seats}
                                    onChange={handleChange}
                                    placeholder="available seats" required />
                            </Form.Group> */}
                            <Modal.Footer>
                                <Button style={{ backgroundColor: "#ae0000", border: 'none' }} onClick={() => setShow(false)}>Cancel</Button>
                                <Button style={{ backgroundColor: '#299d92', border: 'none' }} type="submit">{selectedRoomnumber ? "Update" : "Save"}</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} backdrop="static" keyboard={false}>
                    <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this room?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: '#299d92', color: '#fff' }} onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button style={{ backgroundColor: '#ae0000', color: '#fff' }} onClick={handleDelete}>Delete</Button>
                    </Modal.Footer>
                </Modal> */}

                {/* Room Table */}
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>#</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Room No.</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Type</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Capacity</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Daily</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Weekly</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Monthly</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Available Seats</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Status</th>
                            {isAdmin && (<>
                                <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Actions</th>

                            </>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={room.room_number}>
                                <td>{index + 1}</td>
                                <td>{room.room_number}</td>
                                <td>{room.room_type}</td>
                                <td>{room.capacity}</td>
                                <td>{room.per_day}</td>
                                <td>{room.per_week}</td>
                                <td>{room.per_month}</td>
                                <td>{room.available_seats}</td>
                                <td>{room.status}</td>
                                <td>
                                    {isAdmin && (
                                        <>
                                            <button className="edit" onClick={() => handleEdit(room)} ><i className="fas fa-edit"></i></button>
                                            {/* <button className="delete" onClick={() => handleDeleteConfirmation(room)}><i className="fas fa-trash"></i></button> */}
                                            <button className="delete" onClick={() => handleDelete(room.room_number)}><i className="fas fa-trash"></i></button>

                                        </>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </>
    );
}

