import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';

export default function Feedback() {
    const API_URL = "http://127.0.0.1:5000/api/feedback";
    const PO_API_URL = "http://127.0.0.1:5000/api/submit_feedback";

    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [show, setShow] = useState(false);
    const [isAdmin, setIsAdmin] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [newfeedbacks, setNewFeedbacks] = useState({ feedback_type: "", feedback_message: "", email: "" });

    const userRole = localStorage.getItem("role"); // 'admin' or 'user'

    // const fetchFeedbacks = async () => {
    //     const token = localStorage.getItem("token");
    //     try {
    //         const response = await axios.get(API_URL   , {
    //             headers: {
    //                 Authorization: `Bearer ${token}`  // 🔐 Send token in Authorization header
    //             }
    //         });
    //         const data = (Array.isArray(response.data) ? response.data : response.data.data);
    //         // setFeedbacks (Array.isArray(response.data) ? response.data : response.data.data);
    //         if(Array.isArray(data)){
    //             console.log("Array length:", data.length);
    //         }else {
    //             console.log("Response is not an array:", data);
    //           }
    //     } catch (error) {
    //         console.error("Error fetching feedback:", error);
    //     }
    // };

    const fetchFeedbacks = async () => {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("response data", response.data)
            setFeedbacks(response.data.data)
        } catch (error) {
            console.error("Error fetching feedback:", error)
        }
    }

    useEffect(() => {
        const isAdminLoggedIn = JSON.parse(localStorage.getItem("isAdminLoggedIn"));
        setIsAdmin(isAdminLoggedIn);
        fetchFeedbacks();
    }, []);

    const handleDelete = async (feedbackId) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) return;
        try {
            const token = localStorage.getItem("token")
            const res = await axios.delete(`${API_URL}/${feedbackId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast(res.data.message);
            fetchFeedbacks();
        } catch (error) {
            console.error("Error deleting feedback:", error);
            alert("Error deleting feedback. Please try again.");
        }
    };

    const handleAddFeedback = async (e) => {
        e.preventDefault();

        if (!newfeedbacks.feedback_type.trim() || !newfeedbacks.feedback_message.trim() || !newfeedbacks.email.trim()) {
            alert("Please fill in all fields!");
            return;
        }

        setShow(false);
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post(PO_API_URL, newfeedbacks, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast(res.data.message);
            fetchFeedbacks();
        } catch (error) {
            console.error("Error adding feedback:", error);
            alert("Error adding feedback. Please try again.");
        }
    };

    const handleEditClick = (feedback) => {
        setSelectedFeedback({
            ...feedback,
            feedback_type: feedback.type,
            feedback_message: feedback.message
        });
        setShow(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedFeedback) return;

        try {
            const token = localStorage.getItem("token")
            const res = await axios.put(`${API_URL}/${selectedFeedback.id}`, selectedFeedback, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast(res.data.message);
            fetchFeedbacks();
            setShow(false);
        } catch (error) {
            console.error("Error updating feedback:", error);
            alert("Error updating feedback. Please try again.");
        }
    };

    const handleAddClick = () => {
        if (userRole === 'admin') {
            alert("Admins cannot add feedback.");
            return;
        }

        setSelectedFeedback(null);
        setNewFeedbacks({ feedback_type: "", feedback_message: "", email: "" });
        setShow(true);
    };

    const searchFun = async () => {
        try {
            const response = await axios.get(`${API_URL}?type=${searchTerm}`);
            setFeedbacks(Array.isArray(response.data) ? response.data : response.data.data);
        } catch (error) {
            console.error("Error searching feedbacks:", error);
        }
    };

    return (
        <>
            <div style={{ marginTop: '100px', marginLeft: '10px', marginRight: '10px' }}>
                <header className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="m-1 mb-4">Feedback</h4>
                    <div className="d-flex justify-content-end mb-2">
                        <input
                            className="form-control"
                            style={{ marginRight: '5px', width: '300px' }}
                            type="text"
                            placeholder="Search feedback by email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') searchFun(); }}
                        />
                        {!isAdmin && (
                            <button className="modal-btn" onClick={handleAddClick}>
                                Add Feedback
                            </button>
                        )}
                    </div>
                </header>

                <Modal show={show} onHide={() => setShow(false)} centered>
                    <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
                        <Modal.Title>{selectedFeedback ? "Edit Feedback" : "Add Feedback"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={selectedFeedback ? handleUpdate : handleAddFeedback}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter message category"
                                    value={selectedFeedback ? selectedFeedback.feedback_type : newfeedbacks.feedback_type}
                                    onChange={(e) =>
                                        selectedFeedback
                                            ? setSelectedFeedback({ ...selectedFeedback, feedback_type: e.target.value })
                                            : setNewFeedbacks({ ...newfeedbacks, feedback_type: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter message"
                                    rows={3}
                                    value={selectedFeedback ? selectedFeedback.feedback_message : newfeedbacks.feedback_message}
                                    onChange={(e) =>
                                        selectedFeedback
                                            ? setSelectedFeedback({ ...selectedFeedback, feedback_message: e.target.value })
                                            : setNewFeedbacks({ ...newfeedbacks, feedback_message: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={selectedFeedback ? selectedFeedback.email : newfeedbacks.email}
                                    onChange={(e) =>
                                        selectedFeedback
                                            ? setSelectedFeedback({ ...selectedFeedback, email: e.target.value })
                                            : setNewFeedbacks({ ...newfeedbacks, email: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Modal.Footer>
                                <Button style={{ backgroundColor: "#ae0000", border: 'none' }} onClick={() => setShow(false)}>Cancel</Button>
                                <Button type="submit" style={{ backgroundColor: "#299d92", border: 'none' }}>
                                    {selectedFeedback ? "Update" : "Save"}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>#</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Category</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Message</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Email Address</th>
                            <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.length > 0 ? (
                            feedbacks.map((feedback, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{feedback.type}</td>
                                    <td>{feedback.message}</td>
                                    <td>{feedback.email}</td>
                                    <td>
                                        <button className="edit" onClick={() => handleEditClick(feedback)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="delete" onClick={() => handleDelete(feedback.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No feedback available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </>
    );
}













//                             old code jis mein save ka button update mei chaange ho jata tha



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Modal, Button, Form } from "react-bootstrap";
// import { ToastContainer, toast } from 'react-toastify';

// export default function Feedback() {
//     const API_URL = "http://127.0.0.1:5000/api/feedback";
//     const PO_API_URL = "http://127.0.0.1:5000/api/submit_feedback";

//     const [feedbacks, setFeedbacks] = useState([]);
//     const [selectedFeedback, setSelectedFeedback] = useState(null);
//     const [show, setShow] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [roomToDelete, setRoomToDelete] = useState(null);
//     const [newfeedbacks, setNewFeedbacks] = useState({ feedback_type: "", feedback_message: "", email: "" });
//     // Fetch feedback data
//     const fetchFeedbacks = async () => {
//         try {
//             const response = await axios.get(API_URL);
//             setFeedbacks(Array.isArray(response.data) ? response.data : response.data.data);
//         } catch (error) {
//             console.error("Error fetching feedback:", error);
//         }
//     };
//     useEffect(() => {
//         fetchFeedbacks();
//     }, []);

//     // const handleDeleteConfirmation = (room) => {
//     //     setRoomToDelete(room);
//     //     setShowDeleteModal(true); // Show the delete confirmation modal
//     // };
//     // Delete feedback
//     const handleDelete = async (feedbackId) => {
//         if (!window.confirm("Are you sure you want to delete this feedback?")) return;
//         try {
//             const res = await axios.delete(`${API_URL}/${feedbackId}`);
//             toast(res.data.message);
//             // setShowDeleteModal(false);
//             fetchFeedbacks();
//         } catch (error) {
//             console.error("Error deleting feedback:", error);
//             alert("Error deleting feedback. Please try again.");
//         }
//     };
//     const handleAddFeedback = async (e) => {
//         e.preventDefault();

//         if (!newfeedbacks.feedback_type.trim() || !newfeedbacks.feedback_message.trim() || !newfeedbacks.email.trim()) {
//             alert("Please fill in all fields!");
//             return;
//         }
//         const updatedFeedbacks = [...feedbacks, { id: Date.now(), ...newfeedbacks }];
//         setFeedbacks(updatedFeedbacks);
//         setShow(false);

//         try {
//             const res = await axios.post(PO_API_URL, newfeedbacks, {
//                 feedback_type: newfeedbacks.feedback_type,
//                 feedback_message: newfeedbacks.feedback_message,
//                 email: newfeedbacks.email
//             });

//             // alert("Feedback added successfully!");
//             toast(res.data.message);

//             fetchFeedbacks();
//         } catch (error) {
//             console.error("Error adding feedback:", error);
//             alert("Error adding feedback. Please try again.");
//         }
//     };
//     const handleEditClick = (feedback) => {
//         console.log("feddback", feedback)
//         setSelectedFeedback(feedback);
//         setShow(true);
//     };

//     // const handleEditClick = (feedback) => {
//     //     setSelectedFeedback({
//     //         id: feedback.id,
//     //         feedback_type: feedback.type,
//     //         feedback_message: feedback.message,
//     //         email: feedback.email
//     //     });
//     //     setShow(true);
//     // };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         if (!selectedFeedback) return;
//         const updatedFeedbacks = feedbacks.map(fb => fb.id === selectedFeedback.id ? selectedFeedback : fb);
//         setFeedbacks(updatedFeedbacks);
//         setShow(false);

//         try {
//             const res = await axios.put(`${API_URL}/${selectedFeedback.id}`, selectedFeedback);
//             // alert("Feedback updated successfully!");
//             toast(res.data.message);

//             fetchFeedbacks();
//             setShow(false);
//         } catch (error) {
//             console.error("Error updating feedback:", error);
//             alert("Error updating feedback. Please try again.");
//         }
//     };
//     const handleAddClick = () => {
//         setSelectedFeedback(null);
//         setNewFeedbacks({ type: "", message: "", email: "" });
//         setShow(true);
//     };

//     // const handleAddClick = () => {
//     //     setSelectedFeedback(null); // Means it's a new feedback
//     //     setNewFeedbacks({ feedback_type: "", feedback_message: "", email: "" }); // ✅ Correct field names
//     //     setShow(true);
//     // };

//     const searchFun = async (event) => {
//         try {
//             const response = await axios.get(`http://127.0.0.1:5000/api/feedback?type=${searchTerm}`);
//             setFeedbacks(Array.isArray(response.data) ? response.data : response.data.data);
//             localStorage.setItem("feedbacks", JSON.stringify(newfeedbacks));
//         } catch (error) {
//             console.error("Error fetching feedbacks:", error);
//         }
//     }
//     return (
//         <>
//             <div style={{ marginTop: '100px', marginLeft: '10px', marginRight: '10px' }}>
//                 <header className="d-flex justify-content-between align-items-center mb-2">
//                     <h4 className="m-1 mb-4">Feedback</h4>
//                     <div className="d-flex justify-content-end mb-2">
//                         <input
//                             className="form-control"
//                             style={{ marginRight: '5px', width: '300px' }}
//                             type="text"
//                             placeholder="Search feedback by email"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             onKeyDown={searchFun}
//                         />
//                         <button className="modal-btn" onClick={handleAddClick}>
//                             Add Feedback
//                         </button>
//                     </div>

//                 </header>
//                 <Modal show={show} onHide={() => setShow(false)} centered>
//                     <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
//                         <Modal.Title>{selectedFeedback ? "Edit Feedback" : "Add Feedback"}</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <Form onSubmit={selectedFeedback ? handleUpdate : handleAddFeedback}>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Category</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Enter message category"
//                                     value={selectedFeedback ? selectedFeedback.feedback_type : newfeedbacks.feedback_type}
//                                     onChange={(e) =>
//                                         setSelectedFeedback({
//                                             ...selectedFeedback,
//                                             feedback_type: e.target.value
//                                         })
//                                     }
//                                 />

//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Message</Form.Label>
//                                 <Form.Control
//                                     as="textarea"
//                                     placeholder="Enter message"
//                                     rows={3}
//                                     value={selectedFeedback ? selectedFeedback.feedback_message : newfeedbacks.feedback_message}
//                                     onChange={(e) =>
//                                         selectedFeedback
//                                             ? setSelectedFeedback({ ...selectedFeedback, feedback_message: e.target.value })
//                                             : setNewFeedbacks({ ...newfeedbacks, feedback_message: e.target.value })
//                                     }
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Email</Form.Label>
//                                 <Form.Control
//                                     type="email"
//                                     placeholder="Enter your email"
//                                     value={selectedFeedback ? selectedFeedback.email : newfeedbacks.email}
//                                     onChange={(e) =>
//                                         selectedFeedback
//                                             ? setSelectedFeedback({ ...selectedFeedback, email: e.target.value })
//                                             : setNewFeedbacks({ ...newfeedbacks, email: e.target.value })
//                                     }
//                                 />
//                             </Form.Group>
//                             <Modal.Footer>
//                                 <Button style={{ backgroundColor: "#ae0000", border: 'none' }} onClick={() => setShow(false)}>Cancel</Button> <Button type="submit" style={{ backgroundColor: "#299d92", border: 'none' }}>
//                                     {selectedFeedback ? "Update" : "Save"}
//                                 </Button>
//                             </Modal.Footer>
//                         </Form>
//                     </Modal.Body>
//                 </Modal>
//                 {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} backdrop="static" keyboard={false}>
//                     <Modal.Header style={{ backgroundColor: '#299d92', color: '#fff' }}>
//                         <Modal.Title>Confirm Deletion</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         Are you sure you want to delete this feedback?
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <Button style={{ backgroundColor: '#299d92', color: '#fff' }} onClick={() => setShowDeleteModal(false)}>Cancel</Button>
//                         <Button style={{ backgroundColor: '#ae0000', color: '#fff' }} onClick={handleDelete}>Delete</Button>
//                     </Modal.Footer>
//                 </Modal> */}

//                 <table className="table table-striped table-bordered">
//                     <thead>
//                         <tr>
//                             <th style={{ backgroundColor: '#299d92', color: '#fff' }}>#</th>
//                             <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Category</th>
//                             <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Message</th>
//                             <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Email Address</th>
//                             <th style={{ backgroundColor: '#299d92', color: '#fff' }}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {feedbacks.length > 0 ? (
//                             feedbacks.map((feedback, index) => (
//                                 <tr key={index}>
//                                     <td>{index + 1}</td>
//                                     <td>{feedback.type}</td>
//                                     <td>{feedback.message}</td>
//                                     <td>{feedback.email}</td>
//                                     <td>
//                                         <button className="edit" onClick={() => handleEditClick(feedback)}>
//                                             <i className="fas fa-edit"></i>
//                                         </button>
//                                         <button className="delete" onClick={() => handleDelete(feedback.id)}>
//                                             <i className="fas fa-trash"></i></button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="5" className="text-center">No feedback available</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//             <ToastContainer />

//         </>
//     );
// }